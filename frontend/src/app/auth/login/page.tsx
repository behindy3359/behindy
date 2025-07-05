"use client";

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm, SubmitHandler } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { LogIn, Mail, Lock, AlertCircle, CheckCircle } from 'lucide-react';
import { Button, Input } from '@/components/ui';
import { useAuthStore } from '@/store/authStore';
import { Metadata } from 'next';

// ================================================================
// Types & Validation (타입 정의 수정)
// ================================================================

interface LoginFormData {
  email: string;
  password: string;
  rememberMe: boolean;
}

const loginSchema = yup.object().shape({
  email: yup
    .string()
    .required('이메일을 입력해주세요')
    .email('올바른 이메일 형식이 아닙니다'),
  password: yup
    .string()
    .required('비밀번호를 입력해주세요')
    .min(6, '비밀번호는 최소 6자 이상이어야 합니다'),
  rememberMe: yup.boolean().default(false),
});

// ================================================================
// Styled Components
// ================================================================

const LoginContainer = styled.div`
  width: 100%;
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
`;

const LoginForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

const CheckboxContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: -8px 0 8px 0;
`;

const CheckboxWrapper = styled.label`
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  font-size: 14px;
  color: #374151;
  
  input[type="checkbox"] {
    width: 16px;
    height: 16px;
    border-radius: 4px;
    border: 2px solid #d1d5db;
    background: white;
    cursor: pointer;
    
    &:checked {
      background-color: #667eea;
      border-color: #667eea;
      background-image: url("data:image/svg+xml,%3csvg viewBox='0 0 16 16' fill='white' xmlns='http://www.w3.org/2000/svg'%3e%3cpath d='m13.854 3.646-8 8-.5-.5 8-8 .5.5z'/%3e%3cpath d='m6.854 7.146-2-2-.5.5 2 2 .5-.5z'/%3e%3c/svg%3e");
    }
  }
