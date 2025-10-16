import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/config/axiosConfig';
import { useAuthStore } from '@/shared/store/authStore';
import { useToast } from '@/shared/store/uiStore';
import { Character } from '../types/gameTypes';

// 랜덤 이름 생성용 데이터
const RANDOM_NAMES = {
  prefix: ['용감한', '지혜로운', '빠른', '강한', '영리한', '날렵한', '침착한', '대담한', '신중한', '열정적인'],
  suffix: ['모험가', '탐험가', '여행자', '수호자', '개척자', '발견자', '관찰자', '기록자', '안내자', '추적자']
};

interface UseCharacterCreateParams {
  returnUrl: string;
  stationName: string | null;
  lineNumber: string | null;
}

export const useCharacterCreate = ({ returnUrl, stationName, lineNumber }: UseCharacterCreateParams) => {
  const router = useRouter();
  const toast = useToast();
  const { isAuthenticated } = useAuthStore();

  // 상태
  const [charName, setCharName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isChecking, setIsChecking] = useState(true);
  const [existingCharacter, setExistingCharacter] = useState<Character | null>(null);
  const [nameError, setNameError] = useState('');

  // 기존 캐릭터 확인
  const checkExistingCharacter = async () => {
    if (!isAuthenticated()) {
      router.push('/auth/login');
      return;
    }

    try {
      setIsChecking(true);

      const response = await api.get<{
        success: boolean;
        message: string;
        data: Character | null;
      }>('/characters/exists');

      if (response.success && response.data) {
        setExistingCharacter(response.data);
      }
    } catch (error: any) {
      // 404는 정상 (캐릭터 없음)
      if (error.response?.status !== 404) {
        console.error('Character check error:', error);
      }
    } finally {
      setIsChecking(false);
    }
  };

  // 랜덤 이름 생성
  const generateRandomName = () => {
    const prefix = RANDOM_NAMES.prefix[Math.floor(Math.random() * RANDOM_NAMES.prefix.length)];
    const suffix = RANDOM_NAMES.suffix[Math.floor(Math.random() * RANDOM_NAMES.suffix.length)];
    setCharName(`${prefix}${suffix}`);
    setNameError('');
  };

  // 이름 유효성 검사
  const validateName = (name: string): boolean => {
    if (!name.trim()) {
      setNameError('이름을 입력해주세요');
      return false;
    }
    if (name.length < 2) {
      setNameError('이름은 2자 이상이어야 합니다');
      return false;
    }
    if (name.length > 20) {
      setNameError('이름은 20자 이하여야 합니다');
      return false;
    }
    const nameRegex = /^[가-힣a-zA-Z0-9\s]+$/;
    if (!nameRegex.test(name)) {
      setNameError('한글, 영문, 숫자만 사용 가능합니다');
      return false;
    }
    return true;
  };

  // 캐릭터 생성
  const handleCreateCharacter = async () => {
    if (!validateName(charName)) {
      return;
    }

    try {
      setIsLoading(true);

      const response = await api.post<Character>('/characters', {
        charName: charName.trim()
      });

      toast.success(`캐릭터 '${response.charName}'이 생성되었습니다!`);

      // 노선도에서 진입한 경우
      if (stationName && lineNumber) {
        // 약간의 딜레이 후 게임 시작 안내
        await new Promise(resolve => setTimeout(resolve, 800));
        toast.info('게임을 시작합니다...');

        await new Promise(resolve => setTimeout(resolve, 500));
        const gameUrl = `/game?station=${encodeURIComponent(stationName)}&line=${lineNumber}`;
        router.push(gameUrl);
      }
      // returnUrl이 있는 경우
      else if (returnUrl && returnUrl !== '/') {
        await new Promise(resolve => setTimeout(resolve, 800));
        router.push(returnUrl);
      }
      // 기본: 홈으로 이동
      else {
        await new Promise(resolve => setTimeout(resolve, 800));
        toast.info('홈으로 돌아갑니다');
        await new Promise(resolve => setTimeout(resolve, 500));
        router.push('/');
      }
    } catch (error: any) {
      console.error('Character creation failed:', error);

      let errorMessage = '캐릭터 생성에 실패했습니다';

      if (error && typeof error === 'object' && 'response' in error) {
        const axiosError = error as {
          response: {
            status: number;
            data: { message: string };
            statusText?: string;
          };
          message?: string;
        };

        errorMessage = axiosError.response?.data?.message || errorMessage;

        if (axiosError.response?.status === 409) {
          // 이미 캐릭터가 있다는 에러인 경우 다시 확인
          checkExistingCharacter();
        }
      }

      toast.error(errorMessage);
      setIsLoading(false);
    }
    // Note: setIsLoading(false)를 finally에서 제거 - 페이지 전환 시까지 로딩 유지
  };

  // 기존 캐릭터로 계속하기
  const handleContinueWithExisting = () => {
    if (stationName && lineNumber) {
      const gameUrl = `/game?station=${encodeURIComponent(stationName)}&line=${lineNumber}`;
      router.push(gameUrl);
    } else if (returnUrl && returnUrl !== '/') {
      router.push(returnUrl);
    } else {
      router.push('/');
    }
  };

  // 홈으로 돌아가기
  const handleGoHome = () => {
    router.push('/');
  };

  // 기존 캐릭터 포기하고 새로 만들기
  const handleAbandonAndCreate = async () => {
    if (!existingCharacter) return;

    if (!confirm(`정말로 '${existingCharacter.charName}' 캐릭터를 포기하고 새로 만드시겠습니까?\n이 작업은 되돌릴 수 없습니다.`)) {
      return;
    }

    try {
      setIsLoading(true);

      await api.post('/game/quit');

      setExistingCharacter(null);
      toast.info('이전 캐릭터를 포기했습니다. 새로운 캐릭터를 만들어주세요.');
    } catch (error: any) {
      console.error('Character abandon failed:', error);
      toast.error('캐릭터 포기에 실패했습니다');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    checkExistingCharacter();
  }, []);

  return {
    isChecking,
    existingCharacter,
    charName,
    isLoading,
    nameError,
    setCharName,
    setNameError,
    handleCreateCharacter,
    handleContinueWithExisting,
    handleGoHome,
    handleAbandonAndCreate,
    generateRandomName,
    validateName,
  };
};