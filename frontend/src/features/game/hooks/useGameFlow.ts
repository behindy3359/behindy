import { useState, useEffect, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/config/axiosConfig';
import { useAuthStore } from '@/shared/store/authStore';
import { useToast } from '@/shared/store/uiStore';
import { gameThemeControls } from '@/shared/hooks/useAutoTheme';
import {
  GameFlowState,
  Character,
  GameData,
  GameCompletionData,
  GameEnterResponse,
  ChoiceResponse,
} from '../types/gameTypes';
import {
  enrichCharacterData,
  createCharacterFromAPI,
} from '../utils/characterUtils';

interface UseGameFlowParams {
  stationName: string;
  lineNumber: string;
}

export const useGameFlow = ({ stationName, lineNumber }: UseGameFlowParams) => {
  const router = useRouter();
  const toast = useToast();
  const { isAuthenticated } = useAuthStore();
  const initializeRef = useRef(false);

  // 상태
  const [gameState, setGameState] = useState<GameFlowState>('LOADING');
  const [character, setCharacter] = useState<Character | null>(null);
  const [gameData, setGameData] = useState<GameData | null>(null);
  const [error, setError] = useState<string>('');
  const [isChoiceLoading, setIsChoiceLoading] = useState(false);
  const [canMakeChoice, setCanMakeChoice] = useState(false);
  const [hasInitialized, setHasInitialized] = useState(false);
  const [gameCompletionData, setGameCompletionData] = useState<GameCompletionData | null>(null);
  const [gameStartTime, setGameStartTime] = useState<string | null>(null);

  // 게임 페이지 진입 시 라이트모드 유지
  useEffect(() => {
    gameThemeControls.disableGameMode();
  }, []);

  // 게임 페이지 떠날 때 라이트모드 복원
  useEffect(() => {
    return () => {
      gameThemeControls.disableGameMode();
    };
  }, []);

  const getCompletionGrade = (character: Character): string => {
    const totalStats = character.charHealth + character.charSanity;
    if (totalStats >= 180) return 'S';
    if (totalStats >= 160) return 'A';
    if (totalStats >= 140) return 'B';
    if (totalStats >= 120) return 'C';
    return 'D';
  };

  const initializeGame = useCallback(async () => {
    if (initializeRef.current || hasInitialized) {
      return;
    }

    initializeRef.current = true;

    if (!isAuthenticated()) {
      router.push('/auth/login');
      return;
    }

    if (!stationName || !lineNumber) {
      setError('역 정보가 올바르지 않습니다');
      setGameState('ERROR');
      toast.error('역 정보가 올바르지 않습니다');
      router.push('/');
      return;
    }

    try {
      setGameState('LOADING');
      setError('');

      let characterStatus: Character | null = null;

      try {
        const characterResponse = await api.get<{
          success: boolean;
          message: string;
          data: Character | null;
        }>('/characters/exists');

        if (characterResponse.success && characterResponse.data) {
          characterStatus = createCharacterFromAPI(characterResponse.data);
        } else {
          setGameState('CHARACTER_CREATE');
          setHasInitialized(true);
          return;
        }
      } catch (characterError: any) {
        if (characterError.response?.status === 404) {
          redirectToCharacterCreation();
          return;
        } else {
          throw characterError;
        }
      }

      if (characterStatus && characterStatus.charId) {
        setCharacter(characterStatus);

        const gameEnterUrl = `/game/enter/station/${encodeURIComponent(stationName)}/line/${lineNumber}`;
        const gameResponse = await api.post<GameEnterResponse>(gameEnterUrl);

        if (gameResponse.character) {
          const enrichedCharacter = enrichCharacterData(characterStatus, gameResponse.character);
          setCharacter(enrichedCharacter);
        }

        if (!gameStartTime) {
          setGameStartTime(new Date().toISOString());
        }

        switch (gameResponse.action) {
          case 'START_NEW':
            gameThemeControls.enableGameMode();
            setGameData({
              storyId: gameResponse.selectedStoryId!,
              storyTitle: gameResponse.selectedStoryTitle!,
              currentPage: gameResponse.firstPage!,
              stationName: gameResponse.stationName,
              stationLine: gameResponse.stationLine
            });
            setGameState('GAME_PLAYING');
            toast.success('새로운 스토리를 시작합니다!');
            break;

          case 'RESUME_EXISTING':
            gameThemeControls.enableGameMode();
            setGameData({
              storyId: gameResponse.resumeStoryId!,
              storyTitle: gameResponse.resumeStoryTitle!,
              currentPage: gameResponse.currentPage!,
              stationName: gameResponse.stationName,
              stationLine: gameResponse.stationLine
            });
            setGameState('GAME_PLAYING');
            if (stationName !== gameResponse.stationName || lineNumber !== gameResponse.stationLine.toString()) {
              toast.info(`진행 중인 게임을 재개합니다 (${gameResponse.stationName}역 ${gameResponse.stationLine}호선)`);
            } else {
              toast.info('진행 중인 게임을 재개합니다');
            }
            break;

          case 'NO_STORIES':
            setGameState('NO_STORIES');
            break;

          default:
            console.error('Unknown game action:', gameResponse.action);
            throw new Error('알 수 없는 게임 상태');
        }
      } else {
        setGameState('CHARACTER_CREATE');
      }

      setHasInitialized(true);
    } catch (error: any) {
      console.error('Game initialization failed:', error.message);
      const errorMessage = error.response?.data?.message || error.message || '게임을 시작할 수 없습니다';
      setError(errorMessage);
      setGameState('ERROR');
      toast.error(errorMessage);
      router.push('/');
    } finally {
      initializeRef.current = false;
    }
  }, [stationName, lineNumber, isAuthenticated, router, toast, hasInitialized, gameStartTime]);

  const redirectToCharacterCreation = () => {
    const createUrl = `/character/create?station=${encodeURIComponent(stationName!)}&line=${lineNumber}&returnUrl=${encodeURIComponent(window.location.href)}`;
    router.push(createUrl);
  };

  const handleCharacterCreated = useCallback((newCharacter: Character) => {
    const enrichedCharacter = createCharacterFromAPI(newCharacter);
    setCharacter(enrichedCharacter);
    setHasInitialized(false);
    toast.success(`${enrichedCharacter.charName} 캐릭터로 게임을 시작합니다!`);

    setTimeout(() => {
      initializeGame();
    }, 1000);
  }, [initializeGame, toast]);

  const handleChoice = async (optionId: number) => {
    if (!character || isChoiceLoading || !gameData) {
      return;
    }

    if (character.isAlive === false) {
      toast.error('사망한 캐릭터로는 선택할 수 없습니다');
      return;
    }

    try {
      setIsChoiceLoading(true);
      setCanMakeChoice(false);

      const requestUrl = `/game/choice/${optionId}`;
      const response = await api.post<ChoiceResponse>(requestUrl);

      if (!response.success) {
        throw new Error(response.message || '선택 처리에 실패했습니다');
      }

      if (response.result) {
        toast.info(response.result);
      }

      let updatedCharacter = character;
      if (response.updatedCharacter) {
        updatedCharacter = enrichCharacterData(character, response.updatedCharacter);
        setCharacter(updatedCharacter);
      }

      const isStoryComplete = response.gameOverReason === '스토리 완료';
      const isCharacterDead = response.gameOverReason === '캐릭터 사망';
      const hasNoNextPage = !response.nextPage;
      const isExplicitGameOver = response.isGameOver === true;

      const shouldEndGame = isStoryComplete || isCharacterDead || hasNoNextPage || isExplicitGameOver;

      if (shouldEndGame) {
        if (gameData && gameStartTime) {
          const completionType = isStoryComplete ? 'success' : 'death';

          setGameCompletionData({
            completionType,
            finalCharacter: updatedCharacter,
            gameStartTime,
            storyData: gameData
          });
        }

        setGameState('GAME_COMPLETED');

        if (isStoryComplete) {
          toast.success('🎉 축하합니다! 스토리를 완료했습니다!');
        } else if (isCharacterDead) {
          toast.error('💀 캐릭터가 사망했습니다');
        } else {
          toast.info('🏁 게임이 종료되었습니다');
        }

        return;
      }

      if (response.nextPage && gameData) {
        setGameData({
          ...gameData,
          currentPage: response.nextPage
        });
        setCanMakeChoice(false);
        return;
      }

      toast.warning('게임이 예상치 못하게 종료되었습니다');

      if (gameData && gameStartTime) {
        setGameCompletionData({
          completionType: 'death',
          finalCharacter: updatedCharacter,
          gameStartTime,
          storyData: gameData
        });
      }

      setGameState('GAME_COMPLETED');
    } catch (error: unknown) {
      console.error('Game choice failed:', error instanceof Error ? error.message : 'Unknown');

      if (error && typeof error === 'object' && 'response' in error) {
        const axiosError = error as {
          response: {
            status: number;
            data: { message: string };
          };
        };

        const errorMessage = axiosError.response?.data?.message || '선택을 처리할 수 없습니다';

        switch (axiosError.response?.status) {
          case 404:
            console.error('Game session not found');
            toast.error('게임 세션을 찾을 수 없습니다. 게임을 다시 시작해주세요.');
            setGameState('ERROR');
            setError('게임 세션이 만료되었습니다');
            break;
          case 401:
            console.error('Authentication failed');
            toast.error('로그인이 필요합니다');
            router.push('/auth/login');
            break;
          case 400:
            toast.error('잘못된 선택입니다. 다시 시도해주세요.');
            break;
          case 500:
            console.error('Server error');
            toast.error('서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
            break;
          default:
            toast.error(errorMessage);
        }
      } else {
        toast.error('알 수 없는 오류가 발생했습니다');
      }
    } finally {
      setIsChoiceLoading(false);
    }
  };

  const handleQuitGame = async () => {
    if (confirm('정말로 게임을 포기하시겠습니까?')) {
      try {
        await api.post('/game/quit');
        gameThemeControls.disableGameMode();
        toast.info('게임을 포기했습니다');
        router.push('/');
      } catch (error: any) {
        console.error('Game quit failed:', error.message);
        toast.error('게임 종료 중 오류가 발생했습니다');
      }
    }
  };

  const handleTypingComplete = () => {
    setCanMakeChoice(true);
  };

  const handleNewGame = () => {
    setGameState('CHARACTER_CREATE');
    setGameCompletionData(null);
    setGameStartTime(null);
    setHasInitialized(false);
    toast.info('새로운 모험을 시작해보세요!');
  };

  const handleBackToMain = () => {
    gameThemeControls.disableGameMode();
    router.push('/');
  };

  const handleShareResult = () => {
    if (!gameCompletionData) return;

    const grade = getCompletionGrade(gameCompletionData.finalCharacter);
    const shareText = `${gameCompletionData.storyData.storyTitle}를 완료했습니다!
최종 체력: ${gameCompletionData.finalCharacter.charHealth}/100
최종 정신력: ${gameCompletionData.finalCharacter.charSanity}/100
등급: ${grade}급`;

    if (navigator.share) {
      navigator.share({
        title: 'Behindy 게임 결과',
        text: shareText,
        url: window.location.origin
      });
    } else {
      navigator.clipboard.writeText(shareText);
      toast.success('결과가 클립보드에 복사되었습니다!');
    }
  };

  const handleGoToRandomStory = async () => {
    try {
      toast.info('스토리가 있는 역을 찾는 중...');

      const response = await api.get<Array<{
        storyId: number;
        storyTitle: string;
        stationName: string;
        stationLine: number;
      }>>('/stories/random?count=1');

      if (response && response.length > 0) {
        const story = response[0];
        const gameUrl = `/game?station=${encodeURIComponent(story.stationName)}&line=${story.stationLine}`;

        toast.success(`${story.stationName}역으로 이동합니다!`);
        router.push(gameUrl);
      } else {
        toast.error('스토리가 있는 역을 찾을 수 없습니다');
      }
    } catch (error: any) {
      console.error('Random story fetch failed:', error);
      toast.error('스토리를 불러오는 중 오류가 발생했습니다');
    }
  };

  useEffect(() => {
    if (!hasInitialized && !initializeRef.current) {
      initializeGame();
    }
  }, []);

  return {
    gameState,
    character,
    gameData,
    error,
    isChoiceLoading,
    canMakeChoice,
    gameCompletionData,
    handleChoice,
    handleQuitGame,
    handleTypingComplete,
    handleCharacterCreated,
    handleNewGame,
    handleBackToMain,
    handleShareResult,
    handleGoToRandomStory,
  };
};