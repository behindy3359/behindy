import { useEffect, useState, useCallback } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuthStore } from '@/shared/store/authStore';
import { requiresAuth, isPublicRoute } from '@/shared/utils/navigation/navigationUtils';
import { TokenManager } from '@/config/axiosConfig';
import { env } from '@/config/env';

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
      console.log('🔍 [AuthGuard] 서버 세션 상태 검증 시작');

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
        console.log('✅ [AuthGuard] 서버 세션 유효');
        return true;
      } else {
        console.warn('⚠️ [AuthGuard] 서버 세션 무효:', response.status);
        return false;
      }
    } catch (error) {
      console.error('❌ [AuthGuard] 서버 세션 검증 실패:', error);
      return false;
    }
  }, []);

  // 클라이언트 상태 정리
  const cleanupClientState = useCallback(async () => {
    console.log('🧹 [AuthGuard] 클라이언트 상태 정리 시작');
    
    try {
      await logout();
      TokenManager.clearAllTokens();
      console.log('✅ [AuthGuard] 클라이언트 상태 정리 완료');
    } catch (error) {
      console.error('❌ [AuthGuard] 클라이언트 상태 정리 실패:', error);
    }
  }, [logout]);

  // 인증 초기화 로직
  useEffect(() => {
    if (!isHydrated) return;

    const initializeAuth = async () => {
      console.log('🔍 AuthGuard 초기화 시작:', {
        pathname,
        status,
        hasToken: !!TokenManager.getAccessToken(),
        requiresAuth: requiresAuth(pathname),
        isPublic: isPublicRoute(pathname)
      });

      // 1. 퍼블릭 라우트는 즉시 허용
      if (isPublicRoute(pathname)) {
        console.log('✅ 퍼블릭 라우트 - 접근 허용:', pathname);
        setIsLoading(false);
        return;
      }

      // 2. 보호된 라우트 접근 체크
      if (requiresAuth(pathname)) {
        console.log('🔐 보호된 라우트 - 인증 확인 필요:', pathname);
        
        const hasClientToken = !!TokenManager.getAccessToken();
        const hasClientAuth = isAuthenticated();
        
        if (!hasClientToken || !hasClientAuth) {
          console.warn('❌ 클라이언트 토큰/인증 없음 - 로그인 페이지로 리다이렉트');
          await cleanupClientState();
          router.push(`/auth/login?redirect=${encodeURIComponent(pathname)}`);
          setIsLoading(false);
          return;
        }

        // 서버 상태 검증
        console.log('🔐 클라이언트 토큰 발견 - 서버 세션 검증 중...');
        
        const isServerSessionValid = await validateServerSession();
        
        if (!isServerSessionValid) {
          console.warn('⚠️ [AuthGuard] 서버 세션 무효 - 클라이언트 상태 정리 후 로그인 페이지로 이동');
          
          await cleanupClientState();
          router.push(`/auth/login?redirect=${encodeURIComponent(pathname)}`);
          setIsLoading(false);
          return;
        }

        // 서버 세션이 유효하면 사용자 정보 재확인
        if (status === 'idle' || !isAuthenticated()) {
          console.log('🔐 서버 세션 유효 - 사용자 정보 재확인 중...');
          try {
            await checkAuthStatus();
            console.log('✅ 인증 상태 확인 완료');
          } catch (error) {
            console.error('❌ 인증 상태 확인 실패:', error);
            await cleanupClientState();
            router.push(`/auth/login?redirect=${encodeURIComponent(pathname)}`);
            setIsLoading(false);
            return;
          }
        }
        
        console.log('✅ 인증 성공 - 접근 허용');
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
