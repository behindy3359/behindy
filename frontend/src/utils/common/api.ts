/**
 * 통합 API 응답 타입
 */
export interface ApiResponse<T = any> {
  success: boolean;
  data: T;
  message?: string;
  error?: string;
}

/**
 * API 에러 타입
 */
export interface ApiError {
  code: string;
  message: string;
  details?: any;
}

/**
 * API 에러 처리 유틸리티
 */
export const apiErrorHandler = {
  /**
   * Axios 에러를 사용자 친화적 메시지로 변환
   */
  parseError: (error: any): ApiError => {
    // Axios 에러인 경우
    if (error?.response) {
      const { status, data } = error.response;
      
      // 서버에서 제공한 에러 메시지 우선 사용
      if (data?.message || data?.error) {
        return {
          code: status.toString(),
          message: data.message || data.error,
          details: data,
        };
      }

      // HTTP 상태코드별 기본 메시지
      const statusMessages: Record<number, string> = {
        400: '잘못된 요청입니다. 입력 정보를 확인해주세요.',
        401: '로그인이 필요하거나 인증 정보가 올바르지 않습니다.',
        403: '접근 권한이 없습니다.',
        404: '요청한 정보를 찾을 수 없습니다.',
        409: '이미 존재하는 정보입니다.',
        422: '입력 정보가 올바르지 않습니다.',
        429: '너무 많은 요청이 발생했습니다. 잠시 후 다시 시도해주세요.',
        500: '서버에 문제가 발생했습니다. 잠시 후 다시 시도해주세요.',
      };

      return {
        code: status.toString(),
        message: statusMessages[status] || '알 수 없는 오류가 발생했습니다.',
        details: data,
      };
    }

    // 네트워크 에러
    if (error?.code === 'NETWORK_ERROR' || error?.code === 'ERR_NETWORK') {
      return {
        code: 'NETWORK_ERROR',
        message: '네트워크 연결을 확인해주세요.',
      };
    }

    // 일반 Error 객체
    if (error instanceof Error) {
      return {
        code: 'CLIENT_ERROR',
        message: error.message || '클라이언트 오류가 발생했습니다.',
      };
    }

    // 문자열 에러
    if (typeof error === 'string') {
      return {
        code: 'STRING_ERROR',
        message: error,
      };
    }

    // 기본 에러
    return {
      code: 'UNKNOWN_ERROR',
      message: '알 수 없는 오류가 발생했습니다.',
      details: error,
    };
  },

  /**
   * 에러 코드에 따른 사용자 액션 제안
   */
  getErrorAction: (errorCode: string): {
    action: 'retry' | 'login' | 'redirect' | 'wait';
    button?: string;
    description?: string;
  } => {
    const actions = {
      '401': {
        action: 'login' as const,
        button: '로그인하기',
        description: '로그인 후 다시 시도해주세요.',
      },
      '409': {
        action: 'login' as const,
        button: '로그인하기',
        description: '이미 가입된 이메일입니다. 로그인을 시도해보세요.',
      },
      '429': {
        action: 'wait' as const,
        button: '잠시 후 다시 시도',
        description: '잠시 기다린 후 다시 시도해주세요.',
      },
      'NETWORK_ERROR': {
        action: 'retry' as const,
        button: '다시 시도',
        description: '인터넷 연결을 확인하고 다시 시도해주세요.',
      },
    };

    return actions[errorCode as keyof typeof actions] || {
      action: 'retry',
      button: '다시 시도',
      description: '문제가 지속되면 고객지원팀에 문의해주세요.',
    };
  },
};