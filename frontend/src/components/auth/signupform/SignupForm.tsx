"use client";

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { UserPlus, Mail, Lock, User, Check, X, AlertCircle } from 'lucide-react';
import { Button, Input } from '../../ui';
import { useAuthStore } from '../../../store/authStore';

// ================================================================
// Types & Validation
// ================================================================

interface SignupFormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  agreeToTerms: boolean;
  agreeToPrivacy: boolean;
}

const signupSchema = yup.object({
  name: yup
    .string()
    .required('이름을 입력해주세요')
    .min(2, '이름은 최소 2자 이상이어야 합니다')
    .max(50, '이름은 최대 50자까지 입력 가능합니다'),
  email: yup
    .string()
    .required('이메일을 입력해주세요')
    .email('올바른 이메일 형식이 아닙니다'),
  password: yup
    .string()
    .required('비밀번호를 입력해주세요')
    .min(8, '비밀번호는 최소 8자 이상이어야 합니다')
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
      '비밀번호는 대소문자, 숫자, 특수문자를 포함해야 합니다'
    ),
  confirmPassword: yup
    .string()
    .required('비밀번호 확인을 입력해주세요')
    .oneOf([yup.ref('password')], '비밀번호가 일치하지 않습니다'),
  agreeToTerms: yup
    .boolean()
    .required('이용약관에 동의해주세요')
    .oneOf([true], '이용약관에 동의해주세요'),
  agreeToPrivacy: yup
    .boolean()
    .required('개인정보처리방침에 동의해주세요')
    .oneOf([true], '개인정보처리방침에 동의해주세요'),
});

// ================================================================
// Styled Components
// ================================================================

const FormContainer = styled(motion.div)`
  width: 100%;
  max-width: 450px;
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

const PasswordStrength = styled.div<{ strength: number }>`
  margin-top: 0.5rem;
  
  .strength-bar {
    width: 100%;
    height: 4px;
    background: #e5e7eb;
    border-radius: 2px;
    overflow: hidden;
    
    .strength-fill {
      height: 100%;
      transition: all 0.3s ease;
      border-radius: 2px;
      
      ${({ strength }) => {
        if (strength <= 1) return 'width: 25%; background: #ef4444;';
        if (strength <= 2) return 'width: 50%; background: #f59e0b;';
        if (strength <= 3) return 'width: 75%; background: #eab308;';
        return 'width: 100%; background: #10b981;';
      }}
    }
  }
  
  .strength-text {
    font-size: 0.75rem;
    margin-top: 0.25rem;
    
    ${({ strength }) => {
      if (strength <= 1) return 'color: #ef4444;';
      if (strength <= 2) return 'color: #f59e0b;';
      if (strength <= 3) return 'color: #eab308;';
      return 'color: #10b981;';
    }}
  }
`;

const PasswordRequirements = styled.div`
  font-size: 0.75rem;
  color: #6b7280;
  margin-top: 0.5rem;
  
  .requirement {
    display: flex;
    align-items: center;
    gap: 0.25rem;
    margin-bottom: 0.25rem;
    
    &.met {
      color: #10b981;
    }
    
    &.unmet {
      color: #ef4444;
    }
    
    svg {
      width: 0.75rem;
      height: 0.75rem;
    }
  }
`;

const CheckboxContainer = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 0.5rem;
  
  input[type="checkbox"] {
    width: 1rem;
    height: 1rem;
    border-radius: 4px;
    border: 2px solid #d1d5db;
    margin-top: 0.125rem;
    
    &:checked {
      background-color: #667eea;
      border-color: #667eea;
    }
  }
  
  label {
    font-size: 0.875rem;
    color: #374151;
    cursor: pointer;
    line-height: 1.4;
    
    a {
      color: #667eea;
      text-decoration: none;
      
      &:hover {
        text-decoration: underline;
      }
    }
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

const LoginPrompt = styled.div`
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
// Helper Functions
// ================================================================

const calculatePasswordStrength = (password: string): number => {
  let strength = 0;
  
  if (password.length >= 8) strength++;
  if (/[a-z]/.test(password)) strength++;
  if (/[A-Z]/.test(password)) strength++;
  if (/\d/.test(password)) strength++;
  if (/[@$!%*?&]/.test(password)) strength++;
  
  return Math.min(strength, 4);
};

const getPasswordRequirements = (password: string) => [
  { text: '8자 이상', met: password.length >= 8 },
  { text: '소문자 포함', met: /[a-z]/.test(password) },
  { text: '대문자 포함', met: /[A-Z]/.test(password) },
  { text: '숫자 포함', met: /\d/.test(password) },
  { text: '특수문자 포함', met: /[@$!%*?&]/.test(password) },
];

// ================================================================
// SignupForm Component
// ================================================================

