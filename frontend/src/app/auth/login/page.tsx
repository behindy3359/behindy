"use client";

import React, { Suspense, useEffect, useState } from 'react';
import { LoginForm } from '@/features/auth/components/LoginForm/LoginForm';
import { LOADING_MESSAGES } from '@/shared/utils/common/constants';
import { useToast } from '@/shared/store/uiStore';
import { useSearchParams } from 'next/navigation';

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

// 보안 경고 모달 컴포넌트
function SecurityWarningModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* 배경 오버레이 */}
      <div
        className="absolute inset-0 bg-black bg-opacity-50"
        onClick={onClose}
      />

      {/* 모달 컨텐츠 */}
      <div className="relative bg-white rounded-lg shadow-xl max-w-md w-full mx-4 p-6 animate-fade-in">
        {/* 아이콘 */}
        <div className="flex items-center justify-center w-12 h-12 mx-auto mb-4 bg-yellow-100 rounded-full">
          <svg
            className="w-6 h-6 text-yellow-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
        </div>

        {/* 제목 */}
        <h3 className="text-lg font-bold text-center text-gray-900 mb-2">
          포트폴리오 프로젝트 안내
        </h3>

        {/* 메시지 */}
        <div className="space-y-3 text-sm text-gray-600 mb-6">
          <p className="text-center">
            이 프로젝트는 <span className="font-semibold text-blue-600">포트폴리오 목적</span>으로 동작하고,
            API 문서 공개 등 일부 보안이 완화된 상태입니다.
          </p>
          <div className="bg-yellow-50 border border-yellow-200 rounded-md p-3">
            <p className="font-semibold text-yellow-800 mb-1">⚠️ 주의사항</p>
            <ul className="list-disc list-inside space-y-1 text-yellow-700">
              <li>실제 개인정보를 입력하지 말아주세요</li>
              <li>테스트용 임시 정보만 사용해주세요</li>
              <li>Swagger UI에서 API 명세를 확인할 수 있습니다</li>
              <li></li>
            </ul>
          </div>
        </div>

        {/* 확인 버튼 */}
        <button
          onClick={onClose}
          className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors font-medium"
        >
          확인했습니다
        </button>
      </div>
    </div>
  );
}

// 메인 페이지 컴포넌트 - 단순히 조합만 담당
export default function LoginPage() {
  const searchParams = useSearchParams();
  const toast = useToast();
  const [showWarning, setShowWarning] = useState(false);

  useEffect(() => {
    // 보안 경고를 본 적이 있는지 확인 (세션 스토리지 사용)
    const hasSeenWarning = sessionStorage.getItem('hasSeenSecurityWarning');

    if (!hasSeenWarning) {
      // 1초 후에 모달 표시 (페이지 로드 후 자연스럽게)
      const timer = setTimeout(() => {
        setShowWarning(true);
      }, 500);

      return () => clearTimeout(timer);
    }
  }, []);

  useEffect(() => {
    // URL 파라미터에서 세션 만료 이유 확인
    const reason = searchParams.get('reason');

    if (reason === 'session_expired') {
      toast.warning('세션이 만료되었습니다. 다시 로그인해주세요.');
    } else if (reason === 'server_restart') {
      toast.info('서버 점검으로 인해 로그아웃되었습니다. 다시 로그인해주세요.');
    }
  }, [searchParams, toast]);

  const handleCloseWarning = () => {
    setShowWarning(false);
    // 세션 동안 다시 보지 않음
    sessionStorage.setItem('hasSeenSecurityWarning', 'true');
  };

  return (
    <>
      <SecurityWarningModal isOpen={showWarning} onClose={handleCloseWarning} />
      <Suspense fallback={<LoginLoadingFallback />}>
        <LoginForm />
      </Suspense>
    </>
  );
}