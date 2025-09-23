import { baseTheme } from './base';
import { colors } from '../tokens/colors';
import { shadows } from '../tokens/shadows';

// 다크 테마 (게임 모드)
export const darkTheme = {
  ...baseTheme,
  
  colors: {
    ...baseTheme.colors,
    
    // 다크 테마 배경
    background: {
      primary: colors.background.dark.primary,
      secondary: colors.background.dark.secondary, 
      tertiary: colors.background.dark.tertiary,
    },
    
    // 다크 테마 텍스트
    text: {
      primary: colors.text.dark.primary,
      secondary: colors.text.dark.secondary,
      tertiary: colors.text.dark.tertiary,
      inverse: colors.text.dark.inverse,
    },
    
    // 다크 테마 보더
    border: {
      light: colors.border.dark.light,
      medium: colors.border.dark.medium,
      dark: colors.border.dark.dark,
    },
    
    // 다크 테마에서 브랜드 색상 조정
    primary: {
      500: '#8b5cf6',  // 보라색으로 변경
      600: '#7c3aed',
    },
    
    secondary: {
      500: '#a78bfa',
      600: '#9333ea',
    },
  },
  
  // 다크 테마 그림자
  shadows: {
    ...baseTheme.shadows,
    card: shadows.dark.card,
    button: shadows.dark.button,
    buttonHover: shadows.dark.buttonHover,
    focus: shadows.dark.focus,
    glow: shadows.dark.glow,
    dropdown: shadows.dark.dropdown,
  }
} as const;

export type DarkTheme = typeof darkTheme;