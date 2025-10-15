import { motion } from "framer-motion";
import styled from "styled-components";
import { FlexContainer, SkeletonLoader } from './components';

// CommonGroup - FlexContainer 기반으로 재작성
export const CommonGroup = styled(FlexContainer).attrs({
  $direction: 'row' as const,
  $align: 'center' as const,
  $gap: 2 as const,
})`
  /* FlexContainer의 설정으로 기존 동작 구현 */
`;

// CommonWrapper - 폼용 세로 배치 컨테이너
export const CommonWrapper = styled(motion.form)`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.componentSpacing.form.fieldGap};

  @media ${({ theme }) => `(max-height: 600px)`} {
    gap: ${({ theme }) => theme.spacing[4]};
  }
`;

// CommonLoadingState - 로딩 상태 텍스트
export const CommonLoadingState = styled.div`
  text-align: center;
  padding: ${({ theme }) => theme.spacing[4]};
  color: ${({ theme }) => theme.colors.text.tertiary};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  
  @media ${({ theme }) => `(max-height: 600px)`} {
    padding: ${({ theme }) => theme.spacing[3]};
    font-size: ${({ theme }) => theme.typography.fontSize.xs};
  }
`;

// CommonCommentHeader - 댓글 헤더용 플렉스
export const CommonCommentHeader = styled(FlexContainer).attrs({
  $direction: 'row' as const,
  $justify: 'between' as const,
  $align: 'start' as const,
})`
  margin-bottom: ${({ theme }) => theme.spacing[2]};
`;

// 추가 공통 컴포넌트들

// LoadingSpinner - 개선된 로딩 스피너
export const LoadingSpinner = styled.div<{
  $size?: 'sm' | 'md' | 'lg';
  $color?: string;
}>`
  width: ${({ $size = 'md' }) => {
    switch ($size) {
      case 'sm': return '16px';
      case 'lg': return '48px';
      default: return '24px';
    }
  }};
  height: ${({ $size = 'md' }) => {
    switch ($size) {
      case 'sm': return '16px';
      case 'lg': return '48px';
      default: return '24px';
    }
  }};
  border: 2px solid ${({ theme }) => theme.colors.border.light};
  border-top: 2px solid ${({ $color, theme }) => $color || theme.colors.primary[500]};
  border-radius: 50%;
  animation: spin 1s linear infinite;
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

// ErrorText - 에러 표시용
export const ErrorText = styled.div<{
  $size?: 'sm' | 'md';
}>`
  color: ${({ theme }) => theme.colors.error};
  font-size: ${({ $size = 'sm', theme }) => 
    $size === 'sm' ? theme.typography.fontSize.sm : theme.typography.fontSize.base
  };
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[2]};
  
  svg {
    width: 16px;
    height: 16px;
    flex-shrink: 0;
  }
`;

// SuccessText - 성공 표시용
export const SuccessText = styled.div<{
  $size?: 'sm' | 'md';
}>`
  color: ${({ theme }) => theme.colors.success};
  font-size: ${({ $size = 'sm', theme }) => 
    $size === 'sm' ? theme.typography.fontSize.sm : theme.typography.fontSize.base
  };
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[2]};
  
  svg {
    width: 16px;
    height: 16px;
    flex-shrink: 0;
  }
`;

// Divider - 구분선
export const Divider = styled.div<{
  $orientation?: 'horizontal' | 'vertical';
  $margin?: keyof typeof import('./tokens/spacing').spacing;
}>`
  ${({ $orientation = 'horizontal', $margin = 4, theme }) => {
    if ($orientation === 'vertical') {
      return `
        width: 1px;
        height: auto;
        background: ${theme.colors.border.medium};
        margin: 0 ${theme.spacing[$margin]};
      `;
    } else {
      return `
        height: 1px;
        width: 100%;
        background: ${theme.colors.border.medium};
        margin: ${theme.spacing[$margin]} ;
      `;
    }
  }}
`;

// Badge - 뱃지/라벨
export const Badge = styled.span<{
  $variant?: 'default' | 'success' | 'warning' | 'error' | 'info';
  $size?: 'sm' | 'md';
}>`
  display: inline-flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[1]};
  padding: ${({ $size = 'sm', theme }) => 
    $size === 'sm' 
      ? `${theme.spacing[1]} ${theme.spacing[2]}` 
      : `${theme.spacing[2]} ${theme.spacing[3]}`
  };
  font-size: ${({ $size = 'sm', theme }) => 
    $size === 'sm' ? theme.typography.fontSize.xs : theme.typography.fontSize.sm
  };
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  border-radius: ${({ theme }) => theme.borderRadius.xl};
  
  ${({ $variant = 'default', theme }) => {
    switch ($variant) {
      case 'success':
        return `
          background: rgba(16, 185, 129, 0.1);
          color: ${theme.colors.success};
          border: 1px solid rgba(16, 185, 129, 0.2);
        `;
      case 'warning':
        return `
          background: rgba(245, 158, 11, 0.1);
          color: ${theme.colors.warning};
          border: 1px solid rgba(245, 158, 11, 0.2);
        `;
      case 'error':
        return `
          background: rgba(239, 68, 68, 0.1);
          color: ${theme.colors.error};
          border: 1px solid rgba(239, 68, 68, 0.2);
        `;
      case 'info':
        return `
          background: rgba(102, 126, 234, 0.1);
          color: ${theme.colors.primary[500]};
          border: 1px solid rgba(102, 126, 234, 0.2);
        `;
      default:
        return `
          background: ${theme.colors.background.secondary};
          color: ${theme.colors.text.secondary};
          border: 1px solid ${theme.colors.border.medium};
        `;
    }
  }}
`;

// 스켈레톤 로더 (재export)
export const ContentSkeleton = styled(SkeletonLoader)`
  /* 콘텐츠용 스켈레톤 로더 */
`;