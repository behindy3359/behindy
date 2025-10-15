"use client";

import React, { Suspense, useEffect, useState } from 'react';
import { SignupForm } from '@/features/auth/components/SignupForm/SignupForm';
import { LOADING_MESSAGES } from '@/shared/utils/common/constants';

function SignupLoadingFallback() {
  return (
    <div className="flex items-center justify-content-center min-h-screen">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600">{LOADING_MESSAGES.PAGE_LOADING}</p>
      </div>
    </div>
  );
}

export default function SignupPage() {
  const [showWarning, setShowWarning] = useState(false);

  useEffect(() => {
    // 보안 경고를 본 적이 있는지 확인 (세션 스토리지 사용)
    const hasSeenWarning = sessionStorage.getItem('hasSeenSecurityWarning');

    if (!hasSeenWarning) {
      // 0.5초 후에 모달 표시 (페이지 로드 후 자연스럽게)
      const timer = setTimeout(() => {
        setShowWarning(true);
      }, 500);

      return () => clearTimeout(timer);
    }
  }, []);

  const handleCloseWarning = () => {
    setShowWarning(false);
    // 세션 동안 다시 보지 않음
    sessionStorage.setItem('hasSeenSecurityWarning', 'true');
  };

  return (
    <>
      <Suspense fallback={<SignupLoadingFallback />}>
        <SignupForm />
      </Suspense>
    </>
  );
}