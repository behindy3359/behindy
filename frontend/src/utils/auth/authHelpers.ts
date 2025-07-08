import { jwtDecode } from 'jwt-decode';
import type { AuthError } from '@/types/auth/authState';

  // JWT 페이로드 구조
  export interface JWTPayload {
    sub: string; // 사용자 ID
    name: string;
    email: string;
    iat: number; // 발급 시간
    exp: number; // 만료 시간
    iss?: string; // 발급자
    aud?: string; // 대상
  }

// ================================================================
// JWT 토큰 유틸리티
// ================================================================

// JWT 토큰 디코딩
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

// 토큰 만료 시간 확인
export const getTokenExpiry = (token: string): Date | null => {
  const decoded = safeDecodeJWT(token);
  if (!decoded || !decoded.exp) return null;
  
  return new Date(decoded.exp * 1000);
};

// 토큰이 만료되었는지 확인
export const isTokenExpired = (token: string): boolean => {
  const expiry = getTokenExpiry(token);
  if (!expiry) return true;
  
  return Date.now() >= expiry.getTime();
};

// 토큰 만료까지 남은 시간 (분)
export const getTokenTimeRemaining = (token: string): number => {
  const expiry = getTokenExpiry(token);
  if (!expiry) return 0;
  
  const remaining = expiry.getTime() - Date.now();
  return Math.max(0, Math.floor(remaining / (1000 * 60)));
};

// 토큰 갱신이 필요한지 확인 (만료 5분 전)
export const shouldRefreshToken = (token: string, minutesThreshold = 5): boolean => {
  const timeRemaining = getTokenTimeRemaining(token);
  return timeRemaining > 0 && timeRemaining <= minutesThreshold;
};

// ================================================================
// 에러 처리 유틸리티
// ================================================================

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

// 특정 에러 코드에 대한 사용자 액션 제안
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
// 리다이렉트 관리
// ================================================================

// 로그인 후 리다이렉트 URL 관리
export const redirectManager = {
  saveCurrentUrl: (): void => {
    if (typeof window === 'undefined') return;
    
    const currentPath = window.location.pathname + window.location.search;
    
    // 인증 페이지가 아닌 경우만 저장
    if (!currentPath.startsWith('/auth')) {
      localStorage.setItem('auth_redirect_url', currentPath);
    }
  },

  getRedirectUrl: (defaultUrl = '/'): string => {
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      const redirectParam = urlParams.get('redirect');
      
      if (redirectParam && redirectParam.startsWith('/')) {
        return redirectParam;
      }
    }

    const saved = localStorage.getItem('auth_redirect_url');
    if (saved && saved.startsWith('/')) {
      localStorage.removeItem('auth_redirect_url');
      return saved;
    }

    return defaultUrl;
  },

  // 올바른 로그인 경로로 이동
  redirectToLogin: (returnTo?: string): void => {
    if (typeof window === 'undefined') return;
    
    if (returnTo) {
      localStorage.setItem('auth_redirect_url', returnTo);
    } else {
      redirectManager.saveCurrentUrl();
    }

    // /auth/login으로 리다이렉트
    window.location.href = '/auth/login';
  }
};

const authHelpers = {
  // JWT 관련
  safeDecodeJWT,
  getTokenExpiry,
  isTokenExpired,
  getTokenTimeRemaining,
  shouldRefreshToken,
  
  // 에러 처리
  parseApiError,
  getErrorAction,

  // 리다이렉트
  redirectManager
};

export default authHelpers;