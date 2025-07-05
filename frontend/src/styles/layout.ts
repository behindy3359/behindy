import styled from 'styled-components';

// 🔥 레이아웃 상수 - 모든 페이지에서 통일된 너비 사용
export const LAYOUT_CONSTANTS = {
  // 컨테이너 최대 너비
  MAX_WIDTH: {
    CONTENT: '900px',        // 일반 컨텐츠 (홈, 커뮤니티, 소개)
    WIDE: '1200px',         // 넓은 컨텐츠 (관리자, 대시보드)
    NARROW: '600px',        // 좁은 컨텐츠 (폼, 설정)
  },
  
  // 패딩
  PADDING: {
    DESKTOP: '24px',
    MOBILE: '16px',
  },
  
  // 브레이크포인트
  BREAKPOINT: {
    MOBILE: '768px',
    TABLET: '1024px',
    DESKTOP: '1200px',
  }
} as const;

// 🔥 공통 컨테이너 컴포넌트
export const PageContainer = styled.div<{ 
  $maxWidth?: keyof typeof LAYOUT_CONSTANTS.MAX_WIDTH;
  $fullHeight?: boolean;
}>`
  max-width: ${({ $maxWidth = 'CONTENT' }) => LAYOUT_CONSTANTS.MAX_WIDTH[$maxWidth]};
  margin: 0 auto;
  padding: ${LAYOUT_CONSTANTS.PADDING.DESKTOP};
  width: 100%;
  ${({ $fullHeight }) => $fullHeight && 'min-height: 100vh;'}
  
  @media (max-width: ${LAYOUT_CONSTANTS.BREAKPOINT.MOBILE}) {
    padding: ${LAYOUT_CONSTANTS.PADDING.MOBILE};
  }
`;

export const SectionContainer = styled.div<{
  $spacing?: 'sm' | 'md' | 'lg';
  $background?: string;
}>`
  background: ${({ $background }) => $background || 'transparent'};
  margin-bottom: ${({ $spacing = 'md' }) => {
    switch ($spacing) {
      case 'sm': return '24px';
      case 'lg': return '64px';
      default: return '40px';
    }
  }};
  
  &:last-child {
    margin-bottom: 0;
  }
`;

export const CardGrid = styled.div<{
  $columns?: number;
  $gap?: string;
  $minWidth?: string;
}>`
  display: grid;
  grid-template-columns: repeat(
    auto-fit, 
    minmax(${({ $minWidth = '300px' }) => $minWidth}, 1fr)
  );
  gap: ${({ $gap = '24px' }) => $gap};
  
  @media (max-width: ${LAYOUT_CONSTANTS.BREAKPOINT.MOBILE}) {
    grid-template-columns: 1fr;
    gap: 16px;
  }
`;

// 🔥 반응형 텍스트 스타일
export const ResponsiveTitle = styled.h1<{
  $size?: 'sm' | 'md' | 'lg' | 'xl';
}>`
  font-weight: 700;
  color: #111827;
  margin: 0 0 16px 0;
  line-height: 1.2;
  
  ${({ $size = 'lg' }) => {
    switch ($size) {
      case 'sm':
        return `
          font-size: 24px;
          @media (max-width: ${LAYOUT_CONSTANTS.BREAKPOINT.MOBILE}) {
            font-size: 20px;
          }
        `;
      case 'md':
        return `
          font-size: 32px;
          @media (max-width: ${LAYOUT_CONSTANTS.BREAKPOINT.MOBILE}) {
            font-size: 24px;
          }
        `;
      case 'lg':
        return `
          font-size: 40px;
          @media (max-width: ${LAYOUT_CONSTANTS.BREAKPOINT.MOBILE}) {
            font-size: 28px;
          }
        `;
      case 'xl':
        return `
          font-size: 48px;
          @media (max-width: ${LAYOUT_CONSTANTS.BREAKPOINT.MOBILE}) {
            font-size: 32px;
          }
        `;
    }
  }}
`;

export const ResponsiveText = styled.p<{
  $size?: 'sm' | 'md' | 'lg';
  $color?: string;
}>`
  color: ${({ $color = '#6b7280' }) => $color};
  line-height: 1.6;
  margin: 0 0 16px 0;
  
  ${({ $size = 'md' }) => {
    switch ($size) {
      case 'sm':
        return `
          font-size: 14px;
          @media (max-width: ${LAYOUT_CONSTANTS.BREAKPOINT.MOBILE}) {
            font-size: 13px;
          }
        `;
      case 'lg':
        return `
          font-size: 18px;
          @media (max-width: ${LAYOUT_CONSTANTS.BREAKPOINT.MOBILE}) {
            font-size: 16px;
          }
        `;
      default:
        return `
          font-size: 16px;
          @media (max-width: ${LAYOUT_CONSTANTS.BREAKPOINT.MOBILE}) {
            font-size: 14px;
          }
        `;
    }
  }}
  
  &:last-child {
    margin-bottom: 0;
  }
`;

// 🔥 로딩/에러 상태 공통 컴포넌트
export const LoadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  text-align: center;
  
  .loading-spinner {
    width: 40px;
    height: 40px;
    border: 3px solid #f3f4f6;
    border-top: 3px solid #667eea;
    border-radius: 50%;
    animation: spin 1s linear infinite;
    margin-bottom: 16px;
  }
  
  .loading-text {
    color: #6b7280;
    font-size: 16px;
  }
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

export const ErrorContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  text-align: center;
  background: #fef2f2;
  border: 1px solid #fecaca;
  border-radius: 12px;
  
  .error-icon {
    width: 64px;
    height: 64px;
    color: #ef4444;
    margin-bottom: 16px;
  }
  
  .error-title {
    font-size: 20px;
    font-weight: 600;
    color: #111827;
    margin-bottom: 8px;
  }
  
  .error-description {
    color: #6b7280;
    margin-bottom: 24px;
    line-height: 1.5;
  }
`;

// 🔥 빈 상태 컴포넌트
export const EmptyStateContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 80px 20px;
  text-align: center;
  
  .empty-icon {
    width: 64px;
    height: 64px;
    color: #d1d5db;
    margin-bottom: 20px;
  }
  
  .empty-title {
    font-size: 20px;
    font-weight: 600;
    color: #374151;
    margin-bottom: 12px;
  }
  
  .empty-description {
    color: #6b7280;
    margin-bottom: 32px;
    line-height: 1.6;
    max-width: 400px;
  }
`;

// 🔥 공통 애니메이션
export const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 }
};

export const staggerChildren = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
};

// 🔥 공통 그라데이션
export const GRADIENTS = {
  PRIMARY: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  SUCCESS: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
  WARNING: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
  DANGER: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
  LIGHT: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
} as const;