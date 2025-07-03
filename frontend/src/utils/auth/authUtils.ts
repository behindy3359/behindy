import { jwtDecode } from 'jwt-decode';
import type { 
  JWTPayload, 
  TokenValidation, 
  DecodedToken 
} from '@/types/auth/authJwt';
import type { AuthError } from '@/types/auth/authState';
import { env } from '@/config/env';

// ================================================================
// JWT 토큰 유틸리티
// ================================================================

/**
 * JWT 토큰 디코딩
 */
export const decodeJwtToken = (token: string): DecodedToken | null => {
  try {
    const decoded = jwtDecode<JWTPayload>(token);
    return {
      header: { alg: 'HS256', typ: 'JWT' }, // 기본값
      payload: decoded,
      signature: token.split('.')[2] || ''
    };
  } catch (error) {
    console.error('JWT decode error:', error);
    return null;
  }
};

/**
 * JWT 토큰 검증
 */
export const validateJwtToken = (token: string): TokenValidation => {
  if (!token || token.trim() === '') {
    return {
      isValid: false,
      isExpired: true,
      expiresAt: 0,
      error: 'Token is empty or null'
    };
  }

  try {
    const decodedToken = decodeJwtToken(token);
    
    if (!decodedToken) {
      return {
        isValid: false,
        isExpired: true,
        expiresAt: 0,
        error: 'Invalid token format'
      };
    }

    const now = Math.floor(Date.now() / 1000);
    const expiresAt = decodedToken.payload.exp;
    const isExpired = now >= expiresAt;

    return {
      isValid: !isExpired,
      isExpired,
      expiresAt: expiresAt * 1000, // milliseconds로 변환
      decodedToken
    };
  } catch (error) {
    return {
      isValid: false,
      isExpired: true,
      expiresAt: 0,
      error: error instanceof Error ? error.message : 'Token validation failed'
    };
  }
};

/**
 * 토큰 만료까지 남은 시간 (분)
 */
export const getTokenTimeRemaining = (token: string): number => {
  const validation = validateJwtToken(token);
  if (!validation.isValid) return 0;
  
  const now = Date.now();
  const remaining = validation.expiresAt - now;
  return Math.max(0, Math.floor(remaining / (1000 * 60)));
};

/**
 * 토큰 갱신이 필요한지 확인 (만료 10분 전)
 */
export const shouldRefreshToken = (token: string): boolean => {
  const timeRemaining = getTokenTimeRemaining(token);
  return timeRemaining <= 10 && timeRemaining > 0;
};

// ================================================================
// 로컬 스토리지 유틸리티
// ================================================================

/**
 * 안전한 로컬 스토리지 접근
 */
export const safeLocalStorage = {
  getItem: (key: string): string | null => {
    if (typeof window === 'undefined') return null;
    try {
      return localStorage.getItem(key);
    } catch (error) {
      console.warn('localStorage getItem failed:', error);
      return null;
    }
  },

  setItem: (key: string, value: string): boolean => {
    if (typeof window === 'undefined') return false;
    try {
      localStorage.setItem(key, value);
      return true;
    } catch (error) {
      console.warn('localStorage setItem failed:', error);
      return false;
    }
  },

  removeItem: (key: string): boolean => {
    if (typeof window === 'undefined') return false;
    try {
      localStorage.removeItem(key);
      return true;
    } catch (error) {
      console.warn('localStorage removeItem failed:', error);
      return false;
    }
  },

  clear: (): boolean => {
    if (typeof window === 'undefined') return false;
    try {
      localStorage.clear();
      return true;
    } catch (error) {
      console.warn('localStorage clear failed:', error);
      return false;
    }
  }
};

/**
 * 토큰 스토리지 관리
 */
