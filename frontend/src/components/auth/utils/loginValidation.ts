import { validators } from '@/utils/common/validation';
import type { LoginFormData, LoginFormErrors } from '../types';

interface FieldValidationResult {
  isValid: boolean;
  message?: string;
}

interface FormValidationResult {
  isValid: boolean;
  errors: LoginFormErrors;
}

export const validateLoginForm = {
  // 개별 필드 검증
  field: (
    field: keyof LoginFormData, 
    value: string | boolean
  ): FieldValidationResult => {
    switch (field) {
      case 'email':
        if (!value || (value as string).trim() === '') {
          return { isValid: false, message: '이메일을 입력해주세요.' };
        }
        return validators.email(value as string);
        
      case 'password':
        if (!value || (value as string).trim() === '') {
          return { isValid: false, message: '비밀번호를 입력해주세요.' };
        }
        // 로그인시에는 비밀번호 강도 검사 안함
        return { isValid: true };
        
      case 'rememberMe':
        // 선택사항이므로 항상 유효
        return { isValid: true };
        
      default:
        return { isValid: true };
    }
  },

  // 전체 폼 검증
  all: (formData: LoginFormData): FormValidationResult => {
    const errors: LoginFormErrors = {};
    let isValid = true;

    // 이메일 검증
    const emailValidation = validateLoginForm.field('email', formData.email);
    if (!emailValidation.isValid) {
      errors.email = emailValidation.message;
      isValid = false;
    }

    // 비밀번호 검증
    const passwordValidation = validateLoginForm.field('password', formData.password);
    if (!passwordValidation.isValid) {
      errors.password = passwordValidation.message;
      isValid = false;
    }

    return { isValid, errors };
  },

  // 필수 필드 검증 (간단 체크)
  required: (formData: LoginFormData): boolean => {
    return !!(formData.email.trim() && formData.password);
  },
};