"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm, SubmitHandler } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  UserPlus, 
  Mail, 
  Lock, 
  User, 
  Check, 
  X, 
  AlertCircle, 
  CheckCircle,
  Eye,
  EyeOff,
  Shield
} from 'lucide-react';
import { Button, Input } from '@/components/ui';
import { useAuthStore } from '@/store/authStore';
import { validators, apiErrorHandler, CONFIRM_MESSAGES } from '@/utils/common';

// ================================================================
// Types & Validation (통합된 validators 사용)
// ================================================================

interface SignupFormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  agreeToTerms: boolean;
  agreeToPrivacy: boolean;
  marketingOptIn: boolean;
}

// 🔥 통합된 검증 시스템 사용
const signupSchema = yup.object().shape({
  name: yup
    .string()
    .required('이름을 입력해주세요')
    .test('name-validation', function(value) {
      if (!value) return this.createError({ message: '이름을 입력해주세요' });
      
      const result = validators.name(value);
      if (!result.isValid) {
        return this.createError({ message: result.message });
      }
      return true;
    }),
  email: yup
    .string()
    .required('이메일을 입력해주세요')
    .test('email-validation', function(value) {
      if (!value) return this.createError({ message: '이메일을 입력해주세요' });
      
      const result = validators.email(value);
      if (!result.isValid) {
        return this.createError({ message: result.message });
      }
      return true;
    }),
  password: yup
    .string()
    .required('비밀번호를 입력해주세요')
    .test('password-validation', function(value) {
      if (!value) return this.createError({ message: '비밀번호를 입력해주세요' });
      
      const result = validators.password(value);
      if (!result.isValid) {
        return this.createError({ message: result.messages[0] || '비밀번호가 올바르지 않습니다' });
      }
      return true;
    }),
  confirmPassword: yup
    .string()
    .required('비밀번호 확인을 입력해주세요')
    .test('password-confirm-validation', function(value) {
      const { password } = this.parent;
      
      const result = validators.passwordConfirm(password, value || '');
      if (!result.isValid) {
        return this.createError({ message: result.message });
      }
      return true;
    }),
  agreeToTerms: yup
    .boolean()
    .required('이용약관에 동의해주세요')
    .oneOf([true], '이용약관에 동의해주세요'),
  agreeToPrivacy: yup
    .boolean()
    .required('개인정보처리방침에 동의해주세요')
    .oneOf([true], '개인정보처리방침에 동의해주세요'),
  marketingOptIn: yup.boolean().default(false),
});

// ================================================================
// Styled Components (theme 시스템 적용)
// ================================================================

const SignupContainer = styled.div`
  width: 100%;
  max-height: 80vh;
  overflow-y: auto;
  
  &::-webkit-scrollbar {
    width: 6px;
  }
  
  &::-webkit-scrollbar-track {
    background: ${({ theme }) => theme.colors.background.tertiary};
    border-radius: ${({ theme }) => theme.borderRadius.sm};
  }
  
  &::-webkit-scrollbar-thumb {
    background: ${({ theme }) => theme.colors.border.dark};
    border-radius: ${({ theme }) => theme.borderRadius.sm};
    
    &:hover {
      background: ${({ theme }) => theme.colors.gray[400]};
    }
  }
`;

const PageTitle = styled.h1`
  font-size: ${({ theme }) => theme.typography.fontSize['3xl']};
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text.primary};
  text-align: center;
  margin: 0 0 ${({ theme }) => theme.spacing[2]} 0;
`;

const SignupForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing[6]};
`;

const PasswordStrengthContainer = styled.div<{ $strength: number }>`
  margin-top: ${({ theme }) => theme.spacing[4]};
  
  .strength-bar {
    width: 100%;
    height: 6px;
    background: ${({ theme }) => theme.colors.background.tertiary};
    border-radius: ${({ theme }) => theme.borderRadius.sm};
    overflow: hidden;
    margin-bottom: ${({ theme }) => theme.spacing[2]};
    
    .strength-fill {
      height: 100%;
      transition: all 0.3s ease;
      border-radius: ${({ theme }) => theme.borderRadius.sm};
      
      ${({ $strength, theme }) => {
        if ($strength <= 1) return `width: 25%; background: ${theme.colors.error};`;
        if ($strength <= 2) return `width: 50%; background: ${theme.colors.warning};`;
        if ($strength <= 3) return `width: 75%; background: #eab308;`;
        return `width: 100%; background: ${theme.colors.success};`;
      }}
    }
  }
  
  .strength-text {
    font-size: ${({ theme }) => theme.typography.fontSize.xs};
    font-weight: 500;
    
    ${({ $strength, theme }) => {
      if ($strength <= 1) return `color: ${theme.colors.error};`;
      if ($strength <= 2) return `color: ${theme.colors.warning};`;
      if ($strength <= 3) return `color: #eab308;`;
      return `color: ${theme.colors.success};`;
    }}
  }