export const SignupForm: React.FC = () => {
  const [isFormLoading, setIsFormLoading] = useState(false);
  const [signupError, setSignupError] = useState<string>('');
  const [password, setPassword] = useState('');
  
  const { signup } = useAuthStore();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isValid },
    reset,
  } = useForm<SignupFormData>({
    resolver: yupResolver(signupSchema),
    mode: 'onChange',
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
      agreeToTerms: false,
      agreeToPrivacy: false,
    },
  });

  const watchedPassword = watch('password', '');
  const passwordStrength = calculatePasswordStrength(watchedPassword);
  const passwordRequirements = getPasswordRequirements(watchedPassword);

  const onSubmit = async (data: SignupFormData) => {
    try {
      setIsFormLoading(true);
      setSignupError('');

      // API 호출
      const result = await signup({
        name: data.name,
        email: data.email,
        password: data.password,
      });

      if (result.success) {
        reset();
        // 회원가입 성공 시 리다이렉트는 AuthStore에서 처리
      } else {
        setSignupError(result.error || '회원가입에 실패했습니다.');
      }
    } catch (error) {
      setSignupError('회원가입 중 오류가 발생했습니다.');
      console.error('Signup error:', error);
    } finally {
      setIsFormLoading(false);
    }
  };

  return (
    <FormContainer
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <FormHeader>
        <h2>회원가입</h2>
        <p>새 계정을 만들어 게임을 시작하세요</p>
      </FormHeader>

      {signupError && (
        <ErrorMessage
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
        >
          <AlertCircle />
          {signupError}
        </ErrorMessage>
      )}

      <Form onSubmit={handleSubmit(onSubmit)}>
        <Input
          {...register('name')}
          type="text"
          label="이름"
          placeholder="홍길동"
          leftIcon={<User />}
          error={errors.name?.message}
          fullWidth
          autoComplete="name"
        />

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

        <div>
          <Input
            {...register('password')}
            type="password"
            label="비밀번호"
            placeholder="안전한 비밀번호를 입력하세요"
            leftIcon={<Lock />}
            error={errors.password?.message}
            fullWidth
            autoComplete="new-password"
          />
          
          {watchedPassword && (
            <>
              <PasswordStrength strength={passwordStrength}>
                <div className="strength-bar">
                  <div className="strength-fill" />
                </div>
                <div className="strength-text">
                  {passwordStrength <= 1 && '약함'}
                  {passwordStrength === 2 && '보통'}
                  {passwordStrength === 3 && '강함'}
                  {passwordStrength >= 4 && '매우 강함'}
                </div>
              </PasswordStrength>
              
              <PasswordRequirements>
                {passwordRequirements.map((req, index) => (
                  <div 
                    key={index} 
                    className={`requirement ${req.met ? 'met' : 'unmet'}`}
                  >
                    {req.met ? <Check /> : <X />}
                    {req.text}
                  </div>
                ))}
              </PasswordRequirements>
            </>
          )}
        </div>

        <Input
          {...register('confirmPassword')}
          type="password"
          label="비밀번호 확인"
          placeholder="비밀번호를 다시 입력하세요"
          leftIcon={<Lock />}
          error={errors.confirmPassword?.message}
          fullWidth
          autoComplete="new-password"
        />

        <div>
          <CheckboxContainer>
            <input
              {...register('agreeToTerms')}
              type="checkbox"
              id="agreeToTerms"
            />
            <label htmlFor="agreeToTerms">
              <a href="/terms" target="_blank">이용약관</a>에 동의합니다 (필수)
            </label>
          </CheckboxContainer>
          {errors.agreeToTerms && (
            <div style={{ color: '#ef4444', fontSize: '0.75rem', marginTop: '0.25rem' }}>
              {errors.agreeToTerms.message}
            </div>
          )}
        </div>

        <div>
          <CheckboxContainer>
            <input
              {...register('agreeToPrivacy')}
              type="checkbox"
              id="agreeToPrivacy"
            />
            <label htmlFor="agreeToPrivacy">
              <a href="/privacy" target="_blank">개인정보처리방침</a>에 동의합니다 (필수)
            </label>
          </CheckboxContainer>
          {errors.agreeToPrivacy && (
            <div style={{ color: '#ef4444', fontSize: '0.75rem', marginTop: '0.25rem' }}>
              {errors.agreeToPrivacy.message}
            </div>
          )}
        </div>

        <Button
          type="submit"
          variant="primary"
          size="lg"
          fullWidth
          isLoading={isFormLoading}
          leftIcon={<UserPlus />}
          disabled={!isValid || isFormLoading}
        >
          {isFormLoading ? '계정 생성 중...' : '계정 만들기'}
        </Button>
      </Form>

      <LoginPrompt>
        이미 계정이 있으신가요?{' '}
        <a href="/auth/login">로그인</a>
      </LoginPrompt>
    </FormContainer>
  );
};

export default SignupForm;