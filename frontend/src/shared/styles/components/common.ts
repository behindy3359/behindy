import styled, { keyframes } from 'styled-components';

// ========================================
// 1. 통합 애니메이션 키프레임
// ========================================
export const commonKeyframes = {
  spin: keyframes`
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  `,
  
  pulse: keyframes`
    0%, 100% { 
      opacity: 1; 
      transform: scale(1); 
    }
    50% { 
      opacity: 0.7; 
      transform: scale(1.1); 
    }
  `,
  
  blink: keyframes`
    0%, 70%, 100% { opacity: 1; }
    35% { opacity: 0.3; }
  `,
  
  slowPulse: keyframes`
    0%, 100% { opacity: 1; }
    50% { opacity: 0.5; }
  `,
  
  fadeIn: keyframes`
    from {
      opacity: 0;
      transform: translateY(10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  `,
  
  shimmer: keyframes`
    0% { background-position: -200% 0; }
    100% { background-position: 200% 0; }
  `
} as const;

// ========================================
// 2. 타입 정의들
// ========================================
interface CommonSectionHeaderProps {
  $variant?: 'default' | 'gradient';
  $spacing?: 'compact' | 'normal' | 'relaxed';
}

interface CommonPageHeaderProps {
  $textAlign?: 'left' | 'center' | 'right';
  $spacing?: 'compact' | 'normal' | 'relaxed';
}

interface CommonCardHeaderProps {
  $variant?: 'default' | 'gradient';
  $padding?: 'sm' | 'md' | 'lg';
}

interface CommonCardFooterProps {
  $padding?: 'sm' | 'md' | 'lg';
}

interface CommonLoadingStateProps {
  $variant?: 'page' | 'section' | 'inline';
}

interface CommonErrorStateProps {
  $variant?: 'page' | 'section' | 'inline';
}

interface CommonStatusIndicatorProps {
  $status: 'live' | 'test' | 'loading' | 'error' | 'closed' | 'limited' | 'no-data';
  $size?: 'sm' | 'md' | 'lg';
}

interface CommonSkeletonProps {
  $width?: string;
  $height?: string;
  $variant?: 'text' | 'rectangular' | 'circular';
}

interface CommonActionGroupProps {
  $justify?: 'start' | 'center' | 'end' | 'between';
  $responsive?: boolean;
}


// ========================================
// 3. 헤더 컴포넌트들
// ========================================

// 기본 섹션 헤더
export const CommonSectionHeader = styled.div<CommonSectionHeaderProps>`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: ${({ theme }) => theme.spacing[6]};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border.light};
  
  ${({ $variant, theme }) => {
    if ($variant === 'gradient') {
      return `
        background: linear-gradient(135deg, 
          ${theme.colors.background.secondary} 0%, 
          ${theme.colors.background.tertiary} 100%
        );
      `;
    }
    return `background: ${theme.colors.background.secondary};`;
  }}
  
  ${({ $spacing, theme }) => {
    switch ($spacing) {
      case 'compact':
        return `
          padding: ${theme.spacing[4]};
          margin-bottom: ${theme.spacing[4]};
        `;
      case 'relaxed':
        return `
          padding: ${theme.spacing[8]};
          margin-bottom: ${theme.spacing[12]};
        `;
      default:
        return `
          padding: ${theme.spacing[6]};
          margin-bottom: ${theme.spacing[8]};
        `;
    }
  }}
  
  h2, h3 {
    font-size: ${({ theme }) => theme.typography.fontSize.xl};
    font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
    color: ${({ theme }) => theme.colors.text.primary};
    margin: 0;
    display: flex;
    align-items: center;
    gap: ${({ theme }) => theme.spacing[2]};
    
    svg {
      color: ${({ theme }) => theme.colors.primary[500]};
    }
  }
  
  @media (max-width: 768px) {
    flex-direction: column;
    gap: ${({ theme }) => theme.spacing[4]};
    align-items: stretch;
    
    h2, h3 {
      text-align: center;
      justify-content: center;
    }
  }
`;

// 페이지 헤더
export const CommonPageHeader = styled.div<CommonPageHeaderProps>`
  ${({ $spacing, theme }) => {
    switch ($spacing) {
      case 'compact':
        return `margin-bottom: ${theme.spacing[4]};`;
      case 'relaxed':
        return `margin-bottom: ${theme.spacing[12]};`;
      default:
        return `margin-bottom: ${theme.spacing[8]};`;
    }
  }}
  
  text-align: ${({ $textAlign = 'left' }) => $textAlign};
  
  h1 {
    font-size: ${({ theme }) => theme.textStyles.heading.h1.fontSize};
    font-weight: ${({ theme }) => theme.textStyles.heading.h1.fontWeight};
    color: ${({ theme }) => theme.colors.text.primary};
    margin: 0 0 ${({ theme }) => theme.spacing[4]} 0;
    display: flex;
    align-items: center;
    gap: ${({ theme }) => theme.spacing[3]};
    
    ${({ $textAlign }) => $textAlign === 'center' && 'justify-content: center;'}
    
    svg {
      color: ${({ theme }) => theme.colors.primary[500]};
    }
  }
  
  p {
    color: ${({ theme }) => theme.colors.text.secondary};
    font-size: ${({ theme }) => theme.typography.fontSize.base};
    margin: 0;
    line-height: ${({ theme }) => theme.typography.lineHeight.relaxed};
  }
  
  @media (max-width: 768px) {
    text-align: center;
    
    h1 {
      font-size: ${({ theme }) => theme.textStyles.heading.h2.fontSize};
      justify-content: center;
    }
  }
`;

