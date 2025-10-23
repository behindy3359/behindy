"use client";

import React, { Suspense, useEffect } from 'react';
import { LoginForm } from '@/features/auth/components/LoginForm/LoginForm';
import { LOADING_MESSAGES } from '@/shared/utils/common/constants';
import { useToast } from '@/shared/store/uiStore';
import { useSearchParams } from 'next/navigation';
import { TokenManager } from '@/config/axiosConfig';
import { useAuthStore } from '@/shared/store/authStore';

function LoginLoadingFallback() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600">{LOADING_MESSAGES.LOGIN_PAGE_LOADING}</p>
      </div>
    </div>
  );
}

export default function LoginPage() {
  const searchParams = useSearchParams();
  const toast = useToast();
  const clearTokens = useAuthStore(state => state.clearTokens);

  useEffect(() => {
    // URL 파라미터에서 세션 만료 이유 확인
    const reason = searchParams.get('reason');

    if (reason === 'session_expired' || reason === 'server_restart') {
      // 서버 재시작 또는 세션 만료 시 클라이언트 토큰도 강제 삭제
      TokenManager.clearAllTokens();
      clearTokens();

      if (reason === 'session_expired') {
        toast.warning('세션이 만료되었습니다. 다시 로그인해주세요.');
      } else if (reason === 'server_restart') {
        toast.info('서버 점검으로 인해 로그아웃되었습니다. 다시 로그인해주세요.');
      }
    }
  }, [searchParams, toast, clearTokens]);

  return (
    <Suspense fallback={<LoginLoadingFallback />}>
      <LoginForm />
    </Suspense>
  );
}