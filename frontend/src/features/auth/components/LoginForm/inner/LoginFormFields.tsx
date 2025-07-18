import React, { useState } from 'react';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { Input } from '@/shared/components/ui/input/Input';
import { DemoLoginSection } from './DemoLoginSection';
import {
  OptionsContainer,
  RememberMeWrapper,
  ForgotPasswordLink,
  PasswordToggleButton
} from '../styles';
import type { LoginFormFieldsProps } from '../../../types/types';
import { BasicFullWidthContainer } from '@/shared/styles/commonContainers';
import { CommonWrapper } from '@/shared/styles/commonStyles';

export const LoginFormFields: React.FC<LoginFormFieldsProps> = ({
  formData,
  errors,
  onChange,
  onBlur,
  disabled = false,
  showDemoLogin = true,
  onDemoLogin,
}) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <CommonWrapper>
      {showDemoLogin && onDemoLogin && (
        <DemoLoginSection 
          onDemoLogin={onDemoLogin}
          disabled={disabled}
        />
      )}

      <BasicFullWidthContainer
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
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
          autoFocus
        />
      </BasicFullWidthContainer>

      <BasicFullWidthContainer
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
      >
        <Input
          type={showPassword ? 'text' : 'password'}
          label="비밀번호"
          placeholder="비밀번호를 입력하세요"
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
          autoComplete="current-password"
        />
      </BasicFullWidthContainer>

      <OptionsContainer
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.2 }}
      >
        <RememberMeWrapper>
          <input
            type="checkbox"
            checked={formData.rememberMe}
            onChange={(e) => onChange('rememberMe', e.target.checked)}
            disabled={disabled}
          />
          <span>로그인 상태 유지</span>
        </RememberMeWrapper>

        <ForgotPasswordLink
          type="button"
          onClick={() => {
            const event = new CustomEvent('navigate-to-forgot-password');
            window.dispatchEvent(event);
          }}
          disabled={disabled}
        >
          비밀번호를 잊으셨나요?
        </ForgotPasswordLink>
      </OptionsContainer>
    </CommonWrapper>
  );
};