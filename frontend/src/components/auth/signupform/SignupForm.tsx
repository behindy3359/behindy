"use client";

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import styled from 'styled-components';
import { User, Mail, Lock, UserPlus, AlertCircle, CheckCircle } from 'lucide-react';
import { Button, Input } from '../../ui';
import { useAuthStore } from '../../../store/authStore';

// 폼 검증 스키마
const signupSchema = yup.object({
  name: yup
    .string()
    .required('이름을 입력해주세요')
    .min(2, '이름은 최소 2자 이상이어야 합니다')
    .max(20, '이름은 최대 20자까지 입력 가능합니다'),
  email: yup
    .string()
    .required('이메일을 입력해주세요')
    .email('올바른 이메일 형식을 입력해주세요'),
  password: yup
    .string()
    .required('비밀번호를 입력해주세요')
    .min(8, '비밀번호는 최소 8자 이상이어야 합니다')
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      '비밀번호는 대문자, 소문자, 숫자를 각각 하나 이상 포함해야 합니다'
    ),
  confirmPassword: yup
    .string()
    .required('비밀번호 확인을 입력해주세요')
    .oneOf([yup.ref('password')], '비밀번호가 일치하지 않습니다'),
  agreeToTerms: yup
    .boolean()
    .required('이용약관에 동의해주세요')
    .oneOf([true], '이용약관에 동의해주세요')
});

// 폼 데이터 타입
interface SignupFormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  agreeToTerms: boolean;
}

// Props 타입
interface SignupFormProps {
  onSuccess?: () => void;
  onLoginClick?: () => void;
}

const FormContainer = styled.div`
  width: 100%;
  max-width: 450px;
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

const SuccessMessage = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 16px;
  background: #f0fdf4;
  border: 1px solid #bbf7d0;
  border-radius: 8px;
  color: #166534;
  font-size: 14px;
  
  svg {
    width: 16px;
    height: 16px;
    flex-shrink: 0;
  }
`;

const PasswordStrength = styled.div<{ strength: number }>`
  margin-top: 8px;
  
  .strength-label {
    font-size: 12px;
    color: #6b7280;
    margin-bottom: 4px;
  }
  
  .strength-bar {
    height: 4px;
    background: #e5e7eb;
    border-radius: 2px;
    overflow: hidden;
  }
  
  .strength-fill {
    height: 100%;
    border-radius: 2px;
    transition: all 0.3s ease;
    width: ${({ strength }) => (strength / 4) * 100}%;
    background: ${({ strength }) => {
      if (strength <= 1) return '#ef4444';
      if (strength <= 2) return '#f59e0b';
      if (strength <= 3) return '#10b981';
      return '#059669';
    }};
  }
`;

