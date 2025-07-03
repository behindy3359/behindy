// frontend/src/utils/auth/authHelpers.ts
import { jwtDecode } from 'jwt-decode';
import type { AuthError } from '@/types/auth/authState';
import type { JWTPayload } from '@/types/auth/authJwt';

// ================================================================
// 폼 검증 유틸리티
// ================================================================

/**
 * 이메일 형식 검증 (한국 도메인 포함)
 */
export const validateEmail = (email: string): { isValid: boolean; message?: string } => {
  if (!email || email.trim() === '') {
    return { isValid: false, message: '이메일을 입력해주세요.' };
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const koreanEmailRegex = /^[^\s@]+@[^\s@]+\.(co\.kr|kr|com|net|org)$/;
  
  const normalizedEmail = email.toLowerCase().trim();
  
  if (!emailRegex.test(normalizedEmail)) {
    return { isValid: false, message: '올바른 이메일 형식이 아닙니다.' };
  }

  // 일반적이지 않은 문자 체크
  if (/[가-힣]/.test(normalizedEmail)) {
    return { isValid: false, message: '이메일에는 한글을 사용할 수 없습니다.' };
  }

  return { isValid: true };
};

/**
 * 비밀번호 강도 검증
 */
export const validatePassword = (password: string): {
  isValid: boolean;
  score: number;
  messages: string[];
  strength: 'very-weak' | 'weak' | 'medium' | 'strong' | 'very-strong';
} => {
  const messages: string[] = [];
  let score = 0;

  if (!password) {
    return {
      isValid: false,
      score: 0,
      messages: ['비밀번호를 입력해주세요.'],
      strength: 'very-weak'
    };
  }

  // 길이 검사
  if (password.length >= 8) {
    score += 1;
  } else {
    messages.push('8자 이상이어야 합니다.');
  }

  if (password.length >= 12) {
    score += 1;
  }

  // 소문자 포함
  if (/[a-z]/.test(password)) {
    score += 1;
  } else {
    messages.push('소문자를 포함해야 합니다.');
  }

  // 대문자 포함
  if (/[A-Z]/.test(password)) {
    score += 1;
  } else {
    messages.push('대문자를 포함해야 합니다.');
  }

  // 숫자 포함
  if (/\d/.test(password)) {
    score += 1;
  } else {
    messages.push('숫자를 포함해야 합니다.');
  }

  // 특수문자 포함
  if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    score += 1;
  } else {
    messages.push('특수문자를 포함해야 합니다.');
  }

  // 연속된 문자 체크
  if (!/(.)\1{2,}/.test(password)) {
    score += 1;
  } else {
    messages.push('3개 이상 연속된 문자는 사용할 수 없습니다.');
  }

  // 일반적인 패턴 체크
  const commonPatterns = [
    /123456/,
    /password/i,
    /qwerty/i,
    /admin/i,
    /user/i,
    /1234/
  ];

  const hasCommonPattern = commonPatterns.some(pattern => pattern.test(password));
  if (!hasCommonPattern) {
    score += 1;
  } else {
    messages.push('일반적인 패턴은 사용할 수 없습니다.');
  }

  // 강도 계산
  let strength: 'very-weak' | 'weak' | 'medium' | 'strong' | 'very-strong';
  if (score <= 2) strength = 'very-weak';
  else if (score <= 4) strength = 'weak';
  else if (score <= 6) strength = 'medium';
  else if (score <= 7) strength = 'strong';
  else strength = 'very-strong';

  return {
    isValid: score >= 4, // 최소 4점 이상
    score,
    messages,
    strength
  };
};

/**
 * 이름 검증 (한국어 + 영어)
 */
