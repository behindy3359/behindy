  // ============================================================================
  // 인증 상태 타입들 (Auth State Types)
  // ============================================================================
  import { CurrentUser } from "./authUser";


  /**
   * 인증 상태
   */
  export type AuthStatus = 'idle' | 'loading' | 'authenticated' | 'unauthenticated' | 'error';
  
  /**
   * 토큰 정보
   */
  export interface TokenInfo {
    accessToken: string | null;
    refreshToken: string | null;
    tokenType: string;
    expiresAt?: number;
  }
  
  /**
   * 인증 에러 정보
   */
  export interface AuthError {
    code: string;
    message: string;
    field?: string;
    details?: any;
  }
  
  /**
   * 전체 인증 상태
   */
  export interface AuthState {
    status: AuthStatus;
    user: CurrentUser | null;
    tokens: TokenInfo;
    error: AuthError | null;
    isLoading: boolean;
    lastLoginAttempt?: number;
  }
  