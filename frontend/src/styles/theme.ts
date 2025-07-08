export const theme = {
  // 색상 시스템
  colors: {
    // 기본 브랜드 색상
    primary: {
      500: '#667eea',  // 메인 브랜드 컬러
      600: '#5a67d8',
    },
    
    // 보조 색상
    secondary: {
      500: '#764ba2',  // 메인 보조 컬러
      600: '#6b21a8',
    },

    // 지하철 노선 색상
    metro: {
      line1: '#0052A4',
      line2: '#00A84D', 
      line3: '#EF7C1C',
      line4: '#00A5DE',
    },

    // 그레이 스케일
    gray: {
      50: '#f9fafb',
      100: '#f3f4f6',
      200: '#e5e7eb',
      300: '#d1d5db',
      400: '#9ca3af',
      500: '#6b7280',
      600: '#4b5563',
      700: '#374151',
      800: '#1f2937',
      900: '#111827',
    },

    // 상태 색상
    success: '#10b981',
    warning: '#f59e0b',
    error: '#ef4444',

    // 배경 색상
    background: {
      primary: '#ffffff',
      secondary: '#f9fafb',
      tertiary: '#f3f4f6',
    },

    // 텍스트 색상
    text: {
      primary: '#111827',
      secondary: '#6b7280',
      tertiary: '#9ca3af',
      inverse: '#ffffff',
    },

    // 보더 색상
    border: {
      light: '#f3f4f6',
      medium: '#e5e7eb',
      dark: '#d1d5db',
    }
  },

  // 간격 시스템
  spacing: {
    1: '0.25rem',   // 4px
    2: '0.5rem',    // 8px
    3: '0.75rem',   // 12px
    4: '1rem',      // 16px
    6: '1.5rem',    // 24px
    8: '2rem',      // 32px
    12: '3rem',     // 48px
    16: '4rem',     // 64px
    20: '5rem',     // 80px
  },

  // 테두리 반지름
  borderRadius: {
    sm: '0.375rem',   // 6px
    md: '0.5rem',     // 8px
    lg: '0.75rem',    // 12px
    xl: '1rem',       // 16px
    '2xl': '1.25rem', // 20px
  },

  // 그림자 시스템
  shadows: {
    sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
    md: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
    lg: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
    
    card: '0 2px 8px rgba(0, 0, 0, 0.04)',
    button: '0 4px 14px 0 rgba(102, 126, 234, 0.3)',
    buttonHover: '0 6px 20px 0 rgba(102, 126, 234, 0.4)',
  },

  // 타이포그래피 시스텝
  typography: {
    fontFamily: {
      sans: ['system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
    },
    lineHeight: {
      normal: 1.5,
    },    
    fontSize: {
      xs: '0.75rem',      // 12px
      sm: '0.875rem',     // 14px
      base: '1rem',       // 16px
      lg: '1.125rem',     // 18px
      xl: '1.25rem',      // 20px
      '2xl': '1.5rem',    // 24px
      '3xl': '1.875rem',  // 30px
      '4xl': '2.25rem',   // 36px
      '5xl': '3rem',      // 48px
    },
  },

  // 중단점
  breakpoints: {
    sm: '640px',
    md: '768px',
    lg: '1024px',
  },

  // 컨테이너 최대 너비
  container: {
    lg: '900px',
  }
} as const;

export type Theme = typeof theme;

// 자주 사용하는 그라데이션들
export const gradients = {
  primary: `linear-gradient(135deg, ${theme.colors.primary[500]} 0%, ${theme.colors.secondary[500]} 100%)`,
  primaryHover: `linear-gradient(135deg, ${theme.colors.primary[600]} 0%, ${theme.colors.secondary[600]} 100%)`,
  
  // 🆕 추가 그라데이션들
  success: `linear-gradient(135deg, ${theme.colors.success} 0%, #059669 100%)`,
  error: `linear-gradient(135deg, ${theme.colors.error} 0%, #dc2626 100%)`,
  card: `linear-gradient(135deg, ${theme.colors.background.secondary} 0%, ${theme.colors.background.primary} 100%)`,
  
  // 🆕 방향별 그라데이션
  vertical: `linear-gradient(180deg, ${theme.colors.primary[500]} 0%, ${theme.colors.secondary[500]} 100%)`,
  radial: `radial-gradient(circle, ${theme.colors.primary[500]} 0%, ${theme.colors.secondary[500]} 100%)`,
} as const;

// 자주 사용하는 미디어 쿼리
export const mediaQueries = {
  sm: `@media (min-width: ${theme.breakpoints.sm})`,
  md: `@media (min-width: ${theme.breakpoints.md})`,
  maxSm: `@media (max-width: ${parseInt(theme.breakpoints.sm) - 1}px)`,
  maxMd: `@media (max-width: ${parseInt(theme.breakpoints.md) - 1}px)`,
} as const;

export default theme;