import { api } from '@/config/axiosConfig';
import { useAuthStore } from '@/shared/store/authStore';
import { CharacterGameStatus, GameEnterResponse } from '../types/gameTypes';

interface NavigateToGameParams {
  stationName: string;
  lineNumber: number;
  onSuccess?: (response: GameEnterResponse) => void;
  onError?: (error: string) => void;
  onNoCharacter?: () => void;
  onRequireLogin?: () => void;
}

/**
 * 게임 페이지로 진입하는 공통 함수
 * 지하철 노선도, 네비게이션, 기타 위치에서 동일하게 사용
 */
export async function navigateToGame({
  stationName,
  lineNumber,
  onSuccess,
  onError,
  onNoCharacter,
  onRequireLogin,
}: NavigateToGameParams): Promise<void> {
  try {
    // 1. 로그인 상태 확인
    const isAuthenticated = useAuthStore.getState().isAuthenticated();
    if (!isAuthenticated) {
      console.log('🔒 로그인이 필요합니다');
      onRequireLogin?.();
      
      // 로그인 페이지로 리다이렉트
      if (typeof window !== 'undefined') {
        const returnUrl = `/game?station=${encodeURIComponent(stationName)}&line=${lineNumber}`;
        window.location.href = `/auth/login?returnUrl=${encodeURIComponent(returnUrl)}`;
      }
      return;
    }

    // 2. 캐릭터 상태 확인
    console.log('🎮 캐릭터 상태 확인 중...');
    const characterStatus = await api.get<CharacterGameStatus>('/api/characters/game-status');
    
    // 캐릭터가 없는 경우
    if (!characterStatus || !characterStatus.charId) {
      console.log('❌ 캐릭터가 없습니다. 생성 페이지로 이동');
      onNoCharacter?.();
      
      if (typeof window !== 'undefined') {
        const returnUrl = `/game?station=${encodeURIComponent(stationName)}&line=${lineNumber}`;
        window.location.href = `/character/create?returnUrl=${encodeURIComponent(returnUrl)}`;
      }
      return;
    }

    // 3. 게임 진입 시도
    console.log(`🚉 ${stationName}역 ${lineNumber}호선 게임 진입 시도`);
    const response = await api.post<GameEnterResponse>(
      `/api/game/enter/station/${encodeURIComponent(stationName)}/line/${lineNumber}`
    );

    if (response.success) {
      console.log('✅ 게임 진입 성공:', response.action);
      onSuccess?.(response);
      
      // 게임 페이지로 이동
      if (typeof window !== 'undefined') {
        // 쿼리 파라미터로 역 정보 전달
        const gameUrl = `/game?station=${encodeURIComponent(stationName)}&line=${lineNumber}`;
        window.location.href = gameUrl;
      }
    } else {
      throw new Error(response.message || '게임 진입에 실패했습니다');
    }
    
  } catch (error) {
    console.error('❌ 게임 진입 실패:', error);
    const errorMessage = error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다';
    onError?.(errorMessage);
  }
}

/**
 * 게임 재개 함수
 * 이미 진행 중인 게임이 있을 때 사용
 */
export async function resumeGame(
  onSuccess?: () => void,
  onError?: (error: string) => void
): Promise<void> {
  try {
    const status = await api.get<CharacterGameStatus>('/api/characters/game-status');
    
    if (status.hasActiveGame && status.currentStoryId) {
      console.log('🔄 게임 재개:', status.currentStoryTitle);
      onSuccess?.();
      
      if (typeof window !== 'undefined') {
        window.location.href = '/game';
      }
    } else {
      throw new Error('재개할 게임이 없습니다');
    }
  } catch (error) {
    console.error('❌ 게임 재개 실패:', error);
    const errorMessage = error instanceof Error ? error.message : '게임 재개에 실패했습니다';
    onError?.(errorMessage);
  }
}

/**
 * 게임 종료/포기 함수
 */
export async function quitGame(
  onSuccess?: () => void,
  onError?: (error: string) => void
): Promise<void> {
  try {
    await api.post('/api/game/quit');
    console.log('🏁 게임 종료됨');
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