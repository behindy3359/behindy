import React from 'react';
import styled, { css } from 'styled-components';
import { motion } from 'framer-motion';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  fullWidth?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
}

const buttonVariants = {
  primary: css`
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    border: none;
    box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
    
    &:hover:not(:disabled) {
      background: linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%);
      box-shadow: 0 6px 20px rgba(102, 126, 234, 0.6);
      transform: translateY(-2px);
    }
  `,
  
  secondary: css`
    background: linear-gradient(135deg, #36d1dc 0%, #5b86e5 100%);
    color: white;
    border: none;
    box-shadow: 0 4px 15px rgba(54, 209, 220, 0.4);
    
    &:hover:not(:disabled) {
      background: linear-gradient(135deg, #2bc4cf 0%, #4e7bd3 100%);
      box-shadow: 0 6px 20px rgba(54, 209, 220, 0.6);
      transform: translateY(-2px);
    }
  `,
  
  outline: css`
    background: transparent;
    color: #667eea;
    border: 2px solid #667eea;
    
    &:hover:not(:disabled) {
      background: #667eea;
      color: white;
      transform: translateY(-1px);
    }
  `,
  
  ghost: css`
    background: transparent;
    color: #6b7280;
    border: none;
    
    &:hover:not(:disabled) {
      background: rgba(107, 114, 128, 0.1);
      color: #374151;
    }
  `,
  
  danger: css`
    background: linear-gradient(135deg, #ff6b6b 0%, #ee5a52 100%);
    color: white;
    border: none;
    box-shadow: 0 4px 15px rgba(255, 107, 107, 0.4);
    
    &:hover:not(:disabled) {
      background: linear-gradient(135deg, #ff5252 0%, #dc4747 100%);
      box-shadow: 0 6px 20px rgba(255, 107, 107, 0.6);
      transform: translateY(-2px);
    }
  `
};

// 버튼 크기별 스타일
const buttonSizes = {
  sm: css`
    padding: 8px 16px;
    font-size: 14px;
    min-height: 36px;
  `,
  
  md: css`
    padding: 12px 24px;
    font-size: 16px;
    min-height: 44px;
  `,
  
  lg: css`
    padding: 16px 32px;
    font-size: 18px;
    min-height: 52px;
  `
};

const StyledButton = styled(motion.button)<ButtonProps>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  border-radius: 12px;
  font-weight: 600;
  font-family: inherit;
  cursor: pointer;
  transition: all 0.2s ease;
  position: relative;
  overflow: hidden;
  
  ${({ variant = 'primary' }) => buttonVariants[variant]}
  ${({ size = 'md' }) => buttonSizes[size]}
  ${({ fullWidth }) => fullWidth && css`width: 100%;`}
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none !important;
  }
  
  &:focus {
    outline: none;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.3);
  }
  
  /* 로딩 상태일 때 아이콘 숨기기 */
  ${({ isLoading }) => isLoading && css`
    color: transparent;
  `}
`;

const LoadingSpinner = styled.div`
  position: absolute;
  width: 20px;
  height: 20px;
  border: 2px solid transparent;
  border-top: 2px solid currentColor;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

const IconWrapper = styled.span<{ position: 'left' | 'right' }>`
  display: flex;
  align-items: center;
  order: ${({ position }) => position === 'right' ? 1 : -1};
`;

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  fullWidth = false,
  icon,
  iconPosition = 'left',
  disabled,
  ...props
}) => {
  return (
    <StyledButton
      variant={variant}
      size={size}
      fullWidth={fullWidth}
      isLoading={isLoading}
      disabled={disabled || isLoading}
      whileTap={{ scale: disabled || isLoading ? 1 : 0.98 }}
      {...props}
    >
      {isLoading && <LoadingSpinner />}
      
      {icon && !isLoading && (
        <IconWrapper position={iconPosition}>
          {icon}
        </IconWrapper>
      )}
      
      {children}
    </StyledButton>
  );
};

// 기본 export
export default Button;