import { useEffect, useState, useCallback } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuthStore } from '@/shared/store/authStore';
import { requiresAuth, isPublicRoute } from '@/shared/utils/navigation/navigationUtils';
import { TokenManager } from '@/config/axiosConfig';

export interface UseAuthGuardReturn {
  isLoading: boolean;
  isHydrated: boolean;
  shouldRender: boolean;
}

export const useAuthGuard = (): UseAuthGuardReturn => {
  const router = useRouter();
  const pathname = usePathname();
  const { isAuthenticated, status, checkAuthStatus, logout } = useAuthStore();
  const [isLoading, setIsLoading] = useState(true);
  const [isHydrated, setIsHydrated] = useState(false);

  // 클라이언트 하이드레이션 체크
  useEffect(() => {
    setIsHydrated(true);
  }, []);

  // 서버 상태 검증
  const validateServerSession = useCallback(async (): Promise<boolean> => {
    try {
      const response = await fetch('/api/auth/me', {
        credentials: 'include',
        headers: {
          'Authorization': `Bearer ${TokenManager.getAccessToken()}`
        }
      });

      return response.ok;
    } catch (error) {
      return false;
    }
  }, []);

  // 클라이언트 상태 정리
  const cleanupClientState = useCallback(async () => {
    try {
      await logout();
      TokenManager.clearAllTokens();
    } catch (error) {
      console.error('Client state cleanup failed:', error);
    }
  }, [logout]);

  // 인증 초기화 로직
  useEffect(() => {
    if (!isHydrated) return;

    const initializeAuth = async () => {
      // 1. 퍼블릭 라우트는 즉시 허용
      if (isPublicRoute(pathname)) {
        setIsLoading(false);
        return;
      }

      // 2. 보호된 라우트 접근 체크
      if (requiresAuth(pathname)) {
        const hasClientToken = !!TokenManager.getAccessToken();
        const hasClientAuth = isAuthenticated();

        if (!hasClientToken || !hasClientAuth) {
          await cleanupClientState();
          router.push(`/auth/login?redirect=${encodeURIComponent(pathname)}`);
          setIsLoading(false);
          return;
        }

        // 서버 상태 검증
        const isServerSessionValid = await validateServerSession();

        if (!isServerSessionValid) {
          await cleanupClientState();
          router.push(`/auth/login?redirect=${encodeURIComponent(pathname)}`);
          setIsLoading(false);
          return;
        }

        // 서버 세션이 유효하면 사용자 정보 재확인
        if (status === 'idle' || !isAuthenticated()) {
          try {
            await checkAuthStatus();
          } catch (error) {
            console.error('Auth status check failed:', error);
            await cleanupClientState();
            router.push(`/auth/login?redirect=${encodeURIComponent(pathname)}`);
            setIsLoading(false);
            return;
          }
        }
      }

      setIsLoading(false);
    };

    initializeAuth();
  }, [
    pathname,
    checkAuthStatus,
    isAuthenticated,
    status,
    router,
    isHydrated,
    logout,
    validateServerSession,
    cleanupClientState
  ]);

  const shouldRender = isHydrated && !isLoading && status !== 'loading';

  return {
    isLoading: !isHydrated || isLoading || status === 'loading',
    isHydrated,
    shouldRender
  };
};