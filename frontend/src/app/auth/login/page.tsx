import React, { Suspense } from 'react';
import { LoginForm } from '@/features/auth/components/LoginForm/LoginForm';
import { LOADING_MESSAGES } from '@/shared/utils/common/constants';

// 로딩 폴백 컴포넌트
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

// 메인 페이지 컴포넌트 - 단순히 조합만 담당
export default function LoginPage() {
  return (
    <Suspense fallback={<LoginLoadingFallback />}>
      <LoginForm />
    </Suspense>
  );
}