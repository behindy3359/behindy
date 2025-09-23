// 그림자 토큰 시스템
export const shadows = {
  // 기본 그림자
  base: {
    sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
    xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
  },
  
  // 라이트 테마 그림자
  light: {
    card: '0 2px 8px rgba(0, 0, 0, 0.04)',
    button: '0 4px 14px 0 rgba(102, 126, 234, 0.3)',
    buttonHover: '0 6px 20px 0 rgba(102, 126, 234, 0.4)',
    focus: '0 0 0 3px rgba(102, 126, 234, 0.1)',
    dropdown: '0 10px 25px rgba(0, 0, 0, 0.15)',
  },
  
  // 다크 테마 그림자 (게임 모드)
  dark: {
    card: '0 4px 20px rgba(0, 0, 0, 0.5)',
    button: '0 2px 10px rgba(139, 92, 246, 0.3)',
    buttonHover: '0 4px 15px rgba(139, 92, 246, 0.4)',
    focus: '0 0 0 3px rgba(139, 92, 246, 0.2)',
    glow: '0 0 20px rgba(139, 92, 246, 0.2)',
    dropdown: '0 10px 25px -5px rgba(0, 0, 0, 0.6)',
  },
  
  // 인셋 그림자
  inset: {
    light: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)',
    dark: 'inset 0 2px 4px 0 rgba(255, 255, 255, 0.06)',
  }
} as const;

// 그림자 유틸리티
export const shadowUtils = {
  // 테마에 따른 그림자 선택
  getCardShadow: (isDark: boolean) => isDark ? shadows.dark.card : shadows.light.card,
  getButtonShadow: (isDark: boolean) => isDark ? shadows.dark.button : shadows.light.button,
  getFocusShadow: (isDark: boolean) => isDark ? shadows.dark.focus : shadows.light.focus,
} as const;