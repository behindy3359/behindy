import { motion } from "framer-motion";
import styled from "styled-components";
import { ButtonProps } from "./types";
import { 
  BaseButton,
  BaseInput
} from '@/shared/styles/components';

// StyledButton - BaseButton 재사용으로 대폭 간소화
export const StyledButton = styled(BaseButton).withConfig({
  shouldForwardProp: (prop) => 
    !['variant', 'size', 'isLoading', 'fullWidth', 'leftIcon', 'rightIcon'].includes(prop)
})<ButtonProps>`
  /* BaseButton의 모든 스타일을 상속받아 추가 스타일 최소화 */
  position: relative;
  
  /* 로딩 상태 추가 스타일 */
  ${({ isLoading }) => isLoading && `
    cursor: wait;
    
    .button-content {
      opacity: 0.7;
    }
  `}
`;

export const ButtonContent = styled.span`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

export const LoadingSpinner = styled.div`
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: center;
`;

// Input 스타일들도 BaseInput 기반으로 단순화
export const InputWrapper = styled.div<{ $fullWidth?: boolean }>`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing[2]};
  width: ${({ $fullWidth }) => ($fullWidth ? '100%' : 'auto')};
`;

export const Label = styled.label`
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text.primary};
  margin-bottom: ${({ theme }) => theme.spacing[1]};
`;

export const InputContainer = styled.div.withConfig({
  shouldForwardProp: (prop) => 
    !['hasError', 'hasSuccess', 'size'].includes(prop)
})<{ hasError?: boolean; hasSuccess?: boolean; size?: string }>`
  position: relative;
  display: flex;
  align-items: center;
  
  ${({ size }) => {
    switch (size) {
      case 'sm': return `height: 2.25rem;`;
      case 'lg': return `height: 3rem;`;
      default: return `height: 2.5rem;`;
    }
  }}
`;

// StyledInput - BaseInput 재사용으로 대폭 간소화
export const StyledInput = styled(BaseInput).withConfig({
  shouldForwardProp: (prop) => 
    !['hasError', 'hasSuccess', 'hasLeftIcon', 'hasRightIcon', 'size'].includes(prop)
})<{ 
  hasError?: boolean; 
  hasSuccess?: boolean; 
  hasLeftIcon?: boolean; 
  hasRightIcon?: boolean; 
  size?: string;
}>`
  /* BaseInput 스타일 상속, 추가 커스터마이징만 */
  
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

  /* 에러/성공 상태 오버라이드 */
  ${({ hasError, theme }) =>
    hasError &&
    `
    border-color: ${theme.colors.error} !important;
    
    &:focus {
      border-color: ${theme.colors.error} !important;
      box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1) !important;
    }
  `}

  ${({ hasSuccess, theme }) =>
    hasSuccess &&
    `
    border-color: ${theme.colors.success} !important;
    
    &:focus {
      border-color: ${theme.colors.success} !important;
      box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.1) !important;
    }
  `}
`;

export const IconWrapper = styled.div<{ position: 'left' | 'right'; size?: string }>`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${({ theme }) => theme.colors.text.secondary};
  pointer-events: none;
  z-index: 1;

  ${({ position, size, theme }) => {
    const offset = size === 'lg' ? theme.spacing[4] : 
                   size === 'sm' ? theme.spacing[2] : theme.spacing[4];
    return position === 'left' ? `left: ${offset};` : `right: ${offset};`;
  }}

  svg {
    width: ${({ size }) => (size === 'lg' ? '1.25rem' : '1rem')};
    height: ${({ size }) => (size === 'lg' ? '1.25rem' : '1rem')};
  }
`;

export const ToggleButton = styled.button<{ size?: string }>`
  position: absolute;
  right: ${({ size, theme }) => 
    size === 'lg' ? theme.spacing[4] : 
    size === 'sm' ? theme.spacing[2] : theme.spacing[4]};
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: ${({ theme }) => theme.colors.text.secondary};
  cursor: pointer;
  padding: ${({ theme }) => theme.spacing[1]};
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  display: flex;
  align-items: center;
  justify-content: center;
  transition: color 0.2s ease;

  &:hover {
    color: ${({ theme }) => theme.colors.text.primary};
  }

  &:focus {
    outline: none;
    color: ${({ theme }) => theme.colors.primary[500]};
  }

  svg {
    width: ${({ size }) => (size === 'lg' ? '1.25rem' : '1rem')};
    height: ${({ size }) => (size === 'lg' ? '1.25rem' : '1rem')};
  }
`;

export const HelperText = styled.div<{ hasError?: boolean; hasSuccess?: boolean }>`
  font-size: ${({ theme }) => theme.typography.fontSize.xs};
  color: ${({ theme }) => theme.colors.text.secondary};
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[1]};

  ${({ hasError, theme }) =>
    hasError &&
    `
    color: ${theme.colors.error};
  `}

  ${({ hasSuccess, theme }) =>
    hasSuccess &&
    `
    color: ${theme.colors.success};
  `}

  svg {
    width: 0.875rem;
    height: 0.875rem;
  }
`;