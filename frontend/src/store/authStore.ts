// src/store/authStore.ts
// Zustand 인증 상태 관리

import React from 'react';
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { devtools } from 'zustand/middleware';

// 타입 import
import type { 
  AuthState, 
  AuthStatus,  
  TokenInfo, 
  AuthError,
} from '@/types/auth/authState';
import type { CurrentUser, User } from '@/types/auth/authUser';
import type { LoginRequest as LoginReq, SignupRequest as SignupReq } from '@/types/auth/authRequest';
import type { AuthResponse as AuthRes, RefreshTokenResponse as RefreshRes } from '@/types/auth/authResponse';

// API 및 설정 import
import { api } from '@/config';
import { API_ENDPOINTS } from '@/config';
import { TokenManager } from '@/config';
import { env } from '@/config/env';

// ============================================================================
// 인증 스토어 액션 타입 정의
// ============================================================================

interface AuthActions {
  // 로그인/로그아웃
  login: (credentials: LoginReq) => Promise<boolean>;
  logout: () => Promise<void>;
  signup: (userData: SignupReq) => Promise<boolean>;
  
  // 토큰 관리
  refreshToken: () => Promise<boolean>;
  clearTokens: () => void;
  checkAuthStatus: () => Promise<void>;
  
  // 사용자 정보
  updateUser: (user: Partial<CurrentUser>) => void;
  fetchCurrentUser: () => Promise<void>;
  
  // 상태 관리
  setLoading: (loading: boolean) => void;
  setError: (error: AuthError | null) => void;
  clearError: () => void;
  reset: () => void;
  
  // 유틸리티
  isAuthenticated: () => boolean;
  hasValidToken: () => boolean;
  needsRefresh: () => boolean;
  getUserPermissions: () => string[];
}

// 전체 스토어 타입
type AuthStore = AuthState & AuthActions;

// ============================================================================
// 초기 상태 정의
// ============================================================================

const initialState: AuthState = {
  status: 'idle',
  user: null,
  tokens: {
    accessToken: null,
    refreshToken: null,
    tokenType: 'Bearer',
  },
  error: null,
  isLoading: false,
};

// ============================================================================
// Zustand 스토어 생성
// ============================================================================

