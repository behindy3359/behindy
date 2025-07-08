// src/utils/common/dom.ts

/**
 * DOM 조작 및 브라우저 관련 유틸리티 (기존 프로젝트에서 실제 필요한 것들만)
 */
export const domUtils = {
  /**
   * 안전한 localStorage 접근 (기존 authHelpers.safeStorage와 통합)
   */
  localStorage: {
    get: (key: string): string | null => {
      if (typeof window === 'undefined') return null;
      
      try {
        return localStorage.getItem(key);
      } catch (error) {
        console.warn(`localStorage get failed for key: ${key}`, error);
        return null;
      }
    },

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

    setJSON: (key: string, value: any): boolean => {
      try {
        return domUtils.localStorage.set(key, JSON.stringify(value));
      } catch (error) {
        console.warn(`localStorage setJSON failed for key: ${key}`, error);
        return false;
      }
    },

    getJSON: <T>(key: string): T | null => {
      try {
        const value = domUtils.localStorage.get(key);
        return value ? JSON.parse(value) : null;
      } catch (error) {
        console.warn(`localStorage getJSON failed for key: ${key}`, error);
        return null;
      }
    },
  },

  /**
   * 클립보드 관련 기능 (기존 프로젝트에서 공유 기능에 사용)
   */
  clipboard: {
    writeText: async (text: string): Promise<boolean> => {
      if (typeof window === 'undefined') return false;
      
      try {
        if (navigator.clipboard && navigator.clipboard.writeText) {
          await navigator.clipboard.writeText(text);
          return true;
        } else {
          // 폴백: 구형 브라우저 지원
          const textArea = document.createElement('textarea');
          textArea.value = text;
          textArea.style.position = 'fixed';
          textArea.style.opacity = '0';
          document.body.appendChild(textArea);
          textArea.select();
          const success = document.execCommand('copy');
          document.body.removeChild(textArea);
          return success;
        }
      } catch (error) {
        console.warn('Clipboard write failed:', error);
        return false;
      }
    },
  },

  /**
   * 디바이스/브라우저 감지 (기존 프로젝트에서 반응형 처리에 사용)
   */
  device: {
    isMobile: (): boolean => {
      if (typeof window === 'undefined') return false;
      
      return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent
      );
    },

    isTouchDevice: (): boolean => {
      if (typeof window === 'undefined') return false;
      
      return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    },
  },
};