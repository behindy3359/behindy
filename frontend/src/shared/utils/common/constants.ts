// 지하철 관련 상수
export const METRO_CONFIG = {
  // 노선 색상
  LINE_COLORS: {
    1: '#0052A4',
    2: '#00A84D', 
    3: '#EF7C1C',
    4: '#00A5DE',
  },
  
  // 실시간 데이터 업데이트 간격
  REALTIME_UPDATE_INTERVAL: 30000,
} as const;

export const getLineColor = (lineNumber: number): string => {
  const colors: Record<number, string> = {
    1: METRO_CONFIG.LINE_COLORS[1],
    2: METRO_CONFIG.LINE_COLORS[2], 
    3: METRO_CONFIG.LINE_COLORS[3],
    4: METRO_CONFIG.LINE_COLORS[4],
  };
  return colors[lineNumber] || '#666666'; // fallback
};

// 애니메이션 지속 시간
export const ANIMATION_DURATION = {
  FAST: 150,
  NORMAL: 300,
  SLOW: 500,
} as const;

// 입력 제한
export const INPUT_LIMITS = {
  // 사용자 정보
  NAME_MIN_LENGTH: 2,
  NAME_MAX_LENGTH: 50,
  PASSWORD_MIN_LENGTH: 8,
  
  // 게시글/댓글
  POST_TITLE_MIN_LENGTH: 2,
  POST_TITLE_MAX_LENGTH: 100,
  POST_CONTENT_MIN_LENGTH: 10,
  POST_CONTENT_MAX_LENGTH: 5000,
  COMMENT_MIN_LENGTH: 2,
  COMMENT_MAX_LENGTH: 1000,
} as const;

// 오류 메시지
export const ERROR_MESSAGES = {
  // 네트워크
  NETWORK_ERROR: '네트워크 연결을 확인해주세요.',
  SERVER_ERROR: '서버에 문제가 발생했습니다.',
  
  // 인증
  AUTH_REQUIRED: '로그인이 필요합니다.',
  AUTH_EXPIRED: '로그인이 만료되었습니다.',
  LOGIN_FAILED: '로그인에 실패했습니다.',
  SIGNUP_FAILED: '회원가입에 실패했습니다.',
  LOGIN_ERROR: '로그인 중 오류가 발생했습니다.',
  DEMO_LOGIN_FAILED: '데모 계정 로그인에 실패했습니다.',
  DEMO_LOGIN_ERROR: '데모 계정 로그인 중 오류가 발생했습니다.',
  TOKEN_REFRESH_FAILED: '토큰 갱신에 실패했습니다. 다시 로그인해주세요.',
  
  // 입력 검증
  REQUIRED_FIELD: '필수 입력 항목입니다.',
  INVALID_EMAIL: '올바른 이메일 형식이 아닙니다.',
  INVALID_PASSWORD: '비밀번호가 올바르지 않습니다.',
  PASSWORD_MISMATCH: '비밀번호가 일치하지 않습니다.',
  
  // 게시글 관련
  POST_LOAD_ERROR: '게시글을 불러올 수 없습니다.',
  POST_CREATE_ERROR: '게시글 작성에 실패했습니다.',
  POST_UPDATE_ERROR: '게시글 수정에 실패했습니다.',
  POST_DELETE_ERROR: '게시글 삭제에 실패했습니다.',
  POST_PERMISSION_ERROR: '이 게시글을 수정할 권한이 없습니다.',
  
  // 댓글 관련
  COMMENT_CREATE_ERROR: '댓글 작성에 실패했습니다.',
  COMMENT_UPDATE_ERROR: '댓글 수정에 실패했습니다.',
  COMMENT_DELETE_ERROR: '댓글 삭제에 실패했습니다.',
  
  // 일반
  UNKNOWN_ERROR: '알 수 없는 오류가 발생했습니다.',
  PERMISSION_DENIED: '접근 권한이 없습니다.',
  CONTACT_SUPPORT: '문제가 지속되면 고객지원팀에 문의해주세요.',
} as const;

