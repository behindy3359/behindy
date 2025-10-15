import { useMemo, useCallback, useRef, useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuthStore } from '@/shared/store/authStore';
import { useUIStore } from '@/shared/store/uiStore';
import { api } from '@/config/axiosConfig';
import {
  Home,
  Info,
  MessageSquare,
  User,
  LogIn,
  UserPlus,
} from 'lucide-react';
import { isRouteActive, filterNavItemsByPermission } from '../utils';

export const useSidebarNavigation = () => {
  const router = useRouter();
  const pathname = usePathname();
  const { status, user, logout } = useAuthStore(); // 🔥 isAuthenticated 대신 status 사용
  const { sidebar, toggleSidebar } = useUIStore();
  const navigationTimeoutRef = useRef<NodeJS.Timeout>(null);
  
  // 🔥 하이드레이션 상태 추가
  const [isHydrated, setIsHydrated] = useState(false);
  
  useEffect(() => {
    setIsHydrated(true);
  }, []);

  const baseNavItems = useMemo(() => [
    { 
      path: '/', 
      label: '홈', 
      icon: Home,
    },
    { 
      path: '/about', 
      label: '소개', 
      icon: Info,
    },
    { 
      path: '/community', 
      label: '게시판', 
      icon: MessageSquare,
    },
  ], []);

  // 🔥 status 기반으로 판단
  const baseAccountItems = useMemo(() => {
    // 하이드레이션 전에는 기본값 반환
    if (!isHydrated) {
      return [
        { 
          path: '/auth/login', 
          label: '로그인', 
          icon: LogIn,
        },
        { 
          path: '/auth/signup', 
          label: '회원가입', 
          icon: UserPlus,
        },
      ];
    }
    
    // status가 'authenticated'인지 확인
    const isLoggedIn = status === 'authenticated' && !!user;
    
    return isLoggedIn ? [
      { 
        path: '/character',  // 🔥 프로필 대신 캐릭터 페이지로
        label: user?.name || '내 캐릭터', 
        icon: User,
      },
      { 
        path: '/logout',
        label: '로그아웃', 
        icon: LogIn,
        action: 'logout',
      },
    ] : [
      { 
        path: '/auth/login', 
        label: '로그인', 
        icon: LogIn,
      },
      { 
        path: '/auth/signup', 
        label: '회원가입', 
        icon: UserPlus,
      },
    ];
  }, [status, user, isHydrated]); // 🔥 의존성 배열 수정

  const navItems = useMemo(() => {
    const userPermissions = user?.permissions || [];
    return filterNavItemsByPermission(baseNavItems, userPermissions);
  }, [baseNavItems, user?.permissions]);

  const accountItems = useMemo(() => {
    const userPermissions = user?.permissions || [];
    return filterNavItemsByPermission(baseAccountItems, userPermissions);
  }, [baseAccountItems, user?.permissions]);

  const handleNavigation = useCallback(async (path?: string, action?: string) => {
    if (navigationTimeoutRef.current) {
      clearTimeout(navigationTimeoutRef.current);
    }

    navigationTimeoutRef.current = setTimeout(async () => {
      if (action === 'logout') {
        await logout();
        router.push('/');
      } else if (path === '/character') {
        // 캐릭터 메뉴 클릭 시 캐릭터 존재 여부 확인 후 라우팅
        try {
          const response = await api.get<{
            success: boolean;
            message: string;
            data: any;
          }>('/characters/exists');

          // 캐릭터가 존재하면 캐릭터 정보 페이지로
          if (response.success && response.data) {
            router.push('/character');
          } else {
            // 캐릭터가 없으면 생성 페이지로
            router.push('/character/create');
          }
        } catch (error: any) {
          // 404 에러 (캐릭터 없음) 또는 기타 에러 시 생성 페이지로
          if (error.response?.status === 404) {
            router.push('/character/create');
          } else {
            // 다른 에러는 일단 캐릭터 정보 페이지로 (페이지에서 처리)
            router.push('/character');
          }
        }
      } else if (path) {
        router.push(path);
      }

      if (window.innerWidth < 768 && sidebar.isOpen) {
        toggleSidebar();
      }
    }, 100);
  }, [logout, router, sidebar.isOpen, toggleSidebar]);

  const isActiveRoute = useCallback((path: string) => {
    return isRouteActive(path, pathname);
  }, [pathname]);

  useEffect(() => {
    return () => {
      if (navigationTimeoutRef.current) {
        clearTimeout(navigationTimeoutRef.current);
      }
    };
  }, []);

  return {
    navItems,
    accountItems,
    handleNavigation,
    isActiveRoute,
  };
};