import { darkTheme } from './dark';
import { lightTheme } from './light';

// 게임 모드 variant 
export const gameVariant = {
  ...darkTheme,
  
  // 게임 전용 스타일 추가
  gameMode: true,
  
  // 게임 모드 배경 그라데이션
  backgrounds: {
    gameBackground: 'linear-gradient(180deg, var(--bg-primary) 0%, var(--bg-secondary) 100%)',
    gameCard: 'linear-gradient(135deg, var(--bg-secondary) 0%, var(--bg-tertiary) 100%)',
    gameOverlay: 'radial-gradient(ellipse at center, rgba(139, 92, 246, 0.05) 0%, transparent 70%)',
  },
  
  // 게임 UI 전용 애니메이션
  animations: {
    pulse: 'pulse 2s infinite',
    glow: 'glow 3s ease-in-out infinite alternate',
    typewriter: 'typewriter 0.5s steps(40) 1s 1 normal both',
  },
  
  // 게임 모드 특별 색상
  gameColors: {
    healthBar: '#ef4444',
    sanityBar: '#8b5cf6',
    choiceHover: '#3b82f6',
    storyText: '#e2e8f0',
    narratorText: '#94a3b8',
    playerChoice: '#60a5fa',
  }
} as const;

// 높은 대비 모드 (접근성)
export const highContrastVariant = {
  ...lightTheme,
  
  colors: {
    ...lightTheme.colors,
    
    // 높은 대비 색상
    text: {
      primary: '#000000',
      secondary: '#333333', 
      tertiary: '#666666',
      inverse: '#ffffff',
    },
    
    background: {
      primary: '#ffffff',
      secondary: '#f0f0f0',
      tertiary: '#e0e0e0',
    },
    
    border: {
      light: '#cccccc',
      medium: '#999999',
      dark: '#666666',
    }
  }
} as const;

// 컴팩트 모드 (작은 화면용)
export const compactVariant = {
  spacing: {
    1: '0.125rem',  // 줄어든 간격
    2: '0.375rem',
    3: '0.625rem',
    4: '0.75rem',
    6: '1rem',
    8: '1.25rem',
    12: '2rem',
    16: '2.5rem',
    20: '3rem',
  },
  
  typography: {
    fontSize: {
      xs: '0.625rem',   // 줄어든 폰트
      sm: '0.75rem',
      base: '0.875rem',
      lg: '1rem',
      xl: '1.125rem',
      '2xl': '1.25rem',
      '3xl': '1.5rem',
      '4xl': '1.875rem',
      '5xl': '2.25rem',
    }
  }
} as const;

export type GameVariant = typeof gameVariant;
export type HighContrastVariant = typeof highContrastVariant;
export type CompactVariant = typeof compactVariant;