export const tokenStorage = {
  getAccessToken: (): string | null => {
    return safeLocalStorage.getItem(env.TOKEN_KEY);
  },

  getRefreshToken: (): string | null => {
    return safeLocalStorage.getItem(env.REFRESH_TOKEN_KEY);
  },

  setTokens: (accessToken: string, refreshToken: string): boolean => {
    const accessSet = safeLocalStorage.setItem(env.TOKEN_KEY, accessToken);
    const refreshSet = safeLocalStorage.setItem(env.REFRESH_TOKEN_KEY, refreshToken);
    return accessSet && refreshSet;
  },

  clearTokens: (): boolean => {
    const accessCleared = safeLocalStorage.removeItem(env.TOKEN_KEY);
    const refreshCleared = safeLocalStorage.removeItem(env.REFRESH_TOKEN_KEY);
    return accessCleared && refreshCleared;
  },

  hasValidTokens: (): boolean => {
    const accessToken = tokenStorage.getAccessToken();
    const refreshToken = tokenStorage.getRefreshToken();
    
    if (!accessToken || !refreshToken) return false;
    
    const validation = validateJwtToken(accessToken);
    return validation.isValid || shouldRefreshToken(accessToken);
  }
};

// ================================================================
// 에러 처리 유틸리티
// ================================================================

/**
 * API 에러를 AuthError로 변환
 */
export const parseAuthError = (error: unknown): AuthError => {
  // Axios 에러 형태
  if (error && typeof error === 'object' && 'response' in error) {
    const axiosError = error as {
      response?: {
        status?: number;
        data?: {
          message?: string;
          error?: string;
          statusCode?: number;
        };
      };
      message?: string;
    };

    const status = axiosError.response?.status;
    const data = axiosError.response?.data;

    return {
      code: status?.toString() || 'UNKNOWN_ERROR',
      message: data?.message || data?.error || axiosError.message || '알 수 없는 오류가 발생했습니다.',
      details: data
    };
  }

  // 일반 Error 객체
  if (error instanceof Error) {
    return {
      code: 'CLIENT_ERROR',
      message: error.message,
      details: { name: error.name, stack: error.stack }
    };
  }

  // 문자열 에러
  if (typeof error === 'string') {
    return {
      code: 'STRING_ERROR',
      message: error
    };
  }

  // 기본 에러
  return {
    code: 'UNKNOWN_ERROR',
    message: '알 수 없는 오류가 발생했습니다.',
    details: error
  };
};

/**
 * 에러 메시지 한국어화
 */
export const translateErrorMessage = (error: AuthError): string => {
  const errorMessages: Record<string, string> = {
    // HTTP 상태 코드
    '400': '잘못된 요청입니다.',
    '401': '인증이 필요합니다.',
    '403': '접근 권한이 없습니다.',
    '404': '요청한 정보를 찾을 수 없습니다.',
    '409': '이미 존재하는 정보입니다.',
    '422': '입력 정보를 확인해주세요.',
    '429': '너무 많은 요청이 발생했습니다. 잠시 후 다시 시도해주세요.',
    '500': '서버 오류가 발생했습니다.',
    '502': '서버 연결에 문제가 있습니다.',
    '503': '서버가 일시적으로 사용할 수 없습니다.',

    // 커스텀 에러 코드
    'INVALID_CREDENTIALS': '이메일 또는 비밀번호가 올바르지 않습니다.',
    'EMAIL_ALREADY_EXISTS': '이미 사용 중인 이메일입니다.',
    'WEAK_PASSWORD': '비밀번호가 너무 간단합니다.',
    'TOKEN_EXPIRED': '로그인이 만료되었습니다. 다시 로그인해주세요.',
    'INVALID_TOKEN': '유효하지 않은 토큰입니다.',
    'NETWORK_ERROR': '네트워크 연결을 확인해주세요.',
    'TIMEOUT_ERROR': '요청 시간이 초과되었습니다.',
  };

  return errorMessages[error.code] || error.message;
};

// ================================================================
// 폼 검증 유틸리티
// ================================================================

/**
 * 이메일 형식 검증
 */
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email.trim());
};

/**
 * 비밀번호 강도 검증
 */
export const getPasswordStrength = (password: string): {
  score: number; // 0-4
  feedback: string[];
  isValid: boolean;
} => {
  const feedback: string[] = [];
  let score = 0;

  if (password.length >= 8) {
    score++;
  } else {
    feedback.push('8자 이상이어야 합니다');
  }

  if (/[a-z]/.test(password)) {
    score++;
  } else {
    feedback.push('소문자를 포함해야 합니다');
  }

  if (/[A-Z]/.test(password)) {
    score++;
  } else {
    feedback.push('대문자를 포함해야 합니다');
  }

  if (/\d/.test(password)) {
    score++;
  } else {
    feedback.push('숫자를 포함해야 합니다');
  }

  if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    score++;
  } else {
    feedback.push('특수문자를 포함해야 합니다');
  }

  return {
    score,
    feedback,
    isValid: score >= 4
  };
};

