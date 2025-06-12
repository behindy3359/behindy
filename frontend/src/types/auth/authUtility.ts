import { UserRole } from "./authPermission";
import { CurrentUser, User } from "./authUser";
import { AuthError } from "./authState";

/**
 * 인증이 필요한 요청 타입
 */
export type AuthenticatedRequest<T = Record<string, unknown>> = T & {
  userId: number;
  userRole: UserRole;
};

/**
 * 인증 선택적 요청 타입
 */
export type OptionalAuthRequest<T = Record<string, unknown>> = T & {
  userId?: number;
  userRole?: UserRole;
};

/**
 * 로그인 상태 체크 결과
 */
export interface LoginStatusCheck {
  isLoggedIn: boolean;
  user: CurrentUser | null;
  needsRefresh: boolean;
  error?: AuthError;
}

/**
 * 사용자 생성 시 필요한 데이터 (ID 제외)
 */
export type CreateUserData = Omit<User, 'id' | 'createdAt' | 'updatedAt' | 'deletedAt'>;

/**
 * 사용자 업데이트 시 필요한 데이터 (선택적)
 */
export type UpdateUserData = Partial<Omit<User, 'id' | 'createdAt' | 'updatedAt' | 'deletedAt'>>;