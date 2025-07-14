import { useState, useCallback, useEffect } from 'react';
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

  // 🔥 디버깅: 상태 변화 로깅
  useEffect(() => {
    console.log('=== SIGNUP FORM DEBUG ===');
    console.log('formData:', formData);
    console.log('errors:', errors);
    
    // 각 조건 체크
    const conditions = {
      'errors가 비어있음': Object.keys(errors).length === 0,
      'name 있음': formData.name.trim().length > 0,
      'email 있음': formData.email.trim().length > 0,
      'password 있음': formData.password.length > 0,
      'confirmPassword 있음': formData.confirmPassword.length > 0,
      'password 일치': formData.password === formData.confirmPassword,
      'terms 동의': formData.agreeToTerms === true,
      'privacy 동의': formData.agreeToPrivacy === true,
    };
    
    console.log('조건 체크:', conditions);
    
    const isValid = Object.values(conditions).every(Boolean);
    console.log('최종 isFormValid:', isValid);
    console.log('========================');
  }, [formData, errors]);

  // 개별 필드 변경 처리
  const handleInputChange = useCallback((
    field: keyof SignupFormData, 
    value: string | boolean
  ) => {
    console.log(`🔄 handleInputChange: ${field} = ${value}`);
    
    const updatedFormData = { ...formData, [field]: value };
    setFormData(updatedFormData);
    
    // 기존 에러가 있으면 실시간 검증
    if (errors[field]) {
      console.log(`🔍 실시간 검증: ${field}`);
      const validation = validateSignupForm.field(field, value, updatedFormData);
      console.log(`검증 결과:`, validation);
      
      setErrors(prev => ({
        ...prev,
        [field]: validation.isValid ? undefined : validation.message,
      }));
    }

    // password 변경 시 confirmPassword도 재검증
    if (field === 'password' && updatedFormData.confirmPassword && errors.confirmPassword) {
      console.log('🔍 confirmPassword 재검증');
      const confirmValidation = validateSignupForm.field(
        'confirmPassword', 
        updatedFormData.confirmPassword, 
        updatedFormData
      );
      setErrors(prev => ({
        ...prev,
        confirmPassword: confirmValidation.isValid ? undefined : confirmValidation.message,
      }));
    }
  }, [formData, errors]);

  // 필드 블러 시 검증
  const handleFieldBlur = useCallback((field: keyof SignupFormData) => {
    console.log(`🔍 handleFieldBlur: ${field}`);
    const validation = validateSignupForm.field(field, formData[field], formData);
    console.log(`블러 검증 결과:`, validation);
    
    setErrors(prev => ({
      ...prev,
      [field]: validation.isValid ? undefined : validation.message,
    }));
  }, [formData]);

  // 전체 폼 검증
  const validateForm = useCallback((): FormValidationResult => {
    console.log('🔍 전체 폼 검증');
    const validation = validateSignupForm.all(formData);
    console.log('전체 검증 결과:', validation);
    setErrors(validation.errors);
    return validation;
  }, [formData]);

  // 폼 제출 처리
  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('🚀 폼 제출 시도');
    
    // 클라이언트 검증
    const validation = validateForm();
    if (!validation.isValid) {
      console.log('❌ 클라이언트 검증 실패');
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

  // 폼 유효성 검사
  const isFormValid = 
    Object.keys(errors).length === 0 && 
    formData.name.trim().length > 0 && 
    formData.email.trim().length > 0 && 
    formData.password.length > 0 && 
    formData.confirmPassword.length > 0 &&
    formData.password === formData.confirmPassword &&
    formData.agreeToTerms === true && 
    formData.agreeToPrivacy === true;

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