import { motion } from 'framer-motion';
import styled from 'styled-components';

// BaseContainer - 모든 컨테이너의 기본
const BaseContainer = styled.div<{
  $padding?: keyof typeof import('../tokens/spacing').spacing | 'none';
  $margin?: keyof typeof import('../tokens/spacing').spacing | 'none';
  $maxWidth?: keyof typeof import('./containers').containerSizes;
  $centered?: boolean;
}>`
  ${({ $padding, theme }) => 
    $padding && $padding !== 'none' && `padding: ${theme.spacing[$padding]};`
  }
  
  ${({ $margin, theme }) => 
    $margin && $margin !== 'none' && `margin: ${theme.spacing[$margin]} auto;`
  }
  
  ${({ $maxWidth }) => {
    switch ($maxWidth) {
      case 'sm': return 'max-width: 640px;';
      case 'md': return 'max-width: 768px;';
      case 'lg': return 'max-width: 900px;';
      case 'xl': return 'max-width: 1200px;';
      case 'full': return 'max-width: 100%;';
      default: return '';
    }
  }}
  
  ${({ $centered }) => $centered && 'margin-left: auto; margin-right: auto;'}
`;

// 컨테이너 크기 정의
export const containerSizes = {
  sm: '640px',
  md: '768px', 
  lg: '900px',
  xl: '1200px',
  full: '100%',
} as const;

// 메인 페이지 컨테이너
export const PageContainer = styled(BaseContainer).attrs({
  $maxWidth: 'lg' as const,
  $padding: 6 as const,
  $centered: true,
})`
  @media (max-width: 900px) {
    padding: ${({ theme }) => theme.spacing[4]};
  }
`;

// 카드 형태 컨테이너
export const BaseCard = styled(motion.div)<{
  $variant?: 'default' | 'elevated' | 'outlined' | 'ghost';
  $size?: 'sm' | 'md' | 'lg';
  $interactive?: boolean;
}>`
  background: ${({ theme }) => theme.colors.background.primary};
  border-radius: ${({ theme }) => theme.borderRadius.xl};
  overflow: hidden;
  transition: ${({ theme }) => theme.transition.normal};
  
  ${({ $variant, theme }) => {
    switch ($variant) {
      case 'elevated':
        return `
          border: 1px solid ${theme.colors.border.light};
          box-shadow: ${theme.shadows.card};
        `;
      case 'outlined':
        return `
          border: 2px solid ${theme.colors.border.medium};
        `;
      case 'ghost':
        return `
          background: transparent;
          border: none;
        `;
      default:
        return `
          border: 1px solid ${theme.colors.border.light};
          box-shadow: ${theme.shadows.card};
        `;
    }
  }}
  
  ${({ $size, theme }) => {
    switch ($size) {
      case 'sm':
        return `padding: ${theme.spacing[4]};`;
      case 'lg':
        return `padding: ${theme.spacing[8]};`;
      default:
        return `padding: ${theme.spacing[6]};`;
    }
  }}
  
  ${({ $interactive, theme }) => $interactive && `
    cursor: pointer;
    
    &:hover {
      border-color: ${theme.colors.primary[500]};
      box-shadow: ${theme.shadows.buttonHover};
      transform: translateY(-2px);
    }
    
    &:active {
      transform: translateY(0);
    }
  `}
`;

// 섹션 컨테이너
export const SectionContainer = styled(BaseCard).attrs({
  $variant: 'elevated' as const,
  $size: 'md' as const,
})`
  margin-bottom: ${({ theme }) => theme.spacing[8]};
`;

// 섹션 헤더
export const SectionHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: ${({ theme }) => theme.spacing[6]};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border.light};
  background: linear-gradient(135deg, 
    ${({ theme }) => theme.colors.background.secondary} 0%, 
    ${({ theme }) => theme.colors.background.tertiary} 100%
  );
  
  h2, h3 {
    font-size: ${({ theme }) => theme.typography.fontSize.xl};
    font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
    color: ${({ theme }) => theme.colors.text.primary};
    margin: 0;
    display: flex;
    align-items: center;
    gap: ${({ theme }) => theme.spacing[2]};
  }
  
  @media (max-width: 768px) {
    flex-direction: column;
    gap: ${({ theme }) => theme.spacing[4]};
    align-items: stretch;
  }
