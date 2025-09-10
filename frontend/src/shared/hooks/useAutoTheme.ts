// 🧹 정리된 useAutoTheme 훅 - 개발 로그 제거
// frontend/src/shared/hooks/useAutoTheme.ts

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

const GAME_ROUTES = ['/character']; // 오직 캐릭터 페이지만

// 🎮 게임 테마 수동 제어 함수들
export const gameThemeControls = {
  // 게임 성공 시 다크모드 적용
  enableGameMode: () => {
    document.documentElement.setAttribute('data-theme', 'dark');
    document.documentElement.classList.add('game-mode');
    document.body.setAttribute('data-theme', 'dark');
  },
  
  // 게임 종료 시 라이트모드 복원
  disableGameMode: () => {
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
    const isCharacterPage = pathname.startsWith('/character');
    
    if (isCharacterPage) {
      gameThemeControls.enableGameMode();
    } else {
      gameThemeControls.disableGameMode();
    }
  }, [pathname]);

  const isGameMode = pathname.startsWith('/character');
  
  return {
    isGameMode,
    theme: isGameMode ? 'dark' : 'light'
  };
};