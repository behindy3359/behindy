"use client";

import React, { Suspense, useEffect } from 'react';
import { LoginForm } from '@/features/auth/components/LoginForm/LoginForm';
import { LOADING_MESSAGES } from '@/shared/utils/common/constants';
import { useToast } from '@/shared/store/uiStore';
import { useSearchParams } from 'next/navigation';

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

function LoginContent() {
  const searchParams = useSearchParams();
  const toast = useToast();
  
  useEffect(() => {
    const reason = searchParams.get('reason');
    
    if (reason === 'session_expired') {
      toast.warning('세션이 만료되었습니다. 다시 로그인해주세요.');
    } else if (reason === 'server_restart') {
      toast.info('서버 점검으로 인해 로그아웃되었습니다. 다시 로그인해주세요.');
    }
  }, [searchParams, toast]);
  
  return <LoginForm />;
}

export default function LoginPage() {
  return (
    <Suspense fallback={<LoginLoadingFallback />}>
      <LoginContent />
    </Suspense>
  );
}