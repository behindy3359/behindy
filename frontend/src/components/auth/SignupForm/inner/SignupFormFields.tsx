import React, { useState } from 'react';
import { User, Mail, Lock, Eye, EyeOff, CheckCircle2, AlertCircle } from 'lucide-react';
import { Input } from '@/components/ui/input/Input';
import { PasswordStrengthMeter } from './PasswordStrengthMeter';
import { AgreementSection } from './AgreementSection';
import {
  FieldsContainer,
  FieldWrapper,
  PasswordToggleButton,
  PasswordMatchIndicator
} from '../styles';
import type { SignupFormFieldsProps } from '../../types';

export const SignupFormFields: React.FC<SignupFormFieldsProps> = ({
  formData,
  errors,
  onChange,
  onBlur,
  disabled = false,
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const isPasswordMatch = formData.password && 
                         formData.confirmPassword && 
                         formData.password === formData.confirmPassword;

  return (
    <FieldsContainer>
      {/* 이름 필드 */}
      <FieldWrapper
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Input
          type="text"
          label="이름"
          placeholder="홍길동"
          value={formData.name}
          onChange={(e) => onChange('name', e.target.value)}
          onBlur={() => onBlur('name')}
          leftIcon={<User size={20} />}
          error={errors.name}
          disabled={disabled}
          fullWidth
          autoComplete="name"
          autoFocus
        />
      </FieldWrapper>

      {/* 이메일 필드 */}
      <FieldWrapper
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
      >
        <Input
          type="email"
          label="이메일"
          placeholder="your.email@example.com"
          value={formData.email}
          onChange={(e) => onChange('email', e.target.value)}
          onBlur={() => onBlur('email')}
          leftIcon={<Mail size={20} />}
          error={errors.email}
          disabled={disabled}
          fullWidth
          autoComplete="email"
        />
      </FieldWrapper>

      {/* 비밀번호 필드 */}
      <FieldWrapper
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.2 }}
      >
        <Input
          type={showPassword ? 'text' : 'password'}
          label="비밀번호"
          placeholder="안전한 비밀번호를 입력하세요"
          value={formData.password}
          onChange={(e) => onChange('password', e.target.value)}
          onBlur={() => onBlur('password')}
          leftIcon={<Lock size={20} />}
          rightIcon={
            <PasswordToggleButton
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              disabled={disabled}
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </PasswordToggleButton>
          }
          error={errors.password}
          disabled={disabled}
          fullWidth
          autoComplete="new-password"
        />
        
        {/* 비밀번호 강도 미터 */}
        {formData.password && (
          <PasswordStrengthMeter 
            password={formData.password}
            className="mt-2"
          />
        )}
      </FieldWrapper>

      {/* 비밀번호 확인 필드 */}
      <FieldWrapper
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.3 }}
      >
        <Input
          type={showConfirmPassword ? 'text' : 'password'}
          label="비밀번호 확인"
          placeholder="비밀번호를 다시 입력하세요"
          value={formData.confirmPassword}
          onChange={(e) => onChange('confirmPassword', e.target.value)}
          onBlur={() => onBlur('confirmPassword')}
          leftIcon={<Lock size={20} />}
          rightIcon={
            <PasswordToggleButton
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              disabled={disabled}
            >
              {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </PasswordToggleButton>
          }
          error={errors.confirmPassword}
          disabled={disabled}
          fullWidth
          autoComplete="new-password"
        />
        
        {/* 비밀번호 일치 표시 */}
        {formData.confirmPassword && (
          <PasswordMatchIndicator
            $isMatch={!!isPasswordMatch}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            {isPasswordMatch ? (
              <CheckCircle2 size={16} />
            ) : (
              <AlertCircle size={16} />
            )}
            <span>
              {isPasswordMatch ? '비밀번호가 일치합니다' : '비밀번호가 일치하지 않습니다'}
            </span>
          </PasswordMatchIndicator>
        )}
      </FieldWrapper>

      {/* 약관 동의 섹션 */}
      <FieldWrapper
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.4 }}
      >
        <AgreementSection
          agreements={{
            terms: formData.agreeToTerms,
            privacy: formData.agreeToPrivacy,
            marketing: formData.marketingOptIn,
          }}
          errors={{
            agreeToTerms: errors.agreeToTerms,
            agreeToPrivacy: errors.agreeToPrivacy,
          }}
          onChange={(field, value) => {
            if (field === 'agreeToTerms' || field === 'agreeToPrivacy') {
              onChange(field, value);
            } else if (field === 'marketingOptIn') {
              onChange('marketingOptIn', value);
            }
          }}
          disabled={disabled}
        />
      </FieldWrapper>
    </FieldsContainer>
  );
};