// ========================================
// 4. 카드 컴포넌트들
// ========================================

export const CommonCardHeader = styled.div<CommonCardHeaderProps>`
  ${({ $padding = 'md', theme }) => {
    switch ($padding) {
      case 'sm':
        return `padding: ${theme.spacing[4]} ${theme.spacing[6]};`;
      case 'lg':
        return `padding: ${theme.spacing[8]} ${theme.spacing[6]};`;
      default:
        return `padding: ${theme.spacing[6]} ${theme.spacing[6]};`;
    }
  }}
  
  border-bottom: 1px solid ${({ theme }) => theme.colors.border.light};
  
  ${({ $variant, theme }) => {
    if ($variant === 'gradient') {
      return `
        background: linear-gradient(135deg, 
          ${theme.colors.background.secondary} 0%, 
          ${theme.colors.background.tertiary} 100%
        );
      `;
    }
    return `background: ${theme.colors.background.secondary};`;
  }}
`;

export const CommonCardFooter = styled.div<CommonCardFooterProps>`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;

  ${({ $padding = 'md', theme }) => {
    switch ($padding) {
      case 'sm':
        return `padding: ${theme.spacing[4]} ${theme.spacing[6]};`;
      case 'lg':
        return `padding: ${theme.spacing[8]} ${theme.spacing[6]};`;
      default:
        return `padding: ${theme.spacing[4]} ${theme.spacing[6]};`;
    }
  }}
  
  background: ${({ theme }) => theme.colors.background.secondary};
  border-top: 1px solid ${({ theme }) => theme.colors.border.light};
  flex-shrink: 0;
  
  @media (max-width: 768px) {
    flex-direction: column;
    gap: ${({ theme }) => theme.spacing[4]};
    align-items: stretch;
  }
`;

// ========================================
// 5. 상태 표시 컴포넌트들
// ========================================

// 로딩 상태
export const CommonLoadingState = styled.div<CommonLoadingStateProps>`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: ${({ theme }) => theme.colors.text.secondary};
  
  ${({ $variant }) => {
    switch ($variant) {
      case 'page':
        return `
          min-height: 60vh;
          padding: 5rem 2rem;
        `;
      case 'section':
        return `
          min-height: 200px;
          padding: 3rem 2rem;
        `;
      default:
        return `
          padding: 2rem;
        `;
    }
  }}
  
  .loading-spinner {
    width: ${({ $variant }) => $variant === 'page' ? '48px' : '32px'};
    height: ${({ $variant }) => $variant === 'page' ? '48px' : '32px'};
    border: 3px solid ${({ theme }) => theme.colors.border.light};
    border-top: 3px solid ${({ theme }) => theme.colors.primary[500]};
    border-radius: 50%;
    animation: ${commonKeyframes.spin} 1s linear infinite;
    margin-bottom: ${({ theme }) => theme.spacing[4]};
  }
  
  .loading-text {
    font-size: ${({ $variant, theme }) => 
      $variant === 'page' ? theme.typography.fontSize.base : theme.typography.fontSize.sm
    };
  }
`;

// 에러 상태
export const CommonErrorState = styled.div<CommonErrorStateProps>`
  text-align: center;
  color: ${({ theme }) => theme.colors.error};
  
  ${({ $variant, theme }) => {
    switch ($variant) {
      case 'page':
        return `
          padding: ${theme.spacing[20]};
          min-height: 60vh;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
        `;
      case 'section':
        return `
          padding: ${theme.spacing[16]};
          min-height: 200px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
        `;
      default:
        return `
          padding: ${theme.spacing[8]};
        `;
    }
  }}
  
  .error-icon {
    width: ${({ $variant }) => $variant === 'page' ? '64px' : '48px'};
    height: ${({ $variant }) => $variant === 'page' ? '64px' : '48px'};
    margin-bottom: ${({ theme }) => theme.spacing[4]};
  }
  
  .error-title {
    font-size: ${({ $variant, theme }) => 
      $variant === 'page' ? theme.typography.fontSize.xl : theme.typography.fontSize.lg
    };
    font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
    color: ${({ theme }) => theme.colors.text.primary};
    margin-bottom: ${({ theme }) => theme.spacing[2]};
  }
  
  .error-message {
    color: ${({ theme }) => theme.colors.text.secondary};
    margin-bottom: ${({ theme }) => theme.spacing[6]};
    max-width: 400px;
    line-height: ${({ theme }) => theme.typography.lineHeight.relaxed};
  }
`;

