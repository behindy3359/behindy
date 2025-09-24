import { motion } from 'framer-motion';
import styled from 'styled-components';

// 버튼 베이스 인터페이스 - motion.button과 호환되도록 수정
interface BaseButtonProps {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'destructive';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  isLoading?: boolean;
  disabled?: boolean;
}

// BaseButton - motion.button을 확장하되 $ 접두사 사용하지 않음
export const BaseButton = styled(motion.button)<BaseButtonProps>`
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: ${({ theme }) => theme.spacing[2]};
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  text-align: center;
  white-space: nowrap;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  border: 2px solid transparent;
  cursor: pointer;
  transition: ${({ theme }) => theme.transition.normal};
  text-decoration: none;
  font-family: inherit;
  
  /* 크기 variants */
  ${({ size = 'md', theme }) => {
    const sizeConfig = theme.componentSpacing.button[size];
    return `
      padding: ${sizeConfig.padding};
      font-size: ${theme.typography.fontSize[size === 'lg' ? 'base' : 'sm']};
      gap: ${sizeConfig.gap};
    `;
  }}

  /* 색상 variants */
  ${({ variant = 'primary', theme }) => {
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
    }
  }}

  /* 전체 너비 */
  ${({ fullWidth }) => fullWidth && 'width: 100%;'}

  /* 비활성화 상태 */
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none !important;
    box-shadow: none !important;
  }

  /* 로딩 상태 */
  ${({ isLoading }) => isLoading && `
    cursor: wait;
    
    .button-content {
      opacity: 0.7;
    }
  `}
`;

// ButtonGroup - 버튼들을 그룹화
export const ButtonGroup = styled.div<{
  $direction?: 'horizontal' | 'vertical';
  $attached?: boolean;
  $gap?: keyof typeof import('../tokens/spacing').spacing;
}>`
  display: flex;
  flex-direction: ${({ $direction = 'horizontal' }) => 
    $direction === 'vertical' ? 'column' : 'row'
  };
  
  ${({ $attached, $gap, theme }) => {
    if ($attached) {
      return `
        button + button {
          margin-left: -2px;
          border-top-left-radius: 0;
          border-bottom-left-radius: 0;
        }
        
        button:first-child {
          border-top-right-radius: 0;
          border-bottom-right-radius: 0;
        }
        
        button:not(:first-child):not(:last-child) {
          border-radius: 0;
        }
        
        button:last-child {
          border-top-left-radius: 0;
          border-bottom-left-radius: 0;
        }
        
        button:focus {
          z-index: 1;
          position: relative;
        }
      `;
    } else {
      return `gap: ${theme.spacing[$gap || '2']};`;
    }
  }}
  
  @media (max-width: 768px) {
    ${({ $direction }) => $direction !== 'vertical' && `
      flex-direction: column;
      
      button {
        width: 100%;
      }
    `}
  }
`;

// IconButton - 아이콘만 있는 버튼
export const IconButton = styled(BaseButton)<{
  $round?: boolean;
}>`
  padding: ${({ size = 'md', theme }) => {
    switch (size) {
      case 'sm': return theme.spacing[2];
      case 'lg': return theme.spacing[4];
      default: return theme.spacing[3];
    }
  }};
  
  ${({ $round, theme }) => $round && `
    border-radius: 50%;
    aspect-ratio: 1;
  `}
  
  svg {
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
  }
`;

// FloatingActionButton - 플로팅 액션 버튼
export const FloatingActionButton = styled(IconButton).attrs({
  $variant: 'primary' as const,
  $round: true,
  $size: 'lg' as const,
})`
  position: fixed;
  bottom: ${({ theme }) => theme.spacing[6]};
  right: ${({ theme }) => theme.spacing[6]};
  z-index: ${({ theme }) => theme.zIndex.fixed};
  box-shadow: ${({ theme }) => theme.shadows.buttonHover};
  
  &:hover {
    transform: scale(1.1);
  }
  
  @media (max-width: 768px) {
    bottom: ${({ theme }) => theme.spacing[4]};
    right: ${({ theme }) => theme.spacing[4]};
  }
`;

// LoadingButton - 로딩 상태 표시가 있는 버튼
export const LoadingButton = styled(BaseButton)<{
  $loadingText?: string;
}>`
  .loading-spinner {
    width: 16px;
    height: 16px;
    border: 2px solid transparent;
    border-top: 2px solid currentColor;
    border-radius: 50%;
    animation: spin 1s linear infinite;
  }
  
  .button-content {
    display: flex;
    align-items: center;
    gap: ${({ theme }) => theme.spacing[2]};
  }
`;

// ToggleButton - 토글 가능한 버튼
export const ToggleButton = styled(BaseButton)<{
  $active?: boolean;
}>`
  ${({ $active, variant = 'outline', theme }) => {
    if ($active) {
      switch (variant) {
        case 'outline':
          return `
            background: ${theme.colors.primary[500]};
            color: ${theme.colors.text.inverse};
            border-color: ${theme.colors.primary[500]};
          `;
        case 'ghost':
          return `
            background: ${theme.colors.background.secondary};
            color: ${theme.colors.text.primary};
          `;
        default:
          return `
            background: ${theme.colors.primary[600]};
          `;
      }
    }
    return '';
  }}
`;

// LinkButton - 링크처럼 보이는 버튼
export const LinkButton = styled.button`
  background: none;
  border: none;
  color: ${({ theme }) => theme.colors.primary[500]};
  text-decoration: underline;
  text-decoration-style: dotted;
  text-underline-offset: 2px;
  cursor: pointer;
  font-size: inherit;
  font-family: inherit;
  transition: ${({ theme }) => theme.transition.fast};
  
  &:hover {
    color: ${({ theme }) => theme.colors.primary[600]};
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

// 게임 모드 전용 버튼
export const GameButton = styled(BaseButton)<{
  $gameVariant?: 'choice' | 'action' | 'danger';
}>`
  ${({ $gameVariant, theme }) => {
    if (!theme.gameColors) return '';
    
    switch ($gameVariant) {
      case 'choice':
        return `
          background: linear-gradient(135deg, ${theme.colors.game.choice} 0%, #1d4ed8 100%);
          color: ${theme.colors.text.inverse};
          
          &:hover:not(:disabled) {
            background: linear-gradient(135deg, #1d4ed8 0%, ${theme.colors.game.choice} 100%);
            box-shadow: 0 0 20px rgba(59, 130, 246, 0.4);
          }
        `;
      case 'action':
        return `
          background: linear-gradient(135deg, ${theme.colors.game.success} 0%, #059669 100%);
          color: ${theme.colors.text.inverse};
          
          &:hover:not(:disabled) {
            transform: translateY(-2px);
            box-shadow: 0 0 20px rgba(34, 197, 94, 0.4);
          }
        `;
      case 'danger':
        return `
          background: linear-gradient(135deg, ${theme.colors.game.danger} 0%, #991b1b 100%);
          color: ${theme.colors.text.inverse};
          
          &:hover:not(:disabled) {
            transform: translateY(-2px);
            box-shadow: 0 0 20px rgba(220, 38, 38, 0.4);
          }
        `;
      default:
        return '';
    }
  }}
`;
export const ButtonContent = styled.span`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[2]};
`;

export const ButtonSpinner = styled.div`
  width: 16px;
  height: 16px;
  border: 2px solid transparent;
  border-top: 2px solid currentColor;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;