// 성공 메시지
export const SUCCESS_MESSAGES = {
  // 인증
  LOGIN_SUCCESS: '로그인되었습니다.',
  LOGOUT_SUCCESS: '로그아웃되었습니다.',
  SIGNUP_SUCCESS: '회원가입이 완료되었습니다.',
  SIGNUP_COMPLETE: '회원가입이 완료되었습니다! 로그인 페이지로 이동합니다...',
  TOKEN_REFRESHED: '인증 정보가 갱신되었습니다.',
  
  // 게시글/댓글
  POST_CREATED: '게시글이 작성되었습니다.',
  POST_UPDATED: '게시글이 수정되었습니다.',
  POST_DELETED: '게시글이 삭제되었습니다.',
  COMMENT_CREATED: '댓글이 작성되었습니다.',
  COMMENT_UPDATED: '댓글이 수정되었습니다.',
  COMMENT_DELETED: '댓글이 삭제되었습니다.',
  
  // 기타
  COPIED_TO_CLIPBOARD: '클립보드에 복사되었습니다.',
} as const;

// 로딩 메시지
export const LOADING_MESSAGES = {
  // 페이지 로딩
  PAGE_LOADING: '페이지를 불러오는 중...',
  LOGIN_PAGE_LOADING: '로그인 페이지를 불러오는 중...',
  ERROR_INFO_LOADING: '오류 정보를 불러오는 중...',
  
  // 게시글 관련
  POST_LOADING: '게시글을 불러오는 중...',
  POST_CREATING: '게시글을 작성하는 중...',
  POST_UPDATING: '게시글을 수정하는 중...',
  POSTS_LOADING: '최근 게시글을 불러오는 중...',
  
  // 댓글 관련
  COMMENT_LOADING: '댓글을 불러오는 중...',
  COMMENT_CREATING: '댓글을 작성하는 중...',
  COMMENT_UPDATING: '댓글을 수정하는 중...',
  
  // 인증 관련
  LOGIN_PROCESSING: '로그인 중...',
  SIGNUP_PROCESSING: '계정 생성 중...',
  TOKEN_REFRESHING: '인증 정보 갱신 중...',
  
  // 일반
  LOADING: '불러오는 중...',
  PROCESSING: '처리 중...',
} as const;

// 버튼/액션 텍스트
export const ACTION_MESSAGES = {
  // 네비게이션
  GO_BACK: '돌아가기',
  GO_TO_LIST: '목록으로',
  GO_TO_POST: '게시글로',
  GO_HOME: '홈으로',
  
  // 인증
  LOGIN: '로그인',
  LOGOUT: '로그아웃',
  SIGNUP: '회원가입',
  TRY_AGAIN: '다시 시도',
  
  // 게시글/댓글
  WRITE_POST: '글쓰기',
  EDIT_POST: '수정',
  DELETE_POST: '삭제',
  SAVE_POST: '저장',
  CANCEL: '취소',
  
  // 일반
  CONFIRM: '확인',
  CLOSE: '닫기',
  SUBMIT: '제출',
} as const;

// 확인 메시지
export const CONFIRM_MESSAGES = {
  DELETE_POST: '정말로 이 게시글을 삭제하시겠습니까?',
  DELETE_COMMENT: '정말로 이 댓글을 삭제하시겠습니까?',
  LOGOUT: '로그아웃하시겠습니까?',
} as const;

