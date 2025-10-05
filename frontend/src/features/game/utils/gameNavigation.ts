import { api } from '@/config/axiosConfig';
import { useAuthStore } from '@/shared/store/authStore';
import { API_ENDPOINTS } from '@/shared/utils/common/api';

interface NavigateToGameParams {
  stationName: string;
  lineNumber: number;
  onRequireLogin?: () => void;
  onSuccess?: () => void;
}

/**
 *  단순화된 게임 진입 함수
 */
export function navigateToGame({
  stationName,
  lineNumber,
  onRequireLogin,
  onSuccess,
}: NavigateToGameParams): void {
  
  // 1. 로그인 상태 확인
  const isAuthenticated = useAuthStore.getState().isAuthenticated();
  if (!isAuthenticated) {
    console.log('🔒 로그인이 필요합니다');
    onRequireLogin?.();
    
    // 로그인 페이지로 리다이렉트 (returnUrl 포함)
    if (typeof window !== 'undefined') {
      const returnUrl = `/game?station=${encodeURIComponent(stationName)}&line=${lineNumber}`;
      window.location.href = `/auth/login?returnUrl=${encodeURIComponent(returnUrl)}`;
    }
    return;
  }

  // 2. 로그인된 상태: 게임 페이지로 이동
  console.log(`🚉 ${stationName}역 ${lineNumber}호선 게임 페이지로 이동`);
  onSuccess?.();
  
  if (typeof window !== 'undefined') {
    const gameUrl = `/game?station=${encodeURIComponent(stationName)}&line=${lineNumber}`;
    window.location.href = gameUrl;
  }
}

/**
 *  현재 게임 재개
 */
export function resumeCurrentGame(
  onSuccess?: () => void,
  onError?: (error: unknown) => void
): void {
  try {
    console.log('🔄 게임 재개 시도');
    
    if (typeof window !== 'undefined') {
      window.location.href = '/game';
    }
    
    onSuccess?.();
  } catch (error) {
    console.error('❌ 게임 재개 실패:', error);
    onError?.(error);
  }
}

export async function quitGame(
  onSuccess?: () => void,
  onError?: (error: string) => void
): Promise<void> {
  try {
    await api.post(API_ENDPOINTS.GAME.QUIT);
    console.log('🏁 게임 종료됨');
    
    document.documentElement.setAttribute('data-theme', 'light');
    document.documentElement.classList.remove('game-mode');
    document.body.setAttribute('data-theme', 'light');
    
    onSuccess?.();
    
    if (typeof window !== 'undefined') {
      window.location.href = '/';
    }
  } catch (error) {
    console.error('❌ 게임 종료 실패:', error);
    const errorMessage = error instanceof Error ? error.message : '게임 종료에 실패했습니다';
    onError?.(errorMessage);
  }
}

/**
 *  게임 종료 후 메인으로 (API 호출 없이)
 */
export function exitToMain(): void {
  console.log('🏠 메인으로 이동 - 라이트모드 강제 적용');
  
  document.documentElement.setAttribute('data-theme', 'light');
  document.documentElement.classList.remove('game-mode');
  document.body.setAttribute('data-theme', 'light');
  
  if (typeof window !== 'undefined') {
    window.location.href = '/';
  }
}

export default {
  navigateToGame,
  resumeCurrentGame,
  quitGame,
  exitToMain,
};