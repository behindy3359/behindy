  // ============================================================================
  // 인증 권한 타입들 (Permission Types)
  // ============================================================================
  
  /**
   * 사용자 권한
   */
  export type UserPermission = 
    | 'user:read'
    | 'user:write'
    | 'character:create'
    | 'character:read'
    | 'character:write'
    | 'game:play'
    | 'post:create'
    | 'post:read'
    | 'post:write'
    | 'post:delete'
    | 'comment:create'
    | 'comment:read'
    | 'comment:write'
    | 'comment:delete'
    | 'admin:read'
    | 'admin:write';
  
  /**
   * 사용자 역할
   */
  export type UserRole = 'user' | 'moderator' | 'admin';
  
  /**
   * 권한 확인 결과
   */
  export interface PermissionCheck {
    hasPermission: boolean;
    reason?: string;
  }
  