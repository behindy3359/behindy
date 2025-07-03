import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { devtools } from 'zustand/middleware';
import type { 
  AuthState,
  TokenInfo, 
  AuthError,
} from '@/types/auth/authState';
import type { CurrentUser } from '@/types/auth/authUser';
import type { LoginRequest, SignupRequest } from '@/types/auth/authRequest';
import { api, API_ENDPOINTS, TokenManager } from '@/config';
import { env } from '@/config/env';

// ================================================================
// 백엔드 응답 타입 (AuthController 기준)
// ================================================================

interface JwtAuthResponse {
  accessToken: string;
  refreshToken: string;
  tokenType: string;
  userId: number;
  name: string;
  email: string;
}

interface ApiResponse<T = unknown> {
  success: boolean;
  message?: string;
  data?: T;
}

interface AuthResult {
  success: boolean;
  error?: string;
  data?: unknown;
}

// ================================================================
// 인증 스토어 액션 타입 정의
// ================================================================

interface AuthActions {
  // 로그인/로그아웃
  login: (credentials: LoginRequest) => Promise<AuthResult>;
  logout: () => Promise<void>;
  signup: (userData: SignupRequest) => Promise<AuthResult>;
  
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

type AuthStore = AuthState & AuthActions;

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

// ================================================================
// Zustand 스토어 생성
// ================================================================

export const useAuthStore = create<AuthStore>()(
  devtools(
    persist(
      (set, get) => ({
        ...initialState,

        /**
         * 사용자 로그인 (백엔드 AuthController와 연동)
         */
        login: async (credentials: LoginRequest): Promise<AuthResult> => {
          try {
            set({ isLoading: true, error: null }, false, 'auth/login/start');

            // 백엔드 AuthController의 /api/auth/login 호출
            const response = await api.post<JwtAuthResponse>(
              API_ENDPOINTS.AUTH.LOGIN,
              {
                email: credentials.email,
                password: credentials.password,
              }
            );

            // 토큰 저장
            TokenManager.setTokens(response.accessToken, response.refreshToken);

            // 사용자 정보 업데이트
            const user: CurrentUser = {
              id: response.userId,
              name: response.name,
              email: response.email,
              isAuthenticated: true,
              permissions: [],
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

            return { success: true, data: user };
          } catch (error: unknown) {
            console.error('Login error:', error);
            
            const apiError = error as { 
              response?: { 
                status?: number; 
                data?: { message?: string } 
              } 
            };

            const authError: AuthError = {
              code: apiError.response?.status?.toString() || 'LOGIN_FAILED',
              message: apiError.response?.data?.message || '로그인에 실패했습니다.',
              details: apiError.response?.data,
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

            return { success: false, error: authError.message };
          }
        },

        /**
         * 사용자 회원가입 (백엔드 AuthController와 연동)
         */
        signup: async (userData: SignupRequest): Promise<AuthResult> => {
          try {
            set({ isLoading: true, error: null }, false, 'auth/signup/start');

            // 백엔드 AuthController의 /api/auth/signup 호출
            const response = await api.post<ApiResponse<number>>(
              API_ENDPOINTS.AUTH.SIGNUP,
              {
                name: userData.name,
                email: userData.email,
                password: userData.password,
              }
            );

            set(
              {
                status: 'unauthenticated',
                isLoading: false,
                error: null,
              },
              false,
              'auth/signup/success'
            );

            return { 
              success: true, 
              data: { 
                userId: response.data,
                message: response.message || '회원가입이 완료되었습니다.'
              }
            };
          } catch (error: unknown) {
            console.error('Signup error:', error);
            
            const apiError = error as { 
              response?: { 
                status?: number; 
                data?: { message?: string } 
              } 
            };

            const authError: AuthError = {
              code: apiError.response?.status?.toString() || 'SIGNUP_FAILED',
              message: apiError.response?.data?.message || '회원가입에 실패했습니다.',
              details: apiError.response?.data,
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

            return { success: false, error: authError.message };
          }
        },

        /**
         * 사용자 로그아웃 (백엔드 AuthController와 연동)
         */
        logout: async (): Promise<void> => {
          try {
            const { tokens } = get();
            
            // 백엔드에 로그아웃 요청
            if (tokens.refreshToken) {
              try {
                await api.post<ApiResponse>(API_ENDPOINTS.AUTH.LOGOUT, {
                  refreshToken: tokens.refreshToken,
                });
              } catch (error) {
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

        /**
         * 토큰 갱신 (백엔드 AuthController와 연동)
         */
        refreshToken: async (): Promise<boolean> => {
          try {
            const { tokens } = get();
            
            if (!tokens.refreshToken) {
              throw new Error('No refresh token available');
            }

            // 백엔드 AuthController의 /api/auth/refresh 호출
            const response = await api.post<JwtAuthResponse>(
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
            console.error('Token refresh failed:', error);
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

            // 토큰이 있으면 사용자 정보 복원
            // 실제로는 사용자 정보를 가져오는 API가 필요하지만,
            // 현재는 토큰 검증만 수행
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
              'auth/check/success'
            );
          } catch (error) {
            console.error('Auth status check failed:', error);
            await get().logout();
          }
        },

        /**
         * 현재 사용자 정보 가져오기
         */
        fetchCurrentUser: async (): Promise<void> => {
          try {
            // 실제로는 사용자 정보를 가져오는 API 엔드포인트가 필요
            // 현재는 토큰 검증만 수행
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
            console.error('Fetch user failed:', error);
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

        // 상태 관리 액션들
        setLoading: (loading: boolean): void => {
          set({ isLoading: loading }, false, 'auth/setLoading');
        },

        setError: (error: AuthError | null): void => {
          set({ error }, false, 'auth/setError');
        },

        clearError: (): void => {
          set({ error: null }, false, 'auth/clearError');
        },

        reset: (): void => {
          TokenManager.clearTokens();
          set(initialState, false, 'auth/reset');
        },

        // 인증 유틸리티
        isAuthenticated: (): boolean => {
          const { status, tokens } = get();
          return status === 'authenticated' && !!tokens.accessToken;
        },

        hasValidToken: (): boolean => {
          const { tokens } = get();
          return !!tokens.accessToken && !!tokens.refreshToken;
        },

        needsRefresh: (): boolean => {
          const { tokens, lastLoginAttempt } = get();
          
          if (!tokens.refreshToken) return false;
          
          const oneHour = 60 * 60 * 1000;
          return lastLoginAttempt 
            ? Date.now() - lastLoginAttempt > oneHour 
            : true;
        },

        getUserPermissions: (): string[] => {
          const { user } = get();
          return user?.permissions || [];
        },
      }),
      {
        name: 'auth-store',
        storage: createJSONStorage(() => localStorage),
        partialize: (state) => ({
          user: state.user,
          status: state.status,
        }),
      }
    ),
    {
      name: 'auth-store',
      enabled: env.DEV_MODE,
    }
  )
);

// ================================================================
// 헬퍼 훅들
// ================================================================

export const useAuth = () => {
  const store = useAuthStore();
  return {
    ...store,
    isLoggedIn: store.isAuthenticated(),
    hasToken: store.hasValidToken(),
    shouldRefresh: store.needsRefresh(),
    permissions: store.getUserPermissions(),
  };
};

export default useAuthStore;