import { colors } from '../tokens/colors';
import { spacing, componentSpacing } from '../tokens/spacing';
import { typography, textStyles } from '../tokens/typography';
import { shadows } from '../tokens/shadows';

// 공통 기본 테마 (라이트/다크 테마의 베이스)
export const baseTheme = {
  // 간격 시스템
  spacing,
  componentSpacing,
  
  // 타이포그래피
  typography,
  textStyles,
  
  // 그림자
  shadows,
  
  // 테두리 반지름
  borderRadius: {
    sm: '0.375rem',
    md: '0.5rem', 
    lg: '0.75rem',
    xl: '1rem',
    '2xl': '1.25rem',
  },
  
  // 중단점 (반응형)
  breakpoints: {
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
  },
  
  // 컨테이너 최대 너비
  container: {
    sm: '640px',
    md: '768px',
    lg: '900px',
    xl: '1200px',
  },
  
  // 트랜지션
  transition: {
    fast: '0.15s ease',
    normal: '0.2s ease',
    slow: '0.3s ease',
  },
  
  // z-index 스케일
  zIndex: {
    dropdown: 1000,
    sticky: 1020,
    fixed: 1030,
    modal: 1040,
    popover: 1050,
    tooltip: 1060,
  },
  
  // 공통 색상 (테마 독립적)
  colors: {
    // 브랜드 색상
    primary: colors.primary,
    secondary: colors.secondary,
    
    // 지하철 노선
    metro: colors.metro,
    
    // 상태 색상 
    success: colors.success,
    warning: colors.warning,
    error: colors.error,
    
    // 게임 색상
    game: colors.game,
  }
} as const;

export type BaseTheme = typeof baseTheme;