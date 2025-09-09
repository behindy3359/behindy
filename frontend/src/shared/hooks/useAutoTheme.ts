
import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';

const GAME_ROUTES = ['/character']; // 🔥 /game 제거, 캐릭터 페이지만

// 🎮 게임 테마 수동 제어 함수들
export const gameThemeControls = {
  // 게임 성공 시 다크모드 적용
  enableGameMode: () => {
    console.log('🎮 게임 모드 활성화 - 다크모드 적용');
    document.documentElement.setAttribute('data-theme', 'dark');
    document.documentElement.classList.add('game-mode');
    document.body.setAttribute('data-theme', 'dark');
  },
  
  // 게임 종료 시 라이트모드 복원
  disableGameMode: () => {
    console.log('☀️ 게임 모드 비활성화 - 라이트모드 복원');
    document.documentElement.setAttribute('data-theme', 'light');
    document.documentElement.classList.remove('game-mode');
    document.body.setAttribute('data-theme', 'light');
  },
  
  // 현재 테마 확인
  getCurrentTheme: () => {
    return document.documentElement.getAttribute('data-theme') || 'light';
  }
};

export const useAutoTheme = () => {
  const pathname = usePathname();

  useEffect(() => {
    // 🔥 오직 캐릭터 페이지에서만 자동 다크모드
    const isCharacterPage = pathname.startsWith('/character');
    
    if (isCharacterPage) {
      console.log('👤 캐릭터 페이지 - 다크모드 적용');
      gameThemeControls.enableGameMode();
    } else {
      console.log('🏠 일반 페이지 - 라이트모드 적용');
      gameThemeControls.disableGameMode();
    }
  }, [pathname]);

  const isGameMode = pathname.startsWith('/character'); // /game 제외
  
  return {
    isGameMode,
    theme: isGameMode ? 'dark' : 'light'
  };
};
