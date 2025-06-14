"use client";

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import styled from 'styled-components';
import { Mail, Lock, LogIn, AlertCircle } from 'lucide-react';
import { Button, Input } from '../../ui';
import { useAuthStore } from '../../../store/authStore';

// 폼 검증 스키마
const loginSchema = yup.object({
  email: yup
    .string()
    .required('이메일을 입력해주세요')
    .email('올바른 이메일 형식을 입력해주세요'),
  password: yup
    .string()
    .required('비밀번호를 입력해주세요')
    .min(6, '비밀번호는 최소 6자 이상이어야 합니다')
});

// 폼 데이터 타입
interface LoginFormData {
  email: string;
  password: string;
}

// Props 타입
interface LoginFormProps {
  onSuccess?: () => void;
  onSignupClick?: () => void;
  redirectTo?: string;
}

const FormContainer = styled.div`
  width: 100%;
  max-width: 400px;
  margin: 0 auto;
  padding: 32px;
  background: white;
  border-radius: 16px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
`;

const FormHeader = styled.div`
  text-align: center;
  margin-bottom: 32px;
`;

const Title = styled.h1`
  font-size: 28px;
  font-weight: 700;
  color: #111827;
  margin-bottom: 8px;
`;

const Subtitle = styled.p`
  color: #6b7280;
  font-size: 16px;
`;

const FormContent = styled.form`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const ErrorMessage = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 16px;
  background: #fef2f2;
  border: 1px solid #fecaca;
  border-radius: 8px;
  color: #dc2626;
  font-size: 14px;
  
  svg {
    width: 16px;
    height: 16px;
    flex-shrink: 0;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-top: 8px;
`;

const Divider = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  margin: 24px 0;
  
  &::before,
  &::after {
    content: '';
    flex: 1;
    height: 1px;
    background: #e5e7eb;
  }
  
  span {
    color: #6b7280;
    font-size: 14px;
  }
`;

const SignupLink = styled.div`
  text-align: center;
  margin-top: 24px;
  color: #6b7280;
  font-size: 14px;
  
  button {
    color: #667eea;
    background: none;
    border: none;
    cursor: pointer;
    font-weight: 600;
    text-decoration: underline;
    
    &:hover {
      color: #5a67d8;
    }
  }
`;

const RememberMeContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  
  input[type="checkbox"] {
    width: 16px;
    height: 16px;
    accent-color: #667eea;
  }
  
  label {
    font-size: 14px;
    color: #374151;
    cursor: pointer;
  }
`;

export const LoginForm: React.FC<LoginFormProps> = ({
  onSuccess,
  onSignupClick,
  redirectTo
}) => {
  const [rememberMe, setRememberMe] = useState(false);
  const { login, isLoading, error, clearError } = useAuthStore();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<LoginFormData>({
    resolver: yupResolver(loginSchema),
    mode: 'onBlur'
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      clearError();
      
      await login({
        email: data.email,
        password: data.password,
        rememberMe
      });

      // 로그인 성공 시
      onSuccess?.();
      
      // 리다이렉트 처리
      if (redirectTo) {
        window.location.href = redirectTo;
      }
    } catch (err) {
      // 에러는 zustand store에서 처리됨
      console.error('로그인 오류:', err);
    }
  };

  const isFormLoading = isLoading || isSubmitting;

  return (
    <FormContainer>
      <FormHeader>
        <Title>로그인</Title>
        <Subtitle>Behindy에 오신 것을 환영합니다</Subtitle>
      </FormHeader>

      <FormContent onSubmit={handleSubmit(onSubmit)}>
        {/* 서버 에러 표시 */}
        {error && (
          <ErrorMessage>
            <AlertCircle />
            {typeof error === 'string' ? error : 'An error occurred'}
          </ErrorMessage>
        )}

        {/* 이메일 입력 */}
        <Input
          {...register('email')}
          type="email"
          label="이메일"
          placeholder="이메일을 입력하세요"
          leftIcon={<Mail />}
          error={errors.email?.message}
          disabled={isFormLoading}
          autoComplete="email"
          fullWidth
        />

        {/* 비밀번호 입력 */}
        <Input
          {...register('password')}
          type="password"
          label="비밀번호"
          placeholder="비밀번호를 입력하세요"
          leftIcon={<Lock />}
          error={errors.password?.message}
          disabled={isFormLoading}
          autoComplete="current-password"
          fullWidth
        />

        {/* 로그인 유지 체크박스 */}
        <RememberMeContainer>
          <input
            type="checkbox"
            id="rememberMe"
            checked={rememberMe}
            onChange={(e) => setRememberMe(e.target.checked)}
            disabled={isFormLoading}
          />
          <label htmlFor="rememberMe">
            로그인 상태 유지
          </label>
        </RememberMeContainer>

        {/* 로그인 버튼 */}
        <ButtonGroup>
          <Button
            type="submit"
            variant="primary"
            size="lg"
            fullWidth
            isLoading={isFormLoading}
            icon={<LogIn />}
          >
            {isFormLoading ? '로그인 중...' : '로그인'}
          </Button>
        </ButtonGroup>
      </FormContent>

      <Divider>
        <span>또는</span>
      </Divider>

      {/* 회원가입 링크 */}
      <SignupLink>
        계정이 없으신가요?{' '}
        <button 
          type="button" 
          onClick={onSignupClick}
          disabled={isFormLoading}
        >
          회원가입
        </button>
      </SignupLink>
    </FormContainer>
  );
};

export default LoginForm;