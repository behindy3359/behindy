import React, { useState } from 'react';
import { Mail, Lock, Eye, EyeOff, Info } from 'lucide-react';
import { Input } from '@/shared/components/ui/input/Input';
import { DemoLoginSection } from './DemoLoginSection';
import {
  OptionsContainer,
  ForgotPasswordLink,
  PasswordToggleButton
} from '../styles';
import type { LoginFormFieldsProps } from '../../../types/types';
import { BasicFullWidthContainer } from '@/shared/styles/commonContainers';
import { CommonWrapper } from '@/shared/styles/commonStyles';
import { useAuthLayout } from '../../../contexts/AuthLayoutContext';
import styled from 'styled-components';

const PortfolioInfoBox = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 16px;
  background: linear-gradient(to right, #eff6ff, #eef2ff);
  border: 1px solid #bfdbfe;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  color: #1e40af;
  cursor: pointer;
  transition: all 0.2s;
  margin-top: 12px;

  &:hover {
    background: linear-gradient(to right, #dbeafe, #e0e7ff);
    border-color: #93c5fd;
    transform: translateY(-1px);
  }

  svg {
    flex-shrink: 0;
  }

  span {
    flex: 1;
  }
`;

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
  const { openWarningModal } = useAuthLayout();

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

      <OptionsContainer>
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

      <PortfolioInfoBox onClick={openWarningModal}>
        <Info size={16} />
        <span>
          포트폴리오 프로젝트임을 이해하고, 실제 개인정보를 사용하지 않겠습니다
        </span>
      </PortfolioInfoBox>
    </CommonWrapper>
  );
};