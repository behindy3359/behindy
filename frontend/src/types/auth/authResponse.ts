  // 로그인 성공 응답 데이터
  export interface AuthResponse {
    accessToken: string;
    refreshToken: string;
    tokenType: string;
    userId: number;
    name: string;
    email: string;
  }
  
  // 토큰 갱신 응답 데이터
  export interface RefreshTokenResponse {
    accessToken: string;
    refreshToken: string;
    tokenType: string;
  }
  
  // 회원가입 성공 응답 데이터
  export interface SignupResponse {
    userId: number;
    message: string;
  }
  
  // 로그아웃 응답 데이터
  export interface LogoutResponse {
    message: string;
  }