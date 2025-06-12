  // ============================================================================
  // 세션 관리 타입들 (Session Types)
  // ============================================================================
  
  /**
   * 세션 정보
   */
  export interface SessionInfo {
    sessionId: string;
    userId: number;
    deviceInfo?: string;
    ipAddress?: string;
    userAgent?: string;
    createdAt: string;
    lastActivity: string;
    expiresAt: string;
  }