`;

const PasswordRequirements = styled.div`
  margin-top: ${({ theme }) => theme.spacing[2]};
  padding: ${({ theme }) => theme.spacing[4]};
  background: ${({ theme }) => theme.colors.background.secondary};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  border: 1px solid ${({ theme }) => theme.colors.border.light};
  
  .requirements-title {
    font-size: ${({ theme }) => theme.typography.fontSize.xs};
    font-weight: 600;
    color: ${({ theme }) => theme.colors.text.secondary};
    margin-bottom: ${({ theme }) => theme.spacing[2]};
  }
  
  .requirement {
    display: flex;
    align-items: center;
    gap: ${({ theme }) => theme.spacing[2]};
    margin-bottom: ${({ theme }) => theme.spacing[1]};
    font-size: ${({ theme }) => theme.typography.fontSize.xs};
    
    &.met {
      color: ${({ theme }) => theme.colors.success};
    }
    
    &.unmet {
      color: ${({ theme }) => theme.colors.error};
    }
    
    svg {
      width: 12px;
      height: 12px;
    }
  }
`;

const AgreementSection = styled.div`
  border: 1px solid ${({ theme }) => theme.colors.border.light};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  padding: ${({ theme }) => theme.spacing[6]};
  background: ${({ theme }) => theme.colors.background.secondary};
`;

const AgreementItem = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing[4]};
  
  &:last-child {
    margin-bottom: 0;
  }
`;

const CheckboxWrapper = styled.label<{ $required?: boolean }>`
  display: flex;
  align-items: flex-start;
  gap: ${({ theme }) => theme.spacing[4]};
  cursor: pointer;
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  color: ${({ theme }) => theme.colors.text.primary};
  line-height: 1.5;
  
  input[type="checkbox"] {
    width: 18px;
    height: 18px;
    border-radius: ${({ theme }) => theme.borderRadius.sm};
    border: 2px solid ${({ $required, theme }) => 
      $required ? theme.colors.error : theme.colors.border.dark};
    background: ${({ theme }) => theme.colors.background.primary};
    cursor: pointer;
    margin-top: 2px;
    flex-shrink: 0;
    
    &:checked {
      background-color: ${({ theme }) => theme.colors.primary[500]};
      border-color: ${({ theme }) => theme.colors.primary[500]};
      background-image: url("data:image/svg+xml,%3csvg viewBox='0 0 16 16' fill='white' xmlns='http://www.w3.org/2000/svg'%3e%3cpath d='m13.854 3.646-8 8-.5-.5 8-8 .5.5z'/%3e%3cpath d='m6.854 7.146-2-2-.5.5 2 2 .5-.5z'/%3e%3c/svg%3e");
    }
  }
  
  .required-mark {
    color: ${({ theme }) => theme.colors.error};
    font-weight: 600;
  }
  
  .link {
    color: ${({ theme }) => theme.colors.primary[500]};
    text-decoration: none;
    
    &:hover {
      text-decoration: underline;
    }
  }
`;

const ErrorAlert = styled(motion.div)`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[4]};
  padding: ${({ theme }) => theme.spacing[4]};
  background: #fef2f2;
  border: 1px solid #fecaca;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  color: ${({ theme }) => theme.colors.error};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  margin-bottom: ${({ theme }) => theme.spacing[4]};
  
  svg {
    width: 20px;
    height: 20px;
    flex-shrink: 0;
  }
`;

const SuccessAlert = styled(motion.div)`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[4]};
  padding: ${({ theme }) => theme.spacing[4]};
  background: #f0fdf4;
  border: 1px solid #bbf7d0;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  color: ${({ theme }) => theme.colors.success};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  margin-bottom: ${({ theme }) => theme.spacing[4]};
  
  svg {
    width: 20px;
    height: 20px;
    flex-shrink: 0;
  }
`;

const Divider = styled.div`
  display: flex;
  align-items: center;
  margin: ${({ theme }) => theme.spacing[6]} 0;
  
  &::before,
  &::after {
    content: '';
    flex: 1;
    height: 1px;
    background: ${({ theme }) => theme.colors.border.light};
  }
  
  span {
    padding: 0 ${({ theme }) => theme.spacing[4]};
    color: ${({ theme }) => theme.colors.text.tertiary};
    font-size: ${({ theme }) => theme.typography.fontSize.sm};
    font-weight: 500;
  }
`;

