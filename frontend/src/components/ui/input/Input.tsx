"use client";

import React, { useState, forwardRef } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { Eye, EyeOff, AlertCircle, CheckCircle2 } from 'lucide-react';

// ================================================================
// Types
// ================================================================

export interface InputProps {
  type?: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url';
  placeholder?: string;
  value?: string;
  defaultValue?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
  onFocus?: (e: React.FocusEvent<HTMLInputElement>) => void;
  disabled?: boolean;
  readOnly?: boolean;
  required?: boolean;
  autoComplete?: string;
  autoFocus?: boolean;
  name?: string;
  id?: string;
  className?: string;
  label?: string;
  helperText?: string;
  error?: string | boolean;
  success?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

// ================================================================
// Styled Components (props 필터링 추가)
// ================================================================

const InputWrapper = styled.div<{ $fullWidth?: boolean }>`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  width: ${({ $fullWidth }) => ($fullWidth ? '100%' : 'auto')};
`;

const Label = styled.label`
  font-size: 0.875rem;
  font-weight: 600;
  color: #374151;
  margin-bottom: 0.25rem;
`;

const InputContainer = styled.div.withConfig({
  shouldForwardProp: (prop) => 
    !['hasError', 'hasSuccess', 'size'].includes(prop)
})<{ hasError?: boolean; hasSuccess?: boolean; size?: string }>`
  position: relative;
  display: flex;
  align-items: center;
  
  ${({ size }) => {
    switch (size) {
      case 'sm':
        return `height: 2.25rem;`;
      case 'lg':
        return `height: 3rem;`;
      default:
        return `height: 2.5rem;`;
    }
  }}
`;

const StyledInput = styled.input.withConfig({
  shouldForwardProp: (prop) => 
    !['hasError', 'hasSuccess', 'hasLeftIcon', 'hasRightIcon', 'size'].includes(prop)
})<{ 
  hasError?: boolean; 
  hasSuccess?: boolean; 
  hasLeftIcon?: boolean; 
  hasRightIcon?: boolean; 
  size?: string;
}>`
  width: 100%;
  border: 2px solid #e5e7eb;
  border-radius: 8px;
  font-size: 0.875rem;
  color: #111827;
  background: #ffffff;
  transition: all 0.2s ease-in-out;

  ${({ size }) => {
    switch (size) {
      case 'sm':
        return `
          padding: 0.5rem 0.75rem;
          height: 2.25rem;
        `;
      case 'lg':
        return `
          padding: 0.875rem 1rem;
          height: 3rem;
          font-size: 1rem;
        `;
      default:
        return `
          padding: 0.625rem 0.875rem;
          height: 2.5rem;
        `;
    }
  }}

  ${({ hasLeftIcon, size }) => {
    if (hasLeftIcon) {
      const padding = size === 'lg' ? '2.5rem' : size === 'sm' ? '2rem' : '2.25rem';
      return `padding-left: ${padding};`;
    }
    return '';
  }}

  ${({ hasRightIcon, size }) => {
    if (hasRightIcon) {
      const padding = size === 'lg' ? '2.5rem' : size === 'sm' ? '2rem' : '2.25rem';
      return `padding-right: ${padding};`;
    }
    return '';
  }}

  &::placeholder {
    color: #9ca3af;
  }

  &:focus {
    outline: none;
    border-color: #667eea;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
  }

  &:disabled {
    background: #f9fafb;
    color: #9ca3af;
    cursor: not-allowed;
  }

  &:read-only {
    background: #f9fafb;
  }

  ${({ hasError }) =>
    hasError &&
    `
    border-color: #ef4444;
    
    &:focus {
      border-color: #ef4444;
      box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1);
    }
  `}

  ${({ hasSuccess }) =>
    hasSuccess &&
    `
    border-color: #10b981;
    
    &:focus {
      border-color: #10b981;
      box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.1);
    }
  `}
`;

const IconWrapper = styled.div<{ position: 'left' | 'right'; size?: string }>`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #6b7280;
  pointer-events: none;
  z-index: 1;

  ${({ position, size }) => {
    const offset = size === 'lg' ? '0.875rem' : size === 'sm' ? '0.625rem' : '0.75rem';
    return position === 'left' ? `left: ${offset};` : `right: ${offset};`;
  }}

  svg {
    width: ${({ size }) => (size === 'lg' ? '1.25rem' : '1rem')};
    height: ${({ size }) => (size === 'lg' ? '1.25rem' : '1rem')};
  }
`;

