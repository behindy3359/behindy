"use client";

import React from 'react';
import { Loader2 } from 'lucide-react';
import { ButtonProps } from './types';
import { ButtonContent, LoadingSpinner, StyledButton } from './styles';

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  disabled = false,
  fullWidth = false,
  leftIcon,
  rightIcon,
  onClick,
  type = 'button',
  className,
  id,
  ...rest
}) => {
  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (isLoading || disabled) {
      e.preventDefault();
      return;
    }
    onClick?.(e);
  };

  return (
    <StyledButton
      variant={variant}
      size={size}
      isLoading={isLoading}
      disabled={disabled || isLoading}
      fullWidth={fullWidth}
      onClick={handleClick}
      type={type}
      className={className}
      id={id}
      whileHover={disabled || isLoading ? {} : { scale: 1.02 }}
      whileTap={disabled || isLoading ? {} : { scale: 0.98 }}
      transition={{ duration: 0.1 }}
      {...rest}
    >
      {isLoading && (
        <LoadingSpinner>
          <Loader2 size={16} className="animate-spin" />
        </LoadingSpinner>
      )}
      
      <ButtonContent className="button-content">
        {leftIcon && <span>{leftIcon}</span>}
        {children}
        {rightIcon && <span>{rightIcon}</span>}
      </ButtonContent>
    </StyledButton>
  );
};

export default Button;