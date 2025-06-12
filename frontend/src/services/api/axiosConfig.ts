// src/services/api/axiosConfig.ts
// Axios 인스턴스 설정 및 인터셉터

import axios from 'axios';
import { env } from '@/config/env';

// API 응답 기본 타입
export interface ApiResponse<T = unknown> {
  success: boolean;
  data: T;
  message?: string;
  error?: string;
}

// API 에러 타입
export interface ApiError {
  status: number;
  message: string;
  code?: string;
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

// Axios 인스턴스 생성
const createApiClient = (baseURL: string) => {
  const client = axios.create({
    baseURL,
    timeout: 10000,
    headers: {
      'Content-Type': 'application/json',
    },
  });

  // 요청 인터셉터 - 토큰 자동 추가
  client.interceptors.request.use(
    (config) => {
      const token = TokenManager.getAccessToken();
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }

      // 개발 모드에서 요청 로깅
      if (env.DEV_MODE) {
        console.log(`🚀 API Request: ${config.method?.toUpperCase()} ${config.url}`, {
          headers: config.headers,
          data: config.data,
        });
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
      // 개발 모드에서 응답 로깅
      if (env.DEV_MODE) {
        console.log(`✅ API Response: ${response.config.method?.toUpperCase()} ${response.config.url}`, {
          status: response.status,
          data: response.data,
        });
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

      // 401 에러 시 토큰 갱신 시도
      if (axiosError.response?.status === 401 && originalRequest && !originalRequest._retry) {
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

          // 타입 안전한 응답 처리
          const responseData = refreshResponse.data as { 
            accessToken: string; 
            refreshToken: string; 
          };
          const { accessToken, refreshToken: newRefreshToken } = responseData;
          TokenManager.setTokens(accessToken, newRefreshToken);

          // 원래 요청 재시도 - unknown을 통한 안전한 타입 변환
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
          
          // 로그인 페이지로 리다이렉트 (브라우저 환경에서만)
          if (typeof window !== 'undefined') {
            window.location.href = '/login';
          }
          
          return Promise.reject(refreshError);
        }
      }

      // 에러 로깅
      console.error(`❌ API Error: ${originalRequest?.method?.toString()?.toUpperCase()} ${originalRequest?.url}`, {
        status: axiosError.response?.status,
        message: axiosError.response?.data || axiosError.message,
        data: axiosError.response?.data,
      });

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
  // GET 요청
  get: async <T>(url: string, config?: Record<string, unknown>): Promise<T> => {
    const response = await apiClient.get<T>(url, config);
    return response.data;
  },

  // POST 요청
  post: async <T>(url: string, data?: unknown, config?: Record<string, unknown>): Promise<T> => {
    const response = await apiClient.post<T>(url, data, config);
    return response.data;
  },

  // PUT 요청
  put: async <T>(url: string, data?: unknown, config?: Record<string, unknown>): Promise<T> => {
    const response = await apiClient.put<T>(url, data, config);
    return response.data;
  },

  // PATCH 요청
  patch: async <T>(url: string, data?: unknown, config?: Record<string, unknown>): Promise<T> => {
    const response = await apiClient.patch<T>(url, data, config);
    return response.data;
  },

  // DELETE 요청
  delete: async <T>(url: string, config?: Record<string, unknown>): Promise<T> => {
    const response = await apiClient.delete<T>(url, config);
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