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
  style?: React.CSSProperties;
}

// ================================================================
// Styled Components (색상 시스템 통합)
// ================================================================

const StyledButton = styled(motion.button).withConfig({
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
  border-radius: ${({ theme }) => theme.borderRadius.md};
  border: 2px solid transparent;
  cursor: pointer;
  transition: all 0.2s ease-in-out;
  text-decoration: none;
  font-family: inherit;
  
  /* Size variants */
  ${({ size, theme }) => {
    switch (size) {
      case 'sm':
        return `
          padding: ${theme.spacing[2]} ${theme.spacing[4]};
          font-size: ${theme.typography.fontSize.sm};
          line-height: 1.25;
        `;
      case 'lg':
        return `
          padding: ${theme.spacing[4]} ${theme.spacing[8]};
          font-size: ${theme.typography.fontSize.base};
          line-height: 1.5;
        `;
      default:
        return `
          padding: ${theme.spacing[2]} ${theme.spacing[6]};
          font-size: ${theme.typography.fontSize.sm};
          line-height: 1.25;
        `;
    }
  }}

  /* Color variants (theme 기반) */
  ${({ variant, theme }) => {
    switch (variant) {
      case 'primary':
        return `
          background: linear-gradient(135deg, ${theme.colors.primary[500]} 0%, ${theme.colors.secondary[500]} 100%);
          color: ${theme.colors.text.inverse};
          box-shadow: ${theme.shadows.button};
          
          &:hover:not(:disabled) {
            transform: translateY(-2px);
            box-shadow: ${theme.shadows.buttonHover};
            background: linear-gradient(135deg, ${theme.colors.primary[600]} 0%, ${theme.colors.secondary[600]} 100%);
          }
          
          &:active:not(:disabled) {
            transform: translateY(0);
            box-shadow: ${theme.shadows.button};
          }
        `;
      case 'secondary':
        return `
          background: ${theme.colors.background.secondary};
          color: ${theme.colors.text.secondary};
          border-color: ${theme.colors.border.medium};
          
          &:hover:not(:disabled) {
            background: ${theme.colors.background.tertiary};
            border-color: ${theme.colors.border.dark};
            color: ${theme.colors.text.primary};
          }
          
          &:active:not(:disabled) {
            background: ${theme.colors.border.medium};
          }
        `;
      case 'outline':
        return `
          background: transparent;
          color: ${theme.colors.primary[500]};
          border-color: ${theme.colors.primary[500]};
          
          &:hover:not(:disabled) {
            background: rgba(102, 126, 234, 0.1);
            color: ${theme.colors.primary[600]};
            border-color: ${theme.colors.primary[600]};
          }
          
          &:active:not(:disabled) {
            background: rgba(102, 126, 234, 0.2);
          }
        `;
      case 'ghost':
        return `
          background: transparent;
          color: ${theme.colors.text.secondary};
          
          &:hover:not(:disabled) {
            background: ${theme.colors.background.secondary};
            color: ${theme.colors.text.primary};
          }
          
          &:active:not(:disabled) {
            background: ${theme.colors.background.tertiary};
          }
        `;
      case 'destructive':
        return `
          background: linear-gradient(135deg, ${theme.colors.error} 0%, #dc2626 100%);
          color: ${theme.colors.text.inverse};
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
          background: linear-gradient(135deg, ${theme.colors.primary[500]} 0%, ${theme.colors.secondary[500]} 100%);
          color: ${theme.colors.text.inverse};
          box-shadow: ${theme.shadows.button};
          
          &:hover:not(:disabled) {
            transform: translateY(-2px);
            box-shadow: ${theme.shadows.buttonHover};
          }
          
          &:active:not(:disabled) {
            transform: translateY(0);
            box-shadow: ${theme.shadows.button};
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