export const validateName = (name: string): { isValid: boolean; message?: string } => {
  if (!name || name.trim() === '') {
    return { isValid: false, message: '이름을 입력해주세요.' };
  }

  const trimmedName = name.trim();

  if (trimmedName.length < 2) {
    return { isValid: false, message: '이름은 2자 이상이어야 합니다.' };
  }

  if (trimmedName.length > 20) {
    return { isValid: false, message: '이름은 20자 이하여야 합니다.' };
  }

  // 한글, 영어, 공백만 허용
  if (!/^[가-힣a-zA-Z\s]+$/.test(trimmedName)) {
    return { isValid: false, message: '이름에는 한글, 영문, 공백만 사용 가능합니다.' };
  }

  // 특수문자나 숫자 체크
  if (/[0-9!@#$%^&*(),.?":{}|<>]/.test(trimmedName)) {
    return { isValid: false, message: '이름에는 숫자나 특수문자를 사용할 수 없습니다.' };
  }

  return { isValid: true };
};

/**
 * 비밀번호 확인
 */
export const validatePasswordConfirm = (
  password: string, 
  confirmPassword: string
): { isValid: boolean; message?: string } => {
  if (!confirmPassword) {
    return { isValid: false, message: '비밀번호 확인을 입력해주세요.' };
  }

  if (password !== confirmPassword) {
    return { isValid: false, message: '비밀번호가 일치하지 않습니다.' };
  }

  return { isValid: true };
};

// ================================================================
// JWT 토큰 유틸리티
// ================================================================

/**
 * JWT 토큰 디코딩 (안전한 방식)
 */
export const safeDecodeJWT = (token: string): JWTPayload | null => {
  try {
    if (!token || token.split('.').length !== 3) {
      return null;
    }

    const decoded = jwtDecode<JWTPayload>(token);
    
    // 필수 필드 검증
    if (!decoded.sub || !decoded.exp || !decoded.iat) {
      return null;
    }

    return decoded;
  } catch (error) {
    console.warn('JWT decode failed:', error);
    return null;
  }
};

/**
 * 토큰 만료 시간 확인
 */
export const getTokenExpiry = (token: string): Date | null => {
  const decoded = safeDecodeJWT(token);
  if (!decoded || !decoded.exp) return null;
  
  return new Date(decoded.exp * 1000);
};

/**
 * 토큰이 만료되었는지 확인
 */
export const isTokenExpired = (token: string): boolean => {
  const expiry = getTokenExpiry(token);
  if (!expiry) return true;
  
  return Date.now() >= expiry.getTime();
};

/**
 * 토큰 만료까지 남은 시간 (분)
 */
export const getTokenTimeRemaining = (token: string): number => {
  const expiry = getTokenExpiry(token);
  if (!expiry) return 0;
  
  const remaining = expiry.getTime() - Date.now();
  return Math.max(0, Math.floor(remaining / (1000 * 60)));
};

/**
 * 토큰 갱신이 필요한지 확인 (만료 5분 전)
 */
export const shouldRefreshToken = (token: string, minutesThreshold = 5): boolean => {
  const timeRemaining = getTokenTimeRemaining(token);
  return timeRemaining > 0 && timeRemaining <= minutesThreshold;
};

// ================================================================
// 에러 처리 유틸리티
// ================================================================

/**
 * API 에러를 사용자 친화적 메시지로 변환
 */
export const parseApiError = (error: unknown): AuthError => {
  // Axios 에러
  if (error && typeof error === 'object' && 'response' in error) {
    const axiosError = error as {
      response?: {
        status?: number;
        data?: {
          message?: string;
          error?: string;
          details?: unknown;
        };
      };
      code?: string;
      message?: string;
    };

    const status = axiosError.response?.status;
    const data = axiosError.response?.data;

    // HTTP 상태코드별 메시지
    const statusMessages: Record<number, string> = {
      400: '잘못된 요청입니다. 입력 정보를 확인해주세요.',
      401: '이메일 또는 비밀번호가 올바르지 않습니다.',
      403: '접근 권한이 없습니다.',
      404: '요청한 정보를 찾을 수 없습니다.',
      409: '이미 존재하는 정보입니다.',
      422: '입력 정보가 올바르지 않습니다.',
      429: '너무 많은 요청이 발생했습니다. 잠시 후 다시 시도해주세요.',
      500: '서버에 문제가 발생했습니다. 잠시 후 다시 시도해주세요.',
      502: '서버 연결에 문제가 있습니다.',
      503: '서버가 일시적으로 사용할 수 없습니다.',
    };

    const message = data?.message || data?.error || 
                   (status ? statusMessages[status] : undefined) ||
                   axiosError.message || '알 수 없는 오류가 발생했습니다.';

    return {
      code: status?.toString() || axiosError.code || 'UNKNOWN_ERROR',
      message,
      details: data
    };
  }

  // 네트워크 에러
  if (error && typeof error === 'object' && 'code' in error) {
    const networkError = error as { code?: string; message?: string };
    
    if (networkError.code === 'NETWORK_ERROR' || networkError.code === 'ERR_NETWORK') {
      return {
        code: 'NETWORK_ERROR',
        message: '네트워크 연결을 확인해주세요.'
      };
    }
  }

  // 일반 Error 객체
  if (error instanceof Error) {
    return {
      code: 'CLIENT_ERROR',
      message: error.message || '클라이언트 오류가 발생했습니다.'
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
 * 특정 에러 코드에 대한 사용자 액션 제안
 */
export const getErrorAction = (errorCode: string): {
  action: string;
  button?: string;
  description?: string;
} => {
  const actions: Record<string, { action: string; button?: string; description?: string }> = {
    '401': {
      action: 'retry',
      button: '다시 로그인',
      description: '이메일과 비밀번호를 확인하고 다시 시도해주세요.'
    },
    '409': {
      action: 'redirect',
      button: '로그인하기',
      description: '이미 가입된 이메일입니다. 로그인을 시도해보세요.'
    },
    '429': {
      action: 'wait',
      button: '잠시 후 다시 시도',
      description: '잠시 기다린 후 다시 시도해주세요.'
    },
    'NETWORK_ERROR': {
      action: 'retry',
      button: '다시 시도',
      description: '인터넷 연결을 확인하고 다시 시도해주세요.'
    }
  };

  return actions[errorCode] || {
    action: 'retry',
    button: '다시 시도',
    description: '문제가 지속되면 고객지원팀에 문의해주세요.'
  };
};

// ================================================================
// 로컬 스토리지 안전 관리
// ================================================================

/**
 * 안전한 로컬 스토리지 접근
 */
export const safeStorage = {
  // 읽기
  get: (key: string): string | null => {
    if (typeof window === 'undefined') return null;
    
    try {
      return localStorage.getItem(key);
    } catch (error) {
      console.warn(`localStorage get failed for key: ${key}`, error);
      return null;
    }
  },

  // 쓰기
  set: (key: string, value: string): boolean => {
    if (typeof window === 'undefined') return false;
    
    try {
      localStorage.setItem(key, value);
      return true;
    } catch (error) {
      console.warn(`localStorage set failed for key: ${key}`, error);
      return false;
    }
  },

  // 삭제
  remove: (key: string): boolean => {
    if (typeof window === 'undefined') return false;
    
    try {
      localStorage.removeItem(key);
      return true;
    } catch (error) {
      console.warn(`localStorage remove failed for key: ${key}`, error);
      return false;
    }
  },

  // 존재 여부 확인
  has: (key: string): boolean => {
    return safeStorage.get(key) !== null;
  },

  // JSON 형태로 저장/읽기
  setJSON: (key: string, value: unknown): boolean => {
    try {
      return safeStorage.set(key, JSON.stringify(value));
    } catch (error) {
      console.warn(`localStorage setJSON failed for key: ${key}`, error);
      return false;
    }
  },

  getJSON: <T>(key: string): T | null => {
    try {
      const value = safeStorage.get(key);
      return value ? JSON.parse(value) : null;
    } catch (error) {
      console.warn(`localStorage getJSON failed for key: ${key}`, error);
      return null;
    }
  }
};

// ================================================================
// 폼 데이터 정리
// ================================================================

/**
 * 폼 데이터 전처리 (trim, normalize)
 */
export const sanitizeFormData = <T extends Record<string, unknown>>(data: T): T => {
  const sanitized = { ...data };
  
  Object.entries(sanitized).forEach(([key, value]) => {
    if (typeof value === 'string') {
      // 문자열 양쪽 공백 제거
      sanitized[key as keyof T] = value.trim() as T[keyof T];
    }
  });

  return sanitized;
};

/**
 * 이메일 정규화 (소문자 변환)
 */
export const normalizeEmail = (email: string): string => {
  return email.toLowerCase().trim();
};

// ================================================================
// 리다이렉트 관리
// ================================================================

/**
 * 로그인 후 리다이렉트 URL 관리
 */
export const redirectManager = {
  // 현재 URL 저장
  saveCurrentUrl: (): void => {
    if (typeof window === 'undefined') return;
    
    const currentPath = window.location.pathname + window.location.search;
    
    // 인증 페이지가 아닌 경우만 저장
    if (!currentPath.startsWith('/auth')) {
      safeStorage.set('auth_redirect_url', currentPath);
    }
  },

  // 저장된 URL 가져오기
  getRedirectUrl: (defaultUrl = '/'): string => {
    // URL 파라미터 확인
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      const redirectParam = urlParams.get('redirect');
      
      if (redirectParam && redirectParam.startsWith('/')) {
        return redirectParam;
      }
    }

    // 저장된 URL 확인
    const saved = safeStorage.get('auth_redirect_url');
    if (saved && saved.startsWith('/')) {
      safeStorage.remove('auth_redirect_url');
      return saved;
    }

    return defaultUrl;
  },

  // 인증 필요 시 로그인 페이지로 이동
  redirectToLogin: (returnTo?: string): void => {
    if (typeof window === 'undefined') return;
    
    if (returnTo) {
      safeStorage.set('auth_redirect_url', returnTo);
    } else {
      redirectManager.saveCurrentUrl();
    }

    window.location.href = '/auth/login';
  }
};

// ================================================================
// 디바이스 정보
// ================================================================

/**
 * 디바이스 및 브라우저 정보 수집
 */
export const getDeviceInfo = () => {
  if (typeof window === 'undefined') {
    return {
      userAgent: 'Server',
      platform: 'Server',
      isMobile: false,
      browserName: 'Unknown',
      browserVersion: 'Unknown',
      osName: 'Unknown'
    };
  }

  const userAgent = navigator.userAgent;
  const platform = navigator.platform;

  // 모바일 기기 감지
  const isMobile = /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent);

  // 브라우저 감지
  let browserName = 'Unknown';
  let browserVersion = 'Unknown';

  if (userAgent.includes('Chrome')) {
    browserName = 'Chrome';
    const match = userAgent.match(/Chrome\/(\d+)/);
    browserVersion = match ? match[1] : 'Unknown';
  } else if (userAgent.includes('Firefox')) {
    browserName = 'Firefox';
    const match = userAgent.match(/Firefox\/(\d+)/);
    browserVersion = match ? match[1] : 'Unknown';
  } else if (userAgent.includes('Safari') && !userAgent.includes('Chrome')) {
    browserName = 'Safari';
    const match = userAgent.match(/Version\/(\d+)/);
    browserVersion = match ? match[1] : 'Unknown';
  } else if (userAgent.includes('Edge')) {
    browserName = 'Edge';
    const match = userAgent.match(/Edge\/(\d+)/);
    browserVersion = match ? match[1] : 'Unknown';
  }

  // OS 감지
  let osName = 'Unknown';
  if (userAgent.includes('Windows')) osName = 'Windows';
  else if (userAgent.includes('Mac')) osName = 'macOS';
  else if (userAgent.includes('Linux')) osName = 'Linux';
  else if (userAgent.includes('Android')) osName = 'Android';
  else if (userAgent.includes('iOS')) osName = 'iOS';

  return {
    userAgent,
    platform,
    isMobile,
    browserName,
    browserVersion,
    osName
  };
};

// ================================================================
// 디버깅 유틸리티
// ================================================================

/**
 * 개발 환경에서만 로그 출력
 */
export const debugLog = {
  info: (message: string, ...args: unknown[]) => {
    if (process.env.NODE_ENV === 'development') {
      console.log(`🔍 [AUTH] ${message}`, ...args);
    }
  },

  error: (message: string, error?: unknown) => {
    if (process.env.NODE_ENV === 'development') {
      console.error(`❌ [AUTH] ${message}`, error);
    }
  },

  warn: (message: string, ...args: unknown[]) => {
    if (process.env.NODE_ENV === 'development') {
      console.warn(`⚠️ [AUTH] ${message}`, ...args);
    }
  },

  success: (message: string, ...args: unknown[]) => {
    if (process.env.NODE_ENV === 'development') {
      console.log(`✅ [AUTH] ${message}`, ...args);
    }
  }
};

// ================================================================
// 기본 export
// ================================================================

export default {
  // 폼 검증
  validateEmail,
  validatePassword,
  validateName,
  validatePasswordConfirm,
  
  // JWT 관련
  safeDecodeJWT,
  getTokenExpiry,
  isTokenExpired,
  getTokenTimeRemaining,
  shouldRefreshToken,
  
  // 에러 처리
  parseApiError,
  getErrorAction,
  
  // 스토리지
  safeStorage,
  
  // 데이터 정리
  sanitizeFormData,
  normalizeEmail,
  
  // 리다이렉트
  redirectManager,
  
  // 디바이스 정보
  getDeviceInfo,
  
  // 디버깅
  debugLog
};