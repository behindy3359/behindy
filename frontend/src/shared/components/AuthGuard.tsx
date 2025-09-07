// frontend/src/shared/components/AuthGuard.tsx

"use client";

import React, { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuthStore } from '@/shared/store/authStore';
import { requiresAuth, isPublicRoute } from '@/shared/utils/navigation/navigationUtils';
import { LOADING_MESSAGES } from '@/shared/utils/common/constants';
import { TokenManager } from '@/config/axiosConfig';

interface AuthGuardProps {
  children: React.ReactNode;
}

export const AuthGuard: React.FC<AuthGuardProps> = ({ children }) => {
  const router = useRouter();
  const pathname = usePathname();
  const { isAuthenticated, status, checkAuthStatus, logout } = useAuthStore();
  const [isLoading, setIsLoading] = useState(true);
  const [isHydrated, setIsHydrated] = useState(false);

  // 클라이언트 하이드레이션 체크
  useEffect(() => {
    setIsHydrated(true);
  }, []);

  // 🔥 서버 상태 검증 함수
  const validateServerSession = async (): Promise<boolean> => {
    try {
      console.log('🔍 [AuthGuard] 서버 세션 상태 검증 시작');
      
      // /auth/me API로 서버 세션 상태 확인
      const response = await fetch('/api/auth/me', {
        credentials: 'include', // 쿠키 포함
        headers: {
          'Authorization': `Bearer ${TokenManager.getAccessToken()}`
        }
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
  };

  // 🔥 클라이언트 상태 정리
  const cleanupClientState = async () => {
    console.log('🧹 [AuthGuard] 클라이언트 상태 정리 시작');
    
    try {
      // Zustand 스토어 상태 초기화
      await logout();
      
      // 토큰 정리
      TokenManager.clearAllTokens();
      
      console.log('✅ [AuthGuard] 클라이언트 상태 정리 완료');
    } catch (error) {
      console.error('❌ [AuthGuard] 클라이언트 상태 정리 실패:', error);
    }
  };

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

        // 🔥 클라이언트에 토큰이 있으면 서버 상태 검증
        console.log('🔐 클라이언트 토큰 발견 - 서버 세션 검증 중...');
        
        const isServerSessionValid = await validateServerSession();
        
        if (!isServerSessionValid) {
          console.warn('⚠️ [AuthGuard] 서버 세션 무효 - 클라이언트 상태 정리 후 로그인 페이지로 이동');
          
          // 🔥 서버 세션이 무효하면 클라이언트 상태 정리
          await cleanupClientState();
          
          // 로그인 페이지로 강제 리다이렉트
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
  }, [pathname, checkAuthStatus, isAuthenticated, status, router, isHydrated, logout]);

  // 하이드레이션 전이거나 로딩 중일 때
  if (!isHydrated || isLoading || status === 'loading') {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        backgroundColor: '#f9fafb'
      }}>
        <div style={{
          textAlign: 'center',
          color: '#6b7280'
        }}>
          <div style={{
            width: '40px',
            height: '40px',
            border: '3px solid #f3f4f6',
            borderTop: '3px solid #667eea',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 16px'
          }} />
          {LOADING_MESSAGES.LOADING}
          <style jsx>{`
            @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
          `}</style>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};