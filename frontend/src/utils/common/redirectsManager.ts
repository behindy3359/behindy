// ================================================================
// 리다이렉트 관리
// ================================================================

// 로그인 후 리다이렉트 URL 관리
export const redirectManager = {
  saveCurrentUrl: (): void => {
    if (typeof window === 'undefined') return;
    
    const currentPath = window.location.pathname + window.location.search;
    
    // 인증 페이지가 아닌 경우만 저장
    if (!currentPath.startsWith('/auth')) {
      localStorage.setItem('auth_redirect_url', currentPath);
    }
  },

  getRedirectUrl: (defaultUrl = '/'): string => {
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      const redirectParam = urlParams.get('redirect');
      
      if (redirectParam && redirectParam.startsWith('/')) {
        return redirectParam;
      }
    }

    const saved = localStorage.getItem('auth_redirect_url');
    if (saved && saved.startsWith('/')) {
      localStorage.removeItem('auth_redirect_url');
      return saved;
    }

    return defaultUrl;
  },

  // 올바른 로그인 경로로 이동
  redirectToLogin: (returnTo?: string): void => {
    if (typeof window === 'undefined') return;
    
    if (returnTo) {
      localStorage.setItem('auth_redirect_url', returnTo);
    } else {
      redirectManager.saveCurrentUrl();
    }

    // /auth/login으로 리다이렉트
    window.location.href = '/auth/login';
  }
};

export default redirectManager;