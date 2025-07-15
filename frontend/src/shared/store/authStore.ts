import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import type { 
  AuthState,
  TokenInfo, 
  AuthError,
  CurrentUser,
  LoginRequest,
  SignupRequest
} from '@/shared/types/auth';
import { api, TokenManager } from '@/config/axiosConfig';
import { API_ENDPOINTS, apiErrorHandler } from '@/shared/utils/common/api';
import { env } from '@/config/env';
import { ApiResponse } from '@/shared/types/common';
import { SECURITY_CONFIG } from '@/shared/utils/common/constants';

// 백엔드 응답 타입
interface JwtAuthResponse {
  accessToken: string;
  refreshToken?: string;
  tokenType: string;
  userId: number;
  name: string;
  email: string;
}

interface AuthResult {
  success: boolean;
  error?: string;
  data?: unknown;
}

// 인증 스토어 액션 타입 정의
interface AuthActions {
  login: (credentials: LoginRequest) => Promise<AuthResult>;
  logout: () => Promise<void>;
  signup: (userData: SignupRequest) => Promise<AuthResult>;
  refreshToken: () => Promise<boolean>;
  clearTokens: () => void;
  checkAuthStatus: () => Promise<void>;
  updateUser: (user: Partial<CurrentUser>) => void;
  fetchCurrentUser: () => Promise<void>;
  setLoading: (loading: boolean) => void;
  setError: (error: AuthError | null) => void;
  clearError: () => void;
  reset: () => void;
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

// 🔒 완전 메모리 기반 Zustand 스토어 (가장 안전)
export const useAuthStore = create<AuthStore>()(
  devtools(
    (set, get) => ({
      ...initialState,

        // 사용자 로그인
        login: async (credentials: LoginRequest): Promise<AuthResult> => {
          try {
            set({ isLoading: true, error: null }, false, 'auth/login/start');
      
            const response = await api.post<JwtAuthResponse>(
              API_ENDPOINTS.AUTH.LOGIN,
              {
                email: credentials.email,
                password: credentials.password,
              }
            );
      
            // Access Token만 sessionStorage에 저장
            TokenManager.setAccessToken(response.accessToken);

            const user: CurrentUser = {
              id: response.userId,
              name: response.name,
              email: response.email,
              isAuthenticated: true,
              permissions: [],
            };

            const tokens: TokenInfo = {
              accessToken: response.accessToken,
              refreshToken: null,
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
            
            const errorInfo = apiErrorHandler.parseError(error);
            
            const authError: AuthError = {
              code: errorInfo.code,
              message: errorInfo.message,
              details: errorInfo.details,
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

        // 사용자 회원가입
        signup: async (userData: SignupRequest): Promise<AuthResult> => {
          try {
            set({ isLoading: true, error: null }, false, 'auth/signup/start');
      
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
            
            const errorInfo = apiErrorHandler.parseError(error);
            
            const authError: AuthError = {
              code: errorInfo.code,
              message: errorInfo.message,
              details: errorInfo.details,
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

        // 사용자 로그아웃
        logout: async (): Promise<void> => {
          try {
            await api.post<ApiResponse>(API_ENDPOINTS.AUTH.LOGOUT, {});
          } catch (error) {
            console.warn('Logout API failed:', error);
          } finally {
            TokenManager.clearAllTokens();

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

        // 🔒 토큰 갱신 - 사용자 정보도 다시 조회
        refreshToken: async (): Promise<boolean> => {
          try {
            const response = await api.post<JwtAuthResponse>(
              API_ENDPOINTS.AUTH.REFRESH,
              {}
            );
      
            TokenManager.setAccessToken(response.accessToken);
      
            // 🔒 토큰 갱신 시 사용자 정보도 다시 조회 (보안 강화)
            await get().fetchCurrentUser();
      
            return true;
          } catch (error: unknown) {
            console.error('Token refresh failed:', error);
            await get().logout();
            return false;
          }
        },

        clearTokens: (): void => {
          TokenManager.clearAllTokens();
          set(
            {
              tokens: {
                accessToken: null,
                refreshToken: null,
                tokenType: SECURITY_CONFIG.JWT.TOKEN_TYPE,
              },
            },
            false,
            'auth/clearTokens'
          );
        },

        // 🔒 인증 상태 확인 - 사용자 정보 재조회
        checkAuthStatus: async (): Promise<void> => {
          try {
            set({ isLoading: true }, false, 'auth/check/start');

            const accessToken = TokenManager.getAccessToken();

            if (!accessToken) {
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

            // 🔒 토큰이 있으면 사용자 정보 재조회
            await get().fetchCurrentUser();
          } catch (error) {
            console.error('Auth status check failed:', error);
            await get().logout();
          }
        },

        // 🔒 현재 사용자 정보 가져오기 (매번 서버에서 조회)
        fetchCurrentUser: async (): Promise<void> => {
          try {
            const userResponse = await api.get<ApiResponse<CurrentUser>>(API_ENDPOINTS.AUTH.ME);
            
            const user: CurrentUser = {
              id: userResponse.data.id,
              name: userResponse.data.name,
              email: userResponse.data.email,
              isAuthenticated: true,
              permissions: userResponse.data.permissions || [],
            };

            const accessToken = TokenManager.getAccessToken();

            set(
              {
                status: 'authenticated',
                user,
                tokens: {
                  accessToken,
                  refreshToken: null,
                  tokenType: SECURITY_CONFIG.JWT.TOKEN_TYPE,
                },
                isLoading: false,
              },
              false,
              'auth/fetchUser/success'
            );
          } catch (error) {
            console.error('Fetch user failed:', error);
            // 토큰이 무효하면 로그아웃
            await get().logout();
          }
        },

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
          TokenManager.clearAllTokens();
          set(initialState, false, 'auth/reset');
        },

        isAuthenticated: (): boolean => {
          const { status, tokens } = get();
          return status === 'authenticated' && !!tokens.accessToken;
        },

        hasValidToken: (): boolean => {
          return TokenManager.hasValidTokens();
        },

        needsRefresh: (): boolean => {
          const { lastLoginAttempt } = get();
          
          if (!TokenManager.hasValidTokens()) return false;
          
          const refreshThreshold = SECURITY_CONFIG.JWT.REFRESH_THRESHOLD_MINUTES * 60 * 1000;
          return lastLoginAttempt 
            ? Date.now() - lastLoginAttempt > refreshThreshold 
            : true;
        },

        getUserPermissions: (): string[] => {
          const { user } = get();
          return user?.permissions || [];
        },
      }),
      {
        name: 'auth-store',
        enabled: env.DEV_MODE,
      }
    )
  );

// 헬퍼 훅들
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