// 🔥 보안 설정 - HttpOnly Cookie 지원
export const SECURITY_CONFIG = {
  // 토큰 저장 키 (Access Token만 sessionStorage에 저장)
  TOKEN_KEYS: {
    ACCESS: process.env.NEXT_PUBLIC_TOKEN_KEY || 'behindy_access_token',
    // Refresh Token은 HttpOnly Cookie로 관리되므로 JS에서 접근 불가
  },
  
  // JWT 설정
  JWT: {
    REFRESH_THRESHOLD_MINUTES: 5, // 5분 전에 갱신 시도
    TOKEN_TYPE: 'Bearer',
    MAX_AGE_HOURS: 24,
    
    // 토큰 만료 시간 (밀리초)
    ACCESS_TOKEN_LIFETIME: 15 * 60 * 1000,  // 15분
    REFRESH_TOKEN_LIFETIME: 7 * 24 * 60 * 60 * 1000, // 7일
  },
  
  // API 보안
  API: {
    TIMEOUT_MS: 10000,
    HTTPS_ONLY: process.env.NODE_ENV === 'production',
    WITH_CREDENTIALS: true, // HttpOnly Cookie 전송을 위해 필수
  },
  
  // Cookie 설정 (참고용 - 실제 설정은 서버에서)
  COOKIE: {
    REFRESH_TOKEN_NAME: 'refreshToken',
    HTTP_ONLY: true,
    SECURE: process.env.NODE_ENV === 'production',
    SAME_SITE: 'strict',
    PATH: '/',
    MAX_AGE: 7 * 24 * 60 * 60, // 7일 (초 단위)
  },
} as const;

// 보안 검증 함수
export const validateSecurityConfig = (): void => {
  const isProd = process.env.NODE_ENV === 'production';
  
  if (isProd) {
    // 프로덕션에서 기본값 사용 경고
    if (!process.env.NEXT_PUBLIC_TOKEN_KEY) {
      console.warn('⚠️ 프로덕션에서 NEXT_PUBLIC_TOKEN_KEY 환경변수 설정을 권장합니다.');
    }
    
    // HTTPS 검증
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    if (apiUrl && !apiUrl.startsWith('https://')) {
      console.error('🚨 프로덕션에서는 HTTPS API URL이 필요합니다:', apiUrl);
    }
    
    // withCredentials 확인
    if (!SECURITY_CONFIG.API.WITH_CREDENTIALS) {
      console.error('🚨 HttpOnly Cookie 사용을 위해 withCredentials가 필요합니다.');
    }
  }
  
  // 개발 환경에서 보안 설정 안내
  if (!isProd) {
    console.log('🔒 보안 설정 정보:');
    console.log('  - Access Token: sessionStorage (15분)');
    console.log('  - Refresh Token: HttpOnly Cookie (7일)');
    console.log('  - withCredentials: enabled');
    console.log('  - CORS: 사전 승인된 origin만 허용');
  }
  
  console.log('🔒 보안 설정 검증 완료');
};

// 토큰 상태 확인 유틸리티
export const TOKEN_UTILS = {
  // Access Token 만료 임박 확인 (5분 이내)
  isAccessTokenExpiringSoon: (): boolean => {
    if (typeof window === 'undefined') return false;
    
    const tokenTime = sessionStorage.getItem('behindy_token_time');
    if (!tokenTime) return true;
    
    const tokenTimestamp = parseInt(tokenTime, 10);
    const now = Date.now();
    const timeLeft = (tokenTimestamp + SECURITY_CONFIG.JWT.ACCESS_TOKEN_LIFETIME) - now;
    
    return timeLeft < (5 * 60 * 1000); // 5분 미만
  },
  
  // Access Token 저장 시 시간 기록
  setAccessTokenTime: (): void => {
    if (typeof window === 'undefined') return;
    sessionStorage.setItem('behindy_token_time', Date.now().toString());
  },
  
  // 토큰 시간 정리
  clearAccessTokenTime: (): void => {
    if (typeof window === 'undefined') return;
    sessionStorage.removeItem('behindy_token_time');
  },
} as const;

// 환경별 설정
export const ENV_CONFIG = {
  isDevelopment: process.env.NODE_ENV === 'development',
  isProduction: process.env.NODE_ENV === 'production',
  apiUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api',
  aiUrl: process.env.NEXT_PUBLIC_AI_URL || 'http://localhost:8000',
  devMode: process.env.NEXT_PUBLIC_DEV_MODE === 'true',
  logLevel: process.env.NEXT_PUBLIC_LOG_LEVEL || 'INFO',
  appName: process.env.NEXT_PUBLIC_APP_NAME || 'Behindy',
  appVersion: process.env.NEXT_PUBLIC_APP_VERSION || '1.0.0',
} as const;