// ========================================
// 6. 상태 인디케이터
// ========================================

export const CommonStatusIndicator = styled.div<CommonStatusIndicatorProps>`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[2]};
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  border-radius: ${({ theme }) => theme.borderRadius.xl};
  transition: ${({ theme }) => theme.transition.normal};
  
  ${({ $size = 'md', theme }) => {
    switch ($size) {
      case 'sm':
        return `
          font-size: ${theme.typography.fontSize.xs};
          padding: ${theme.spacing[1]} ${theme.spacing[2]};
        `;
      case 'lg':
        return `
          font-size: ${theme.typography.fontSize.base};
          padding: ${theme.spacing[3]} ${theme.spacing[4]};
        `;
      default:
        return `
          font-size: ${theme.typography.fontSize.sm};
          padding: ${theme.spacing[2]} ${theme.spacing[3]};
        `;
    }
  }}
  
  &::before {
    content: '';
    width: ${({ $size }) => $size === 'lg' ? '10px' : '8px'};
    height: ${({ $size }) => $size === 'lg' ? '10px' : '8px'};
    border-radius: 50%;
  }
  
  ${({ $status, theme }) => {
    switch ($status) {
      case 'live':
        return `
          color: ${theme.colors.error};
          background: rgba(239, 68, 68, 0.1);
          
          &::before {
            background: ${theme.colors.error};
            animation: ${commonKeyframes.pulse} 2s infinite;
          }
        `;
      case 'test':
        return `
          color: ${theme.colors.warning};
          background: rgba(245, 158, 11, 0.1);
          
          &::before {
            background: ${theme.colors.warning};
            animation: ${commonKeyframes.blink} 3s infinite;
          }
        `;
      case 'loading':
        return `
          color: ${theme.colors.text.secondary};
          background: rgba(107, 114, 128, 0.1);
          
          &::before {
            background: ${theme.colors.text.secondary};
            animation: ${commonKeyframes.spin} 1s linear infinite;
          }
        `;
      case 'error':
        return `
          color: ${theme.colors.error};
          background: rgba(239, 68, 68, 0.1);
          
          &::before {
            background: ${theme.colors.error};
          }
        `;
      case 'limited':
        return `
          color: ${theme.colors.warning};
          background: rgba(245, 158, 11, 0.1);
          
          &::before {
            background: ${theme.colors.warning};
            animation: ${commonKeyframes.slowPulse} 4s infinite;
          }
        `;
      default:
        return `
          color: ${theme.colors.text.secondary};
          background: rgba(107, 114, 128, 0.1);
          
          &::before {
            background: ${theme.colors.text.secondary};
          }
        `;
    }
  }}
`;

// ========================================
// 7. 스켈레톤 로더 
// ========================================

export const CommonSkeleton = styled.div<CommonSkeletonProps>`
  ${({ $variant, $width = '100%', $height = '20px', theme }) => {
    switch ($variant) {
      case 'circular':
        const size = $width;
        return `
          width: ${size};
          height: ${size};
          border-radius: 50%;
        `;
      case 'rectangular':
        return `
          width: ${$width};
          height: ${$height};
          border-radius: ${theme.borderRadius.md};
        `;
      default:
        return `
          width: ${$width};
          height: ${$height};
          border-radius: ${theme.borderRadius.sm};
        `;
    }
  }}
  
  background: linear-gradient(90deg, 
    ${({ theme }) => theme.colors.background.secondary} 25%, 
    ${({ theme }) => theme.colors.background.tertiary} 50%, 
    ${({ theme }) => theme.colors.background.secondary} 75%
  );
  background-size: 200% 100%;
  animation: ${commonKeyframes.shimmer} 1.5s infinite;
`;

// 개별 스켈레톤 라인 
export const SkeletonLine = styled(CommonSkeleton).attrs({
  $height: '16px',
})<{ $width?: string }>`
  width: ${({ $width = '100%' }) => $width};
  margin-bottom: ${({ theme }) => theme.spacing[2]};
  
  &:last-child {
    margin-bottom: 0;
  }
`;

// 텍스트 스켈레톤 컨테이너 (타입 안전)
export const CommonTextSkeleton = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing[2]};
`;

// ========================================
// 8. 액션 그룹
// ========================================

export const CommonActionGroup = styled.div<CommonActionGroupProps>`
  display: flex;
  flex-direction: row;
  gap: ${({ theme }) => theme.spacing[3]};
  align-items: center;

  ${({ $justify = 'end' }) => {
    switch ($justify) {
      case 'start': return 'justify-content: flex-start;';
      case 'center': return 'justify-content: center;';
      case 'between': return 'justify-content: space-between;';
      default: return 'justify-content: flex-end;';
    }
  }}
  
  ${({ $responsive = true }) => $responsive && `
    @media (max-width: 768px) {
      flex-direction: column;
      width: 100%;
      
      button {
        width: 100%;
      }
    }
  `}
`;

// ========================================
// 9. 통계 표시 컴포넌트
// ========================================
// CommonStatItem은 common-animated.ts로 이동했습니다 (framer-motion 사용)