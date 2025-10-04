/**
 * 환경별 로깅 유틸리티
 */

const isDev = process.env.NODE_ENV === 'development';
const isTest = process.env.NODE_ENV === 'test';

export const logger = {
  /**
   * 일반 로그 (개발 환경)
   */
  log: (...args: any[]) => {
    if (isDev) {
      console.log(...args);
    }
  },

  /**
   * 경고 로그 (개발 환경)
   */
  warn: (...args: any[]) => {
    if (isDev) {
      console.warn(...args);
    }
  },

  /**
   * 에러 로그 (모든 환경)
   */
  error: (...args: any[]) => {
    console.error(...args);
  },

  /**
   * 디버그 로그 (개발 환경)
   */
  debug: (...args: any[]) => {
    if (isDev && !isTest) {
      console.debug(...args);
    }
  },

  /**
   * 정보 로그 (개발 환경)
   */
  info: (...args: any[]) => {
    if (isDev) {
      console.info(...args);
    }
  },

  /**
   * 테이블 로그 (개발 환경)
   */
  table: (data: any) => {
    if (isDev) {
      console.table(data);
    }
  },

  /**
   * 그룹 로그 시작 (개발 환경)
   */
  group: (label: string) => {
    if (isDev) {
      console.group(label);
    }
  },

  /**
   * 그룹 로그 종료 (개발 환경)
   */
  groupEnd: () => {
    if (isDev) {
      console.groupEnd();
    }
  },
};

/**
 * API 요청/응답 로깅 헬퍼
 */
export const logAPI = {
  request: (method: string, url: string, data?: any) => {
    logger.group(`🌐 API Request: ${method} ${url}`);
    if (data) logger.log('Data:', data);
    logger.groupEnd();
  },

  response: (url: string, status: number, data?: any) => {
    const emoji = status >= 200 && status < 300 ? '✅' : '❌';
    logger.group(`${emoji} API Response: ${url} (${status})`);
    if (data) logger.log('Data:', data);
    logger.groupEnd();
  },

  error: (url: string, error: any) => {
    logger.group(`❌ API Error: ${url}`);
    logger.error('Error:', error);
    logger.groupEnd();
  },
};