const ToggleButton = styled.button<{ size?: string }>`
  position: absolute;
  right: ${({ size }) => (size === 'lg' ? '0.875rem' : size === 'sm' ? '0.625rem' : '0.75rem')};
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: #6b7280;
  cursor: pointer;
  padding: 0.25rem;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: color 0.2s ease;

  &:hover {
    color: #374151;
  }

  &:focus {
    outline: none;
    color: #667eea;
  }

  svg {
    width: ${({ size }) => (size === 'lg' ? '1.25rem' : '1rem')};
    height: ${({ size }) => (size === 'lg' ? '1.25rem' : '1rem')};
  }
`;

const HelperText = styled.div<{ hasError?: boolean; hasSuccess?: boolean }>`
  font-size: 0.75rem;
  color: #6b7280;
  display: flex;
  align-items: center;
  gap: 0.25rem;

  ${({ hasError }) =>
    hasError &&
    `
    color: #ef4444;
  `}

  ${({ hasSuccess }) =>
    hasSuccess &&
    `
    color: #10b981;
  `}

  svg {
    width: 0.875rem;
    height: 0.875rem;
  }
`;

// ================================================================
// Input Component
// ================================================================

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      type = 'text',
      placeholder,
      value,
      defaultValue,
      onChange,
      onBlur,
      onFocus,
      disabled = false,
      readOnly = false,
      required = false,
      autoComplete,
      autoFocus = false,
      name,
      id,
      className,
      label,
      helperText,
      error,
      success = false,
      leftIcon,
      rightIcon,
      fullWidth = false,
      size = 'md',
      ...rest
    },
    ref
  ) => {
    const [showPassword, setShowPassword] = useState(false);
    const [isFocused, setIsFocused] = useState(false);

    const isPassword = type === 'password';
    const hasError = Boolean(error);
    const hasSuccess = success && !hasError;
    const hasLeftIcon = Boolean(leftIcon);
    const hasRightIcon = Boolean(rightIcon) || isPassword;

    const inputType = isPassword && showPassword ? 'text' : type;

    const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
      setIsFocused(true);
      onFocus?.(e);
    };

    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
      setIsFocused(false);
      onBlur?.(e);
    };

    const togglePasswordVisibility = () => {
      setShowPassword(!showPassword);
    };

    return (
      <InputWrapper $fullWidth={fullWidth} className={className}>
        {label && (
          <Label htmlFor={id}>
            {label}
            {required && <span style={{ color: '#ef4444' }}> *</span>}
          </Label>
        )}

        <InputContainer hasError={hasError} hasSuccess={hasSuccess} size={size}>
          {leftIcon && (
            <IconWrapper position="left" size={size}>
              {leftIcon}
            </IconWrapper>
          )}

          <StyledInput
            ref={ref}
            type={inputType}
            placeholder={placeholder}
            value={value}
            defaultValue={defaultValue}
            onChange={onChange}
            onFocus={handleFocus}
            onBlur={handleBlur}
            disabled={disabled}
            readOnly={readOnly}
            required={required}
            autoComplete={autoComplete}
            autoFocus={autoFocus}
            name={name}
            id={id}
            hasError={hasError}
            hasSuccess={hasSuccess}
            hasLeftIcon={hasLeftIcon}
            hasRightIcon={hasRightIcon}
            size={size}
            {...rest}
          />

          {isPassword && (
            <ToggleButton
              type="button"
              onClick={togglePasswordVisibility}
              size={size}
              tabIndex={-1}
            >
              {showPassword ? <EyeOff /> : <Eye />}
            </ToggleButton>
          )}

          {!isPassword && rightIcon && (
            <IconWrapper position="right" size={size}>
              {rightIcon}
            </IconWrapper>
          )}
        </InputContainer>

        {(helperText || error) && (
          <HelperText hasError={hasError} hasSuccess={hasSuccess}>
            {hasError && <AlertCircle />}
            {hasSuccess && <CheckCircle2 />}
            {hasError ? (typeof error === 'string' ? error : '오류가 발생했습니다.') : helperText}
          </HelperText>
        )}
      </InputWrapper>
    );
  }
);

Input.displayName = 'Input';

export default Input;