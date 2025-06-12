export { env, default as envConfig } from './env';
export { apiClient, aiClient, api, aiApi, TokenManager } from '../services/api/axiosConfig';
export { API_ENDPOINTS, AI_ENDPOINTS, buildApiUrl } from '../utils/constants/api';

// 앱 전역 설정
export const APP_CONFIG = {
  // 앱 정보
  NAME: 'Behindy',
  VERSION: '1.0.0',
  DESCRIPTION: '지하철 노선도 기반 텍스트 어드벤처 게임',

  // UI 설정
  ANIMATION_DURATION: {
    SHORT: 200,
    MEDIUM: 400,
    LONG: 800,
  },

  // 게임 설정
  GAME: {
    AUTO_SAVE_INTERVAL: 30000, // 30초
    MAX_HEALTH: 100,
    MAX_SANITY: 100,
    CRITICAL_HEALTH: 20,
    CRITICAL_SANITY: 20,
  },

  // 페이지네이션 기본 설정
  PAGINATION: {
    DEFAULT_SIZE: 10,
    MAX_SIZE: 50,
  },

  // 로컬 스토리지 키
  STORAGE_KEYS: {
    ACCESS_TOKEN: 'behindy_access_token',
    REFRESH_TOKEN: 'behindy_refresh_token',
    USER_PREFERENCES: 'behindy_preferences',
    GAME_SETTINGS: 'behindy_game_settings',
  },

  // 개발 설정
  DEV: {
    ENABLE_LOGS: true,
    ENABLE_QUERY_DEVTOOLS: true,
    MOCK_API: false,
  },
} as const;

export default APP_CONFIG;