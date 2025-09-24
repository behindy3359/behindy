import { darkTheme } from './dark';
import { lightTheme } from './light';
import { gameVariant } from './variants';

// 테마 시스템 통합 export
export { baseTheme, type BaseTheme } from './base';
export { lightTheme, type LightTheme } from './light';
export { darkTheme, type DarkTheme } from './dark';

export { 
  gameVariant, 
  highContrastVariant, 
  compactVariant,
  type GameVariant,
  type HighContrastVariant,
  type CompactVariant 
} from './variants';

// 토큰들도 함께 export
export { colors } from '../tokens/colors';
export { spacing, componentSpacing } from '../tokens/spacing';
export { typography, textStyles } from '../tokens/typography';
export { shadows, shadowUtils } from '../tokens/shadows';

// 기본 테마 (현재 사용 중인 테마) - 이름 변경하여 충돌 방지
export const defaultTheme = lightTheme;

// 테마 선택기
export const getTheme = (mode: 'light' | 'dark' | 'game') => {
  switch (mode) {
    case 'dark':
      return darkTheme;
    case 'game':
      return gameVariant;
    default:
      return lightTheme;
  }
};

// CSS 변수 생성기 (기존 globalTheme.css와 연동)
export const generateCSSVariables = (selectedTheme: typeof lightTheme) => {
  return {
    // 배경색
    '--bg-primary': selectedTheme.colors.background.primary,
    '--bg-secondary': selectedTheme.colors.background.secondary,
    '--bg-tertiary': selectedTheme.colors.background.tertiary,
    
    // 텍스트
    '--text-primary': selectedTheme.colors.text.primary,
    '--text-secondary': selectedTheme.colors.text.secondary,
    '--text-tertiary': selectedTheme.colors.text.tertiary,
    '--text-inverse': selectedTheme.colors.text.inverse,
    
    // 보더
    '--border-light': selectedTheme.colors.border.light,
    '--border-medium': selectedTheme.colors.border.medium,
    '--border-dark': selectedTheme.colors.border.dark,
    
    // 브랜드
    '--primary-500': selectedTheme.colors.primary[500],
    '--primary-600': selectedTheme.colors.primary[600],
    '--secondary-500': selectedTheme.colors.secondary[500],
    '--secondary-600': selectedTheme.colors.secondary[600],
    
    // 상태
    '--success': selectedTheme.colors.success,
    '--warning': selectedTheme.colors.warning,
    '--error': selectedTheme.colors.error,
    
    // 그림자
    '--shadow-card': selectedTheme.shadows.card,
    '--shadow-button': selectedTheme.shadows.button,
    '--shadow-lg': selectedTheme.shadows.dropdown,
  };
};