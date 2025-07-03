"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
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
  marketingOptIn?: boolean;
}

const signupSchema = yup.object({
  name: yup
    .string()
    .required('이름을 입력해주세요')
    .min(2, '이름은 최소 2자 이상이어야 합니다')
    .max(50, '이름은 최대 50자까지 입력 가능합니다')
    .matches(/^[가-힣a-zA-Z\s]+$/, '이름에는 한글, 영문, 공백만 사용 가능합니다'),
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
  marketingOptIn: yup.boolean(),
});

// ================================================================
// Styled Components
// ================================================================

const SignupContainer = styled.div`
  width: 100%;
  max-height: 80vh;
  overflow-y: auto;
  
  /* 커스텀 스크롤바 */
  &::-webkit-scrollbar {
    width: 6px;
  }
  
  &::-webkit-scrollbar-track {
    background: #f1f5f9;
    border-radius: 3px;
  }
  
  &::-webkit-scrollbar-thumb {
    background: #cbd5e1;
    border-radius: 3px;
    
    &:hover {
      background: #94a3b8;
    }
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
`;

const SignupForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

const PasswordStrengthContainer = styled.div<{ $strength: number }>`
  margin-top: 12px;
  
  .strength-bar {
    width: 100%;
    height: 6px;
    background: #f1f5f9;
    border-radius: 3px;
    overflow: hidden;
    margin-bottom: 8px;
    
    .strength-fill {
      height: 100%;
      transition: all 0.3s ease;
      border-radius: 3px;
      
      ${({ $strength }) => {
        if ($strength <= 1) return 'width: 25%; background: #ef4444;';
        if ($strength <= 2) return 'width: 50%; background: #f59e0b;';
        if ($strength <= 3) return 'width: 75%; background: #eab308;';
        return 'width: 100%; background: #10b981;';
      }}
    }
  }
  
  .strength-text {
    font-size: 12px;
    font-weight: 500;
    
    ${({ $strength }) => {
      if ($strength <= 1) return 'color: #ef4444;';
      if ($strength <= 2) return 'color: #f59e0b;';
      if ($strength <= 3) return 'color: #eab308;';
      return 'color: #10b981;';
    }}
  }
`;

const PasswordRequirements = styled.div`
  margin-top: 8px;
  padding: 12px;
  background: #f8fafc;
  border-radius: 6px;
  border: 1px solid #e2e8f0;
  
  .requirements-title {
    font-size: 12px;
    font-weight: 600;
    color: #475569;
    margin-bottom: 8px;
  }
  
  .requirement {
    display: flex;
    align-items: center;
    gap: 6px;
    margin-bottom: 4px;
    font-size: 11px;
    
    &.met {
      color: #10b981;
    }
    
    &.unmet {
      color: #ef4444;
    }
    
    svg {
      width: 12px;
      height: 12px;
    }
  }
`;

const AgreementSection = styled.div`
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 20px;
  background: #fafbfc;
`;

const AgreementItem = styled.div`
  margin-bottom: 16px;
  
  &:last-child {
    margin-bottom: 0;
  }
`;

const CheckboxWrapper = styled.label<{ $required?: boolean }>`
  display: flex;
  align-items: flex-start;
  gap: 12px;
  cursor: pointer;
  font-size: 14px;
  color: #374151;
  line-height: 1.5;
  
  input[type="checkbox"] {
    width: 18px;
    height: 18px;
    border-radius: 4px;
    border: 2px solid ${({ $required }) => $required ? '#dc2626' : '#d1d5db'};
    background: white;
    cursor: pointer;
    margin-top: 2px;
    flex-shrink: 0;
    
    &:checked {
      background-color: #667eea;
      border-color: #667eea;
      background-image: url("data:image/svg+xml,%3csvg viewBox='0 0 16 16' fill='white' xmlns='http://www.w3.org/2000/svg'%3e%3cpath d='m13.854 3.646-8 8-.5-.5 8-8 .5.5z'/%3e%3cpath d='m6.854 7.146-2-2-.5.5 2 2 .5-.5z'/%3e%3c/svg%3e");
    }
  }
  
  .required-mark {
    color: #dc2626;
    font-weight: 600;
  }
  
  .link {
    color: #667eea;
    text-decoration: none;
    
    &:hover {
      text-decoration: underline;
    }
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
  margin: 24px 0;
  
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

const LoginPrompt = styled.div`
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
      marketingOptIn: false,
    },
  });

  const watchedPassword = watch('password', '');
  const watchedConfirmPassword = watch('confirmPassword', '');
  const passwordStrength = calculatePasswordStrength(watchedPassword);
  const passwordRequirements = getPasswordRequirements(watchedPassword);

  // 이미 로그인된 사용자는 홈으로 리다이렉트
  useEffect(() => {
    if (isAuthenticated()) {
      router.push('/');
    }
  }, [isAuthenticated, router]);

  const onSubmit = async (data: SignupFormData) => {
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
        
        // 성공 메시지 표시 후 로그인 페이지로 이동
        setTimeout(() => {
          router.push('/auth/login?message=signup_success');
        }, 2000);
      } else {
        setSignupError(result.error || '회원가입에 실패했습니다.');
      }
    } catch (error) {
      setSignupError('회원가입 중 오류가 발생했습니다.');
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
      <PageTitle>새로운 모험을 시작하세요</PageTitle>
      <PageSubtitle>몇 분만에 계정을 만들고 지하철 어드벤처에 참여하세요</PageSubtitle>

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
            <PasswordStrengthContainer $strength={passwordStrength}>
              <div className="strength-bar">
                <div className="strength-fill" />
              </div>
              <div className="strength-text">
                비밀번호 강도: {getPasswordStrengthText(passwordStrength)}
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