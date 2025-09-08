import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

// 🎮 게임 모드 라우트 정의
const GAME_ROUTES = ['/game', '/character'];

export const useAutoTheme = () => {
  const pathname = usePathname();

  useEffect(() => {
    const isGameMode = GAME_ROUTES.some(route => pathname.startsWith(route));
    
    // 🎯 HTML 요소에 데이터 속성 추가
    document.documentElement.setAttribute('data-theme', isGameMode ? 'dark' : 'light');
    document.documentElement.classList.toggle('game-mode', isGameMode);
    
    // 🌟 게임 진입 시 전환 효과 트리거
    if (isGameMode) {
      document.documentElement.classList.add('theme-transitioning');
      setTimeout(() => {
        document.documentElement.classList.remove('theme-transitioning');
      }, 500);
    }
    
    console.log(`🎨 테마 변경: ${isGameMode ? '다크(게임)' : '라이트(일상)'} 모드`);
  }, [pathname]);

  const isGameMode = GAME_ROUTES.some(route => pathname.startsWith(route));
  
  return {
    isGameMode,
    theme: isGameMode ? 'dark' : 'light'
  };
};