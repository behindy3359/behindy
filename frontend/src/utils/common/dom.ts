// DOM 조작 및 브라우저 관련 유틸리티
export const domUtils = {
  // localStorage 접근
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

  // 클립보드 관련 기능
  clipboard: {
    writeText: async (text: string): Promise<boolean> => {
      if (typeof window === 'undefined') return false;
      
      try {
        if (navigator.clipboard && navigator.clipboard.writeText) {
          await navigator.clipboard.writeText(text);
          return true;
        } else {
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

  // 디바이스/브라우저 감지
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