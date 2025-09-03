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
  const { isAuthenticated, status, checkAuthStatus } = useAuthStore();
  const [isLoading, setIsLoading] = useState(true);
  const [isHydrated, setIsHydrated] = useState(false);

  // 클라이언트 하이드레이션 체크
  useEffect(() => {
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    // 하이드레이션 전에는 실행하지 않음
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
        
        // sessionStorage에서 토큰 확인 (클라이언트에서만)
        const hasToken = !!TokenManager.getAccessToken();
        
        if (!hasToken) {
          console.warn('❌ 토큰 없음 - 로그인 페이지로 리다이렉트');
          router.push(`/auth/login?redirect=${encodeURIComponent(pathname)}`);
          setIsLoading(false);
          return;
        }

        // 토큰이 있으면 사용자 정보 확인
        if (status === 'idle' || !isAuthenticated()) {
          console.log('🔐 토큰 발견 - 인증 상태 확인 중...');
          try {
            await checkAuthStatus();
            console.log('✅ 인증 상태 확인 완료');
          } catch (error) {
            console.error('❌ 인증 상태 확인 실패:', error);
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
  }, [pathname, checkAuthStatus, isAuthenticated, status, router, isHydrated]);

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