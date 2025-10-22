export const theme = {
  // 색상 시스템 - CSS 변수 사용으로 변경
  colors: {
    // 기본 브랜드 색상
    primary: {
      500: 'var(--primary-500)',
      600: 'var(--primary-600)',
    },
    
    // 보조 색상
    secondary: {
      500: 'var(--secondary-500)',
      600: 'var(--secondary-600)',
    },

    // 지하철 노선 색상 (변경 없음)
    metro: {
      line1: '#0052A4',
      line2: '#00A84D', 
      line3: '#EF7C1C',
      line4: '#00A5DE',
    },

    // 상태 색상
    success: 'var(--success)',
    warning: 'var(--warning)',
    error: 'var(--error)',

    // 배경 색상
    background: {
      primary: 'var(--bg-primary)',
      secondary: 'var(--bg-secondary)',
      tertiary: 'var(--bg-tertiary)',
    },

    // 텍스트 색상
    text: {
      primary: 'var(--text-primary)',
      secondary: 'var(--text-secondary)',
      tertiary: 'var(--text-tertiary)',
      inverse: 'var(--text-inverse)',
    },

    // 보더 색상
    border: {
      light: 'var(--border-light)',
      medium: 'var(--border-medium)',
      dark: 'var(--border-dark)',
    },

    // 🎮 게임 전용 색상 추가
    game: {
      health: 'var(--game-health)',
      sanity: 'var(--game-sanity)',
      choice: 'var(--game-choice)',
      success: 'var(--game-success)',
      danger: 'var(--game-danger)',
      story: 'var(--game-story)',
    }
  },

  // 그림자 시스템 - CSS 변수 사용
  shadows: {
    sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
    lg: 'var(--shadow-lg)',
    card: 'var(--shadow-card)',
    button: 'var(--shadow-button)',
    buttonHover: 'var(--shadow-button)',
    dropdown: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
  },

  // 나머지는 기존과 동일
  spacing: {
    1: '0.25rem',
    2: '0.5rem',
    3: '0.75rem',
    4: '1rem',
    6: '1.5rem',
    8: '2rem',
    12: '3rem',
    16: '4rem',
    20: '5rem',
  },

  borderRadius: {
    sm: '0.375rem',
    md: '0.5rem',
    lg: '0.75rem',
    xl: '1rem',
    '2xl': '1.25rem',
  },

  typography: {
    fontFamily: {
      sans: ['system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
    },
    lineHeight: {
      tight: 1.25,
      normal: 1.5,
      relaxed: 1.75,
      loose: 2,
    },
    fontWeight: {
      normal: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
    },
    fontSize: {
      xs: '0.75rem',
      sm: '0.875rem',
      base: '1rem',
      lg: '1.125rem',
      xl: '1.25rem',
      '2xl': '1.5rem',
      '3xl': '1.875rem',
      '4xl': '2.25rem',
      '5xl': '3rem',
    },
  },

  breakpoints: {
    sm: '640px',
    md: '768px',
    lg: '1024px',
  },

  container: {
    lg: '900px',
  },

  // z-index 레이어 시스템
  zIndex: {
    base: 1,
    dropdown: 100,
    popover: 1050,  // 메뉴, 드롭다운 등
    modal: 1000,
    toast: 2000,
    tooltip: 3000,
  },

  // 텍스트 스타일 시스템
  textStyles: {
    heading: {
      h1: {
        fontSize: '2.25rem',
        fontWeight: 700,
        lineHeight: 1.25,
      },
      h2: {
        fontSize: '1.875rem',
        fontWeight: 700,
        lineHeight: 1.3,
      },
      h3: {
        fontSize: '1.5rem',
        fontWeight: 600,
        lineHeight: 1.35,
      },
      h4: {
        fontSize: '1.25rem',
        fontWeight: 600,
        lineHeight: 1.4,
      },
    },
    body: {
      large: {
        fontSize: '1.125rem',
        lineHeight: 1.75,
      },
      medium: {
        fontSize: '1rem',
        lineHeight: 1.5,
      },
      small: {
        fontSize: '0.875rem',
        lineHeight: 1.5,
      },
    },
  },

  // 전환 효과
  transition: {
    fast: 'all 0.15s ease',
    normal: 'all 0.3s ease',
    slow: 'all 0.5s ease',
  },
} as const;

export const gradients = {
  primary: `linear-gradient(135deg, var(--primary-500) 0%, var(--secondary-500) 100%)`,
  primaryHover: `linear-gradient(135deg, var(--primary-600) 0%, var(--secondary-600) 100%)`,
  
  // 게임 모드 전용 그라데이션
  gameBackground: `linear-gradient(180deg, var(--bg-primary) 0%, var(--bg-secondary) 100%)`,
  gameCard: `linear-gradient(135deg, var(--bg-secondary) 0%, var(--bg-tertiary) 100%)`,
  
  // 기존 그라데이션
  success: `linear-gradient(135deg, var(--success) 0%, #059669 100%)`,
  error: `linear-gradient(135deg, var(--error) 0%, #dc2626 100%)`,
} as const;
