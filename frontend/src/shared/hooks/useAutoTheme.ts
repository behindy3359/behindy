import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

// 🎮 게임 관련 라우트만 다크모드 적용
const GAME_ROUTES = ['/game', '/character'];

export const useAutoTheme = () => {
  const pathname = usePathname();

  useEffect(() => {
    const isGameMode = GAME_ROUTES.some(route => pathname.startsWith(route));
    
    console.log('🎨 [useAutoTheme] 라우트 체크:', {
      pathname,
      isGameMode,
      gameRoutes: GAME_ROUTES
    });
    
    // 🔥 강제로 테마 설정
    if (isGameMode) {
      console.log('🌙 다크모드 적용');
      document.documentElement.setAttribute('data-theme', 'dark');
      document.documentElement.classList.add('game-mode');
      document.body.setAttribute('data-theme', 'dark'); // body에도 추가
    } else {
      console.log('☀️ 라이트모드 적용');
      document.documentElement.setAttribute('data-theme', 'light');
      document.documentElement.classList.remove('game-mode');
      document.body.setAttribute('data-theme', 'light'); // body에도 추가
    }
    
    // 🔄 정리 함수
    return () => {
      // 컴포넌트 언마운트 시에도 테마 확인
      const currentPath = window.location.pathname;
      const stillInGame = GAME_ROUTES.some(route => currentPath.startsWith(route));
      
      if (!stillInGame) {
        console.log('🧹 컴포넌트 정리 시 라이트모드 강제 적용');
        document.documentElement.setAttribute('data-theme', 'light');
        document.documentElement.classList.remove('game-mode');
        document.body.setAttribute('data-theme', 'light');
      }
    };
  }, [pathname]); // pathname이 변경될 때마다 실행

  const isGameMode = GAME_ROUTES.some(route => pathname.startsWith(route));
  
  return {
    isGameMode,
    theme: isGameMode ? 'dark' : 'light'
  };
};