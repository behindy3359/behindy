import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/shared/store/authStore';
import { apiErrorHandler } from '@/shared/utils/common/api';
import { validateSignupForm } from '../utils/formValidation';
import type { 
  SignupFormData, 
  SignupFormErrors, 
  FormValidationResult 
} from '../types/types';

const initialFormData: SignupFormData = {
  name: '',
  email: '',
  password: '',
  confirmPassword: '',
  agreeToTerms: false,
  agreeToPrivacy: false,
  marketingOptIn: false,
};

export function useSignupForm() {
  const router = useRouter();
  const { signup } = useAuthStore();
  
  // 폼 상태
  const [formData, setFormData] = useState<SignupFormData>(initialFormData);
  const [errors, setErrors] = useState<SignupFormErrors>({});
  const [isLoading, setIsLoading] = useState(false);
  const [submitError, setSubmitError] = useState<string>('');
  const [submitSuccess, setSubmitSuccess] = useState<string>('');

  // 개별 필드 변경 처리
  const handleInputChange = useCallback((
    field: keyof SignupFormData, 
    value: string | boolean
  ) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // 해당 필드의 에러만 클리어
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  }, [errors]);

  // 필드 블러 시 검증
  const handleFieldBlur = useCallback((field: keyof SignupFormData) => {
    const validation = validateSignupForm.field(field, formData[field], formData);
    if (!validation.isValid) {
      setErrors(prev => ({ ...prev, [field]: validation.message }));
    }
  }, [formData]);

  // 전체 폼 검증
  const validateForm = useCallback((): FormValidationResult => {
    const validation = validateSignupForm.all(formData);
    setErrors(validation.errors);
    return validation;
  }, [formData]);

  // 폼 제출 처리
  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    
    // 클라이언트 검증
    const validation = validateForm();
    if (!validation.isValid) {
      return;
    }

    setIsLoading(true);
    setSubmitError('');
    setSubmitSuccess('');

    try {
      const result = await signup({
        name: formData.name.trim(),
        email: formData.email.trim().toLowerCase(),
        password: formData.password,
      });

      if (result.success) {
        setSubmitSuccess('회원가입이 완료되었습니다!');
        
        setTimeout(() => {
          router.push('/auth/login?message=signup_success');
        }, 2000);
      } else {
        setSubmitError(result.error || '회원가입에 실패했습니다.');
      }
    } catch (error: unknown) {
      const errorInfo = apiErrorHandler.parseError(error);
      setSubmitError(errorInfo.message);
      
      if (errorInfo.code === '409' && errorInfo.details?.field === 'email') {
        setErrors(prev => ({
          ...prev,
          email: '이미 사용 중인 이메일입니다.',
        }));
      }
    } finally {
      setIsLoading(false);
    }
  }, [formData, signup, router, validateForm]);

  // 폼 리셋
  const resetForm = useCallback(() => {
    setFormData(initialFormData);
    setErrors({});
    setSubmitError('');
    setSubmitSuccess('');
  }, []);

  // 로그인 페이지로 이동
  const navigateToLogin = useCallback(() => {
    router.push('/auth/login');
  }, [router]);

  // 폼 유효성 검사 - 포트폴리오 알람만 필수
  const isFormValid =
    formData.name.trim().length > 0 &&
    formData.email.trim().length > 0 &&
    formData.password.length > 0 &&
    formData.confirmPassword.length > 0 &&
    formData.password === formData.confirmPassword &&
    formData.agreeToTerms === true;

  return {
    // 상태
    formData,
    errors,
    isLoading,
    submitError,
    submitSuccess,
    isFormValid,
    
    // 액션
    handleInputChange,
    handleFieldBlur,
    handleSubmit,
    resetForm,
    navigateToLogin,
    validateForm,
  };
}