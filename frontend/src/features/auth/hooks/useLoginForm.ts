import { useState, useCallback, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuthStore } from '@/shared/store/authStore';
import { apiErrorHandler } from '@/shared/utils/common/api';
import { SUCCESS_MESSAGES, ERROR_MESSAGES } from '@/shared/utils/common/constants';
import { validateLoginForm } from '../utils/loginValidation';
import type { LoginFormData, LoginFormErrors } from '../types/types';

const initialFormData: LoginFormData = {
  email: '',
  password: '',
  rememberMe: false,
};

export function useLoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login, isAuthenticated } = useAuthStore();
  
  const [formData, setFormData] = useState<LoginFormData>(initialFormData);
  const [errors, setErrors] = useState<LoginFormErrors>({});
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState<string>('');

  // 이미 로그인된 사용자 리다이렉트
  useEffect(() => {
    if (isAuthenticated()) {
      router.push('/');
    }
  }, [isAuthenticated, router]);

  // URL 파라미터에서 회원가입 성공 메시지 확인
  useEffect(() => {
    if (searchParams.get('message') === 'signup_success') {
      setSuccess(SUCCESS_MESSAGES.SIGNUP_COMPLETE);
    }
  }, [searchParams]);

  const handleInputChange = useCallback((
    field: keyof LoginFormData, 
    value: string | boolean
  ) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
    if (errors.submit) {
      setErrors(prev => ({ ...prev, submit: undefined }));
    }
  }, [errors]);

  const handleFieldBlur = useCallback((field: keyof LoginFormData) => {
    const validation = validateLoginForm.field(field, formData[field]);
    if (!validation.isValid) {
      setErrors(prev => ({ ...prev, [field]: validation.message }));
    }
  }, [formData]);

  const performLogin = useCallback(async (credentials: {
    email: string;
    password: string;
    rememberMe: boolean;
  }) => {
    setIsLoading(true);
    setErrors({});
    setSuccess('');

    try {
      const result = await login(credentials);

      if (result.success) {
        setSuccess(SUCCESS_MESSAGES.LOGIN_SUCCESS);
        setTimeout(() => {
          const redirectTo = searchParams.get('redirect') || '/';
          router.push(redirectTo);
        }, 1000);
      } else {
        setErrors({ submit: result.error || ERROR_MESSAGES.LOGIN_FAILED });
      }
    } catch (error: unknown) {
      const errorInfo = apiErrorHandler.parseError(error);
      setErrors({ submit: errorInfo.message });
    } finally {
      setIsLoading(false);
    }
  }, [login, router, searchParams]);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    
    const validation = validateLoginForm.all(formData);
    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    await performLogin({
      email: formData.email.trim().toLowerCase(),
      password: formData.password,
      rememberMe: formData.rememberMe,
    });
  }, [formData, performLogin]);

  const handleDemoLogin = useCallback(async () => {
    await performLogin({
      email: 'demo@demo.com',
      password: 'Ademo123!',
      rememberMe: false,
    });
  }, [performLogin]);

  const navigateToSignup = useCallback(() => {
    router.push('/auth/signup');
  }, [router]);

  const navigateToForgotPassword = useCallback(() => {
    router.push('/auth/forgot-password');
  }, [router]);

  const isFormValid = formData.email.trim() && 
                     formData.password && 
                     Object.keys(errors).length === 0;

  return {
    // 상태
    formData,
    errors,
    isLoading,
    success,
    isFormValid,
    
    // 액션
    handleInputChange,
    handleFieldBlur,
    handleSubmit,
    handleDemoLogin,
    navigateToSignup,
    navigateToForgotPassword,
  };
}