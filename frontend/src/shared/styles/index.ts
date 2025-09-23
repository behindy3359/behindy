// 🎨 Behindy 통합 스타일 시스템
// Phase 1-4 완료: 토큰 시스템 → 테마 → 컴포넌트 → 통합

// === 토큰 시스템 ===
export * from './tokens/colors';
export * from './tokens/spacing';
export * from './tokens/typography';
export * from './tokens/shadows';

// === 테마 시스템 ===
export * from './themes';  // 모든 테마와 유틸리티
import { getTheme } from './themes'; // getTheme 명시적 import

// === 컴포넌트 시스템 ===
export * from './components';  // 모든 기본 컴포넌트

// === 레거시 호환성 ===
// 기존 파일들을 점진적으로 새 시스템으로 마이그레이션하기 위한 재export
export * from './theme';  // 기존 theme.ts 유지 (호환성용)

// === 타입 정의 ===
export type { Theme } from './styled';

// === 유틸리티 함수들 ===

// CSS 변수 적용 헬퍼
export const applyCSSVariables = (theme: any) => {
  const variables = {
    // 배경색
    '--bg-primary': theme.colors.background.primary,
    '--bg-secondary': theme.colors.background.secondary,
    '--bg-tertiary': theme.colors.background.tertiary,
    
    // 텍스트
    '--text-primary': theme.colors.text.primary,
    '--text-secondary': theme.colors.text.secondary,
    '--text-tertiary': theme.colors.text.tertiary,
    '--text-inverse': theme.colors.text.inverse,
    
    // 보더
    '--border-light': theme.colors.border.light,
    '--border-medium': theme.colors.border.medium,
    '--border-dark': theme.colors.border.dark,
    
    // 브랜드
    '--primary-500': theme.colors.primary[500],
    '--primary-600': theme.colors.primary[600],
    '--secondary-500': theme.colors.secondary[500],
    '--secondary-600': theme.colors.secondary[600],
    
    // 상태
    '--success': theme.colors.success,
    '--warning': theme.colors.warning,
    '--error': theme.colors.error,
    
    // 게임 색상
    '--game-health': theme.colors.game.health,
    '--game-sanity': theme.colors.game.sanity,
    '--game-choice': theme.colors.game.choice,
    '--game-success': theme.colors.game.success,
    '--game-danger': theme.colors.game.danger,
    '--game-story': theme.colors.game.story,
    
    // 그림자
    '--shadow-card': theme.shadows.card,
    '--shadow-button': theme.shadows.button,
    '--shadow-lg': theme.shadows.dropdown || theme.shadows.lg,
  };
  
  Object.entries(variables).forEach(([property, value]) => {
    document.documentElement.style.setProperty(property, value);
  });
};

// 테마 전환 헬퍼
export const switchTheme = (mode: 'light' | 'dark' | 'game') => {
  const theme = getTheme(mode);
  applyCSSVariables(theme);
  
  // HTML 속성 업데이트
  document.documentElement.setAttribute('data-theme', mode);
  document.body.setAttribute('data-theme', mode);
  
  // 게임 모드 클래스 토글
  if (mode === 'game') {
    document.body.classList.add('game-mode');
  } else {
    document.body.classList.remove('game-mode');
  }
  
  return theme;
};

// 반응형 헬퍼
export const breakpoints = {
  mobile: '(max-width: 640px)',
  tablet: '(max-width: 768px)', 
  desktop: '(min-width: 1024px)',
  largeDesktop: '(min-width: 1280px)',
} as const;

export const mediaQuery = (breakpoint: keyof typeof breakpoints) => 
  `@media ${breakpoints[breakpoint]}`;

// 스타일 조합 헬퍼
export const combineStyles = (...styles: (string | false | undefined)[]) => 
  styles.filter(Boolean).join(' ');

// 컴포넌트 variant 생성기
export const createVariant = <T extends Record<string, any>>(
  baseStyles: string,
  variants: T
) => (variant: keyof T) => `${baseStyles} ${variants[variant]}`;

// 🎯 마이그레이션 가이드
export const MIGRATION_GUIDE = {
  // 기존 -> 새로운 방식
  examples: {
    // 컨테이너
    old: "import { PageContainer } from '@/shared/styles/commonContainers'",
    new: "import { PageContainer } from '@/shared/styles'",
    
    // 테마
    oldTheme: "import { theme } from '@/shared/styles/theme'",
    newTheme: "import { lightTheme, darkTheme, gameVariant } from '@/shared/styles'",
    
    // 컴포넌트
    oldComponent: "styled.div`background: #ffffff;`",
    newComponent: "styled(BaseCard)`background: ${({ theme }) => theme.colors.background.primary};`",
  },
  
  // 단계별 마이그레이션
  steps: [
    "1. 기존 스타일 파일에서 import 경로 변경",
    "2. CSS 하드코딩을 테마 변수로 교체", 
    "3. 공통 컴포넌트를 BaseComponent로 교체",
    "4. variant 시스템 적용",
    "5. 애니메이션을 통합 시스템으로 변경"
  ]
} as const;

// 🔧 개발 도구
export const devTools = {
  // 현재 적용된 테마 확인
  getCurrentTheme: () => document.documentElement.getAttribute('data-theme') || 'light',
  
  // 테마 토큰 검사
  inspectTokens: (theme: any) => ({
    colors: Object.keys(theme.colors),
    spacing: Object.keys(theme.spacing),
    typography: Object.keys(theme.typography),
    shadows: Object.keys(theme.shadows),
  }),
  
  // CSS 변수 상태 확인
  inspectCSSVariables: () => {
    const style = getComputedStyle(document.documentElement);
    const variables: Record<string, string> = {};
    
    ['--bg-primary', '--text-primary', '--primary-500'].forEach(variable => {
      variables[variable] = style.getPropertyValue(variable);
    });
    
    return variables;
  }
} as const;