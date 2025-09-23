export const colors = {
  // 기본 브랜드 색상
  primary: {
    500: '#667eea',
    600: '#5a67d8',
  },
  
  secondary: {
    500: '#764ba2', 
    600: '#6b21a8',
  },

  // 지하철 노선 색상
  metro: {
    line1: '#0052A4',
    line2: '#00A84D', 
    line3: '#EF7C1C',
    line4: '#00A5DE',
  },

  // 상태 색상
  success: '#10b981',
  warning: '#f59e0b',
  error: '#ef4444',

  // 라이트 테마 배경
  background: {
    light: {
      primary: '#ffffff',
      secondary: '#f9fafb',
      tertiary: '#f3f4f6',
    },
    dark: {
      primary: '#0a0a0a',
      secondary: '#1a1a1a', 
      tertiary: '#2a2a2a',
    }
  },

  // 라이트 테마 텍스트
  text: {
    light: {
      primary: '#111827',
      secondary: '#6b7280',
      tertiary: '#9ca3af',
      inverse: '#ffffff',
    },
    dark: {
      primary: '#ffffff',
      secondary: '#b0b0b0',
      tertiary: '#808080',
      inverse: '#0a0a0a',
    }
  },

  // 보더 색상
  border: {
    light: {
      light: '#f3f4f6',
      medium: '#e5e7eb',
      dark: '#d1d5db',
    },
    dark: {
      light: '#404040',
      medium: '#2a2a2a',
      dark: '#6366f1',
    }
  },

  // 게임 전용 색상
  game: {
    health: '#ef4444',
    sanity: '#8b5cf6',
    choice: '#3b82f6',
    success: '#22c55e',
    danger: '#dc2626',
    story: '#64748b',
  }
} as const;