const TermsContainer = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 8px;
  
  input[type="checkbox"] {
    width: 16px;
    height: 16px;
    margin-top: 2px;
    accent-color: #667eea;
  }
  
  label {
    font-size: 14px;
    color: #374151;
    cursor: pointer;
    line-height: 1.5;
    
    a {
      color: #667eea;
      text-decoration: underline;
      
      &:hover {
        color: #5a67d8;
      }
    }
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

const LoginLink = styled.div`
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

// 비밀번호 강도 체크 함수
const checkPasswordStrength = (password: string): number => {
  let strength = 0;
  if (password.length >= 8) strength++;
  if (/[a-z]/.test(password)) strength++;
  if (/[A-Z]/.test(password)) strength++;
  if (/\d/.test(password)) strength++;
  return strength;
};

export const SignupForm: React.FC<SignupFormProps> = ({
  onSuccess,
  onLoginClick
}) => {
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [isSuccess, setIsSuccess] = useState(false);
  const { signup, isLoading, error, clearError } = useAuthStore();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting }
  } = useForm<SignupFormData>({
    resolver: yupResolver(signupSchema),
    mode: 'onBlur',
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
      agreeToTerms: false
    }
  });

  const watchPassword = watch('password', '');

  // 비밀번호 강도 실시간 체크
  React.useEffect(() => {
    setPasswordStrength(checkPasswordStrength(watchPassword));
  }, [watchPassword]);

  const onSubmit = async (data: SignupFormData) => {
    try {
      clearError();
      
      await signup({
        name: data.name,
        email: data.email,
        password: data.password
      });

      // 회원가입 성공 시
      setIsSuccess(true);
      
      // 2초 후 성공 콜백 실행
      setTimeout(() => {
        onSuccess?.();
      }, 2000);
      
    } catch (err) {
      // 에러는 zustand store에서 처리됨
      console.error('회원가입 오류:', err);
    }
  };

  const isFormLoading = isLoading || isSubmitting;

  if (isSuccess) {
    return (
      <FormContainer>
        <FormHeader>
          <Title>회원가입 완료!</Title>
          <Subtitle>환영합니다! 로그인 페이지로 이동합니다.</Subtitle>
        </FormHeader>
        <SuccessMessage>
          <CheckCircle />
          회원가입이 성공적으로 완료되었습니다.
        </SuccessMessage>
      </FormContainer>
    );
  }

  return (
    <FormContainer>
      <FormHeader>
        <Title>회원가입</Title>
        <Subtitle>Behindy에서 특별한 모험을 시작하세요</Subtitle>
      </FormHeader>

      <FormContent onSubmit={handleSubmit(onSubmit)}>
        {/* 서버 에러 표시 */}
        {error && (
          <ErrorMessage>
            <AlertCircle />
            {typeof error === 'string' ? error : 'An error occurred'}
          </ErrorMessage>
        )}

        {/* 이름 입력 */}
        <Input
          {...register('name')}
          type="text"
          label="이름"
          placeholder="이름을 입력하세요"
          leftIcon={<User />}
          error={errors.name?.message}
          disabled={isFormLoading}
          autoComplete="name"
          fullWidth
        />

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
        <div>
          <Input
            {...register('password')}
            type="password"
            label="비밀번호"
            placeholder="비밀번호를 입력하세요"
            leftIcon={<Lock />}
            error={errors.password?.message}
            disabled={isFormLoading}
            autoComplete="new-password"
            fullWidth
          />
          {watchPassword && (
            <PasswordStrength strength={passwordStrength}>
              <div className="strength-label">
                비밀번호 강도: {
                  passwordStrength <= 1 ? '약함' :
                  passwordStrength <= 2 ? '보통' :
                  passwordStrength <= 3 ? '강함' : '매우 강함'
                }
              </div>
              <div className="strength-bar">
                <div className="strength-fill" />
              </div>
            </PasswordStrength>
          )}
        </div>

        {/* 비밀번호 확인 */}
        <Input
          {...register('confirmPassword')}
          type="password"
          label="비밀번호 확인"
          placeholder="비밀번호를 다시 입력하세요"
          leftIcon={<Lock />}
          error={errors.confirmPassword?.message}
          disabled={isFormLoading}
          autoComplete="new-password"
          fullWidth
        />

        {/* 이용약관 동의 */}
        <TermsContainer>
          <input
            {...register('agreeToTerms')}
            type="checkbox"
            id="agreeToTerms"
            disabled={isFormLoading}
          />
          <label htmlFor="agreeToTerms">
            <a href="/terms" target="_blank">이용약관</a> 및{' '}
            <a href="/privacy" target="_blank">개인정보처리방침</a>에 동의합니다.
            {errors.agreeToTerms && (
              <div style={{ color: '#ef4444', fontSize: '12px', marginTop: '4px' }}>
                {errors.agreeToTerms.message}
              </div>
            )}
          </label>
        </TermsContainer>

        {/* 회원가입 버튼 */}
        <ButtonGroup>
          <Button
            type="submit"
            variant="primary"
            size="lg"
            fullWidth
            isLoading={isFormLoading}
            icon={<UserPlus />}
          >
            {isFormLoading ? '가입 중...' : '회원가입'}
          </Button>
        </ButtonGroup>
      </FormContent>

      <Divider>
        <span>또는</span>
      </Divider>

      {/* 로그인 링크 */}
      <LoginLink>
        이미 계정이 있으신가요?{' '}
        <button 
          type="button" 
          onClick={onLoginClick}
          disabled={isFormLoading}
        >
          로그인
        </button>
      </LoginLink>
    </FormContainer>
  );
};

export default SignupForm;