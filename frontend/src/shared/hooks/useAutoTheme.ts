import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';

export const useAutoTheme = () => {
  const pathname = usePathname();
  const [isGameMode, setIsGameMode] = useState(false);

  // 게임 관련 경로 정의
  const gameRoutes = [
    '/game',
    '/character'
  ];

  useEffect(() => {
    // 현재 경로가 게임 관련 경로인지 확인
    const shouldEnterGameMode = gameRoutes.some(route => pathname.startsWith(route));
    
    if (shouldEnterGameMode !== isGameMode) {
      setIsGameMode(shouldEnterGameMode);
      
      // 테마 전환
      if (shouldEnterGameMode) {
        // 🌙 다크 테마 (게임 모드) 활성화
        document.documentElement.setAttribute('data-theme', 'dark');
        document.body.classList.add('game-mode');
        
        // 전환 애니메이션 트리거
        document.dispatchEvent(new CustomEvent('game-mode-enter'));
        
        console.log('🎮 게임 모드 진입 - 다크 테마 활성화');
      } else {
        // ☀️ 라이트 테마 (일반 모드) 활성화
        document.documentElement.setAttribute('data-theme', 'light');
        document.body.classList.remove('game-mode');
        
        console.log('🏠 일반 모드 진입 - 라이트 테마 활성화');
      }
    }
  }, [pathname, isGameMode]);

  // 컴포넌트 언마운트 시 정리
  useEffect(() => {
    return () => {
      // 페이지 이동 시 기본 테마로 복원
      if (isGameMode) {
        document.documentElement.setAttribute('data-theme', 'light');
        document.body.classList.remove('game-mode');
      }
    };
  }, []);

  return {
    isGameMode,
    setGameMode: (gameMode: boolean) => {
      setIsGameMode(gameMode);
      
      if (gameMode) {
        document.documentElement.setAttribute('data-theme', 'dark');
        document.body.classList.add('game-mode');
      } else {
        document.documentElement.setAttribute('data-theme', 'light');
        document.body.classList.remove('game-mode');
      }
    }
  };
};