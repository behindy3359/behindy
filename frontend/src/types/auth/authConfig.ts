  /**
   * 인증 설정
   */
  export interface AuthConfig {
    tokenStorageKey: string;
    refreshTokenStorageKey: string;
    autoRefresh: boolean;
    refreshThreshold: number; // 토큰 만료 전 갱신할 시간 (초)
    maxRetries: number;
    loginRedirectPath: string;
    logoutRedirectPath: string;
  }
  