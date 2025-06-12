export const API_ENDPOINTS = {
    // 인증 관련
    AUTH: {
      SIGNUP: '/auth/signup',
      LOGIN: '/auth/login',
      LOGOUT: '/auth/logout',
      REFRESH: '/auth/refresh',
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
  
  // 편의 함수들
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