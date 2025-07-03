"use client";

import React, { useState, Suspense } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, ArrowLeft, Send, CheckCircle, AlertCircle } from 'lucide-react';
import { Button, Input } from '@/components/ui';

interface ForgotPasswordFormData {
  email: string;
}

const forgotPasswordSchema = yup.object({
  email: yup
    .string()
    .required('이메일을 입력해주세요')
    .email('올바른 이메일 형식이 아닙니다'),
});

const ForgotPasswordContainer = styled.div`
  width: 100%;
`;

const BackButton = styled(motion.button)`
  display: flex;
  align-items: center;
  gap: 8px;
  background: none;
  border: none;
  color: #6b7280;
  font-size: 14px;
  cursor: pointer;
  margin-bottom: 24px;
  padding: 8px;
  border-radius: 6px;
  transition: all 0.2s ease;
  
  &:hover {
    color: #374151;
    background: #f9fafb;
  }
`;

const PageTitle = styled.h1`
  font-size: 28px;
  font-weight: 700;
  color: #111827;
  text-align: center;
  margin: 0 0 8px 0;
`;

const PageSubtitle = styled.p`
  color: #6b7280;
  text-align: center;
  margin: 0 0 32px 0;
  font-size: 16px;
  line-height: 1.5;
`;

const ForgotPasswordForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

const SuccessState = styled(motion.div)`
  text-align: center;
  padding: 40px 20px;
  
  .success-icon {
    width: 80px;
    height: 80px;
    margin: 0 auto 24px;
    background: #f0fdf4;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #16a34a;
  }
  
  .success-title {
    font-size: 24px;
    font-weight: 700;
    color: #111827;
    margin: 0 0 12px 0;
  }
  
  .success-message {
    color: #6b7280;
    font-size: 16px;
    line-height: 1.5;
    margin: 0 0 32px 0;
  }
  
  .email-highlight {
    color: #667eea;
    font-weight: 600;
  }
`;

const ErrorAlert = styled(motion.div)`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px;
  background: #fef2f2;
  border: 1px solid #fecaca;
  border-radius: 8px;
  color: #dc2626;
  font-size: 14px;
  margin-bottom: 16px;
  
  svg {
    width: 20px;
    height: 20px;
    flex-shrink: 0;
  }
`;

const LoadingFallback = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px 20px;
  color: #6b7280;
`;

function ForgotPasswordContent() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string>('');
  const [submittedEmail, setSubmittedEmail] = useState<string>('');

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<ForgotPasswordFormData>({
    resolver: yupResolver(forgotPasswordSchema),
    mode: 'onChange',
  });

  const onSubmit = async (data: ForgotPasswordFormData) => {
    try {
      setIsLoading(true);
      setError('');

      // TODO: 실제 비밀번호 재설정 API 호출
      // const response = await api.post('/auth/forgot-password', data);
      
      // 시뮬레이션
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setSubmittedEmail(data.email);
      setIsSuccess(true);
    } catch (error) {
      setError('이메일 전송에 실패했습니다. 다시 시도해주세요.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackToLogin = () => {
    router.push('/auth/login');
  };

  if (isSuccess) {
    return (
      <ForgotPasswordContainer>
        <SuccessState
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <motion.div 
            className="success-icon"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ 
              type: "spring",
              stiffness: 260,
              damping: 20,
              delay: 0.2 
            }}
          >
            <CheckCircle size={40} />
          </motion.div>
          
          <div className="success-title">이메일을 확인해주세요</div>
          <div className="success-message">
            <span className="email-highlight">{submittedEmail}</span>로<br />
            비밀번호 재설정 링크를 발송했습니다.<br />
            이메일을 확인하고 안내에 따라 진행해주세요.
          </div>
          
          <Button
            variant="primary"
            fullWidth
            onClick={handleBackToLogin}
            leftIcon={<ArrowLeft size={20} />}
          >
            로그인으로 돌아가기
          </Button>
        </SuccessState>
      </ForgotPasswordContainer>
    );
  }

  return (
    <ForgotPasswordContainer>
      <BackButton
        onClick={handleBackToLogin}
        whileHover={{ x: -2 }}
        whileTap={{ scale: 0.98 }}
      >
        <ArrowLeft size={16} />
        로그인으로 돌아가기
      </BackButton>

      <PageTitle>비밀번호를 잊으셨나요?</PageTitle>
      <PageSubtitle>
        걱정하지 마세요! 가입하신 이메일 주소를 입력하시면<br />
        비밀번호 재설정 링크를 보내드립니다.
      </PageSubtitle>

      <AnimatePresence>
        {error && (
          <ErrorAlert
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <AlertCircle />
            {error}
          </ErrorAlert>
        )}
      </AnimatePresence>

      <ForgotPasswordForm onSubmit={handleSubmit(onSubmit)}>
        <Input
          {...register('email')}
          type="email"
          label="이메일"
          placeholder="your.email@example.com"
          leftIcon={<Mail size={20} />}
          error={errors.email?.message}
          fullWidth
          autoComplete="email"
          autoFocus
        />

        <Button
          type="submit"
          variant="primary"
          size="lg"
          fullWidth
          isLoading={isLoading}
          leftIcon={<Send size={20} />}
          disabled={!isValid || isLoading}
        >
          {isLoading ? '전송 중...' : '재설정 링크 보내기'}
        </Button>
      </ForgotPasswordForm>
    </ForgotPasswordContainer>
  );
}

export default function ForgotPasswordPage() {
  return (
    <Suspense fallback={
      <LoadingFallback>
        <div>페이지를 불러오는 중...</div>
      </LoadingFallback>
    }>
      <ForgotPasswordContent />
    </Suspense>
  );
}