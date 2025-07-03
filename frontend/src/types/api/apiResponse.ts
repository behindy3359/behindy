/**
 * JWT 인증 응답 (백엔드 JwtAuthResponse와 일치)
 */
export interface JwtAuthResponse {
  accessToken: string;
  refreshToken: string;
  tokenType: string;
  userId: number;
  name: string;
  email: string;
}

/**
 * 회원가입 성공 응답 (백엔드 ApiResponse<Integer>와 일치)
 */
export interface SignupResponse {
  success: boolean;
  message: string;
  data: number; // userId
}

/**
 * 로그아웃 응답 (백엔드 ApiResponse와 일치)
 */
export interface LogoutResponse {
  success: boolean;
  message: string;
}

// ================================================================
// 요청 타입들 (백엔드 DTO와 일치)
// ================================================================

/**
 * 로그인 요청 (백엔드 LoginRequest와 일치)
 */
export interface LoginRequest {
  email: string;
  password: string;
}

/**
 * 회원가입 요청 (백엔드 SignupRequest와 일치)
 */
export interface SignupRequest {
  name: string;
  email: string;
  password: string;
}

/**
 * 토큰 갱신 요청 (백엔드 TokenRefreshRequest와 일치)
 */
export interface TokenRefreshRequest {
  refreshToken: string;
}

// ================================================================
// 에러 타입 (간소화)
// ================================================================

/**
 * API 에러 응답
 */
export interface ApiError {
  success: false;
  message: string;
  error?: string;
}

/**
 * 인증 에러 정보
 */
export interface AuthError {
  code: string;
  message: string;
}

export interface AuthResult {
  success: boolean;
  error?: string;
  data?: any;
}