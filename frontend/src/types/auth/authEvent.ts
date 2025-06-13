import { AuthError } from "./authState";

// 인증 이벤트 타입
export type AuthEventType = 
  | 'login_success'
  | 'login_failed'
  | 'logout'
  | 'token_refreshed'
  | 'token_expired'
  | 'session_ended'
  | 'password_changed'
  | 'profile_updated';

// 인증 이벤트 데이터
export interface AuthEvent {
  type: AuthEventType;
  timestamp: number;
  userId?: number;
  data?: unknown;
  error?: AuthError;
}