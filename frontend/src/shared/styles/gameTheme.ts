export const gameTheme = {
  // 🌙 다크 테마 (게임 모드)
  dark: {
    colors: {
      // 배경색 - 깊고 신비로운 어둠
      background: {
        primary: '#0a0a0a',      // 거의 검은색
        secondary: '#1a1a1a',    // 약간 밝은 검은색
        tertiary: '#2a2a2a',     // 중간 회색
        accent: '#1e1b3a',       // 보라빛 어둠
      },
      
      // 텍스트 - 대비가 높은 밝은 색상
      text: {
        primary: '#ffffff',      // 순백색
        secondary: '#b0b0b0',    // 밝은 회색
        tertiary: '#808080',     // 중간 회색
        accent: '#a78bfa',       // 보라색 강조
      },
      
      // 게임 UI 색상
      game: {
        health: '#ef4444',       // 빨간색 (체력)
        sanity: '#8b5cf6',       // 보라색 (정신력)
        choice: '#3b82f6',       // 파란색 (선택지)
        story: '#64748b',        // 회색 (스토리 텍스트)
        success: '#22c55e',      // 초록색 (성공)
        danger: '#dc2626',       // 짙은 빨간색 (위험)
      },
      
      // 보더 및 구분선
      border: {
        primary: '#404040',      // 기본 보더
        secondary: '#2a2a2a',    // 약한 보더
        accent: '#6366f1',       // 강조 보더
      }
    },
    
    // 그림자 - 어둠 속에서 더 깊은 그림자
    shadows: {
      card: '0 4px 20px rgba(0, 0, 0, 0.5)',
      button: '0 2px 10px rgba(139, 92, 246, 0.3)',
      glow: '0 0 20px rgba(139, 92, 246, 0.2)',
    }
  },
  
  // ☀️ 라이트 테마 (일상 모드) - 기존 테마 유지
  light: {
    // 기존 라이트 테마 그대로 사용
  }
};