import axios from 'axios';
import { env } from '@/config/env';
import { STORAGE_KEYS, ERROR_MESSAGES } from '@/utils/common'; // 🔥 상수 중앙화

// API 응답 기본 타입
export interface ApiResponse<T = unknown> {
  success: boolean;
  data: T;
  message?: string;
  error?: string;
}

// 토큰 관리 유틸리티 - 상수 중앙화 적용
class TokenManager {
  static getAccessToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN); // 🔥 상수 사용
  }

  static getRefreshToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN); // 🔥 상수 사용
  }

  static setTokens(accessToken: string, refreshToken: string): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, accessToken); // 🔥 상수 사용
    localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, refreshToken); // 🔥 상수 사용
  }

  static clearTokens(): void {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN); // 🔥 상수 사용
    localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN); // 🔥 상수 사용
  }

  static hasValidTokens = (): boolean => {
    const accessToken = TokenManager.getAccessToken();
    const refreshToken = TokenManager.getRefreshToken();
    return Boolean(accessToken && refreshToken);
  };
}

// 🔥 인증이 필요한 엔드포인트 패턴 정의 (상수로 관리)
const AUTH_REQUIRED_PATTERNS = [
  '/auth/logout',
  '/auth/refresh',
  '/characters',
  '/game',
  '/posts',
  '/comments',
] as const;

const AUTH_REQUIRED_METHODS = ['POST', 'PUT', 'PATCH', 'DELETE'] as const;

// 🔥 요청에 인증이 필요한지 확인하는 함수
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
  
  // 게시글/댓글 조회는 예외
  if (method === 'GET' && (url.includes('/posts') || url.includes('/comments'))) {
    return false;
  }
  
  return needsAuthForEndpoint || needsAuthForMethod;
};

// Axios 인스턴스 생성
const createApiClient = (baseURL: string) => {
  const client = axios.create({
    baseURL,
    timeout: 10000, // 🔥 상수화 가능
    headers: {
      'Content-Type': 'application/json',
    },
  });

  // 🔥 수정된 요청 인터셉터
  client.interceptors.request.use(
    (config) => {
      if (requiresAuth(config)) {
        const token = TokenManager.getAccessToken();
        if (token && config.headers) {
          config.headers.Authorization = `Bearer ${token}`;
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

  // 응답 인터셉터 - 토큰 갱신 및 에러 처리
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

      // 🔥 401 에러 시 토큰 갱신 시도
      if (axiosError.response?.status === 401 && 
          originalRequest && 
          !originalRequest._retry &&
          requiresAuth(originalRequest)) {
        
        originalRequest._retry = true;

        try {
          const refreshToken = TokenManager.getRefreshToken();
          if (!refreshToken) {
            throw new Error(ERROR_MESSAGES.AUTH_EXPIRED); // 🔥 상수 사용
          }

          // 토큰 갱신 요청
          const refreshResponse = await axios.post(`${env.API_URL}/auth/refresh`, {
            refreshToken,
          });

          const responseData = refreshResponse.data as { 
            accessToken: string; 
            refreshToken: string; 
          };
          const { accessToken, refreshToken: newRefreshToken } = responseData;
          TokenManager.setTokens(accessToken, newRefreshToken);

          // 원래 요청 재시도
          const retryConfig = {
            ...originalRequest,
            headers: {
              ...(originalRequest.headers as Record<string, string> || {}),
              Authorization: `Bearer ${accessToken}`,
            },
          };
          
          return client(retryConfig as unknown as Parameters<typeof client>[0]);
        } catch (refreshError) {
          // 토큰 갱신 실패 시 로그아웃 처리
          TokenManager.clearTokens();
          
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

// 🔥 퍼블릭 API 함수들
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