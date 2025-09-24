"use client";

import React, { useState, forwardRef } from 'react';
import { Eye, EyeOff, AlertCircle, CheckCircle2 } from 'lucide-react';
import { InputProps } from './types';
import { HelperText, IconWrapper, InputContainer, InputWrapper, Label, StyledInput, ToggleButton } from './styles';

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      type = 'text',
      placeholder,
      value,
      defaultValue,
      onChange,
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
      maxLength,
      minLength,
      ...rest
    },
    ref
  ) => {
    const [showPassword, setShowPassword] = useState(false);

    const isPassword = type === 'password';
    const hasError = Boolean(error);
    const hasSuccess = success && !hasError;
    const hasLeftIcon = Boolean(leftIcon);
    const hasRightIcon = Boolean(rightIcon) || isPassword;

    const inputType = isPassword && showPassword ? 'text' : type;

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
            maxLength={maxLength}
            minLength={minLength}
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