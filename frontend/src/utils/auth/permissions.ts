// frontend/src/utils/auth/permissions.ts

import type { 
  UserPermission, 
  UserRole, 
  PermissionCheck 
} from '@/types/auth/authPermission';
import type { CurrentUser } from '@/types/auth/authUser';

// ================================================================
// 권한 상수 정의
// ================================================================

export const PERMISSIONS = {
  // 사용자 관련
  USER_READ: 'user:read' as const,
  USER_WRITE: 'user:write' as const,
  
  // 캐릭터 관련
  CHARACTER_CREATE: 'character:create' as const,
  CHARACTER_READ: 'character:read' as const,
  CHARACTER_WRITE: 'character:write' as const,
  
  // 게임 관련
  GAME_PLAY: 'game:play' as const,
  
  // 게시글 관련
  POST_CREATE: 'post:create' as const,
  POST_READ: 'post:read' as const,
  POST_WRITE: 'post:write' as const,
  POST_DELETE: 'post:delete' as const,
  
  // 댓글 관련
  COMMENT_CREATE: 'comment:create' as const,
  COMMENT_READ: 'comment:read' as const,
  COMMENT_WRITE: 'comment:write' as const,
  COMMENT_DELETE: 'comment:delete' as const,
  
  // 관리자 관련
  ADMIN_READ: 'admin:read' as const,
  ADMIN_WRITE: 'admin:write' as const,
} as const;

export const ROLES = {
  USER: 'user' as const,
  MODERATOR: 'moderator' as const,
  ADMIN: 'admin' as const,
} as const;

// ================================================================
// 역할별 기본 권한 정의
// ================================================================

const ROLE_PERMISSIONS: Record<UserRole, UserPermission[]> = {
  [ROLES.USER]: [
    PERMISSIONS.USER_READ,
    PERMISSIONS.CHARACTER_CREATE,
    PERMISSIONS.CHARACTER_READ,
    PERMISSIONS.CHARACTER_WRITE,
    PERMISSIONS.GAME_PLAY,
    PERMISSIONS.POST_CREATE,
    PERMISSIONS.POST_READ,
    PERMISSIONS.POST_WRITE, // 자신의 게시글만
    PERMISSIONS.COMMENT_CREATE,
    PERMISSIONS.COMMENT_READ,
    PERMISSIONS.COMMENT_WRITE, // 자신의 댓글만
  ],
  
  [ROLES.MODERATOR]: [
    ...ROLE_PERMISSIONS.user,
    PERMISSIONS.POST_DELETE, // 다른 사용자 게시글도
    PERMISSIONS.COMMENT_DELETE, // 다른 사용자 댓글도
  ],
  
  [ROLES.ADMIN]: [
    ...ROLE_PERMISSIONS.moderator,
    PERMISSIONS.USER_WRITE,
    PERMISSIONS.ADMIN_READ,
    PERMISSIONS.ADMIN_WRITE,
  ],
};

// ================================================================
// 권한 확인 함수들
// ================================================================

/**
 * 사용자가 특정 권한을 가지고 있는지 확인
 */
export const hasPermission = (
  user: CurrentUser | null,
  permission: UserPermission,
  resourceOwnerId?: number
): PermissionCheck => {
  if (!user || !user.isAuthenticated) {
    return {
      hasPermission: false,
      reason: '로그인이 필요합니다.'
    };
  }

  // 직접 권한 확인 (사용자에게 직접 부여된 권한)
  if (user.permissions?.includes(permission)) {
    return { hasPermission: true };
  }

  // 역할 기반 권한 확인 (현재는 역할 정보가 없으므로 기본적으로 user 역할로 가정)
  const userRole: UserRole = 'user'; // 실제로는 JWT나 사용자 정보에서 가져와야 함
  const rolePermissions = ROLE_PERMISSIONS[userRole] || [];
  
  if (rolePermissions.includes(permission)) {
    // 리소스 소유자 확인이 필요한 권한들
    const ownerOnlyPermissions: UserPermission[] = [
      PERMISSIONS.POST_WRITE,
      PERMISSIONS.POST_DELETE,
      PERMISSIONS.COMMENT_WRITE,
      PERMISSIONS.COMMENT_DELETE,
      PERMISSIONS.CHARACTER_WRITE,
    ];

    if (ownerOnlyPermissions.includes(permission)) {
      if (resourceOwnerId === undefined) {
        return { hasPermission: true }; // 소유자 확인이 불가능한 경우 허용
      }
      
      if (resourceOwnerId === user.id) {
        return { hasPermission: true };
      }
      
      // 관리자나 모더레이터는 다른 사용자의 리소스도 수정/삭제 가능
      if (userRole === 'admin' || userRole === 'moderator') {
        return { hasPermission: true };
      }
      
      return {
        hasPermission: false,
        reason: '본인의 콘텐츠만 수정/삭제할 수 있습니다.'
      };
    }

    return { hasPermission: true };
  }

  return {
    hasPermission: false,
    reason: '해당 권한이 없습니다.'
  };
};

/**
 * 여러 권한 중 하나라도 가지고 있는지 확인
 */
export const hasAnyPermission = (
  user: CurrentUser | null,
  permissions: UserPermission[],
  resourceOwnerId?: number
): PermissionCheck => {
  for (const permission of permissions) {
    const check = hasPermission(user, permission, resourceOwnerId);
    if (check.hasPermission) {
      return { hasPermission: true };
    }
  }

  return {
    hasPermission: false,
    reason: '필요한 권한이 없습니다.'
  };
};

