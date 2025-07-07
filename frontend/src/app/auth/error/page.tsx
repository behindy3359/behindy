"use client";

import React, { Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { AlertTriangle, ArrowLeft, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui';

const ErrorContainer = styled.div`
  text-align: center;
  padding: 40px 20px;
`;

const ErrorIcon = styled(motion.div)`
  width: 80px;
  height: 80px;
  margin: 0 auto 24px;
  background: #fef2f2;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #ef4444;
`;

const ErrorTitle = styled.h1`
  font-size: 24px;
  font-weight: 700;
  color: #111827;
  margin: 0 0 12px 0;
`;

const ErrorMessage = styled.p`
  color: #6b7280;
  font-size: 16px;
  line-height: 1.5;
  margin: 0 0 32px 0;
  max-width: 400px;
  margin-left: auto;
  margin-right: auto;
`;

const ActionButtons = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  max-width: 300px;
  margin: 0 auto;
`;

const LoadingFallback = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px 20px;
  color: #6b7280;
`;

const getErrorInfo = (errorCode: string) => {
  switch (errorCode) {
    case 'invalid_credentials':
      return {
        title: '로그인 정보가 올바르지 않습니다',
        message: '이메일 또는 비밀번호를 확인해주세요.',
      };
    case 'email_exists':
      return {
        title: '이미 사용 중인 이메일입니다',
        message: '다른 이메일 주소를 사용하거나 로그인을 시도해주세요.',
      };
    case 'server_error':
      return {
        title: '서버 오류가 발생했습니다',
        message: '일시적인 서버 문제입니다. 잠시 후 다시 시도해주세요.',
      };
    case 'network_error':
      return {
        title: '네트워크 연결 오류',
        message: '인터넷 연결을 확인하고 다시 시도해주세요.',
      };
    default:
      return {
        title: '예상치 못한 오류가 발생했습니다',
        message: '문제가 지속되면 고객지원팀에 문의해주세요.',
      };
  }
};

function AuthErrorContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const errorCode = searchParams.get('code') || 'unknown';
  const errorInfo = getErrorInfo(errorCode);

  const handleRetry = () => {
    const returnTo = searchParams.get('return_to');
    if (returnTo === 'signup') {
      router.push('/auth/signup');
    } else {
      router.push('/auth/login');
    }
  };

  const handleGoHome = () => {
    router.push('/');
  };

  return (
    <ErrorContainer>
      <ErrorIcon
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ 
          type: "spring",
          stiffness: 260,
          damping: 20 
        }}
      >
        <AlertTriangle size={40} />
      </ErrorIcon>

      <ErrorTitle>{errorInfo.title}</ErrorTitle>
      <ErrorMessage>{errorInfo.message}</ErrorMessage>

      <ActionButtons>
        <Button
          variant="primary"
          fullWidth
          onClick={handleRetry}
          leftIcon={<RefreshCw size={20} />}
        >
          다시 시도
        </Button>
        
        <Button
          variant="ghost"
          fullWidth
          onClick={handleGoHome}
          leftIcon={<ArrowLeft size={20} />}
        >
          홈으로 돌아가기
        </Button>
      </ActionButtons>
    </ErrorContainer>
  );
}

// 메인 컴포넌트 - Suspense로 감싸기
export default function AuthErrorPage() {
  return (
    <Suspense fallback={
      <LoadingFallback>
        <div>오류 정보를 불러오는 중...</div>
      </LoadingFallback>
    }>
      <AuthErrorContent />
    </Suspense>
  );
}