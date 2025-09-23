import 'styled-components';

// 통합된 테마 타입 정의
export interface Theme {
  // 간격 시스템
  spacing: {
    1: string;
    2: string;
    3: string;
    4: string;
    6: string;
    8: string;
    10: string;
    12: string;
    16: string;
    20: string;
  };
  
  // 컴포넌트별 간격
  componentSpacing: {
    card: {
      padding: string;
      gap: string;
    };
    button: {
      sm: { padding: string; gap: string; };
      md: { padding: string; gap: string; };
      lg: { padding: string; gap: string; };
    };
    input: {
      sm: { padding: string; height: string; };
      md: { padding: string; height: string; };
      lg: { padding: string; height: string; };
    };
    form: {
      fieldGap: string;
      sectionGap: string;
    };
    layout: {
      pageMargin: string;
      sectionGap: string;
      cardGap: string;
    };
  };

  // 색상 시스템
  colors: {
    // 브랜드 색상
    primary: {
      500: string;
      600: string;
    };
    secondary: {
      500: string;
      600: string;
    };

    // 배경 색상
    background: {
      primary: string;
      secondary: string;
      tertiary: string;
    };

    // 텍스트 색상
    text: {
      primary: string;
      secondary: string;
      tertiary: string;
      inverse: string;
    };

    // 보더 색상
    border: {
      light: string;
      medium: string;
      dark: string;
    };

    // 지하철 노선 색상
    metro: {
      line1: string;
      line2: string;
      line3: string;
      line4: string;
    };

    // 상태 색상
    success: string;
    warning: string;
    error: string;

    // 게임 색상
    game: {
      health: string;
      sanity: string;
      choice: string;
      success: string;
      danger: string;
      story: string;
    };
  };

  // 타이포그래피 시스템
  typography: {
    fontFamily: {
      sans: readonly string[];
    };
    fontSize: {
      xs: string;
      sm: string;
      base: string;
      lg: string;
      xl: string;
      '2xl': string;
      '3xl': string;
      '4xl': string;
      '5xl': string;
    };
    fontWeight: {
      normal: number;
      medium: number;
      semibold: number;
      bold: number;
      extrabold: number;
    };
    lineHeight: {
      tight: number;
      normal: number;
      relaxed: number;
      loose: number;
    };
  };

  // 텍스트 스타일 프리셋
  textStyles: {
    heading: {
      h1: { fontSize: string; fontWeight: number; lineHeight: number; };
      h2: { fontSize: string; fontWeight: number; lineHeight: number; };
      h3: { fontSize: string; fontWeight: number; lineHeight: number; };
      h4: { fontSize: string; fontWeight: number; lineHeight: number; };
    };
    body: {
      large: { fontSize: string; fontWeight: number; lineHeight: number; };
      normal: { fontSize: string; fontWeight: number; lineHeight: number; };
      small: { fontSize: string; fontWeight: number; lineHeight: number; };
    };
    ui: {
      button: { fontSize: string; fontWeight: number; };
      caption: { fontSize: string; fontWeight: number; };
      label: { fontSize: string; fontWeight: number; };
    };
  };

  // 그림자 시스템
  shadows: {
    base: {
      sm: string;
      md: string;
      lg: string;
      xl: string;
    };
    card: string;
    button: string;
    buttonHover: string;
    focus: string;
    dropdown: string;
    glow?: string; // 다크 테마에서만 사용
  };

  // 테두리 반지름
  borderRadius: {
    sm: string;
    md: string;
    lg: string;
    xl: string;
    '2xl': string;
  };

  // 중단점 (반응형)
  breakpoints: {
    sm: string;
    md: string;
    lg: string;
    xl: string;
  };

  // 컨테이너 최대 너비
  container: {
    sm: string;
    md: string;
    lg: string;
    xl: string;
  };

  // 트랜지션
  transition: {
    fast: string;
    normal: string;
    slow: string;
  };

  // z-index 스케일
  zIndex: {
    dropdown: number;
    sticky: number;
    fixed: number;
    modal: number;
    popover: number;
    tooltip: number;
  };

  // 게임 모드 전용 속성 (선택적)
  gameMode?: boolean;
  backgrounds?: {
    gameBackground: string;
    gameCard: string;
    gameOverlay: string;
  };
  animations?: {
    pulse: string;
    glow: string;
    typewriter: string;
  };
  gameColors?: {
    healthBar: string;
    sanityBar: string;
    choiceHover: string;
    storyText: string;
    narratorText: string;
    playerChoice: string;
  };
}

declare module 'styled-components' {
  export interface DefaultTheme extends Theme {}
}