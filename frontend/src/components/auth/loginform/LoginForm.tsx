"use client";

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { LogIn, Mail, Lock, AlertCircle } from 'lucide-react';
import { Button, Input } from '../../ui';
import { useAuthStore } from '../../../store/authStore';

// ================================================================
// Types & Validation
// ================================================================

interface LoginFormData {
  email: string;
  password: string;
  rememberMe?: boolean;
}

const loginSchema = yup.object({
  email: yup
    .string()
    .required('이메일을 입력해주세요')
    .email('올바른 이메일 형식이 아닙니다'),
  password: yup
    .string()
    .required('비밀번호를 입력해주세요')
    .min(6, '비밀번호는 최소 6자 이상이어야 합니다'),
});

// ================================================================
// Styled Components
// ================================================================

const FormContainer = styled(motion.div)`
  width: 100%;
  max-width: 400px;
  margin: 0 auto;
  padding: 2rem;
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
`;

const FormHeader = styled.div`
  text-align: center;
  margin-bottom: 2rem;
  
  h2 {
    font-size: 1.875rem;
    font-weight: 700;
    color: #111827;
    margin-bottom: 0.5rem;
  }
  
  p {
    color: #6b7280;
    font-size: 0.875rem;
  }
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const CheckboxContainer = styled.div`
  display: flex;
  items-center;
  gap: 0.5rem;
  
  input[type="checkbox"] {
    width: 1rem;
    height: 1rem;
    border-radius: 4px;
    border: 2px solid #d1d5db;
    
    &:checked {
      background-color: #667eea;
      border-color: #667eea;
    }
  }
  
  label {
    font-size: 0.875rem;
    color: #374151;
    cursor: pointer;
  }
`;

const ForgotPassword = styled.button`
  background: none;
  border: none;
  color: #667eea;
  font-size: 0.875rem;
  text-align: right;
  cursor: pointer;
  text-decoration: none;
  
  &:hover {
    text-decoration: underline;
  }
`;

const ErrorMessage = styled(motion.div)`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem;
  background: #fef2f2;
  border: 1px solid #fecaca;
  border-radius: 8px;
  color: #dc2626;
  font-size: 0.875rem;
  
  svg {
    width: 1rem;
    height: 1rem;
    flex-shrink: 0;
  }
`;

const Divider = styled.div`
  display: flex;
  align-items: center;
  margin: 1.5rem 0;
  
  &::before,
  &::after {
    content: '';
    flex: 1;
    height: 1px;
    background: #e5e7eb;
  }
  
  span {
    padding: 0 1rem;
    color: #6b7280;
    font-size: 0.875rem;
  }
`;

const SignupPrompt = styled.div`
  text-align: center;
  margin-top: 1.5rem;
  font-size: 0.875rem;
  color: #6b7280;
  
  a {
    color: #667eea;
    text-decoration: none;
    font-weight: 600;
    
    &:hover {
      text-decoration: underline;
    }
  }
`;

// ================================================================
// LoginForm Component
// ================================================================

export const LoginForm: React.FC = () => {
  const [isFormLoading, setIsFormLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [loginError, setLoginError] = useState<string>('');
  
  const { login } = useAuthStore();

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    reset,
  } = useForm<LoginFormData>({
    resolver: yupResolver(loginSchema),
    mode: 'onChange',
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      setIsFormLoading(true);
      setLoginError('');

      // API 호출
      const result = await login({
        email: data.email,
        password: data.password,
        rememberMe,
      });

      if (result.success) {
        reset();
        // 로그인 성공 시 리다이렉트는 AuthStore에서 처리
      } else {
        setLoginError(result.error || '로그인에 실패했습니다.');
      }
    } catch (error) {
      setLoginError('로그인 중 오류가 발생했습니다.');
      console.error('Login error:', error);
    } finally {
      setIsFormLoading(false);
    }
  };

  const handleForgotPassword = () => {
    // TODO: 비밀번호 찾기 기능 구현
    alert('비밀번호 찾기 기능은 준비 중입니다.');
  };

  return (
    <FormContainer
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <FormHeader>
        <h2>로그인</h2>
        <p>계정에 로그인하여 게임을 시작하세요</p>
      </FormHeader>

      {loginError && (
        <ErrorMessage
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
        >
          <AlertCircle />
          {loginError}
        </ErrorMessage>
      )}

      <Form onSubmit={handleSubmit(onSubmit)}>
        <Input
          {...register('email')}
          type="email"
          label="이메일"
          placeholder="your.email@example.com"
          leftIcon={<Mail />}
          error={errors.email?.message}
          fullWidth
          autoComplete="email"
        />

        <Input
          {...register('password')}
          type="password"
          label="비밀번호"
          placeholder="비밀번호를 입력하세요"
          leftIcon={<Lock />}
          error={errors.password?.message}
          fullWidth
          autoComplete="current-password"
        />

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <CheckboxContainer>
            <input
              type="checkbox"
              id="rememberMe"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
            />
            <label htmlFor="rememberMe">로그인 상태 유지</label>
          </CheckboxContainer>

          <ForgotPassword type="button" onClick={handleForgotPassword}>
            비밀번호 찾기
          </ForgotPassword>
        </div>

        <Button
          type="submit"
          variant="primary"
          size="lg"
          fullWidth
          isLoading={isFormLoading}
          leftIcon={<LogIn />}
          disabled={!isValid || isFormLoading}
        >
          {isFormLoading ? '로그인 중...' : '로그인'}
        </Button>
      </Form>

      <Divider>
        <span>또는</span>
      </Divider>

      <SignupPrompt>
        계정이 없으신가요?{' '}
        <a href="/auth/signup">회원가입</a>
      </SignupPrompt>
    </FormContainer>
  );
};

export default LoginForm;