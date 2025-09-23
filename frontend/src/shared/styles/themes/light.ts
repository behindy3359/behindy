import { baseTheme } from './base';
import { colors } from '../tokens/colors';
import { shadows } from '../tokens/shadows';

// 라이트 테마 (일상 모드)
export const lightTheme = {
  ...baseTheme,
  
  colors: {
    ...baseTheme.colors,
    
    // 라이트 테마 배경
    background: {
      primary: colors.background.light.primary,
      secondary: colors.background.light.secondary,
      tertiary: colors.background.light.tertiary,
    },
    
    // 라이트 테마 텍스트
    text: {
      primary: colors.text.light.primary,
      secondary: colors.text.light.secondary,
      tertiary: colors.text.light.tertiary,
      inverse: colors.text.light.inverse,
    },
    
    // 라이트 테마 보더
    border: {
      light: colors.border.light.light,
      medium: colors.border.light.medium,
      dark: colors.border.light.dark,
    },
  },
  
  // 라이트 테마 그림자
  shadows: {
    ...baseTheme.shadows,
    card: shadows.light.card,
    button: shadows.light.button,
    buttonHover: shadows.light.buttonHover,
    focus: shadows.light.focus,
    dropdown: shadows.light.dropdown,
  }
} as const;

export type LightTheme = typeof lightTheme;