/**
 * 이름 검증
 */
export const isValidName = (name: string): boolean => {
  const trimmedName = name.trim();
  return trimmedName.length >= 2 && trimmedName.length <= 50;
};

/**
 * 폼 데이터 정리
 */
export const sanitizeFormData = <T extends Record<string, unknown>>(data: T): T => {
  const sanitized = { ...data };
  
  Object.keys(sanitized).forEach(key => {
    const value = sanitized[key];
    if (typeof value === 'string') {
      // 문자열 양쪽 공백 제거
      sanitized[key] = value.trim() as T[Extract<keyof T, string>];
    }
  });

  return sanitized;
};

// ================================================================
// 리다이렉트 유틸리티
// ================================================================

/**
 * 인증 후 리다이렉트 URL 결정
 */
export const getRedirectUrl = (defaultUrl: string = '/'): string => {
  if (typeof window === 'undefined') return defaultUrl;

  // URL 파라미터에서 redirect 확인
  const urlParams = new URLSearchParams(window.location.search);
  const redirectParam = urlParams.get('redirect');

  if (redirectParam) {
    // 보안을 위해 상대 경로만 허용
    if (redirectParam.startsWith('/') && !redirectParam.startsWith('//')) {
      return redirectParam;
    }
  }

  // sessionStorage에서 확인
  const sessionRedirect = safeLocalStorage.getItem('auth_redirect_url');
  if (sessionRedirect && sessionRedirect.startsWith('/')) {
    safeLocalStorage.removeItem('auth_redirect_url');
    return sessionRedirect;
  }

  return defaultUrl;
};

/**
 * 로그인 필요 시 현재 URL 저장
 */
export const saveCurrentUrlForRedirect = (): void => {
  if (typeof window === 'undefined') return;

  const currentPath = window.location.pathname + window.location.search;
  
  // 인증 페이지가 아닌 경우만 저장
  if (!currentPath.startsWith('/auth')) {
    safeLocalStorage.setItem('auth_redirect_url', currentPath);
  }
};

// ================================================================
// 디바이스 및 세션 정보
// ================================================================

/**
 * 디바이스 정보 수집
 */
export const getDeviceInfo = () => {
  if (typeof window === 'undefined') {
    return {
      userAgent: 'Server',
      platform: 'Server',
      isMobile: false,
      browserName: 'Unknown'
    };
  }

  const userAgent = navigator.userAgent;
  const platform = navigator.platform;
  const isMobile = /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent);
  
  let browserName = 'Unknown';
  if (userAgent.includes('Chrome')) browserName = 'Chrome';
  else if (userAgent.includes('Firefox')) browserName = 'Firefox';
  else if (userAgent.includes('Safari')) browserName = 'Safari';
  else if (userAgent.includes('Edge')) browserName = 'Edge';

  return {
    userAgent,
    platform,
    isMobile,
    browserName
  };
};

/**
 * 세션 ID 생성 (간단한 구현)
 */
export const generateSessionId = (): string => {
  const timestamp = Date.now().toString(36);
  const randomPart = Math.random().toString(36).substring(2);
  return `session_${timestamp}_${randomPart}`;
};

// ================================================================
// 기본 export
// ================================================================

export default {
  // JWT 관련
  decodeJwtToken,
  validateJwtToken,
  getTokenTimeRemaining,
  shouldRefreshToken,
  
  // 스토리지 관련
  safeLocalStorage,
  tokenStorage,
  
  // 에러 처리
  parseAuthError,
  translateErrorMessage,
  
  // 폼 검증
  isValidEmail,
  getPasswordStrength,
  isValidName,
  sanitizeFormData,
  
  // 리다이렉트
  getRedirectUrl,
  saveCurrentUrlForRedirect,
  
  // 디바이스/세션
  getDeviceInfo,
  generateSessionId
};