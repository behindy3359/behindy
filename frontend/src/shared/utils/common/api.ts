import { ApiError } from "@/shared/types/common";

// API 에러 처리 유틸리티
export const apiErrorHandler = {
  // Axios 에러를 사용자 친화적 메시지로 변환
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

  // 에러 코드에 따른 사용자 액션 제안
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

export const API_ENDPOINTS = {
  // 인증 관련
  AUTH: {
    SIGNUP: '/auth/signup',
    LOGIN: '/auth/login',
    LOGOUT: '/auth/logout',
    REFRESH: '/auth/refresh',
    ME: '/auth/me', // 🔥 추가된 엔드포인트
  },

  // 캐릭터 관련
  CHARACTERS: {
    BASE: '/characters',
    CURRENT: '/characters/current',
    EXISTS: '/characters/exists',
    HISTORY: '/characters/history',
    GAME_ENTER_CHECK: '/characters/game-enter-check',
    BY_ID: (id: number) => `/characters/${id}`,
    STATS: (id: number) => `/characters/${id}/stats`,
  },

  // 게임 관련
  GAME: {
    ELIGIBILITY: '/game/eligibility',
    STATUS: '/game/status',
    START: (storyId: number) => `/game/start/${storyId}`,
    RESUME: '/game/resume',
    CHOICE: (optionId: number) => `/game/choice/${optionId}`,
    QUIT: '/game/quit',
    
    // 관리자용
    ADMIN: {
      SESSIONS: '/game/admin/sessions',
      STORIES_STATS: (storyId: number) => `/game/admin/stories/${storyId}/statistics`,
      CLEANUP: '/game/admin/cleanup',
    },
  },

  // 스토리 관련
  STORIES: {
    BASE: '/stories',
    BY_LINE: (lineNumber: number) => `/stories/line/${lineNumber}`,
    BY_STATION: (stationName: string) => `/stories/station/${encodeURIComponent(stationName)}`,
    BY_STATION_LINE: (stationName: string, lineNumber: number) => 
      `/stories/station/${encodeURIComponent(stationName)}/line/${lineNumber}`,
    BY_ID: (id: number) => `/stories/${id}`,
    RANDOM: '/stories/random',
    RANDOM_BY_LINE: (lineNumber: number) => `/stories/random/line/${lineNumber}`,
    BY_DIFFICULTY: (difficulty: string) => `/stories/difficulty/${difficulty}`,
  },

  // 게시판 관련
  POSTS: {
    BASE: '/posts',
    BY_ID: (id: number) => `/posts/${id}`,
  },

  // 댓글 관련
  COMMENTS: {
    BASE: '/comments',
    BY_ID: (id: number) => `/comments/${id}`,
    BY_POST: (postId: number) => `/comments/posts/${postId}`,
    MY_COMMENTS: '/comments/my',
  },
} as const;

// AI 서버 엔드포인트
export const AI_ENDPOINTS = {
  STORY: {
    GENERATE: '/story/generate',
    VALIDATE: '/story/validate',
  },
} as const;

// 쿼리 매개변수 타입
export interface PaginationParams {
  page?: number;
  size?: number;
}

export interface CharacterStatsParams {
  healthChange?: number;
  sanityChange?: number;
}

export interface RandomStoriesParams {
  count?: number;
}

export interface CleanupParams {
  daysOld?: number;
}

// API 엔드포인트 빌더 유틸리티
export class ApiUrlBuilder {
  private baseUrl: string;
  private params: URLSearchParams;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
    this.params = new URLSearchParams();
  }

  // 쿼리 매개변수 추가
  addParam(key: string, value: string | number | boolean | undefined): this {
    if (value !== undefined) {
      this.params.append(key, value.toString());
    }
    return this;
  }

  // 페이지네이션 매개변수 추가
  addPagination(pagination?: PaginationParams): this {
    if (pagination) {
      if (pagination.page !== undefined) this.addParam('page', pagination.page);
      if (pagination.size !== undefined) this.addParam('size', pagination.size);
    }
    return this;
  }

  // 캐릭터 스탯 매개변수 추가
  addCharacterStats(stats?: CharacterStatsParams): this {
    if (stats) {
      if (stats.healthChange !== undefined) this.addParam('healthChange', stats.healthChange);
      if (stats.sanityChange !== undefined) this.addParam('sanityChange', stats.sanityChange);
    }
    return this;
  }

  // 최종 URL 빌드
  build(): string {
    const paramString = this.params.toString();
    return paramString ? `${this.baseUrl}?${paramString}` : this.baseUrl;
  }
}

export const buildApiUrl = {
  // 페이지네이션이 있는 게시글 목록
  posts: (pagination?: PaginationParams) => 
    new ApiUrlBuilder(API_ENDPOINTS.POSTS.BASE).addPagination(pagination).build(),

  // 페이지네이션이 있는 댓글 목록
  commentsByPost: (postId: number, pagination?: PaginationParams) => 
    new ApiUrlBuilder(API_ENDPOINTS.COMMENTS.BY_POST(postId)).addPagination(pagination).build(),

  // 내 댓글 목록
  myComments: (pagination?: PaginationParams) => 
    new ApiUrlBuilder(API_ENDPOINTS.COMMENTS.MY_COMMENTS).addPagination(pagination).build(),

  // 캐릭터 스탯 업데이트
  characterStats: (charId: number, stats?: CharacterStatsParams) => 
    new ApiUrlBuilder(API_ENDPOINTS.CHARACTERS.STATS(charId)).addCharacterStats(stats).build(),

  // 랜덤 스토리
  randomStories: (params?: RandomStoriesParams) => 
    new ApiUrlBuilder(API_ENDPOINTS.STORIES.RANDOM).addParam('count', params?.count).build(),

  // 노선별 랜덤 스토리
  randomStoriesByLine: (lineNumber: number, params?: RandomStoriesParams) => 
    new ApiUrlBuilder(API_ENDPOINTS.STORIES.RANDOM_BY_LINE(lineNumber)).addParam('count', params?.count).build(),

  // 관리자 세션 정리
  adminCleanup: (params?: CleanupParams) => 
    new ApiUrlBuilder(API_ENDPOINTS.GAME.ADMIN.CLEANUP).addParam('daysOld', params?.daysOld).build(),
};

export default API_ENDPOINTS;