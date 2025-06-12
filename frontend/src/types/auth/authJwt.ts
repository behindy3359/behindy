
  // ============================================================================
  // JWT 토큰 관련 타입들 (JWT Types)
  // ============================================================================
  
  /**
   * JWT 페이로드 구조
   */
  export interface JWTPayload {
    sub: string; // 사용자 ID
    name: string;
    email: string;
    iat: number; // 발급 시간
    exp: number; // 만료 시간
    iss?: string; // 발급자
    aud?: string; // 대상
  }
  
  /**
   * 토큰 디코딩 결과
   */
  export interface DecodedToken {
    header: {
      alg: string;
      typ: string;
    };
    payload: JWTPayload;
    signature: string;
  }
  
  /**
   * 토큰 검증 결과
   */
  export interface TokenValidation {
    isValid: boolean;
    isExpired: boolean;
    expiresAt: number;
    decodedToken?: DecodedToken;
    error?: string;
  }