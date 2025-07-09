import styled from "styled-components";

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
      case 'sm':
        return `height: 2.25rem;`;
      case 'lg':
        return `height: 3rem;`;
      default:
        return `height: 2.5rem;`;
    }
  }}
`;

export const StyledInput = styled.input.withConfig({
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
  border: 2px solid ${({ theme }) => theme.colors.border.medium};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  color: ${({ theme }) => theme.colors.text.primary};
  background: ${({ theme }) => theme.colors.background.primary};
  transition: all 0.2s ease-in-out;

  ${({ size, theme }) => {
    switch (size) {
      case 'sm':
        return `
          padding: ${theme.spacing[2]} ${theme.spacing[4]};
          height: 2.25rem;
        `;
      case 'lg':
        return `
          padding: ${theme.spacing[4]} ${theme.spacing[4]};
          height: 3rem;
          font-size: ${theme.typography.fontSize.base};
        `;
      default:
        return `
          padding: ${theme.spacing[2]} ${theme.spacing[4]};
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
    color: ${({ theme }) => theme.colors.text.tertiary};
  }

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary[500]};
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
  }

  &:disabled {
    background: ${({ theme }) => theme.colors.background.secondary};
    color: ${({ theme }) => theme.colors.text.tertiary};
    cursor: not-allowed;
  }

  &:read-only {
    background: ${({ theme }) => theme.colors.background.secondary};
  }

  /* Error state */
  ${({ hasError, theme }) =>
    hasError &&
    `
    border-color: ${theme.colors.error};
    
    &:focus {
      border-color: ${theme.colors.error};
      box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1);
    }
  `}

  /* Success state */
  ${({ hasSuccess, theme }) =>
    hasSuccess &&
    `
    border-color: ${theme.colors.success};
    
    &:focus {
      border-color: ${theme.colors.success};
      box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.1);
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
