import { SessionInfo } from "./authSession";

  // 회원가입 요청 데이터
  export interface SignupRequest {
    name: string;
    email: string;
    password: string;
  }
  
  // 로그인 요청 데이터
  export interface LoginRequest {
    email: string;
    password: string;
  }
  
  // 토큰 갱신 요청 데이터
  export interface RefreshTokenRequest {
    refreshToken: string;
  }
  
  // 로그아웃 요청 데이터
  export interface LogoutRequest {
    refreshToken: string;
  }
  
  // 비밀번호 변경 요청 데이터
  export interface ChangePasswordRequest {
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
  }
  
  // 프로필 업데이트 요청 데이터
  export interface UpdateProfileRequest {
    name?: string;
    email?: string;
  }
  
  // 활성 세션 목록
  export interface ActiveSession {
    current: SessionInfo;
    others: SessionInfo[];
  }
  