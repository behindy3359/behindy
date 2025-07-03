"use client";

import React, { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import { Loading } from '@/components/ui/loading/Loading';

interface AuthGuardProps {
  children: React.ReactNode;
  requireAuth?: boolean;
  redirectTo?: string;
}

export const AuthGuard: React.FC<AuthGuardProps> = ({
  children,
  requireAuth = false,
  redirectTo = '/auth/login'
}) => {
  const router = useRouter();
  const pathname = usePathname();
  const { isAuthenticated, checkAuthStatus, isLoading } = useAuthStore();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      await checkAuthStatus();
      setIsChecking(false);
    };

    checkAuth();
  }, [checkAuthStatus]);

  useEffect(() => {
    if (!isChecking && !isLoading) {
      if (requireAuth && !isAuthenticated()) {
        // 인증이 필요한 페이지에 비인증 사용자가 접근
        const loginUrl = new URL(redirectTo, window.location.origin);
        loginUrl.searchParams.set('redirect', pathname);
        router.push(loginUrl.toString());
      } else if (!requireAuth && isAuthenticated()) {
        // 인증된 사용자가 인증 페이지에 접근
        router.push('/');
      }
    }
  }, [isChecking, isLoading, isAuthenticated, requireAuth, router, pathname, redirectTo]);

  // 로딩 중이거나 권한 체크 중일 때
  if (isChecking || isLoading) {
    return (
      <Loading 
        variant="spinner" 
        size="lg" 
        fullScreen 
        message="인증 상태를 확인하는 중..." 
      />
    );
  }

  // 인증이 필요한데 인증되지 않은 경우
  if (requireAuth && !isAuthenticated()) {
    return null; // 리다이렉트 처리 중
  }

  // 인증된 사용자가 인증 페이지에 접근하는 경우
  if (!requireAuth && isAuthenticated()) {
    return null; // 리다이렉트 처리 중
  }

  return <>{children}</>;
};

export default AuthGuard;