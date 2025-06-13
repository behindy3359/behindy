// src/components/ui/Input/Input.tsx
import React, { forwardRef, useState } from 'react';
import styled, { css } from 'styled-components';
import { Eye, EyeOff, AlertCircle, CheckCircle } from 'lucide-react';

export interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  label?: string;
  error?: string;
  success?: string;
  helperText?: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'filled' | 'outline';
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  isLoading?: boolean;
  fullWidth?: boolean;
}

// Input 크기별 스타일
const inputSizes = {
  sm: css`
    padding: 8px 12px;
    font-size: 14px;
    min-height: 36px;
  `,
  
  md: css`
    padding: 12px 16px;
    font-size: 16px;
    min-height: 44px;
  `,
  
  lg: css`
    padding: 16px 20px;
    font-size: 18px;
    min-height: 52px;
  `
};

// Input 변형별 스타일
const inputVariants = {
  default: css`
    background: white;
    border: 2px solid #e5e7eb;
    
    &:focus {
      border-color: #667eea;
      box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
    }
  `,
  
  filled: css`
    background: #f9fafb;
    border: 2px solid transparent;
    
    &:focus {
      background: white;
      border-color: #667eea;
      box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
    }
  `,
  
  outline: css`
    background: transparent;
    border: 2px solid #d1d5db;
    
    &:focus {
      border-color: #667eea;
      box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
    }
  `
};

// 스타일드 컴포넌트용 타입
interface StyledInputProps {
  $size: InputProps['size'];
  $variant: InputProps['variant'];
  $hasLeftIcon: boolean;
  $hasRightIcon: boolean;
  $hasError: boolean;
  $hasSuccess: boolean;
}

const InputWrapper = styled.div<{ $fullWidth?: boolean }>`
  display: flex;
  flex-direction: column;
  gap: 6px;
  width: ${({ $fullWidth }) => $fullWidth ? '100%' : 'auto'};
`;

const Label = styled.label`
  font-size: 14px;
  font-weight: 600;
  color: #374151;
  margin-bottom: 2px;
`;

const InputContainer = styled.div`
  position: relative;
  display: flex;
  align-items: center;
`;

const StyledInput = styled.input<StyledInputProps>`
  width: 100%;
  border-radius: 12px;
  font-family: inherit;
  transition: all 0.2s ease;
  outline: none;
  
  ${({ $size = 'md' }) => inputSizes[$size]}
  ${({ $variant = 'default' }) => inputVariants[$variant]}
  
  ${({ $hasLeftIcon }) => $hasLeftIcon && css`
    padding-left: 44px;
  `}
  
  ${({ $hasRightIcon }) => $hasRightIcon && css`
    padding-right: 44px;
  `}

  ${({ $hasError }) => $hasError && css`
    border-color: #ef4444 !important;
    
    &:focus {
      border-color: #ef4444 !important;
      box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1) !important;
    }
  `}

  ${({ $hasSuccess }) => $hasSuccess && css`
    border-color: #10b981 !important;
    
    &:focus {
      border-color: #10b981 !important;
      box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.1) !important;
    }
  `}
  
  &::placeholder {
    color: #9ca3af;
  }
  
  &:disabled {
    background: #f3f4f6;
    color: #9ca3af;
    cursor: not-allowed;
  }

  &:focus {
    transform: translateY(-1px);
  }
`;

const IconWrapper = styled.div<{ $position: 'left' | 'right' }>`
  position: absolute;
  ${({ $position }) => $position}: 12px;
  display: flex;
  align-items: center;
  color: #9ca3af;
  z-index: 1;
  pointer-events: none;
  
  svg {
    width: 20px;
    height: 20px;
  }
`;

const PasswordToggle = styled.button`
  position: absolute;
  right: 12px;
  background: none;
  border: none;
  cursor: pointer;
  color: #9ca3af;
  display: flex;
  align-items: center;
  padding: 4px;
  border-radius: 4px;
  transition: color 0.2s ease;
  z-index: 2;
  
  &:hover {
    color: #6b7280;
  }
  
  &:focus {
    outline: none;
    color: #6b7280;
  }
  
  svg {
    width: 20px;
    height: 20px;
  }
`;

const HelperText = styled.div<{ $variant: 'error' | 'success' | 'default' }>`
  font-size: 12px;
  display: flex;
  align-items: center;
  gap: 4px;
  
  ${({ $variant }) => {
    switch ($variant) {
      case 'error':
        return css`color: #ef4444;`;
      case 'success':
        return css`color: #10b981;`;
      default:
        return css`color: #6b7280;`;
    }
  }}
  
  svg {
    width: 14px;
    height: 14px;
  }
`;

const LoadingSpinner = styled.div`
  position: absolute;
  right: 12px;
  width: 16px;
  height: 16px;
  border: 2px solid #e5e7eb;
  border-top: 2px solid #667eea;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  z-index: 2;
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

export const Input = forwardRef<HTMLInputElement, InputProps>(({
  label,
  error,
  success,
  helperText,
  size = 'md',
  variant = 'default',
  leftIcon,
  rightIcon,
  isLoading = false,
  fullWidth = false,
  type = 'text',
  className,
  ...props
}, ref) => {
  const [showPassword, setShowPassword] = useState(false);
  
  const actualType = type === 'password' && showPassword ? 'text' : type;
  const hasError = Boolean(error);
  const hasSuccess = Boolean(success && !error);
  const hasRightIcon = Boolean(rightIcon) || type === 'password' || isLoading;

  return (
    <InputWrapper $fullWidth={fullWidth} className={className}>
      {label && (
        <Label htmlFor={props.id}>
          {label}
        </Label>
      )}
      
      <InputContainer>
        {leftIcon && (
          <IconWrapper $position="left">
            {leftIcon}
          </IconWrapper>
        )}
        
        <StyledInput
          ref={ref}
          type={actualType}
          $size={size}
          $variant={variant}
          $hasLeftIcon={Boolean(leftIcon)}
          $hasRightIcon={hasRightIcon}
          $hasError={hasError}
          $hasSuccess={hasSuccess}
          {...props}
        />
        
        {isLoading && <LoadingSpinner />}
        
        {!isLoading && type === 'password' && (
          <PasswordToggle
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            tabIndex={-1}
            aria-label={showPassword ? '비밀번호 숨기기' : '비밀번호 보기'}
          >
            {showPassword ? <EyeOff /> : <Eye />}
          </PasswordToggle>
        )}
        
        {!isLoading && type !== 'password' && rightIcon && (
          <IconWrapper $position="right">
            {rightIcon}
          </IconWrapper>
        )}
      </InputContainer>
      
      {(error || success || helperText) && (
        <HelperText $variant={hasError ? 'error' : hasSuccess ? 'success' : 'default'}>
          {hasError && <AlertCircle />}
          {hasSuccess && <CheckCircle />}
          {error || success || helperText}
        </HelperText>
      )}
    </InputWrapper>
  );
});

Input.displayName = 'Input';

export default Input;