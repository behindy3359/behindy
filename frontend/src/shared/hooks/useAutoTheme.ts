
import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';

const GAME_ROUTES = ['/game', '/character'];

// 🔥 테마 전환 지연을 위한 플래그
let isGameEntryAttempt = false;
let themeTransitionDelay: NodeJS.Timeout | null = null;

export const useAutoTheme = () => {
  const pathname = usePathname();
  const previousPathnameRef = useRef(pathname);

  useEffect(() => {
    const isGameMode = GAME_ROUTES.some(route => pathname.startsWith(route));
    const wasGameMode = GAME_ROUTES.some(route => previousPathnameRef.current.startsWith(route));
    
    console.log('🎨 [useAutoTheme] 라우트 변경 감지:', {
      from: previousPathnameRef.current,
      to: pathname,
      wasGameMode,
      isGameMode,
      isGameEntryAttempt
    });

    // 🎮 게임 모드로 진입하는 경우
    if (isGameMode && !wasGameMode) {
      console.log('🎮 게임 모드 진입 - 즉시 다크모드 적용');
      isGameEntryAttempt = true;
      applyTheme('dark');
    }
    
    // 🏠 게임 모드에서 나오는 경우
    else if (!isGameMode && wasGameMode) {
      console.log('🏠 게임 모드 종료 감지');
      
      // 🔥 게임 진입 시도 중이었다면 지연 적용
      if (isGameEntryAttempt) {
        console.log('⏳ 게임 진입 실패로 인한 즉시 복귀 - 테마 전환 지연');
        
        // 기존 지연 타이머 취소
        if (themeTransitionDelay) {
          clearTimeout(themeTransitionDelay);
        }
        
        // 🕒 1.5초 후에 라이트모드 적용 (사용자가 상황을 인지할 시간)
        themeTransitionDelay = setTimeout(() => {
          console.log('✨ 지연된 라이트모드 적용');
          applyTheme('light');
          isGameEntryAttempt = false;
        }, 1500);
      } else {
        // 정상적인 게임 종료인 경우 즉시 적용
        console.log('✨ 정상 게임 종료 - 즉시 라이트모드 적용');
        applyTheme('light');
      }
    }
    
    // 🔄 이전 경로 업데이트
    previousPathnameRef.current = pathname;
    
    // 🧹 정리 함수
    return () => {
      if (themeTransitionDelay) {
        clearTimeout(themeTransitionDelay);
      }
    };
  }, [pathname]);

  const isGameMode = GAME_ROUTES.some(route => pathname.startsWith(route));
  
  return {
    isGameMode,
    theme: isGameMode ? 'dark' : 'light'
  };
};

// 🎨 테마 적용 헬퍼 함수
function applyTheme(theme: 'light' | 'dark') {
  console.log(`🎨 테마 적용: ${theme}`);
  
  document.documentElement.setAttribute('data-theme', theme);
  document.body.setAttribute('data-theme', theme);
  
  if (theme === 'dark') {
    document.documentElement.classList.add('game-mode');
  } else {
    document.documentElement.classList.remove('game-mode');
  }
}

// 🎯 게임 진입 성공 시 호출할 함수 (게임 페이지에서 사용)
export function confirmGameEntry() {
  console.log('✅ 게임 진입 성공 확인');
  isGameEntryAttempt = false; // 플래그 리셋
  
  // 혹시 대기 중인 테마 전환이 있다면 취소
  if (themeTransitionDelay) {
    clearTimeout(themeTransitionDelay);
    themeTransitionDelay = null;
  }
}

// 🏠 게임 진입 실패 시 호출할 함수
export function handleGameEntryFailure() {
  console.log('❌ 게임 진입 실패 - 부드러운 홈 복귀');
  isGameEntryAttempt = false;
  
  // 즉시 라이트모드로 전환하지 않고 자연스럽게 처리
  if (themeTransitionDelay) {
    clearTimeout(themeTransitionDelay);
  }
  
  // 짧은 지연 후 라이트모드 적용
  themeTransitionDelay = setTimeout(() => {
    applyTheme('light');
  }, 800);
}
