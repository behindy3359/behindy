import { colors } from '../tokens/colors';
import { spacing, componentSpacing } from '../tokens/spacing';
import { typography, textStyles } from '../tokens/typography';
import { shadows } from '../tokens/shadows';

// 공통 기본 테마 (라이트/다크 테마의 베이스) - 완전한 타입 구현
export const baseTheme = {
  // 간격 시스템
  spacing,
  componentSpacing,
  
  // 타이포그래피
  typography: {
    ...typography,
    fontWeight: {
      normal: typography.fontWeight.normal,
      medium: typography.fontWeight.medium,
      semibold: typography.fontWeight.semibold,
      bold: typography.fontWeight.bold,
      extrabold: typography.fontWeight.extrabold,
    },
  },
  textStyles,
  
  // 기본 그림자 (테마별로 오버라이드됨)
  shadows: {
    base: shadows.base,
    card: shadows.light.card,
    button: shadows.light.button,
    buttonHover: shadows.light.buttonHover,
    focus: shadows.light.focus,
    dropdown: shadows.light.dropdown,
  },
  
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
  
  // 공통 색상 (테마별로 배경/텍스트/보더는 오버라이드됨)
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
    
    // 기본 배경 (라이트 테마 기본값, 다크 테마에서 오버라이드)
    background: {
      primary: colors.background.light.primary,
      secondary: colors.background.light.secondary,
      tertiary: colors.background.light.tertiary,
    },
    
    // 기본 텍스트 (라이트 테마 기본값, 다크 테마에서 오버라이드)
    text: {
      primary: colors.text.light.primary,
      secondary: colors.text.light.secondary,
      tertiary: colors.text.light.tertiary,
      inverse: colors.text.light.inverse,
    },
    
    // 기본 보더 (라이트 테마 기본값, 다크 테마에서 오버라이드)
    border: {
      light: colors.border.light.light,
      medium: colors.border.light.medium,
      dark: colors.border.light.dark,
    },
  }
} as const;

export type BaseTheme = typeof baseTheme;