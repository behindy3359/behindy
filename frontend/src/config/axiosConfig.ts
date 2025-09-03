import axios from 'axios';
import { env } from '@/config/env';
import { SECURITY_CONFIG, validateSecurityConfig } from '@/shared/utils/common/constants';

// 보안 설정 검증
if (typeof window !== 'undefined') {
  validateSecurityConfig();
}

// 토큰 관리 유틸리티 - sessionStorage 사용으로 변경
class TokenManager {
  static getAccessToken(): string | null {
    if (typeof window === 'undefined') return null;
    return sessionStorage.getItem(SECURITY_CONFIG.TOKEN_KEYS.ACCESS);
  }

  static setAccessToken(accessToken: string): void {
    if (typeof window === 'undefined') return;
    sessionStorage.setItem(SECURITY_CONFIG.TOKEN_KEYS.ACCESS, accessToken);
    // 토큰 저장 시간도 함께 저장
    sessionStorage.setItem(SECURITY_CONFIG.TOKEN_KEYS.ACCESS + '_time', Date.now().toString());
  }

  static clearAccessToken(): void {
    if (typeof window === 'undefined') return;
    sessionStorage.removeItem(SECURITY_CONFIG.TOKEN_KEYS.ACCESS);
    sessionStorage.removeItem(SECURITY_CONFIG.TOKEN_KEYS.ACCESS + '_time');
  }

  static isTokenValid(): boolean {
    if (typeof window === 'undefined') return false;
    
    const token = sessionStorage.getItem(SECURITY_CONFIG.TOKEN_KEYS.ACCESS);
    const tokenTime = sessionStorage.getItem(SECURITY_CONFIG.TOKEN_KEYS.ACCESS + '_time');
    
    if (!token || !tokenTime) return false;
    
    const tokenAge = Date.now() - parseInt(tokenTime);
    const maxAge = SECURITY_CONFIG.JWT.ACCESS_TOKEN_LIFETIME;
    
    // 토큰이 만료되었으면 false
    return tokenAge < maxAge;
  }
  static hasValidTokens = (): boolean => {
    return TokenManager.isTokenValid();
  };

  // 모든 토큰 정리
  static clearAllTokens(): void {
    TokenManager.clearAccessToken();
    // Refresh Token은 서버에서 Cookie 삭제 API를 통해 처리
  }
}

// 인증이 필요한 엔드포인트 패턴 정의
const AUTH_REQUIRED_PATTERNS = [
  '/auth/logout',
  '/auth/me',
  '/characters',
  '/game',
  '/posts',
  '/comments',
] as const;

const AUTH_REQUIRED_METHODS = ['POST', 'PUT', 'PATCH', 'DELETE'] as const;

// 요청에 인증이 필요한지 확인
const requiresAuth = (config: {
  url?: string;
  method?: string;
  headers?: Record<string, string>;
  _retry?: boolean;
}): boolean => {
  const url = config.url || '';
  const method = (config.method || 'GET').toUpperCase();
  
  const needsAuthForEndpoint = AUTH_REQUIRED_PATTERNS.some(pattern => 
    url.includes(pattern)
  );
  
  const needsAuthForMethod = AUTH_REQUIRED_METHODS.includes(method as any);
  
  // 게시글/댓글 조회는 예외 (GET 요청)
  if (method === 'GET' && (url.includes('/posts') || url.includes('/comments'))) {
    return false;
  }
  
  return needsAuthForEndpoint || needsAuthForMethod;
};