const LoginPrompt = styled.div`
  text-align: center;
  margin-top: ${({ theme }) => theme.spacing[6]};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  color: ${({ theme }) => theme.colors.text.secondary};
  
  a {
    color: ${({ theme }) => theme.colors.primary[500]};
    text-decoration: none;
    font-weight: 600;
    margin-left: ${({ theme }) => theme.spacing[1]};
    
    &:hover {
      text-decoration: underline;
    }
  }
`;

// ================================================================
// Helper Functions (통합된 validators 활용)
// ================================================================

const getPasswordStrengthText = (strength: number): string => {
  switch (strength) {
    case 0:
    case 1:
      return '매우 약함';
    case 2:
      return '약함';
    case 3:
      return '보통';
    case 4:
      return '강함';
    default:
      return '매우 강함';
  }
};

// ================================================================
// Component
// ================================================================

export default function SignupPage() {
  const router = useRouter();
  const { signup, isAuthenticated } = useAuthStore();
  const [signupError, setSignupError] = useState<string>('');
  const [signupSuccess, setSignupSuccess] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isValid },
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
      marketingOptIn: false,
    },
  });

  const watchedPassword = watch('password', '');
  const watchedConfirmPassword = watch('confirmPassword', '');

  // 🔥 통합된 검증 시스템 사용
  const passwordValidation = validators.password(watchedPassword);
  const passwordRequirements = passwordValidation.messages.map((msg, index) => ({
    text: msg,
    met: passwordValidation.score > index
  }));

  // 이미 로그인된 사용자는 홈으로 리다이렉트
  useEffect(() => {
    if (isAuthenticated()) {
      router.push('/');
    }
  }, [isAuthenticated, router]);

  const onSubmit: SubmitHandler<SignupFormData> = async (data) => {
    try {
      setIsLoading(true);
      setSignupError('');
      setSignupSuccess('');

      const result = await signup({
        name: data.name,
        email: data.email,
        password: data.password,
      });

      if (result.success) {
        setSignupSuccess('회원가입이 완료되었습니다! 로그인 페이지로 이동합니다...');
        
        setTimeout(() => {
          router.push('/auth/login?message=signup_success');
        }, 2000);
      } else {
        // 🔥 통합된 에러 처리 사용
        const errorInfo = apiErrorHandler.parseError(result.error);
        setSignupError(errorInfo.message);
      }
    } catch (error: unknown) {
      // 🔥 통합된 에러 처리 사용
      const errorInfo = apiErrorHandler.parseError(error);
      setSignupError(errorInfo.message);
      console.error('Signup error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleTermsClick = () => {
    window.open('/terms', '_blank');
  };

  const handlePrivacyClick = () => {
    window.open('/privacy', '_blank');
  };

  const navigateToLogin = () => {
    router.push('/auth/login');
  };

  const isPasswordMatch = watchedPassword && watchedConfirmPassword && 
    watchedPassword === watchedConfirmPassword;

  return (
    <SignupContainer>
      <PageTitle>behindy에 어서오세요!</PageTitle>

      {/* 에러 메시지 */}
      <AnimatePresence>
        {signupError && (
          <ErrorAlert
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <AlertCircle />
            {signupError}
          </ErrorAlert>
        )}
      </AnimatePresence>

      {/* 성공 메시지 */}
      <AnimatePresence>
        {signupSuccess && (
          <SuccessAlert
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <CheckCircle />
            {signupSuccess}
          </SuccessAlert>
        )}
      </AnimatePresence>

      <SignupForm onSubmit={handleSubmit(onSubmit)}>
        {/* 이름 입력 */}
        <Input
          {...register('name')}
          type="text"
          label="이름"
          placeholder="홍길동"
          leftIcon={<User size={20} />}
          error={errors.name?.message}
          fullWidth
          autoComplete="name"
          autoFocus
        />

        {/* 이메일 입력 */}
        <Input
          {...register('email')}
          type="email"
          label="이메일"
          placeholder="your.email@example.com"
          leftIcon={<Mail size={20} />}
          error={errors.email?.message}
          fullWidth
          autoComplete="email"
        />

        {/* 비밀번호 입력 */}
        <div>
          <Input
            {...register('password')}
            type={showPassword ? 'text' : 'password'}
            label="비밀번호"
            placeholder="안전한 비밀번호를 입력하세요"
            leftIcon={<Lock size={20} />}
            rightIcon={
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{ background: 'none', border: 'none', cursor: 'pointer' }}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            }
            error={errors.password?.message}
            fullWidth
            autoComplete="new-password"
          />
          
          {/* 비밀번호 강도 표시 */}
          {watchedPassword && (
            <PasswordStrengthContainer $strength={passwordValidation.score}>
              <div className="strength-bar">
                <div className="strength-fill" />
              </div>
              <div className="strength-text">
                비밀번호 강도: {getPasswordStrengthText(passwordValidation.score)}
              </div>
            </PasswordStrengthContainer>
          )}
          
          {/* 비밀번호 요구사항 */}
          {watchedPassword && (
            <PasswordRequirements>
              <div className="requirements-title">
                <Shield size={14} style={{ display: 'inline', marginRight: '4px' }} />
                비밀번호 요구사항
              </div>
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
          )}
        </div>

        {/* 비밀번호 확인 */}
        <div>
          <Input
            {...register('confirmPassword')}
            type={showConfirmPassword ? 'text' : 'password'}
            label="비밀번호 확인"
            placeholder="비밀번호를 다시 입력하세요"
            leftIcon={<Lock size={20} />}
            rightIcon={
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                style={{ background: 'none', border: 'none', cursor: 'pointer' }}
              >
                {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            }
            error={errors.confirmPassword?.message}
            fullWidth
            autoComplete="new-password"
          />
          
          {/* 비밀번호 일치 표시 */}
          {watchedConfirmPassword && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              style={{
                marginTop: '8px',
                fontSize: '12px',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                color: isPasswordMatch ? '#10b981' : '#ef4444'
              }}
            >
              {isPasswordMatch ? <Check size={14} /> : <X size={14} />}
              {isPasswordMatch ? '비밀번호가 일치합니다' : '비밀번호가 일치하지 않습니다'}
            </motion.div>
          )}
        </div>

        {/* 약관 동의 */}
        <AgreementSection>
          <AgreementItem>
            <CheckboxWrapper $required>
              <input
                {...register('agreeToTerms')}
                type="checkbox"
                id="agreeToTerms"
              />
              <span>
                <span className="required-mark">*</span>
                <button 
                  type="button"
                  className="link"
                  onClick={handleTermsClick}
                >
                  이용약관
                </button>
                에 동의합니다
              </span>
            </CheckboxWrapper>
            {errors.agreeToTerms && (
              <div style={{ 
                color: '#ef4444', 
                fontSize: '12px', 
                marginTop: '4px',
                marginLeft: '30px'
              }}>
                {errors.agreeToTerms.message}
              </div>
            )}
          </AgreementItem>

          <AgreementItem>
            <CheckboxWrapper $required>
              <input
                {...register('agreeToPrivacy')}
                type="checkbox"
                id="agreeToPrivacy"
              />
              <span>
                <span className="required-mark">*</span>
                <button 
                  type="button"
                  className="link"
                  onClick={handlePrivacyClick}
                >
                  개인정보처리방침
                </button>
                에 동의합니다
              </span>
            </CheckboxWrapper>
            {errors.agreeToPrivacy && (
              <div style={{ 
                color: '#ef4444', 
                fontSize: '12px', 
                marginTop: '4px',
                marginLeft: '30px'
              }}>
                {errors.agreeToPrivacy.message}
              </div>
            )}
          </AgreementItem>

          <AgreementItem>
            <CheckboxWrapper>
              <input
                {...register('marketingOptIn')}
                type="checkbox"
                id="marketingOptIn"
              />
              <span>
                마케팅 정보 수신에 동의합니다 (선택)
                <div style={{ 
                  fontSize: '12px', 
                  color: '#6b7280', 
                  marginTop: '2px' 
                }}>
                  새로운 게임 업데이트와 이벤트 소식을 받아보세요
                </div>
              </span>
            </CheckboxWrapper>
          </AgreementItem>
        </AgreementSection>

        <Button
          type="submit"
          variant="primary"
          size="lg"
          fullWidth
          isLoading={isLoading}
          leftIcon={<UserPlus size={20} />}
          disabled={!isValid || isLoading}
        >
          {isLoading ? '계정 생성 중...' : '계정 만들기'}
        </Button>
      </SignupForm>

      <Divider>
        <span>또는</span>
      </Divider>

      <LoginPrompt>
        이미 계정이 있으신가요?
        <motion.a
          onClick={navigateToLogin}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          style={{ cursor: 'pointer' }}
        >
          로그인
        </motion.a>
      </LoginPrompt>
    </SignupContainer>
  );
}