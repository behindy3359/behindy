import { useMemo, useCallback, useRef, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuthStore } from '@/shared/store/authStore';
import { useUIStore } from '@/shared/store/uiStore';
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
  const { isAuthenticated, logout, user } = useAuthStore();
  const { sidebar, toggleSidebar } = useUIStore();
  const navigationTimeoutRef = useRef<NodeJS.Timeout>(null);

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

  const baseAccountItems = useMemo(() => {
    return isAuthenticated() ? [
      { 
        path: '/profile', 
        label: user?.name || '프로필', 
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
  }, [isAuthenticated, user?.name]);

  const navItems = useMemo(() => {
    const userPermissions = user?.permissions || [];
    return filterNavItemsByPermission(baseNavItems, userPermissions);
  }, [baseNavItems, user?.permissions]);

  const accountItems = useMemo(() => {
    const userPermissions = user?.permissions || [];
    return filterNavItemsByPermission(baseAccountItems, userPermissions);
  }, [baseAccountItems, user?.permissions]);

  const handleNavigation = useCallback((path?: string, action?: string) => {
    if (navigationTimeoutRef.current) {
      clearTimeout(navigationTimeoutRef.current);
    }

    navigationTimeoutRef.current = setTimeout(() => {
      if (action === 'logout') {
        logout();
        router.push('/');
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