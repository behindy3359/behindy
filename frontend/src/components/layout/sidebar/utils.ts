import { NavigationItem } from "./types";

// 초기 사이드바 상태 결정
export const getInitialSidebarState = (): boolean => {
  if (typeof window === 'undefined') return true; // SSR 기본값
  
  // 저장된 사용자 설정 확인
  const savedState = localStorage.getItem('sidebar-state');
  if (savedState !== null) {
    try {
      return JSON.parse(savedState);
    } catch {
      // JSON 파싱 실패시 기본값 사용
    }
  }
  
  // 화면 크기에 따른 기본값
  const isDesktop = window.innerWidth >= 768;
  return isDesktop; // 데스크톱: 열림, 모바일: 닫힘
};

// 사이드바 상태 저장
export const saveSidebarState = (isOpen: boolean): void => {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.setItem('sidebar-state', JSON.stringify(isOpen));
  } catch (error) {
    console.warn('Failed to save sidebar state:', error);
  }
};

// 모바일 기기 감지
export const isMobileDevice = (): boolean => {
  if (typeof window === 'undefined') return false;
  return window.innerWidth < 768;
};

// 네비게이션 아이템 필터링 (권한 기반)
export const filterNavItemsByPermission = (
  items: NavigationItem[],
  userPermissions: string[] = []
): NavigationItem[] => {
  return items.filter(item => {
    // 권한이 필요없는 아이템은 항상 표시
    if (!item.path?.startsWith('/admin')) {
      return true;
    }
    
    // 관리자 권한이 필요한 아이템
    return userPermissions.includes('admin');
  });
};

// 활성 라우트 확인 (중첩 라우트 고려)
export const isRouteActive = (itemPath: string, currentPath: string): boolean => {
  if (itemPath === '/') {
    return currentPath === '/';
  }
  
  return currentPath.startsWith(itemPath);
};

// 사이드바 애니메이션 변형
export const sidebarAnimationVariants = {
  open: {
    width: 280,
    transition: { duration: 0.3, ease: 'easeInOut' }
  },
  closed: {
    width: 60,
    transition: { duration: 0.3, ease: 'easeInOut' }
  },
  mobile: {
    open: {
      transform: 'translateX(0)',
      transition: { duration: 0.3, ease: 'easeInOut' }
    },
    closed: {
      transform: 'translateX(-100%)',
      transition: { duration: 0.3, ease: 'easeInOut' }
    }
  }
};

// 테마 모드 저장/로드
export const themeUtils = {
  save: (theme: 'light' | 'dark'): void => {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem('theme-preference', theme);
    } catch (error) {
      console.warn('Failed to save theme preference:', error);
    }
  },
  
  load: (): 'light' | 'dark' => {
    if (typeof window === 'undefined') return 'light';
    
    try {
      const saved = localStorage.getItem('theme-preference');
      if (saved === 'dark' || saved === 'light') {
        return saved;
      }
    } catch (error) {
      console.warn('Failed to load theme preference:', error);
    }
    
    // 시스템 테마 감지
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }
    
    return 'light';
  },
  
  apply: (theme: 'light' | 'dark'): void => {
    if (typeof document === 'undefined') return;
    
    document.documentElement.setAttribute('data-theme', theme);
    document.documentElement.style.colorScheme = theme;
  }
};