import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/config/axiosConfig';
import { useAuthStore } from '@/shared/store/authStore';
import { useToast } from '@/shared/store/uiStore';
import { CharacterGameStatus } from '../types/gameTypes';

export const useCharacterData = () => {
  const router = useRouter();
  const toast = useToast();
  const { isAuthenticated } = useAuthStore();

  const [character, setCharacter] = useState<CharacterGameStatus | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // 캐릭터 정보 조회
  const fetchCharacterInfo = async () => {
    if (!isAuthenticated()) {
      router.push('/auth/login');
      return;
    }

    try {
      setIsLoading(true);
      const response = await api.get<CharacterGameStatus>('/characters/game-status');
      setCharacter(response);
    } catch (error: any) {
      // 캐릭터가 없는 경우
      if (error.response?.status === 404) {
        setCharacter(null);
      } else {
        console.error('캐릭터 조회 실패:', error);
        toast.error('캐릭터 정보를 불러올 수 없습니다');
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCharacterInfo();
  }, []);

  return {
    character,
    isLoading,
    refetch: fetchCharacterInfo,
  };
};