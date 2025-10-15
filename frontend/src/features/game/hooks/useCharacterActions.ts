import { useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useToast } from '@/shared/store/uiStore';
import { api } from '@/config/axiosConfig';
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

  // 캐릭터 생성 페이지로 이동 (캐릭터 존재 여부 확인 후)
  const handleCreateCharacter = useCallback(async () => {
    try {
      const response = await api.get<{
        success: boolean;
        message: string;
        data: any;
      }>('/characters/exists');

      // 캐릭터가 이미 존재하면 캐릭터 정보 페이지로
      if (response.success && response.data) {
        toast.info('이미 캐릭터가 존재합니다');
        router.push('/character');
      } else {
        // 캐릭터가 없으면 생성 페이지로
        router.push('/character/create');
      }
    } catch (error: any) {
      // 404 에러 (캐릭터 없음) - 생성 페이지로
      if (error.response?.status === 404) {
        router.push('/character/create');
      } else {
        // 기타 에러 - 일단 생성 페이지로 (페이지에서 처리)
        console.error('Character check error:', error);
        router.push('/character/create');
      }
    }
  }, [router, toast]);

  return {
    handleResumeGame,
    handleNewGame,
    handleCreateCharacter,
  };
};