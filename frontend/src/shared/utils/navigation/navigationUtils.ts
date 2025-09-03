
export const PROTECTED_ROUTES = [
  '/community/write',      // 글쓰기만 보호
  '/community/edit',       // 글 수정만 보호  
  '/character',           // 캐릭터 생성
  '/profile'              // 프로필
];

export const PUBLIC_ROUTES = [
  '/',                    // 홈페이지
  '/community',           // 커뮤니티 목록
  '/community/[id]',      // 게시글 상세
  '/metro',               // 지하철 노선도
  '/game',                // 게임 시작
  '/auth/login',
  '/auth/signup',
  '/auth/error',
  '/auth/forgot-password'
];

export const AUTH_ROUTES = ['/auth/login', '/auth/signup'];

// 인증이 필요한 라우트인지 확인 (매우 제한적으로 적용)
export const requiresAuth = (path: string): boolean => {
  return PROTECTED_ROUTES.some(route => {
    if (route.includes('[')) {
      // 동적 라우트 처리
      const pattern = route.replace(/\[.*?\]/g, '[^/]+');
      const regex = new RegExp(`^${pattern}$`);
      return regex.test(path);
    }
    return path.startsWith(route);
  });
};

// 퍼블릭 라우트인지 확인
export const isPublicRoute = (path: string): boolean => {
  return PUBLIC_ROUTES.some(route => {
    if (route.includes('[')) {
      const pattern = route.replace(/\[.*?\]/g, '[^/]+');
      const regex = new RegExp(`^${pattern}$`);
      return regex.test(path);
    }
    return path === route || path.startsWith(route);
  });
};

// 로그인 후 리다이렉트 URL 가져오기
export const getRedirectUrl = (defaultUrl = '/'): string => {
  if (typeof window === 'undefined') return defaultUrl;
  
  const urlParams = new URLSearchParams(window.location.search);
  const redirect = urlParams.get('redirect');
  
  if (redirect && redirect.startsWith('/') && !redirect.startsWith('//')) {
    return redirect;
  }
  
  return defaultUrl;
};
