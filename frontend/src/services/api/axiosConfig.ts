import axios from 'axios';
import { env } from '@/config/env';

// API 응답 기본 타입
export interface ApiResponse<T = unknown> {
  success: boolean;
  data: T;
  message?: string;
  error?: string;
}

// 토큰 관리 유틸리티
class TokenManager {
  static getAccessToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem(env.TOKEN_KEY);
  }

  static getRefreshToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem(env.REFRESH_TOKEN_KEY);
  }

  static setTokens(accessToken: string, refreshToken: string): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(env.TOKEN_KEY, accessToken);
    localStorage.setItem(env.REFRESH_TOKEN_KEY, refreshToken);
  }

  static clearTokens(): void {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(env.TOKEN_KEY);
    localStorage.removeItem(env.REFRESH_TOKEN_KEY);
  }
}

// 🔥 인증이 필요한 엔드포인트 패턴 정의
const AUTH_REQUIRED_PATTERNS = [
  '/auth/logout',      // 로그아웃
  '/auth/refresh',     // 토큰 갱신
  '/characters',       // 캐릭터 관련
  '/game',            // 게임 관련
  '/posts',           // 게시글 작성/수정/삭제 (GET 제외)
  '/comments',        // 댓글 작성/수정/삭제
];

// 🔥 인증이 필요한 HTTP 메서드 정의
const AUTH_REQUIRED_METHODS = ['POST', 'PUT', 'PATCH', 'DELETE'];

// 🔥 요청에 인증이 필요한지 확인하는 함수
const requiresAuth = (config: {
  url?: string;
  method?: string;
  headers?: Record<string, string>;
  _retry?: boolean;
}): boolean => {
  const url = config.url || '';
  const method = (config.method || 'GET').toUpperCase();
  
  // 특정 엔드포인트들은 항상 인증 필요
  const needsAuthForEndpoint = AUTH_REQUIRED_PATTERNS.some(pattern => 
    url.includes(pattern)
  );
  
  // 특정 메서드들은 인증 필요 (POST, PUT, PATCH, DELETE)
  const needsAuthForMethod = AUTH_REQUIRED_METHODS.includes(method);
  
  // 게시글 조회는 예외 (GET /posts, GET /posts/:id)
  if (method === 'GET' && url.includes('/posts')) {
    return false; // 게시글 조회는 인증 불필요
  }
  
  // 댓글 조회도 예외 (GET /comments)
  if (method === 'GET' && url.includes('/comments')) {
    return false; // 댓글 조회는 인증 불필요
  }
  
  return needsAuthForEndpoint || needsAuthForMethod;
};


// Axios 인스턴스 생성
const createApiClient = (baseURL: string) => {
  const client = axios.create({
    baseURL,
    timeout: 10000,
    headers: {
      'Content-Type': 'application/json',
    },
  });

  // 🔥 수정된 요청 인터셉터 - 선택적 토큰 추가
  client.interceptors.request.use(
    (config) => {
      // 인증이 필요한 요청인지 확인
      if (requiresAuth(config)) {
        const token = TokenManager.getAccessToken();
        if (token && config.headers) {
          config.headers.Authorization = `Bearer ${token}`;
        }
      }

      // 개발 모드에서 요청 로깅
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

      // 🔥 401 에러 시 토큰 갱신 시도 (인증이 필요한 요청에 대해서만)
      if (axiosError.response?.status === 401 && 
          originalRequest && 
          !originalRequest._retry &&
          requiresAuth(originalRequest)) {
        
        originalRequest._retry = true;

        try {
          const refreshToken = TokenManager.getRefreshToken();
          if (!refreshToken) {
            throw new Error('No refresh token available');
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
  // GET 요청 (대부분 인증 불필요)
  get: async <T>(url: string, config?: Record<string, unknown>): Promise<T> => {
    const response = await apiClient.get<T>(url, config);
    return response.data;
  },

  // POST 요청 (인증 필요)
  post: async <T>(url: string, data?: unknown, config?: Record<string, unknown>): Promise<T> => {
    const response = await apiClient.post<T>(url, data, config);
    return response.data;
  },

  // PUT 요청 (인증 필요)
  put: async <T>(url: string, data?: unknown, config?: Record<string, unknown>): Promise<T> => {
    const response = await apiClient.put<T>(url, data, config);
    return response.data;
  },

  // PATCH 요청 (인증 필요)
  patch: async <T>(url: string, data?: unknown, config?: Record<string, unknown>): Promise<T> => {
    const response = await apiClient.patch<T>(url, data, config);
    return response.data;
  },

  // DELETE 요청 (인증 필요)
  delete: async <T>(url: string, config?: Record<string, unknown>): Promise<T> => {
    const response = await apiClient.delete<T>(url, config);
    return response.data;
  },
};

// 🔥 퍼블릭 API 함수들 (인증 불필요)
export const publicApi = {
  // 게시글 목록 조회 (인증 불필요)
  getPosts: async <T>(url: string, config?: Record<string, unknown>): Promise<T> => {
    const response = await apiClient.get<T>(url, config);
    return response.data;
  },

  // 게시글 상세 조회 (인증 불필요)
  getPost: async <T>(url: string, config?: Record<string, unknown>): Promise<T> => {
    const response = await apiClient.get<T>(url, config);
    return response.data;
  },

  // 댓글 목록 조회 (인증 불필요)
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

// 토큰 관리 함수들 export
export { TokenManager };

export default api;