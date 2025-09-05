// frontend/src/shared/store/authStore.ts

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

// 🔒 SessionStorage 기반 상태 복원 헬퍼
const restoreAuthState = (): Partial<AuthState> => {
  if (typeof window === 'undefined') return {};

  try {
    const accessToken = TokenManager.getAccessToken();
    const storedUser = sessionStorage.getItem('behindy_user');
    
    if (accessToken && TokenManager.isTokenValid() && storedUser) {
      const user: CurrentUser = JSON.parse(storedUser);
      
      console.log('🔄 [AuthStore] 세션에서 인증 상태 복원:', {
        hasToken: !!accessToken,
        userName: user.name,
        userEmail: user.email
      });

      return {
        status: 'authenticated',
        user,
        tokens: {
          accessToken,
          refreshToken: null, // HttpOnly Cookie
          tokenType: SECURITY_CONFIG.JWT.TOKEN_TYPE,
        },
      };
    }
  } catch (error) {
    console.warn('⚠️ [AuthStore] 세션 복원 실패:', error);
    // 복원 실패 시 정리
    TokenManager.clearAllTokens();
    sessionStorage.removeItem('behindy_user');
  }

  return {};
};

// 🔒 SessionStorage에 사용자 정보 저장
const saveUserToSession = (user: CurrentUser | null): void => {
  if (typeof window === 'undefined') return;

  try {
    if (user) {
      sessionStorage.setItem('behindy_user', JSON.stringify(user));
      console.log('💾 [AuthStore] 사용자 정보 세션 저장:', user.name);
    } else {
      sessionStorage.removeItem('behindy_user');
      console.log('🗑️ [AuthStore] 사용자 정보 세션 제거');
    }
  } catch (error) {
    console.warn('⚠️ [AuthStore] 사용자 정보 저장 실패:', error);
  }
};

// 🔒 Zustand 스토어 (persist 제거, sessionStorage 직접 관리)
export const useAuthStore = create<AuthStore>()(
  devtools(
    (set, get) => ({
      // 초기 상태 + 세션 복원
      ...initialState,
      ...restoreAuthState(),

      // 사용자 로그인
      login: async (credentials: LoginRequest): Promise<AuthResult> => {
        try {
          set({ isLoading: true, error: null }, false, 'auth/login/start');
    
          console.log('🔐 [AuthStore] 로그인 시도:', {
            email: credentials.email,
            timestamp: new Date().toISOString()
          });

          const response = await api.post<JwtAuthResponse>(
            API_ENDPOINTS.AUTH.LOGIN,
            {
              email: credentials.email,
              password: credentials.password,
            }
          );

          console.log('✅ [AuthStore] 로그인 API 성공:', {
            userId: response.userId,
            name: response.name,
            tokenType: response.tokenType
          });
    
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

          // 🔥 세션에 사용자 정보 저장
          saveUserToSession(user);
    
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

          console.log('🎉 [AuthStore] 로그인 완료:', user.name);
    
          return { success: true, data: user };
        } catch (error: unknown) {
          console.error('❌ [AuthStore] 로그인 실패:', error);
          
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

          console.log('📝 [AuthStore] 회원가입 시도:', {
            name: userData.name,
            email: userData.email,
            timestamp: new Date().toISOString()
          });
    
          const response = await api.post<ApiResponse<number>>(
            API_ENDPOINTS.AUTH.SIGNUP,
            {
              name: userData.name,
              email: userData.email,
              password: userData.password,
            }
          );

          console.log('✅ [AuthStore] 회원가입 성공:', {
            userId: response.data,
            message: response.message
          });
    
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
          console.error('❌ [AuthStore] 회원가입 실패:', error);
          
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
        console.log('🚪 [AuthStore] 로그아웃 시작');

        try {
          // 서버에 로그아웃 요청 (Cookie 정리)
          await api.post<ApiResponse>(API_ENDPOINTS.AUTH.LOGOUT, {});
          console.log('✅ [AuthStore] 서버 로그아웃 완료');
        } catch (error) {
          console.warn('⚠️ [AuthStore] 서버 로그아웃 실패:', error);
        } finally {
          // 클라이언트 정리
          TokenManager.clearAllTokens();
          saveUserToSession(null);

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

          console.log('🧹 [AuthStore] 클라이언트 정리 완료');
        }
      },

      // 🔄 토큰 갱신
      refreshToken: async (): Promise<boolean> => {
        try {
          console.log('🔄 [AuthStore] 토큰 갱신 시작');
          
          const response = await api.post<JwtAuthResponse>(
            API_ENDPOINTS.AUTH.REFRESH,
            {} // Refresh Token은 Cookie에 있음
          );

          console.log('✅ [AuthStore] 토큰 갱신 성공');
    
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
    
          return true;
        } catch (error: unknown) {
          console.error('❌ [AuthStore] 토큰 갱신 실패:', error);
          // 갱신 실패 시 로그아웃
          await get().logout();
          return false;
        }
      },

      // 토큰 클리어
      clearTokens: (): void => {
        console.log('🗑️ [AuthStore] 토큰 클리어');
        TokenManager.clearAllTokens();
        saveUserToSession(null);
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

          console.log('🔍 [AuthStore] 인증 상태 확인 시작');

          const accessToken = TokenManager.getAccessToken();

          if (!accessToken) {
            // Access Token이 없으면 Refresh 시도
            console.log('🔄 [AuthStore] Access Token 없음, Refresh 시도');
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
              console.log('🔄 [AuthStore] Access Token 만료, 갱신 시도');
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
          console.error('❌ [AuthStore] 인증 상태 확인 실패:', error);
          await get().logout();
        }
      },

      // 현재 사용자 정보 가져오기
      fetchCurrentUser: async (): Promise<void> => {
        try {
          console.log('👤 [AuthStore] 사용자 정보 조회 시작');

          const userResponse = await api.get<ApiResponse<CurrentUser>>(API_ENDPOINTS.AUTH.ME);
          
          const user: CurrentUser = {
            id: userResponse.data.id,
            name: userResponse.data.name,
            email: userResponse.data.email,
            isAuthenticated: true,
            permissions: userResponse.data.permissions || [],
          };

          console.log('✅ [AuthStore] 사용자 정보 조회 성공:', {
            id: user.id,
            name: user.name,
            email: user.email
          });

          const accessToken = TokenManager.getAccessToken();

          // 🔥 세션에 사용자 정보 저장
          saveUserToSession(user);

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
          console.error('❌ [AuthStore] 사용자 정보 조회 실패:', error);
          // 사용자 정보 조회 실패 시 로그아웃
          await get().logout();
        }
      },

      // 사용자 정보 업데이트
      updateUser: (userUpdate: Partial<CurrentUser>): void => {
        const { user } = get();
        if (user) {
          const updatedUser = { ...user, ...userUpdate };
          
          // 🔥 세션에도 업데이트된 정보 저장
          saveUserToSession(updatedUser);

          set(
            {
              user: updatedUser,
            },
            false,
            'auth/updateUser'
          );

          console.log('📝 [AuthStore] 사용자 정보 업데이트:', userUpdate);
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
        console.log('🔄 [AuthStore] 상태 리셋');
        TokenManager.clearAllTokens();
        saveUserToSession(null);
        set(initialState, false, 'auth/reset');
      },

      // 인증 여부 확인
      isAuthenticated: (): boolean => {
        const { status, tokens } = get();
        const isAuth = status === 'authenticated' && !!tokens.accessToken;
        return isAuth;
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