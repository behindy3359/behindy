import { describe, it, expect } from 'vitest';
import {
  METRO_CONFIG,
  getLineColor,
  ANIMATION_DURATION,
  INPUT_LIMITS,
  ERROR_MESSAGES,
  SUCCESS_MESSAGES,
  LOADING_MESSAGES,
  ACTION_MESSAGES,
  CONFIRM_MESSAGES,
  SECURITY_CONFIG,
  ENV_CONFIG,
} from '../constants';

describe('constants', () => {
  describe('METRO_CONFIG', () => {
    it('should have correct line colors', () => {
      expect(METRO_CONFIG.LINE_COLORS[1]).toBe('#0052A4');
      expect(METRO_CONFIG.LINE_COLORS[2]).toBe('#00A84D');
      expect(METRO_CONFIG.LINE_COLORS[3]).toBe('#EF7C1C');
      expect(METRO_CONFIG.LINE_COLORS[4]).toBe('#00A5DE');
    });

    it('should have realtime update interval', () => {
      expect(METRO_CONFIG.REALTIME_UPDATE_INTERVAL).toBe(30000);
    });
  });

  describe('getLineColor', () => {
    it('should return correct color for line 1', () => {
      expect(getLineColor(1)).toBe('#0052A4');
    });

    it('should return correct color for line 2', () => {
      expect(getLineColor(2)).toBe('#00A84D');
    });

    it('should return fallback color for unknown line', () => {
      expect(getLineColor(99)).toBe('#666666');
    });
  });

  describe('ANIMATION_DURATION', () => {
    it('should have correct animation durations', () => {
      expect(ANIMATION_DURATION.FAST).toBe(150);
      expect(ANIMATION_DURATION.NORMAL).toBe(300);
      expect(ANIMATION_DURATION.SLOW).toBe(500);
    });
  });

  describe('INPUT_LIMITS', () => {
    it('should have correct name length limits', () => {
      expect(INPUT_LIMITS.NAME_MIN_LENGTH).toBe(2);
      expect(INPUT_LIMITS.NAME_MAX_LENGTH).toBe(50);
    });

    it('should have correct password length', () => {
      expect(INPUT_LIMITS.PASSWORD_MIN_LENGTH).toBe(8);
    });

    it('should have correct post limits', () => {
      expect(INPUT_LIMITS.POST_TITLE_MIN_LENGTH).toBe(2);
      expect(INPUT_LIMITS.POST_TITLE_MAX_LENGTH).toBe(100);
      expect(INPUT_LIMITS.POST_CONTENT_MIN_LENGTH).toBe(10);
      expect(INPUT_LIMITS.POST_CONTENT_MAX_LENGTH).toBe(5000);
    });

    it('should have correct comment limits', () => {
      expect(INPUT_LIMITS.COMMENT_MIN_LENGTH).toBe(2);
      expect(INPUT_LIMITS.COMMENT_MAX_LENGTH).toBe(1000);
    });
  });

  describe('ERROR_MESSAGES', () => {
    it('should have network error messages', () => {
      expect(ERROR_MESSAGES.NETWORK_ERROR).toBe('네트워크 연결을 확인해주세요.');
      expect(ERROR_MESSAGES.SERVER_ERROR).toBe('서버에 문제가 발생했습니다.');
    });

    it('should have auth error messages', () => {
      expect(ERROR_MESSAGES.AUTH_REQUIRED).toBe('로그인이 필요합니다.');
      expect(ERROR_MESSAGES.LOGIN_FAILED).toBe('로그인에 실패했습니다.');
    });

    it('should have validation error messages', () => {
      expect(ERROR_MESSAGES.REQUIRED_FIELD).toBe('필수 입력 항목입니다.');
      expect(ERROR_MESSAGES.INVALID_EMAIL).toBe('올바른 이메일 형식이 아닙니다.');
    });
  });

  describe('SUCCESS_MESSAGES', () => {
    it('should have auth success messages', () => {
      expect(SUCCESS_MESSAGES.LOGIN_SUCCESS).toBe('로그인되었습니다.');
      expect(SUCCESS_MESSAGES.SIGNUP_SUCCESS).toBe('회원가입이 완료되었습니다.');
    });

    it('should have post success messages', () => {
      expect(SUCCESS_MESSAGES.POST_CREATED).toBe('게시글이 작성되었습니다.');
      expect(SUCCESS_MESSAGES.COMMENT_CREATED).toBe('댓글이 작성되었습니다.');
    });
  });

  describe('LOADING_MESSAGES', () => {
    it('should have page loading messages', () => {
      expect(LOADING_MESSAGES.PAGE_LOADING).toBe('페이지를 불러오는 중...');
      expect(LOADING_MESSAGES.LOGIN_PAGE_LOADING).toBe('로그인 페이지를 불러오는 중...');
    });

    it('should have processing messages', () => {
      expect(LOADING_MESSAGES.LOADING).toBe('불러오는 중...');
      expect(LOADING_MESSAGES.PROCESSING).toBe('처리 중...');
    });
  });

  describe('ACTION_MESSAGES', () => {
    it('should have navigation messages', () => {
      expect(ACTION_MESSAGES.GO_BACK).toBe('돌아가기');
      expect(ACTION_MESSAGES.GO_HOME).toBe('홈으로');
    });

    it('should have auth action messages', () => {
      expect(ACTION_MESSAGES.LOGIN).toBe('로그인');
      expect(ACTION_MESSAGES.LOGOUT).toBe('로그아웃');
    });

    it('should have general action messages', () => {
      expect(ACTION_MESSAGES.CONFIRM).toBe('확인');
      expect(ACTION_MESSAGES.CANCEL).toBe('취소');
    });
  });

  describe('CONFIRM_MESSAGES', () => {
    it('should have delete confirmation messages', () => {
      expect(CONFIRM_MESSAGES.DELETE_POST).toBe('정말로 이 게시글을 삭제하시겠습니까?');
      expect(CONFIRM_MESSAGES.DELETE_COMMENT).toBe('정말로 이 댓글을 삭제하시겠습니까?');
    });

    it('should have logout confirmation message', () => {
      expect(CONFIRM_MESSAGES.LOGOUT).toBe('로그아웃하시겠습니까?');
    });
  });

  describe('SECURITY_CONFIG', () => {
    it('should have JWT settings', () => {
      expect(SECURITY_CONFIG.JWT.TOKEN_TYPE).toBe('Bearer');
      expect(SECURITY_CONFIG.JWT.REFRESH_THRESHOLD_MINUTES).toBe(5);
      expect(SECURITY_CONFIG.JWT.ACCESS_TOKEN_LIFETIME).toBe(15 * 60 * 1000);
    });

    it('should have API settings', () => {
      expect(SECURITY_CONFIG.API.TIMEOUT_MS).toBe(10000);
      expect(SECURITY_CONFIG.API.WITH_CREDENTIALS).toBe(true);
    });

    it('should have cookie settings', () => {
      expect(SECURITY_CONFIG.COOKIE.REFRESH_TOKEN_NAME).toBe('refreshToken');
      expect(SECURITY_CONFIG.COOKIE.HTTP_ONLY).toBe(true);
      expect(SECURITY_CONFIG.COOKIE.SAME_SITE).toBe('strict');
    });
  });

  describe('ENV_CONFIG', () => {
    it('should have environment settings', () => {
      expect(ENV_CONFIG.appName).toBe('Behindy');
      expect(typeof ENV_CONFIG.isDevelopment).toBe('boolean');
      expect(typeof ENV_CONFIG.isProduction).toBe('boolean');
    });

    it('should have API URLs', () => {
      expect(typeof ENV_CONFIG.apiUrl).toBe('string');
      expect(typeof ENV_CONFIG.aiUrl).toBe('string');
    });

    it('should have app metadata', () => {
      expect(ENV_CONFIG.appName).toBeTruthy();
      expect(ENV_CONFIG.appVersion).toBeTruthy();
    });
  });
});
