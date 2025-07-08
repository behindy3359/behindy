/**
 * 로컬 스토리지 키
 */
export const STORAGE_KEYS = {
  // 인증 관련 (기존 env.ts와 TokenManager에서 사용)
  ACCESS_TOKEN: 'behindy_access_token',
  REFRESH_TOKEN: 'behindy_refresh_token',
  
  // UI 상태 (기존 uiStore에서 사용)
  SIDEBAR_STATE: 'sidebar-state',
  
  // 리다이렉트 (기존 authHelpers에서 사용)
  AUTH_REDIRECT: 'auth_redirect_url',
} as const;

/**
 * 지하철 관련 상수
 */
export const METRO_CONFIG = {
  // 노선 색상 (기존 LINE_COLORS와 동일)
  LINE_COLORS: {
    1: '#0052A4',
    2: '#00A84D', 
    3: '#EF7C1C',
    4: '#00A5DE',
  },
  
  // 실시간 데이터 업데이트 간격
  REALTIME_UPDATE_INTERVAL: 30000,
} as const;

/**
 * 애니메이션 지속 시간 (기존 프로젝트에서 사용되는 값들)
 */
export const ANIMATION_DURATION = {
  FAST: 150,
  NORMAL: 300,
  SLOW: 500,
} as const;

/**
 * 입력 제한 (기존 검증 로직에서 사용)
 */
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

/**
 * 오류 메시지 (기존 프로젝트에서 하드코딩된 메시지들)
 */
export const ERROR_MESSAGES = {
  // 네트워크
  NETWORK_ERROR: '네트워크 연결을 확인해주세요.',
  SERVER_ERROR: '서버에 문제가 발생했습니다.',
  
  // 인증
  AUTH_REQUIRED: '로그인이 필요합니다.',
  AUTH_EXPIRED: '로그인이 만료되었습니다.',
  
  // 입력 검증
  REQUIRED_FIELD: '필수 입력 항목입니다.',
  INVALID_EMAIL: '올바른 이메일 형식이 아닙니다.',
  INVALID_PASSWORD: '비밀번호가 올바르지 않습니다.',
  PASSWORD_MISMATCH: '비밀번호가 일치하지 않습니다.',
  
  // 일반
  UNKNOWN_ERROR: '알 수 없는 오류가 발생했습니다.',
} as const;

/**
 * 성공 메시지 (기존 프로젝트에서 하드코딩된 메시지들)
 */
export const SUCCESS_MESSAGES = {
  // 인증
  LOGIN_SUCCESS: '로그인되었습니다.',
  LOGOUT_SUCCESS: '로그아웃되었습니다.',
  SIGNUP_SUCCESS: '회원가입이 완료되었습니다.',
  
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

/**
 * 확인 메시지 (기존 프로젝트에서 사용되는 confirm 메시지들)
 */
export const CONFIRM_MESSAGES = {
  DELETE_POST: '정말로 이 게시글을 삭제하시겠습니까?',
  DELETE_COMMENT: '정말로 이 댓글을 삭제하시겠습니까?',
  LOGOUT: '로그아웃하시겠습니까?',
} as const;