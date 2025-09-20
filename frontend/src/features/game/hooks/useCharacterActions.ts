import { useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useToast } from '@/shared/store/uiStore';
import { resumeCurrentGame } from '../utils/gameNavigation';

export const useCharacterActions = () => {
  const router = useRouter();
  const toast = useToast();

  // 게임 재개
  const handleResumeGame = useCallback(() => {
    resumeCurrentGame(
      () => toast.success('게임을 재개합니다'),
      (error: unknown) => {
        // 타입 체크 후 처리
        if (error instanceof Error) {
          console.error('Error message:', error.message);
        } else {
          console.error('Unknown error:', error);
        }
      }
    );
  }, [toast]);

  // 새 게임 시작
  const handleNewGame = useCallback(() => {
    router.push('/');  // 메인 페이지로 이동하여 역 선택
  }, [router]);

  // 캐릭터 생성 페이지로 이동
  const handleCreateCharacter = useCallback(() => {
    router.push('/character/create');
  }, [router]);

  return {
    handleResumeGame,
    handleNewGame,
    handleCreateCharacter,
  };
};