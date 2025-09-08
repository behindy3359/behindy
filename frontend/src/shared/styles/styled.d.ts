
import 'styled-components';

// 🔥 완전한 테마 타입 정의
export interface Theme {
  // 색상 시스템
  colors: {
    // 기본 브랜드 색상
    primary: {
      500: string;
      600: string;
    };
    
    // 보조 색상
    secondary: {
      500: string;
      600: string;
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

    // 🎮 게임 전용 색상
    game: {
      health: string;
      sanity: string;
      choice: string;
      success: string;
      danger: string;
      story: string;
    };
  };

  // 간격 시스템
  spacing: {
    1: string;
    2: string;
    3: string;
    4: string;
    6: string;
    8: string;
    12: string;
    16: string;
    20: string;
  };

  // 테두리 반지름
  borderRadius: {
    sm: string;
    md: string;
    lg: string;
    xl: string;
    '2xl': string;
  };

  // 그림자 시스템
  shadows: {
    sm: string;
    md: string;
    lg: string;
    card: string;
    button: string;
    buttonHover: string;
  };

  // 타이포그래피 시스템
  typography: {
    fontFamily: {
      sans: string[];
    };
    lineHeight: {
      normal: number;
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
  };

  // 중단점
  breakpoints: {
    sm: string;
    md: string;
    lg: string;
  };

  // 컨테이너 최대 너비
  container: {
    lg: string;
  };
}

declare module 'styled-components' {
  export interface DefaultTheme extends Theme {}
}
