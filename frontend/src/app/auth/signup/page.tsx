import React, { Suspense } from 'react';
import { SignupForm } from '@/components/auth/SignupForm/SignupForm';
import { LOADING_MESSAGES } from '@/utils/common/constants';

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
  return (
    <Suspense fallback={<SignupLoadingFallback />}>
      <SignupForm />
    </Suspense>
  );
}