export const PROTECTED_ROUTES = ['/game', '/character', '/profile'];
export const AUTH_ROUTES = ['/auth/login', '/auth/signup'];

/**
 * 인증이 필요한 라우트인지 확인
 */
export const requiresAuth = (path: string): boolean => {
  return PROTECTED_ROUTES.some(route => path.startsWith(route));
};

/**
 * 인증된 사용자가 접근하면 안 되는 페이지인지 확인
 */
export const isAuthRoute = (path: string): boolean => {
  return AUTH_ROUTES.some(route => path.startsWith(route));
};

/**
 * 로그인 후 리다이렉트 URL 가져오기
 */
export const getRedirectUrl = (defaultUrl = '/'): string => {
  if (typeof window === 'undefined') return defaultUrl;
  
  const urlParams = new URLSearchParams(window.location.search);
  const redirect = urlParams.get('redirect');
  
  if (redirect && redirect.startsWith('/') && !redirect.startsWith('//')) {
    return redirect;
  }
  
  return defaultUrl;
};