import { useEffect, useState, useCallback } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuthStore } from '@/shared/store/authStore';
import { requiresAuth, isPublicRoute } from '@/shared/utils/navigation/navigationUtils';
import { TokenManager } from '@/config/axiosConfig';
import { env } from '@/config/env';
import { logger } from '@/shared/utils/common/logger';

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
      logger.debug('[AuthGuard] Validating server session');

      const accessToken = TokenManager.getAccessToken();
      const headers: Record<string, string> = {};

      if (accessToken) {
        headers['Authorization'] = `Bearer ${accessToken}`;
      }

      const response = await fetch(`${env.API_URL}/auth/me`, {
        credentials: 'include',
        headers,
      });

      if (response.ok) {
        logger.debug('[AuthGuard] Server session valid');
        return true;
      } else {
        logger.warn('[AuthGuard] Server session invalid', { status: response.status });
        return false;
      }
    } catch (error) {
      logger.error('[AuthGuard] Server session validation failed', error);
      return false;
    }
  }, []);

  // 클라이언트 상태 정리
  const cleanupClientState = useCallback(async () => {
    logger.debug('[AuthGuard] Cleaning up client state');

    try {
      await logout();
      TokenManager.clearAllTokens();
      logger.debug('[AuthGuard] Client state cleanup completed');
    } catch (error) {
      logger.error('[AuthGuard] Client state cleanup failed', error);
    }
  }, [logout]);

  // 인증 초기화 로직
  useEffect(() => {
    if (!isHydrated) return;

    const initializeAuth = async () => {
      logger.debug('[AuthGuard] Initializing auth', {
        pathname,
        status,
        hasToken: !!TokenManager.getAccessToken(),
        requiresAuth: requiresAuth(pathname),
        isPublic: isPublicRoute(pathname)
      });

      // 1. 퍼블릭 라우트는 즉시 허용
      if (isPublicRoute(pathname)) {
        logger.debug('[AuthGuard] Public route - access granted', { pathname });
        setIsLoading(false);
        return;
      }

      // 2. 보호된 라우트 접근 체크
      if (requiresAuth(pathname)) {
        logger.debug('[AuthGuard] Protected route - checking auth', { pathname });

        const hasClientToken = !!TokenManager.getAccessToken();
        const hasClientAuth = isAuthenticated();

        if (!hasClientToken || !hasClientAuth) {
          logger.warn('[AuthGuard] No client token/auth - redirecting to login');
          await cleanupClientState();
          router.push(`/auth/login?redirect=${encodeURIComponent(pathname)}`);
          setIsLoading(false);
          return;
        }

        // 서버 상태 검증
        logger.debug('[AuthGuard] Client token found - validating server session');

        const isServerSessionValid = await validateServerSession();

        if (!isServerSessionValid) {
          logger.warn('[AuthGuard] Invalid server session - cleaning up and redirecting');

          await cleanupClientState();
          router.push(`/auth/login?redirect=${encodeURIComponent(pathname)}`);
          setIsLoading(false);
          return;
        }

        // 서버 세션이 유효하면 사용자 정보 재확인
        if (status === 'idle' || !isAuthenticated()) {
          logger.debug('[AuthGuard] Valid server session - re-checking user info');
          try {
            await checkAuthStatus();
            logger.debug('[AuthGuard] Auth status check completed');
          } catch (error) {
            logger.error('[AuthGuard] Auth status check failed', error);
            await cleanupClientState();
            router.push(`/auth/login?redirect=${encodeURIComponent(pathname)}`);
            setIsLoading(false);
            return;
          }
        }

        logger.debug('[AuthGuard] Authentication successful - access granted');
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