/**
 * 모든 권한을 가지고 있는지 확인
 */
export const hasAllPermissions = (
  user: CurrentUser | null,
  permissions: UserPermission[],
  resourceOwnerId?: number
): PermissionCheck => {
  for (const permission of permissions) {
    const check = hasPermission(user, permission, resourceOwnerId);
    if (!check.hasPermission) {
      return check;
    }
  }

  return { hasPermission: true };
};

/**
 * 사용자의 모든 권한 목록 가져오기
 */
export const getUserPermissions = (user: CurrentUser | null): UserPermission[] => {
  if (!user || !user.isAuthenticated) {
    return [];
  }

  // 직접 부여된 권한
  const directPermissions = user.permissions || [];
  
  // 역할 기반 권한 (실제로는 JWT나 API에서 역할 정보를 가져와야 함)
  const userRole: UserRole = 'user';
  const rolePermissions = ROLE_PERMISSIONS[userRole] || [];

  // 중복 제거하여 반환
  return Array.from(new Set([...directPermissions, ...rolePermissions]));
};

// ================================================================
// 페이지별 권한 확인
// ================================================================

/**
 * 페이지 접근 권한 확인
 */
export const canAccessPage = (
  user: CurrentUser | null,
  path: string
): PermissionCheck => {
  // 공개 페이지들
  const publicPaths = ['/', '/auth/login', '/auth/signup', '/metro-map', '/community'];
  
  if (publicPaths.includes(path) || path.startsWith('/community/')) {
    return { hasPermission: true };
  }

  // 인증이 필요한 페이지들
  const protectedPaths = {
    '/profile': [PERMISSIONS.USER_READ],
    '/character': [PERMISSIONS.CHARACTER_READ],
    '/game': [PERMISSIONS.GAME_PLAY],
    '/admin': [PERMISSIONS.ADMIN_READ],
  };

  for (const [pagePath, requiredPermissions] of Object.entries(protectedPaths)) {
    if (path.startsWith(pagePath)) {
      return hasAnyPermission(user, requiredPermissions);
    }
  }

  // 기본적으로 인증된 사용자만 접근 가능
  return {
    hasPermission: user?.isAuthenticated || false,
    reason: '로그인이 필요합니다.'
  };
};

/**
 * 게시글 권한 확인
 */
export const canManagePost = (
  user: CurrentUser | null,
  postAuthorId: number,
  action: 'read' | 'write' | 'delete'
): PermissionCheck => {
  const permissionMap = {
    read: PERMISSIONS.POST_READ,
    write: PERMISSIONS.POST_WRITE,
    delete: PERMISSIONS.POST_DELETE,
  };

  return hasPermission(user, permissionMap[action], postAuthorId);
};

/**
 * 댓글 권한 확인
 */
export const canManageComment = (
  user: CurrentUser | null,
  commentAuthorId: number,
  action: 'read' | 'write' | 'delete'
): PermissionCheck => {
  const permissionMap = {
    read: PERMISSIONS.COMMENT_READ,
    write: PERMISSIONS.COMMENT_WRITE,
    delete: PERMISSIONS.COMMENT_DELETE,
  };

  return hasPermission(user, permissionMap[action], commentAuthorId);
};

/**
 * 캐릭터 권한 확인
 */
export const canManageCharacter = (
  user: CurrentUser | null,
  characterUserId: number,
  action: 'read' | 'write' | 'create'
): PermissionCheck => {
  const permissionMap = {
    read: PERMISSIONS.CHARACTER_READ,
    write: PERMISSIONS.CHARACTER_WRITE,
    create: PERMISSIONS.CHARACTER_CREATE,
  };

  return hasPermission(user, permissionMap[action], characterUserId);
};

// ================================================================
// 권한 기반 UI 헬퍼
// ================================================================

/**
 * 권한에 따른 UI 요소 표시 여부 결정
 */
export const shouldShowUI = (
  user: CurrentUser | null,
  requiredPermissions: UserPermission | UserPermission[],
  resourceOwnerId?: number
): boolean => {
  const permissions = Array.isArray(requiredPermissions) 
    ? requiredPermissions 
    : [requiredPermissions];

  const check = hasAnyPermission(user, permissions, resourceOwnerId);
  return check.hasPermission;
};

/**
 * 권한 에러 메시지 생성
 */
export const getPermissionErrorMessage = (check: PermissionCheck): string => {
  if (check.hasPermission) return '';
  
  return check.reason || '권한이 없습니다.';
};

// ================================================================
// 권한 데코레이터 (고차 함수)
// ================================================================

/**
 * 함수 실행 전 권한 확인
 */
export const withPermission = <T extends unknown[], R>(
  requiredPermission: UserPermission,
  fn: (...args: T) => R,
  user: CurrentUser | null,
  resourceOwnerId?: number
) => {
  return (...args: T): R => {
    const check = hasPermission(user, requiredPermission, resourceOwnerId);
    
    if (!check.hasPermission) {
      throw new Error(check.reason || '권한이 없습니다.');
    }
    
    return fn(...args);
  };
};

// ================================================================
// 기본 export
// ================================================================

export default {
  PERMISSIONS,
  ROLES,
  hasPermission,
  hasAnyPermission,
  hasAllPermissions,
  getUserPermissions,
  canAccessPage,
  canManagePost,
  canManageComment,
  canManageCharacter,
  shouldShowUI,
  getPermissionErrorMessage,
  withPermission,
};