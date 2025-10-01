// 🧹 정리된 Axios 설정 - 개발 로그 제거
// frontend/src/config/axiosConfig.ts

import axios from 'axios';
import { env } from '@/config/env';
import { SECURITY_CONFIG, validateSecurityConfig } from '@/shared/utils/common/constants';

// 보안 설정 검증
if (typeof window !== 'undefined') {
  validateSecurityConfig();
}

// 토큰 관리 유틸리티
class TokenManager {
  static getAccessToken(): string | null {
    if (typeof window === 'undefined') return null;
    return sessionStorage.getItem(SECURITY_CONFIG.TOKEN_KEYS.ACCESS);
  }

  static setAccessToken(accessToken: string): void {
    if (typeof window === 'undefined') return;
    sessionStorage.setItem(SECURITY_CONFIG.TOKEN_KEYS.ACCESS, accessToken);
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
    
    return tokenAge < maxAge;
  }

  static hasValidTokens = (): boolean => {
    return TokenManager.isTokenValid();
  };

  static clearAllTokens(): void {
    TokenManager.clearAccessToken();
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
    withCredentials: true,
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

      // CSRF 토큰 추가 (상태 변경 요청에만)
      if (config.method && ['POST', 'PUT', 'PATCH', 'DELETE'].includes(config.method.toUpperCase())) {
        if (typeof window !== 'undefined') {
          const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
          if (csrfToken && config.headers) {
            config.headers['X-CSRF-Token'] = csrfToken;
          }
        }
      }

      return config;
    },
    (error) => {
      console.error('❌ [API] Request Error:', error); // ✅ 유지
      return Promise.reject(error);
    }
  );

  // 응답 인터셉터
  client.interceptors.response.use(
    (response) => {
      return response;
    },
    async (error: unknown) => {
      const axiosError = error as {
        config?: Record<string, unknown> & { _retry?: boolean };
        response?: {
          status: number;
          data: unknown;
          statusText?: string;
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
          const refreshResponse = await axios.post(
            `${env.API_URL}/auth/refresh`, 
            {}, 
            { 
              withCredentials: true,
              timeout: SECURITY_CONFIG.API.TIMEOUT_MS
            }
          );

          const responseData = refreshResponse.data as { 
            accessToken: string; 
          };
          
          TokenManager.setAccessToken(responseData.accessToken);

          const retryConfig = {
            ...originalRequest,
            headers: {
              ...(originalRequest.headers as Record<string, string> || {}),
              Authorization: `${SECURITY_CONFIG.JWT.TOKEN_TYPE} ${responseData.accessToken}`,
            },
          };
          
          return client(retryConfig as unknown as Parameters<typeof client>[0]);
          
        } catch (refreshError) {
          console.error('❌ [API] Token refresh failed:', refreshError); // ✅ 유지
          
          // 토큰 갱신 실패 시 강제 로그아웃 처리
          TokenManager.clearAllTokens();
          
          try {
            await axios.post(`${env.API_URL}/auth/logout`, {}, { 
              withCredentials: true,
              timeout: 3000
            });
          } catch (logoutError) {
            console.warn('⚠️ [API] Logout API failed (ignored):', logoutError); // ✅ 유지
          }
          
          try {
            const { useAuthStore } = await import('@/shared/store/authStore');
            await useAuthStore.getState().logout();
          } catch (storeError) {
            console.warn('⚠️ [API] Auth store cleanup failed:', storeError); // ✅ 유지
          }
          
          if (typeof window !== 'undefined') {
            const currentPath = window.location.pathname + window.location.search;
            const redirectUrl = `/auth/login?redirect=${encodeURIComponent(currentPath)}&reason=session_expired`;
            window.location.href = redirectUrl;
          }
          
          return Promise.reject(refreshError);
        }
      }

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