
"use client";

import React, { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuthStore } from '@/shared/store/authStore';
import { requiresAuth, isPublicRoute } from '@/shared/utils/navigation/navigationUtils';
import { LOADING_MESSAGES } from '@/shared/utils/common/constants';

interface AuthGuardProps {
  children: React.ReactNode;
}

export const AuthGuard: React.FC<AuthGuardProps> = ({ children }) => {
  const router = useRouter();
  const pathname = usePathname();
  const { isAuthenticated, status } = useAuthStore();
  const [ isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      console.log('🔍 AuthGuard 체크 시작:', {
        pathname,
        status,
        isAuth: isAuthenticated(),
        requiresAuth: requiresAuth(pathname),
        isPublic: isPublicRoute(pathname)
      });

      // 로딩 중이면 대기
      if (status === 'loading') {
        console.log('⏳ 인증 상태 로딩 중...');
        return;
      }

      // 1. 퍼블릭 라우트는 항상 허용
      if (isPublicRoute(pathname)) {
        console.log('✅ 퍼블릭 라우트 - 접근 허용:', pathname);
        setIsLoading(false);
        return;
      }

      // 2. 보호된 라우트만 인증 확인
      if (requiresAuth(pathname)) {
        console.log('🔐 보호된 라우트 - 인증 확인 필요:', pathname);
        
        const authResult = isAuthenticated();
        console.log('🎯 인증 결과:', {
          isAuthenticated: authResult,
          accessToken: !!localStorage.getItem('behindy_access_token'),
          refreshToken: !!localStorage.getItem('behindy_refresh_token')
        });
        
        if (!authResult) {
          console.warn('❌ 인증 실패 - 로그인 페이지로 리다이렉트');
          router.push(`/auth/login?redirect=${encodeURIComponent(pathname)}`);
          return;
        } else {
          console.log('✅ 인증 성공 - 접근 허용');
        }
      }

      setIsLoading(false);
    };

    checkAuth();
  }, [pathname, isAuthenticated, status, router]);

  // useEffect(() => {
  //   const checkAuth = async () => {
  //     // 로딩 중이면 대기
  //     if (status === 'loading') {
  //       return;
  //     }

  //     // 1. 퍼블릭 라우트는 항상 허용
  //     if (isPublicRoute(pathname)) {
  //       setIsLoading(false);
  //       return;
  //     }

  //     // 2. 보호된 라우트만 인증 확인
  //     if (requiresAuth(pathname)) {
  //       if (!isAuthenticated()) {
  //         // 올바른 로그인 경로로 리다이렉트
  //         router.push(`/auth/login?redirect=${encodeURIComponent(pathname)}`);
  //         return;
  //       }
  //     }

  //     setIsLoading(false);
  //   };

  //   checkAuth();
  // }, [pathname, isAuthenticated, status, router]);

  // 로딩 중일 때
  if (isLoading || status === 'loading') {
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