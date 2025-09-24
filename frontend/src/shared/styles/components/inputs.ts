import styled from 'styled-components';

// 입력 컴포넌트 베이스 인터페이스
interface BaseInputProps {
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'filled' | 'flushed';
  error?: boolean;
  success?: boolean;
  fullWidth?: boolean;
}

// BaseInput - 모든 입력의 기본
export const BaseInput = styled.input<BaseInputProps>`
  width: ${({ fullWidth }) => fullWidth ? '100%' : 'auto'};
  border: 2px solid ${({ theme }) => theme.colors.border.medium};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  color: ${({ theme }) => theme.colors.text.primary};
  background: ${({ theme }) => theme.colors.background.primary};
  transition: ${({ theme }) => theme.transition.normal};
  font-family: inherit;

  /* 크기 variants */
  ${({ size = 'md', theme }) => {
    const sizeConfig = theme.componentSpacing.input[size];
    return `
      padding: ${sizeConfig.padding};
      height: ${sizeConfig.height};
      ${size === 'lg' ? `font-size: ${theme.typography.fontSize.base};` : ''}
    `;
  }}

  /* 스타일 variants */
  ${({ variant = 'default', theme }) => {
    switch (variant) {
      case 'filled':
        return `
          background: ${theme.colors.background.secondary};
          border-color: transparent;
          
          &:focus {
            background: ${theme.colors.background.primary};
            border-color: ${theme.colors.primary[500]};
          }
        `;
      case 'flushed':
        return `
          background: transparent;
          border: none;
          border-bottom: 2px solid ${theme.colors.border.medium};
          border-radius: 0;
          padding-left: 0;
          padding-right: 0;
          
          &:focus {
            border-bottom-color: ${theme.colors.primary[500]};
          }
        `;
      default:
        return '';
    }
  }}

  &::placeholder {
    color: ${({ theme }) => theme.colors.text.tertiary};
  }

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary[500]};
    box-shadow: ${({ theme }) => theme.shadows.focus};
  }

  &:disabled {
    background: ${({ theme }) => theme.colors.background.secondary};
    color: ${({ theme }) => theme.colors.text.tertiary};
    cursor: not-allowed;
    opacity: 0.6;
  }

  &:read-only {
    background: ${({ theme }) => theme.colors.background.secondary};
    cursor: default;
  }
`;

// InputWrapper - 입력 필드 래퍼
export const InputWrapper = styled.div<{ fullWidth?: boolean }>`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing[2]};
  width: ${({ fullWidth }) => fullWidth ? '100%' : 'auto'};
`;

// InputContainer - 아이콘과 입력을 감싸는 컨테이너
export const InputContainer = styled.div<{
  size?: 'sm' | 'md' | 'lg';
  error?: boolean;
  success?: boolean;
}>`
  position: relative;
  display: flex;
  align-items: center;
`;

// InputIcon - 입력 필드 아이콘
export const InputIcon = styled.div<{
  position: 'left' | 'right';
  size?: 'sm' | 'md' | 'lg';
}>`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${({ theme }) => theme.colors.text.secondary};
  pointer-events: none;
  z-index: 1;
`;

// BaseTextarea - 텍스트영역
export const BaseTextarea = styled.textarea<BaseInputProps>`
  width: ${({ fullWidth }) => fullWidth ? '100%' : 'auto'};
  min-height: 80px;
  resize: vertical;
  border: 2px solid ${({ theme }) => theme.colors.border.medium};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  padding: ${({ theme }) => theme.spacing[3]};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  color: ${({ theme }) => theme.colors.text.primary};
  background: ${({ theme }) => theme.colors.background.primary};
  font-family: inherit;
  line-height: ${({ theme }) => theme.typography.lineHeight.normal};
  transition: ${({ theme }) => theme.transition.normal};

  &::placeholder {
    color: ${({ theme }) => theme.colors.text.tertiary};
  }

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary[500]};
    box-shadow: ${({ theme }) => theme.shadows.focus};
  }

  &:disabled {
    background: ${({ theme }) => theme.colors.background.secondary};
    color: ${({ theme }) => theme.colors.text.tertiary};
    cursor: not-allowed;
    opacity: 0.6;
  }
`;