// Axios 인스턴스 생성
const createApiClient = (baseURL: string) => {
  const client = axios.create({
    baseURL,
    timeout: SECURITY_CONFIG.API.TIMEOUT_MS,
    headers: {
      'Content-Type': 'application/json',
    },
    withCredentials: true, // 🔥 HttpOnly Cookie 전송을 위해 필수
  });

  // 요청 인터셉터
  client.interceptors.request.use(
    (config) => {
      if (requiresAuth(config)) {
        const token = TokenManager.getAccessToken();
        if (token && config.headers) {
          config.headers.Authorization = `${SECURITY_CONFIG.JWT.TOKEN_TYPE} ${token}`;
        }
      }

      if (env.DEV_MODE) {
        const hasAuth = config.headers?.Authorization ? '🔐' : '🌍';
        console.log(`${hasAuth} API Request: ${config.method?.toUpperCase()} ${config.url}`);
      }

      return config;
    },
    (error) => {
      console.error('❌ Request Error:', error);
      return Promise.reject(error);
    }
  );

  // 응답 인터셉터 - 자동 토큰 갱신
  client.interceptors.response.use(
    (response) => {
      if (env.DEV_MODE) {
        console.log(`✅ API Response: ${response.config.method?.toUpperCase()} ${response.config.url} (${response.status})`);
      }
      return response;
    },
    async (error: unknown) => {
      const axiosError = error as {
        config?: Record<string, unknown> & { _retry?: boolean };
        response?: {
          status: number;
          data: unknown;
        };
        message?: string;
      };

      const originalRequest = axiosError.config;

      // 401 에러 시 자동 토큰 갱신 시도
      if (axiosError.response?.status === 401 && 
          originalRequest && 
          !originalRequest._retry &&
          requiresAuth(originalRequest)) {
        
        originalRequest._retry = true;

        try {
          console.log('🔄 Access Token 만료, 자동 갱신 시도...');

          // 🔥 Refresh Token이 Cookie에 있으므로 요청 body 없이 호출
          const refreshResponse = await axios.post(
            `${env.API_URL}/auth/refresh`, 
            {}, // 빈 body
            { 
              withCredentials: true, // Cookie 전송
              timeout: SECURITY_CONFIG.API.TIMEOUT_MS
            }
          );

          const responseData = refreshResponse.data as { 
            accessToken: string; 
          };
          
          // 새로운 Access Token만 저장 (Refresh Token은 Cookie에서 자동 갱신됨)
          TokenManager.setAccessToken(responseData.accessToken);

          // 원래 요청 재시도
          const retryConfig = {
            ...originalRequest,
            headers: {
              ...(originalRequest.headers as Record<string, string> || {}),
              Authorization: `${SECURITY_CONFIG.JWT.TOKEN_TYPE} ${responseData.accessToken}`,
            },
          };
          
          console.log('✅ 토큰 갱신 성공, 원래 요청 재시도');
          return client(retryConfig as unknown as Parameters<typeof client>[0]);
          
        } catch (refreshError) {
          console.error('❌ 토큰 갱신 실패:', refreshError);
          
          // 토큰 갱신 실패 시 로그아웃 처리
          TokenManager.clearAllTokens();
          
          // 로그아웃 API 호출 (Cookie 정리)
          try {
            await axios.post(`${env.API_URL}/auth/logout`, {}, { 
              withCredentials: true 
            });
          } catch (logoutError) {
            console.warn('로그아웃 API 호출 실패:', logoutError);
          }
          
          if (typeof window !== 'undefined') {
            window.location.href = '/auth/login';
          }
          
          return Promise.reject(refreshError);
        }
      }

      // 에러 로깅
      console.error(`❌ API Error: ${originalRequest?.method?.toString()?.toUpperCase()} ${originalRequest?.url} (${axiosError.response?.status})`);

      return Promise.reject(error);
    }
  );

  return client;
};

// API 클라이언트 인스턴스들
export const apiClient = createApiClient(env.API_URL);
export const aiClient = createApiClient(env.AI_URL);

// 공통 API 요청 함수들
export const api = {
  get: async <T>(url: string, config?: Record<string, unknown>): Promise<T> => {
    const response = await apiClient.get<T>(url, config);
    return response.data;
  },

  post: async <T>(url: string, data?: unknown, config?: Record<string, unknown>): Promise<T> => {
    const response = await apiClient.post<T>(url, data, config);
    return response.data;
  },

  put: async <T>(url: string, data?: unknown, config?: Record<string, unknown>): Promise<T> => {
    const response = await apiClient.put<T>(url, data, config);
    return response.data;
  },

  patch: async <T>(url: string, data?: unknown, config?: Record<string, unknown>): Promise<T> => {
    const response = await apiClient.patch<T>(url, data, config);
    return response.data;
  },

  delete: async <T>(url: string, config?: Record<string, unknown>): Promise<T> => {
    const response = await apiClient.delete<T>(url, config);
    return response.data;
  },
};

// 퍼블릭 API 함수들 (인증 불필요)
export const publicApi = {
  getPosts: async <T>(url: string, config?: Record<string, unknown>): Promise<T> => {
    const response = await apiClient.get<T>(url, config);
    return response.data;
  },

  getPost: async <T>(url: string, config?: Record<string, unknown>): Promise<T> => {
    const response = await apiClient.get<T>(url, config);
    return response.data;
  },

  getComments: async <T>(url: string, config?: Record<string, unknown>): Promise<T> => {
    const response = await apiClient.get<T>(url, config);
    return response.data;
  },
};

// AI 서버용 API 함수들
export const aiApi = {
  post: async <T>(url: string, data?: unknown, config?: Record<string, unknown>): Promise<T> => {
    const response = await aiClient.post<T>(url, data, config);
    return response.data;
  },
};

export { TokenManager };
export default api;