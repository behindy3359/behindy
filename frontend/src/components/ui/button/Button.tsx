"use client";

import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';

// ================================================================
// Types
// ================================================================

export interface ButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'destructive';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  disabled?: boolean;
  fullWidth?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  type?: 'button' | 'submit' | 'reset';
  className?: string;
  id?: string;
}

// ================================================================
// Styled Components (props 필터링 추가)
// ================================================================

const StyledButton = styled(motion.button).withConfig({
  // DOM으로 전달하지 않을 props 필터링
  shouldForwardProp: (prop) => 
    !['variant', 'size', 'isLoading', 'fullWidth', 'leftIcon', 'rightIcon'].includes(prop)
})<ButtonProps>`
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  font-weight: 600;
  text-align: center;
  white-space: nowrap;
  border-radius: 8px;
  border: 2px solid transparent;
  cursor: pointer;
  transition: all 0.2s ease-in-out;
  text-decoration: none;
  font-family: inherit;
  
  /* Size variants */
  ${({ size }) => {
    switch (size) {
      case 'sm':
        return `
          padding: 0.5rem 1rem;
          font-size: 0.875rem;
          line-height: 1.25rem;
        `;
      case 'lg':
        return `
          padding: 0.75rem 2rem;
          font-size: 1rem;
          line-height: 1.5rem;
        `;
      default:
        return `
          padding: 0.625rem 1.5rem;
          font-size: 0.875rem;
          line-height: 1.25rem;
        `;
    }
  }}

  /* Color variants */
  ${({ variant }) => {
    switch (variant) {
      case 'primary':
        return `
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          box-shadow: 0 4px 14px 0 rgba(102, 126, 234, 0.3);
          
          &:hover:not(:disabled) {
            transform: translateY(-2px);
            box-shadow: 0 6px 20px 0 rgba(102, 126, 234, 0.4);
          }
          
          &:active:not(:disabled) {
            transform: translateY(0);
            box-shadow: 0 2px 8px 0 rgba(102, 126, 234, 0.3);
          }
        `;
      case 'secondary':
        return `
          background: #f8fafc;
          color: #475569;
          border-color: #e2e8f0;
          
          &:hover:not(:disabled) {
            background: #f1f5f9;
            border-color: #cbd5e1;
          }
          
          &:active:not(:disabled) {
            background: #e2e8f0;
          }
        `;
      case 'outline':
        return `
          background: transparent;
          color: #667eea;
          border-color: #667eea;
          
          &:hover:not(:disabled) {
            background: rgba(102, 126, 234, 0.1);
            color: #5a67d8;
            border-color: #5a67d8;
          }
          
          &:active:not(:disabled) {
            background: rgba(102, 126, 234, 0.2);
          }
        `;
      case 'ghost':
        return `
          background: transparent;
          color: #64748b;
          
          &:hover:not(:disabled) {
            background: #f8fafc;
            color: #475569;
          }
          
          &:active:not(:disabled) {
            background: #f1f5f9;
          }
        `;
      case 'destructive':
        return `
          background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
          color: white;
          box-shadow: 0 4px 14px 0 rgba(239, 68, 68, 0.3);
          
          &:hover:not(:disabled) {
            transform: translateY(-2px);
            box-shadow: 0 6px 20px 0 rgba(239, 68, 68, 0.4);
          }
          
          &:active:not(:disabled) {
            transform: translateY(0);
            box-shadow: 0 2px 8px 0 rgba(239, 68, 68, 0.3);
          }
        `;
      default:
        return `
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          box-shadow: 0 4px 14px 0 rgba(102, 126, 234, 0.3);
          
          &:hover:not(:disabled) {
            transform: translateY(-2px);
            box-shadow: 0 6px 20px 0 rgba(102, 126, 234, 0.4);
          }
          
          &:active:not(:disabled) {
            transform: translateY(0);
            box-shadow: 0 2px 8px 0 rgba(102, 126, 234, 0.3);
          }
        `;
    }
  }}

  /* Full width */
  ${({ fullWidth }) => fullWidth && `
    width: 100%;
  `}

  /* Disabled state */
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none !important;
    box-shadow: none !important;
  }

  /* Loading state */
  ${({ isLoading }) => isLoading && `
    cursor: wait;
    
    .button-content {
      opacity: 0.7;
    }
  `}
`;

const ButtonContent = styled.span`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const LoadingSpinner = styled.div`
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: center;
`;

// ================================================================
// Button Component
// ================================================================

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