`;

// 그리드 컨테이너
export const GridContainer = styled.div<{ 
  $columns?: string; 
  $gap?: keyof typeof import('../tokens/spacing').spacing;
}>`
  display: grid;
  grid-template-columns: ${({ $columns }) => $columns || 'repeat(auto-fill, minmax(320px, 1fr))'};
  gap: ${({ $gap = 6, theme }) => theme.spacing[$gap]};
  padding: ${({ theme }) => theme.spacing[6]};
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: ${({ theme }) => theme.spacing[4]};
    padding: ${({ theme }) => theme.spacing[4]};
  }
`;

// 폼 컨테이너
export const FormContainer = styled(motion.div)`
  background: ${({ theme }) => theme.colors.background.primary};
  border-radius: ${({ theme }) => theme.borderRadius.xl};
  border: 1px solid ${({ theme }) => theme.colors.border.light};
  overflow: hidden;
  box-shadow: ${({ theme }) => theme.shadows.card};
  position: relative;
`;

export const FormSection = styled.div`
  padding: ${({ theme }) => theme.spacing[6]};
  
  &:not(:last-child) {
    border-bottom: 1px solid ${({ theme }) => theme.colors.border.light};
  }
`;

// 상태 표시 컨테이너
export const StateContainer = styled.div<{ $variant?: 'loading' | 'error' | 'empty' }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: ${({ theme }) => theme.spacing[20]};
  text-align: center;
  color: ${({ theme }) => theme.colors.text.secondary};
  
  .state-icon {
    width: 64px;
    height: 64px;
    margin-bottom: ${({ theme }) => theme.spacing[6]};
    color: ${({ theme }) => theme.colors.border.dark};
  }
  
  .state-title {
    font-size: ${({ theme }) => theme.typography.fontSize.xl};
    font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
    color: ${({ theme }) => theme.colors.text.primary};
    margin-bottom: ${({ theme }) => theme.spacing[4]};
  }
  
  .state-description {
    color: ${({ theme }) => theme.colors.text.secondary};
    font-size: ${({ theme }) => theme.typography.fontSize.base};
    margin-bottom: ${({ theme }) => theme.spacing[8]};
    line-height: ${({ theme }) => theme.typography.lineHeight.relaxed};
    max-width: 400px;
  }
  
  ${({ $variant, theme }) => {
    switch ($variant) {
      case 'error':
        return `
          .state-icon { color: ${theme.colors.error}; }
          .state-title { color: ${theme.colors.error}; }
        `;
      case 'loading':
        return `
          .state-icon { 
            animation: spin 2s linear infinite;
            color: ${theme.colors.primary[500]}; 
          }
        `;
      default:
        return '';
    }
  }}
`;

// 유틸리티 컴포넌트
export const FullWidthContainer = styled(motion.div)`
  width: 100%;
`;

export const CenteredContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
`;

export const FlexContainer = styled.div<{
  $direction?: 'row' | 'column';
  $align?: 'start' | 'center' | 'end' | 'stretch' | 'flex-start';
  $justify?: 'start' | 'center' | 'end' | 'between' | 'around';
  $gap?: keyof typeof import('../tokens/spacing').spacing;
  $wrap?: boolean;
}>`
  display: flex;
  flex-direction: ${({ $direction = 'row' }) => $direction};
  align-items: ${({ $align = 'stretch' }) => {
    switch ($align) {
      case 'start': return 'flex-start';
      case 'end': return 'flex-end';
      default: return $align;
    }
  }};
  justify-content: ${({ $justify = 'start' }) => {
    switch ($justify) {
      case 'start': return 'flex-start';
      case 'end': return 'flex-end';
      case 'between': return 'space-between';
      case 'around': return 'space-around';
      default: return $justify;
    }
  }};
  gap: ${({ $gap, theme }) => $gap ? theme.spacing[$gap] : '0'};
  ${({ $wrap }) => $wrap && 'flex-wrap: wrap;'}
`;