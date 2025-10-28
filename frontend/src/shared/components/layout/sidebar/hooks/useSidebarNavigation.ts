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
  FileText,
  Server,
  Code,
  Bot,
  Container,
  Book,
  Shield,
} from 'lucide-react';
import { isRouteActive, filterNavItemsByPermission } from '../utils';
import { aboutPages } from '@/features/about/utils';
import type { NavItem } from '../types';

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

  const baseNavItems = useMemo(() => {
    // About 서브메뉴 아이콘 매핑
    const aboutIconMap: Record<string, any> = {
      overview: FileText,
      backend: Server,
      frontend: Code,
      aiserver: Bot,
      devops: Container,
      development: Book,
    };

    return [
      {
        path: '/',
        label: '홈',
        icon: Home,
      },
      {
        path: '/about',
        label: '소개',
        icon: Info,
        children: aboutPages.map((page) => ({
          path: page.path,
          label: page.label,
          icon: aboutIconMap[page.slug] || FileText,
          isActive: isRouteActive(page.path, pathname),
        })),
      },
      {
        path: '/community',
        label: '게시판',
        icon: MessageSquare,
      },
    ];
  }, [pathname]);

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

    // 관리자 권한 확인 (Role이 'ADMIN'인 경우)
    const isAdmin = user?.role === 'ADMIN';

    const loggedInItems: NavItem[] = [
      {
        path: '/character',  // 🔥 프로필 대신 캐릭터 페이지로
        label: user?.name || '내 캐릭터',
        icon: User,
      },
    ];

    // 관리자인 경우 관리자 대시보드 메뉴 추가
    if (isAdmin) {
      loggedInItems.push({
        path: '/admin',
        label: '관리자 대시보드',
        icon: Shield,
      });
    }

    loggedInItems.push({
      path: '/logout',
      label: '로그아웃',
      icon: LogIn,
      action: 'logout',
    });

    return isLoggedIn ? loggedInItems : [
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
  }, [status, user, isHydrated]);

  const navItems = useMemo(() => {
    const userPermissions = user?.permissions || [];
    return filterNavItemsByPermission(baseNavItems, userPermissions);
  }, [baseNavItems, user?.permissions]);

  const accountItems = useMemo(() => {
    // 관리자인 경우 permissions 체크 없이 모든 메뉴 표시
    if (user?.role === 'ADMIN') {
      return baseAccountItems;
    }

    const userPermissions = user?.permissions || [];
    return filterNavItemsByPermission(baseAccountItems, userPermissions);
  }, [baseAccountItems, user?.permissions, user?.role]);

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