// BaseSelect - 선택박스
export const BaseSelect = styled.select<BaseInputProps>`
  width: ${({ fullWidth }) => fullWidth ? '100%' : 'auto'};
  border: 2px solid ${({ theme }) => theme.colors.border.medium};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  color: ${({ theme }) => theme.colors.text.primary};
  background: ${({ theme }) => theme.colors.background.primary};
  cursor: pointer;
  transition: ${({ theme }) => theme.transition.normal};

  /* 크기 variants */
  ${({ size = 'md', theme }) => {
    const sizeConfig = theme.componentSpacing.input[size];
    return `
      padding: ${sizeConfig.padding};
      height: ${sizeConfig.height};
      ${size === 'lg' ? `font-size: ${theme.typography.fontSize.base};` : ''}
    `;
  }}

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary[500]};
    box-shadow: ${({ theme }) => theme.shadows.focus};
  }

  &:disabled {
    background: ${({ theme }) => theme.colors.background.secondary};
    color: ${({ theme }) => theme.colors.text.tertiary};
    cursor: not-allowed;
    opacity: 0.6;
  }
`;

// Checkbox - 체크박스
export const BaseCheckbox = styled.input.attrs({ type: 'checkbox' })<{
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'switch';
}>`
  width: ${({ size = 'md' }) => {
    switch (size) {
      case 'sm': return '16px';
      case 'lg': return '24px';
      default: return '20px';
    }
  }};
  height: ${({ size = 'md' }) => {
    switch (size) {
      case 'sm': return '16px';
      case 'lg': return '24px';
      default: return '20px';
    }
  }};
  border: 2px solid ${({ theme }) => theme.colors.border.medium};
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  background: ${({ theme }) => theme.colors.background.primary};
  cursor: pointer;
  transition: ${({ theme }) => theme.transition.fast};
  appearance: none;
  margin: 0;
  
  &:checked {
    background-color: ${({ theme }) => theme.colors.primary[500]};
    border-color: ${({ theme }) => theme.colors.primary[500]};
    background-image: url("data:image/svg+xml,%3csvg viewBox='0 0 16 16' fill='white' xmlns='http://www.w3.org/2000/svg'%3e%3cpath d='m13.854 3.646-8 8-.5-.5 8-8 .5.5z'/%3e%3cpath d='m6.854 7.146-2-2-.5.5 2 2 .5-.5z'/%3e%3c/svg%3e");
    background-size: contain;
    background-repeat: no-repeat;
    background-position: center;
  }
  
  &:focus {
    outline: none;
    box-shadow: ${({ theme }) => theme.shadows.focus};
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

// Radio - 라디오 버튼
export const BaseRadio = styled.input.attrs({ type: 'radio' })<{
  size?: 'sm' | 'md' | 'lg';
}>`
  width: ${({ size = 'md' }) => {
    switch (size) {
      case 'sm': return '16px';
      case 'lg': return '24px';
      default: return '20px';
    }
  }};
  height: ${({ size = 'md' }) => {
    switch (size) {
      case 'sm': return '16px';
      case 'lg': return '24px';
      default: return '20px';
    }
  }};
  border: 2px solid ${({ theme }) => theme.colors.border.medium};
  border-radius: 50%;
  background: ${({ theme }) => theme.colors.background.primary};
  cursor: pointer;
  transition: ${({ theme }) => theme.transition.fast};
  appearance: none;
  margin: 0;
  
  &:checked {
    background-color: ${({ theme }) => theme.colors.primary[500]};
    border-color: ${({ theme }) => theme.colors.primary[500]};
    background-image: radial-gradient(circle, white 25%, transparent 25%);
  }
  
  &:focus {
    outline: none;
    box-shadow: ${({ theme }) => theme.shadows.focus};
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;