`;

const ForgotPasswordLink = styled.button`
  background: none;
  border: none;
  color: #667eea;
  font-size: 14px;
  cursor: pointer;
  text-decoration: none;
  
  &:hover {
    text-decoration: underline;
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

const SuccessAlert = styled(motion.div)`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px;
  background: #f0fdf4;
  border: 1px solid #bbf7d0;
  border-radius: 8px;
  color: #16a34a;
  font-size: 14px;
  margin-bottom: 16px;
  
  svg {
    width: 20px;
    height: 20px;
    flex-shrink: 0;
  }
`;

const Divider = styled.div`
  display: flex;
  align-items: center;
  margin: 32px 0;
  
  &::before,
  &::after {
    content: '';
    flex: 1;
    height: 1px;
    background: #e5e7eb;
  }
  
  span {
    padding: 0 16px;
    color: #9ca3af;
    font-size: 14px;
    font-weight: 500;
  }
`;

const SignupPrompt = styled.div`
  text-align: center;
  margin-top: 24px;
  font-size: 14px;
  color: #6b7280;
  
  a {
    color: #667eea;
    text-decoration: none;
    font-weight: 600;
    margin-left: 4px;
    
    &:hover {
      text-decoration: underline;
    }
  }
`;

const DemoCredentials = styled.div`
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 24px;
  
  .demo-title {
    font-size: 14px;
    font-weight: 600;
    color: #475569;
    margin-bottom: 8px;
  }
  
  .demo-info {
    font-size: 13px;
    color: #64748b;
    line-height: 1.4;
  }
  
  .demo-credentials {
    background: white;
    border-radius: 4px;
    padding: 8px;
    margin-top: 8px;
    font-family: 'Monaco', 'Consolas', monospace;
    font-size: 12px;
    
    div {
      margin: 2px 0;
    }
  }
`;

const LoadingFallback = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px 20px;
  color: #6b7280;
`;

// ================================================================
// Component
// ================================================================

export const metadata: Metadata = {
  title: '로그인',
  description: 'Behindy에 로그인하세요',
}

// SearchParams를 사용하는 컴포넌트를 별도로 분리
function LoginPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login, isAuthenticated } = useAuthStore();
  const [loginError, setLoginError] = useState<string>('');
  const [loginSuccess, setLoginSuccess] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    setValue,
    reset,
  } = useForm<LoginFormData>({
    resolver: yupResolver(loginSchema),
    mode: 'onChange',
    defaultValues: {
      email: '',
      password: '',
      rememberMe: false,
    },
  });

  // 이미 로그인된 사용자는 홈으로 리다이렉트
  useEffect(() => {
    if (isAuthenticated()) {
      router.push('/');
    }
  }, [isAuthenticated, router]);

  // URL 파라미터에서 성공 메시지 확인
  useEffect(() => {
    const message = searchParams.get('message');
    if (message === 'signup_success') {
      setLoginSuccess('회원가입이 완료되었습니다. 로그인해주세요.');
    }
  }, [searchParams]);

  // 수정된 onSubmit 함수 (타입 안전성 확보)
  const onSubmit: SubmitHandler<LoginFormData> = async (data) => {
    try {
      setIsLoading(true);
      setLoginError('');
      setLoginSuccess('');

      const result = await login({
        email: data.email,
        password: data.password,
        rememberMe: data.rememberMe,
      });

      if (result.success) {
        setLoginSuccess('로그인 성공! 잠시 후 이동합니다...');
        
        // 성공 메시지 표시 후 리다이렉트
        setTimeout(() => {
          const redirectTo = searchParams.get('redirect') || '/';
          router.push(redirectTo);
        }, 1500);
      } else {
        setLoginError(result.error || '로그인에 실패했습니다.');
      }
    } catch (error) {
      setLoginError('로그인 중 오류가 발생했습니다.');
      console.error('Login error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = () => {
    // TODO: 비밀번호 찾기 페이지로 이동
    alert('비밀번호 찾기 기능은 준비 중입니다.');
  };

  const handleDemoLogin = async () => {
    try {
      setIsLoading(true);
      setLoginError('');
      setLoginSuccess('');

      // 🔥 데모 계정으로 즉시 로그인 시도
      const result = await login({
        email: 'demo@demo.com',
        password: 'Ademo123!',
        rememberMe: false,
      });

      if (result.success) {
        setLoginSuccess('데모 계정 로그인 성공! 잠시 후 이동합니다...');
        
        // 성공 메시지 표시 후 리다이렉트
        setTimeout(() => {
          const redirectTo = searchParams.get('redirect') || '/';
          router.push(redirectTo);
        }, 1500);
      } else {
        setLoginError(result.error || '데모 계정 로그인에 실패했습니다.');
      }
    } catch (error) {
      setLoginError('데모 계정 로그인 중 오류가 발생했습니다.');
      console.error('Demo login error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const navigateToSignup = () => {
    router.push('/auth/signup');
  };

  return (
    <LoginContainer>
      <PageTitle>다시 오신 것을 환영합니다</PageTitle>
      <PageSubtitle>계정에 로그인하여 게임을 계속하세요</PageSubtitle>

      {/* 데모 계정 안내 */}
      <DemoCredentials>
        <div className="demo-title">🎮 데모 계정으로 접속하기</div>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleDemoLogin}
          style={{ marginTop: '8px', width: '100%' }}
        >
          데모 계정 정보 입력
        </Button>
      </DemoCredentials>

      {/* 에러 메시지 */}
      <AnimatePresence>
        {loginError && (
          <ErrorAlert
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <AlertCircle />
            {loginError}
          </ErrorAlert>
        )}
      </AnimatePresence>

      {/* 성공 메시지 */}
      <AnimatePresence>
        {loginSuccess && (
          <SuccessAlert
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <CheckCircle />
            {loginSuccess}
          </SuccessAlert>
        )}
      </AnimatePresence>

      <LoginForm onSubmit={handleSubmit(onSubmit)}>
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

        <Input
          {...register('password')}
          type="password"
          label="비밀번호"
          placeholder="비밀번호를 입력하세요"
          leftIcon={<Lock size={20} />}
          error={errors.password?.message}
          fullWidth
          autoComplete="current-password"
        />

        <CheckboxContainer>
          <CheckboxWrapper>
            <input
              {...register('rememberMe')}
              type="checkbox"
              id="rememberMe"
            />
            로그인 상태 유지
          </CheckboxWrapper>

          <ForgotPasswordLink 
            type="button" 
            onClick={handleForgotPassword}
          >
            비밀번호를 잊으셨나요?
          </ForgotPasswordLink>
        </CheckboxContainer>

        <Button
          type="submit"
          variant="primary"
          size="lg"
          fullWidth
          isLoading={isLoading}
          leftIcon={<LogIn size={20} />}
          disabled={!isValid || isLoading}
        >
          {isLoading ? '로그인 중...' : '로그인'}
        </Button>
      </LoginForm>

      <Divider>
        <span>또는</span>
      </Divider>

      <SignupPrompt>
        아직 계정이 없으신가요?
        <motion.a
          onClick={navigateToSignup}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          style={{ cursor: 'pointer' }}
        >
          회원가입
        </motion.a>
      </SignupPrompt>
    </LoginContainer>
  );
}

// 메인 컴포넌트 - Suspense로 감싸기
export default function LoginPage() {
  return (
    <Suspense fallback={
      <LoadingFallback>
        <div>로그인 페이지를 불러오는 중...</div>
      </LoadingFallback>
    }>
      <LoginPageContent />
    </Suspense>
  );
}