import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
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

// 🔒 Zustand 스토어 with persist
export const useAuthStore = create<AuthStore>()(
  devtools(
    persist(
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
      
            // Access Token sessionStorage에 저장
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
              refreshToken: null, // HttpOnly Cookie로 관리
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
            // 서버에 로그아웃 요청 (Cookie 정리)
            await api.post<ApiResponse>(API_ENDPOINTS.AUTH.LOGOUT, {});
          } catch (error) {
            console.warn('Logout API failed:', error);
          } finally {
            // 클라이언트 토큰 정리
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

        // 🔄 토큰 갱신
        refreshToken: async (): Promise<boolean> => {
          try {
            console.log('🔄 Refreshing access token...');
            
            const response = await api.post<JwtAuthResponse>(
              API_ENDPOINTS.AUTH.REFRESH,
              {} // Refresh Token은 Cookie에 있음
            );
      
            // 새 Access Token 저장
            TokenManager.setAccessToken(response.accessToken);
            
            // 토큰 정보 업데이트
            set(
              (state) => ({
                tokens: {
                  ...state.tokens,
                  accessToken: response.accessToken,
                },
              }),
              false,
              'auth/refreshToken/success'
            );
      
            // 사용자 정보도 다시 조회
            await get().fetchCurrentUser();
      
            console.log('✅ Token refreshed successfully');
            return true;
          } catch (error: unknown) {
            console.error('❌ Token refresh failed:', error);
            // 갱신 실패 시 로그아웃
            await get().logout();
            return false;
          }
        },

        // 토큰 클리어
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

        // 🔥 인증 상태 확인 (개선된 버전)
        checkAuthStatus: async (): Promise<void> => {
          try {
            set({ isLoading: true }, false, 'auth/check/start');

            const accessToken = TokenManager.getAccessToken();

            if (!accessToken) {
              // Access Token이 없으면 Refresh 시도
              console.log('🔄 No access token, attempting refresh...');
              const refreshSuccess = await get().refreshToken();
              
              if (!refreshSuccess) {
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
            } else {
              // Access Token이 있으면 유효성 검증
              if (!TokenManager.isTokenValid()) {
                console.log('🔄 Access token expired, refreshing...');
                const refreshSuccess = await get().refreshToken();
                
                if (!refreshSuccess) {
                  set(
                    {
                      status: 'unauthenticated',
                      user: null,
                      isLoading: false,
                    },
                    false,
                    'auth/check/expired'
                  );
                  return;
                }
              } else {
                // 토큰이 유효하면 사용자 정보 조회
                await get().fetchCurrentUser();
              }
            }
          } catch (error) {
            console.error('Auth status check failed:', error);
            await get().logout();
          }
        },

        // 현재 사용자 정보 가져오기
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
            // 사용자 정보 조회 실패 시 로그아웃
            await get().logout();
          }
        },

        // 사용자 정보 업데이트
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

        // 로딩 상태 설정
        setLoading: (loading: boolean): void => {
          set({ isLoading: loading }, false, 'auth/setLoading');
        },

        // 에러 설정
        setError: (error: AuthError | null): void => {
          set({ error }, false, 'auth/setError');
        },

        // 에러 클리어
        clearError: (): void => {
          set({ error: null }, false, 'auth/clearError');
        },

        // 상태 리셋
        reset: (): void => {
          TokenManager.clearAllTokens();
          set(initialState, false, 'auth/reset');
        },

        // 인증 여부 확인
        isAuthenticated: (): boolean => {
          const { status, tokens } = get();
          return status === 'authenticated' && !!tokens.accessToken;
        },

        // 유효한 토큰 여부
        hasValidToken: (): boolean => {
          return TokenManager.hasValidTokens();
        },

        // 갱신 필요 여부
        needsRefresh: (): boolean => {
          const { lastLoginAttempt } = get();
          
          if (!TokenManager.hasValidTokens()) return false;
          
          const refreshThreshold = SECURITY_CONFIG.JWT.REFRESH_THRESHOLD_MINUTES * 60 * 1000;
          return lastLoginAttempt 
            ? Date.now() - lastLoginAttempt > refreshThreshold 
            : true;
        },

        // 사용자 권한 가져오기
        getUserPermissions: (): string[] => {
          const { user } = get();
          return user?.permissions || [];
        },
      }),
      {
        name: 'auth-storage',
        // 🔥 persist할 데이터 선택
        partialize: (state) => ({ 
          user: state.user,
          status: state.status,
          // tokens는 제외 (sessionStorage로 별도 관리)
        }),
        // 🔥 하이드레이션 후 처리
        onRehydrateStorage: () => {
          console.log('🔄 Auth store rehydrating...');
          
          return (state, error) => {
            if (error) {
              console.error('❌ Auth store hydration error:', error);
              return;
            }
            
            if (state && typeof window !== 'undefined') {
              const accessToken = TokenManager.getAccessToken();
              
              if (accessToken && TokenManager.isTokenValid()) {
                // 토큰이 유효하고 유저 정보가 있으면 인증 상태 유지
                if (state.user) {
                  state.tokens.accessToken = accessToken;
                  state.status = 'authenticated';
                  console.log('✅ Auth restored: user logged in');
                } else {
                  // 토큰은 있는데 유저 정보가 없으면 다시 조회
                  console.log('🔄 Token found but no user info, fetching...');
                  state.checkAuthStatus();
                }
              } else if (!accessToken && state.user) {
                // 토큰이 없는데 유저 정보가 있으면 초기화
                state.user = null;
                state.status = 'unauthenticated';
                console.log('⚠️ User data found but no valid token, clearing auth');
              } else if (accessToken && !TokenManager.isTokenValid()) {
                // 토큰이 만료되었으면 갱신 시도
                console.log('🔄 Token expired, attempting refresh...');
                state.checkAuthStatus();
              }
            }
          };
        },
      }
    ),
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