export const useAuthStore = create<AuthStore>()(
  devtools(
    persist(
      (set, get) => ({
        // 초기 상태
        ...initialState,

        // ================================================================
        // 로그인/인증 액션들
        // ================================================================

        /**
         * 사용자 로그인
         */
        login: async (credentials: LoginReq): Promise<boolean> => {
          try {
            set({ isLoading: true, error: null }, false, 'auth/login/start');

            // API 호출
            const response = await api.post<AuthRes>(
              API_ENDPOINTS.AUTH.LOGIN,
              credentials
            );

            // 토큰 저장
            TokenManager.setTokens(response.accessToken, response.refreshToken);

            // 사용자 정보 업데이트
            const user: CurrentUser = {
              id: response.userId,
              name: response.name,
              email: response.email,
              isAuthenticated: true,
              permissions: [], // 필요시 백엔드에서 제공
            };

            const tokens: TokenInfo = {
              accessToken: response.accessToken,
              refreshToken: response.refreshToken,
              tokenType: response.tokenType || 'Bearer',
            };

            set(
              {
                status: 'authenticated',
                user,
                tokens,
                error: null,
                isLoading: false,
                lastLoginAttempt: Date.now(),
              },
              false,
              'auth/login/success'
            );

            return true;
          } catch (error: unknown) {
            const authError: AuthError = {
              code: (error as { response?: { status?: number } }).response?.status?.toString() || 'LOGIN_FAILED',
              message: (error as { response?: { data?: { message?: string } } }).response?.data?.message || '로그인에 실패했습니다.',
              details: (error as { response?: { data?: unknown } }).response?.data,
            };

            set(
              {
                status: 'unauthenticated',
                user: null,
                error: authError,
                isLoading: false,
                lastLoginAttempt: Date.now(),
              },
              false,
              'auth/login/error'
            );

            return false;
          }
        },

        /**
         * 사용자 회원가입
         */
        signup: async (userData: SignupReq): Promise<boolean> => {
          try {
            set({ isLoading: true, error: null }, false, 'auth/signup/start');

            await api.post(API_ENDPOINTS.AUTH.SIGNUP, userData);

            set(
              {
                status: 'unauthenticated',
                isLoading: false,
                error: null,
              },
              false,
              'auth/signup/success'
            );

            return true;
          } catch (error: unknown) {
            const authError: AuthError = {
              code: (error as { response?: { status?: number } }).response?.status?.toString() || 'SIGNUP_FAILED',
              message: (error as { response?: { data?: { message?: string } } }).response?.data?.message || '회원가입에 실패했습니다.',
              details: (error as { response?: { data?: unknown } }).response?.data,
            };

            set(
              {
                status: 'error',
                error: authError,
                isLoading: false,
              },
              false,
              'auth/signup/error'
            );

            return false;
          }
        },

        /**
         * 사용자 로그아웃
         */
        logout: async (): Promise<void> => {
          try {
            const { tokens } = get();
            
            // 백엔드에 로그아웃 요청 (선택적)
            if (tokens.refreshToken) {
              try {
                await api.post(API_ENDPOINTS.AUTH.LOGOUT, {
                  refreshToken: tokens.refreshToken,
                });
              } catch (error) {
                // 로그아웃 API 실패해도 클라이언트 정리는 진행
                console.warn('Logout API failed:', error);
              }
            }
          } catch (error) {
            console.warn('Logout process error:', error);
          } finally {
            // 토큰 정리
            TokenManager.clearTokens();

            // 상태 초기화
            set(
              {
                status: 'unauthenticated',
                user: null,
                tokens: {
                  accessToken: null,
                  refreshToken: null,
                  tokenType: 'Bearer',
                },
                error: null,
                isLoading: false,
              },
              false,
              'auth/logout'
            );
          }
        },

        // ================================================================
        // 토큰 관리 액션들
        // ================================================================

        /**
         * 토큰 갱신
         */
        refreshToken: async (): Promise<boolean> => {
          try {
            const { tokens } = get();
            
            if (!tokens.refreshToken) {
              throw new Error('No refresh token available');
            }

            const response = await api.post<RefreshRes>(
              API_ENDPOINTS.AUTH.REFRESH,
              { refreshToken: tokens.refreshToken }
            );

            // 새 토큰 저장
            TokenManager.setTokens(response.accessToken, response.refreshToken);

            const newTokens: TokenInfo = {
              accessToken: response.accessToken,
              refreshToken: response.refreshToken,
              tokenType: response.tokenType || 'Bearer',
            };

            set(
              {
                tokens: newTokens,
                status: 'authenticated',
                error: null,
              },
              false,
              'auth/refresh/success'
            );

            return true;
          } catch (error: unknown) {
            // 토큰 갱신 실패 시 로그아웃 처리
            await get().logout();
            return false;
          }
        },

        /**
         * 토큰 정리
         */
        clearTokens: (): void => {
          TokenManager.clearTokens();
          set(
            {
              tokens: {
                accessToken: null,
                refreshToken: null,
                tokenType: 'Bearer',
              },
            },
            false,
            'auth/clearTokens'
          );
        },

        /**
         * 인증 상태 확인
         */
        checkAuthStatus: async (): Promise<void> => {
          try {
            set({ isLoading: true }, false, 'auth/check/start');

            // localStorage에서 토큰 확인
            const accessToken = TokenManager.getAccessToken();
            const refreshToken = TokenManager.getRefreshToken();

            if (!accessToken || !refreshToken) {
              set(
                {
                  status: 'unauthenticated',
                  user: null,
                  isLoading: false,
                },
                false,
                'auth/check/noTokens'
              );
              return;
            }

            // 토큰이 있으면 사용자 정보 가져오기 시도
            await get().fetchCurrentUser();
          } catch (error) {
            // 토큰이 유효하지 않으면 정리
            await get().logout();
          }
        },

        // ================================================================
        // 사용자 정보 관리
        // ================================================================

        /**
         * 현재 사용자 정보 가져오기
         */
        fetchCurrentUser: async (): Promise<void> => {
          try {
            // 실제로는 사용자 정보를 가져오는 API 엔드포인트가 필요
            // 현재는 토큰에서 정보를 추출하거나 별도 API 구현 필요
            
            // 임시로 토큰 검증만 수행
            const accessToken = TokenManager.getAccessToken();
            const refreshToken = TokenManager.getRefreshToken();

            if (accessToken && refreshToken) {
              set(
                {
                  status: 'authenticated',
                  tokens: {
                    accessToken,
                    refreshToken,
                    tokenType: 'Bearer',
                  },
                  isLoading: false,
                },
                false,
                'auth/fetchUser/success'
              );
            } else {
              throw new Error('No valid tokens');
            }
          } catch (error) {
            set(
              {
                status: 'unauthenticated',
                user: null,
                isLoading: false,
              },
              false,
              'auth/fetchUser/error'
            );
          }
        },

        /**
         * 사용자 정보 업데이트
         */
        updateUser: (userUpdate: Partial<CurrentUser>): void => {
          const { user } = get();
          if (user) {
            set(
              {
                user: { ...user, ...userUpdate },
              },
              false,
              'auth/updateUser'
            );
          }
        },

        // ================================================================
        // 상태 관리 액션들
        // ================================================================

        /**
         * 로딩 상태 설정
         */
        setLoading: (loading: boolean): void => {
          set({ isLoading: loading }, false, 'auth/setLoading');
        },

        /**
         * 에러 설정
         */
        setError: (error: AuthError | null): void => {
          set({ error }, false, 'auth/setError');
        },

        /**
         * 에러 정리
         */
        clearError: (): void => {
          set({ error: null }, false, 'auth/clearError');
        },

        /**
         * 상태 초기화
         */
        reset: (): void => {
          TokenManager.clearTokens();
          set(initialState, false, 'auth/reset');
        },

        // ================================================================
        // 유틸리티 메서드들
        // ================================================================

        /**
         * 인증 여부 확인
         */
        isAuthenticated: (): boolean => {
          const { status, tokens } = get();
          return status === 'authenticated' && !!tokens.accessToken;
        },

        /**
         * 유효한 토큰 존재 여부
         */
        hasValidToken: (): boolean => {
          const { tokens } = get();
          return !!tokens.accessToken && !!tokens.refreshToken;
        },

        /**
         * 토큰 갱신 필요 여부
         */
        needsRefresh: (): boolean => {
          const { tokens, lastLoginAttempt } = get();
          
          // 토큰이 없으면 갱신 불가
          if (!tokens.refreshToken) return false;
          
          // 마지막 로그인 시도가 1시간 이상 지났으면 갱신 시도
          const oneHour = 60 * 60 * 1000;
          return lastLoginAttempt 
            ? Date.now() - lastLoginAttempt > oneHour 
            : true;
        },

        /**
         * 사용자 권한 목록 가져오기
         */
        getUserPermissions: (): string[] => {
          const { user } = get();
          return user?.permissions || [];
        },
      }),
      {
        name: 'auth-store', // localStorage 키
        storage: createJSONStorage(() => localStorage),
        // 민감한 정보는 persist에서 제외
        partialize: (state) => ({
          user: state.user,
          status: state.status,
          // 토큰은 TokenManager에서 별도 관리하므로 제외
        }),
      }
    ),
    {
      name: 'auth-store', // Redux DevTools 이름
      enabled: env.DEV_MODE,
    }
  )
);

// ============================================================================
// 편의 함수들 export
// ============================================================================

// 인증 상태 확인 헬퍼
export const useAuth = () => {
  const store = useAuthStore();
  return {
    // 상태
    ...store,
    
    // 계산된 값들
    isLoggedIn: store.isAuthenticated(),
    hasToken: store.hasValidToken(),
    shouldRefresh: store.needsRefresh(),
    permissions: store.getUserPermissions(),
  };
};

// 로그인 필요 여부 확인
export const useRequireAuth = () => {
  const { isAuthenticated, checkAuthStatus } = useAuthStore();
  
  React.useEffect(() => {
    if (!isAuthenticated()) {
      checkAuthStatus();
    }
  }, []);
  
  return isAuthenticated();
};

export default useAuthStore;