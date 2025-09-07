"use client";

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { ArrowLeft, RotateCcw, LogOut, User, AlertTriangle } from 'lucide-react';
import { api } from '@/config/axiosConfig';
import { useAuthStore } from '@/shared/store/authStore';
import { useToast } from '@/shared/store/uiStore';
import { Button } from '@/shared/components/ui/button/Button';
import { AppLayout } from '@/shared/components/layout/applayout/AppLayout';
import { 
  GameEnterResponse, 
  ChoiceResponse, 
  Character,
  GamePage as GamePageType
} from '@/features/game/types/gameTypes';
import { StoryDisplay } from '@/features/game/components/StoryDisplay/StoryDisplay';
import { ChoiceButtons } from '@/features/game/components/ChoiceButtons/ChoiceButtons';
import { CharacterStatus } from '@/features/game/components/CharacterStatus/CharacterStatus';
import { CharacterCreationForm } from '@/features/game/components/CharacterCreationForm/CharacterCreationForm';

export type GameFlowState = 
  | 'LOADING'           
  | 'CHARACTER_CREATE'  
  | 'GAME_PLAYING'        
  | 'GAME_OVER'         
  | 'ERROR';            

interface GameData {
  storyId: number;
  storyTitle: string;
  currentPage: GamePageType;
  stationName: string;
  stationLine: number;
}

export default function UnifiedGamePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const toast = useToast();
  const { isAuthenticated } = useAuthStore();
  const initializeRef = useRef(false); // 🔥 초기화 중복 방지

  const stationName = searchParams.get('station');
  const lineNumber = searchParams.get('line');

  const [gameState, setGameState] = useState<GameFlowState>('LOADING');
  const [character, setCharacter] = useState<Character | null>(null);
  const [gameData, setGameData] = useState<GameData | null>(null);
  const [error, setError] = useState<string>('');
  const [isChoiceLoading, setIsChoiceLoading] = useState(false);
  const [canMakeChoice, setCanMakeChoice] = useState(false);
  const [hasInitialized, setHasInitialized] = useState(false); // 🔥 초기화 완료 플래그

  // 🔥 게임 초기화 로직 개선 - 올바른 API 엔드포인트 사용
  const initializeGame = useCallback(async () => {
    // 이미 초기화 중이거나 완료된 경우 중복 실행 방지
    if (initializeRef.current || hasInitialized) {
      console.log('🔄 [Game Page] Already initializing or initialized, skipping...');
      return;
    }

    initializeRef.current = true;
    console.log('🎮 [Game Page] initializeGame started');
    
    if (!isAuthenticated()) {
      console.log('❌ [Game Page] Not authenticated, redirecting to login');
      router.push('/auth/login');
      return;
    }

    if (!stationName || !lineNumber) {
      console.log('❌ [Game Page] Missing params:', { stationName, lineNumber });
      setError('역 정보가 올바르지 않습니다');
      setGameState('ERROR');
      toast.error('역 정보가 올바르지 않습니다');
      
      router.push('/');
      return;
    }

    try {
      setGameState('LOADING');
      setError('');

      console.log('📡 [Game Page] Checking character status...');
      
      // 🔥 올바른 API 엔드포인트 사용: /characters/exists
      let characterStatus: Character | null = null;
      
      try {
        console.log('🎯 [Game Page] API 요청: /characters/exists');
        
        const characterResponse = await api.get<{
          success: boolean;
          message: string;
          data: Character | null;
        }>('/characters/exists');
        
        console.log('✅ [Game Page] Character exists response:', {
          success: characterResponse.success,
          message: characterResponse.message,
          hasData: !!characterResponse.data,
          charName: characterResponse.data?.charName,
          isAlive: characterResponse.data?.isAlive
        });

        if (characterResponse.success && characterResponse.data) {
          characterStatus = characterResponse.data;
        } else {
          // 캐릭터가 없는 경우
          console.log('👤 [Game Page] No character found, switching to creation');
          setGameState('CHARACTER_CREATE');
          setHasInitialized(true);
          return;
        }
      } catch (characterError: any) {
        console.log('⚠️ [Game Page] Character check error:', {
          status: characterError.response?.status,
          message: characterError.response?.data?.message || characterError.message,
          url: characterError.config?.url,
          isNotFound: characterError.response?.status === 404
        });
        
        // 404 또는 캐릭터 없음의 경우
        if (characterError.response?.status === 404) {
          console.log('👤 [Game Page] Character not found (404), redirecting to creation');
          redirectToCharacterCreation();  // 🔥 개선된 리다이렉트 함수 사용
          return;
        } else {
          // 다른 에러는 실제 에러로 처리
          throw characterError;
        }
      }


      if (characterStatus && characterStatus.charId) {
        // 🔥 캐릭터 상태 상세 로깅
        console.log('👤 [Game Page] Character status detailed:', {
          charId: characterStatus.charId,
          charName: characterStatus.charName,
          charHealth: characterStatus.charHealth,
          charSanity: characterStatus.charSanity,
          isAlive: characterStatus.isAlive,
          isDying: characterStatus.isDying,
          statusMessage: characterStatus.statusMessage,
          hasGameProgress: characterStatus.hasGameProgress,
          createdAt: characterStatus.createdAt
        });
      
        setCharacter(characterStatus);
        
        console.log('📡 [Game Page] Attempting to enter game...', {
          stationName,
          lineNumber,
          character: {
            charId: characterStatus.charId,
            charName: characterStatus.charName,
            isAlive: characterStatus.isAlive,
            health: characterStatus.charHealth,
            sanity: characterStatus.charSanity
          }
        });

        const gameEnterUrl = `/game/enter/station/${encodeURIComponent(stationName)}/line/${lineNumber}`;
        console.log('🎯 [Game Page] Game enter URL:', gameEnterUrl);
      
        const gameResponse = await api.post<GameEnterResponse>(gameEnterUrl);
        
        console.log('✅ [Game Page] Game enter response:', {
          success: gameResponse.success,
          action: gameResponse.action,
          message: gameResponse.message,
          selectedStoryId: gameResponse.selectedStoryId,
          resumeStoryId: gameResponse.resumeStoryId,
          stationName: gameResponse.stationName,
          stationLine: gameResponse.stationLine,
          // 🔥 응답으로 받은 캐릭터 정보도 로깅
          responseCharacter: gameResponse.character ? {
            charId: gameResponse.character.charId,
            charName: gameResponse.character.charName,
            isAlive: gameResponse.character.isAlive,
            health: gameResponse.character.charHealth,
            sanity: gameResponse.character.charSanity
          } : null
        });
      
        if (!gameResponse.success) {
          throw new Error(gameResponse.message);
        }
      
        // 🔥 게임 응답에서 받은 캐릭터 정보로 업데이트
        if (gameResponse.character) {
          console.log('🔄 [Game Page] Updating character from game response');
          setCharacter(gameResponse.character);
        }
      
        switch (gameResponse.action) {
          case 'START_NEW':
            console.log('🆕 [Game Page] Starting new game:', {
              storyId: gameResponse.selectedStoryId,
              storyTitle: gameResponse.selectedStoryTitle,
              firstPageId: gameResponse.firstPage?.pageId,
              character: gameResponse.character ? {
                charId: gameResponse.character.charId,
                isAlive: gameResponse.character.isAlive
              } : null
            });
            
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
            console.log('▶️ [Game Page] Resuming existing game:', {
              storyId: gameResponse.resumeStoryId,
              storyTitle: gameResponse.resumeStoryTitle,
              currentPageId: gameResponse.currentPage?.pageId,
              character: gameResponse.character ? {
                charId: gameResponse.character.charId,
                isAlive: gameResponse.character.isAlive
              } : null
            });
            
            setGameData({
              storyId: gameResponse.resumeStoryId!,
              storyTitle: gameResponse.resumeStoryTitle!,
              currentPage: gameResponse.currentPage!,
              stationName: gameResponse.stationName,
              stationLine: gameResponse.stationLine
            });
            setGameState('GAME_PLAYING');
            toast.info('진행 중인 게임을 재개합니다');
            break;
      
          case 'NO_STORIES':
            console.log('⚠️ [Game Page] No stories available');
            setError('플레이 가능한 스토리가 없습니다');
            setGameState('ERROR');
            toast.error('이 역에는 아직 스토리가 없습니다');
            router.push('/');
            break;
      
          default:
            throw new Error('알 수 없는 게임 상태');
        }
      } else {
        // 캐릭터 없음
        console.log('👤 [Game Page] No character data, switching to creation');
        setGameState('CHARACTER_CREATE');
      }

      setHasInitialized(true);

    } catch (error: any) {
      console.error('❌ [Game Page] Game initialization failed:', {
        error,
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
        url: error.config?.url,
        stationName,
        lineNumber
      });
      
      const errorMessage = error.response?.data?.message || error.message || '게임을 시작할 수 없습니다';
      setError(errorMessage);
      setGameState('ERROR');
      toast.error(errorMessage);
      
      router.push('/');
    } finally {
      initializeRef.current = false;
      console.log('🏁 [Game Page] Game initialization complete');
    }
  }, [stationName, lineNumber, isAuthenticated, router, toast, hasInitialized]);

  // 캐릭터가 없을 때 생성 페이지로 이동하는 로직 개선
  const redirectToCharacterCreation = () => {
    console.log('👤 [Game Page] 캐릭터 생성 페이지로 이동');
    
    // 🔥 현재 게임 목적지 정보를 URL 파라미터로 전달
    const createUrl = `/character/create?station=${encodeURIComponent(stationName!)}&line=${lineNumber}&returnUrl=${encodeURIComponent(window.location.href)}`;
    
    router.push(createUrl);
  };

  // 캐릭터 생성 완료 핸들러 개선
  const handleCharacterCreated = useCallback((newCharacter: Character) => {
    console.log('✅ [Game Page] Character created, continuing with game:', {
      charId: newCharacter.charId,
      charName: newCharacter.charName,
      originalDestination: { stationName, lineNumber }
    });
    
    setCharacter(newCharacter);
    setHasInitialized(false); // 재초기화 허용
    toast.success(`${newCharacter.charName} 캐릭터로 게임을 시작합니다!`);
    
    // 🔥 캐릭터 생성 후 즉시 게임 초기화 재시도
    setTimeout(() => {
      console.log('🔄 [Game Page] Restarting game initialization after character creation');
      initializeGame();
    }, 1000);  // 1초 후 재시도 (서버 동기화 시간 확보)
  }, [initializeGame, toast, stationName, lineNumber]);

// frontend/src/app/game/page.tsx - handleChoice 함수 수정

const handleChoice = async (optionId: number) => {
  console.log('🎯 [Game Page] Choice selected:', {
    optionId,
    character: character ? {
      charId: character.charId,
      charName: character.charName,
      isAlive: character.isAlive,
      charHealth: character.charHealth,
      charSanity: character.charSanity
    } : null,
    isLoading: isChoiceLoading,
    canMakeChoice,
    gameData: gameData ? {
      storyId: gameData.storyId,
      currentPageId: gameData.currentPage?.pageId
    } : null
  });
  
  // 🔥 개선된 조건 체크 - isAlive가 undefined인 경우도 허용
  if (!character || isChoiceLoading || !gameData) {
    console.warn('⚠️ [Game Page] Cannot make choice:', {
      hasCharacter: !!character,
      isAlive: character?.isAlive,
      isLoading: isChoiceLoading,
      hasGameData: !!gameData,
      canMakeChoice
    });
    return;
  }

  // 🔥 캐릭터가 명시적으로 사망한 경우만 막기
  if (character.isAlive === false) {
    console.warn('⚠️ [Game Page] Character is dead, cannot make choice');
    toast.error('사망한 캐릭터로는 선택할 수 없습니다');
    return;
  }

  try {
    setIsChoiceLoading(true);
    setCanMakeChoice(false);

    // 🔥 요청 URL 수정 - /api 제거
    const requestUrl = `/game/choice/${optionId}`;
    console.log('📡 [Game Page] Sending choice to API:', {
      optionId,
      requestUrl,
      method: 'POST',
      timestamp: new Date().toISOString(),
      characterState: {
        charId: character.charId,
        charName: character.charName,
        health: character.charHealth,
        sanity: character.charSanity,
        isAlive: character.isAlive
      }
    });

    const response = await api.post<ChoiceResponse>(requestUrl);
    
    console.log('✅ [Game Page] Choice response:', {
      success: response.success,
      result: response.result,
      isGameOver: response.isGameOver,
      gameOverReason: response.gameOverReason,
      hasNextPage: !!response.nextPage,
      nextPageId: response.nextPage?.pageId,
      updatedCharacter: response.updatedCharacter ? {
        charId: response.updatedCharacter.charId,
        charHealth: response.updatedCharacter.charHealth,
        charSanity: response.updatedCharacter.charSanity,
        isAlive: response.updatedCharacter.isAlive
      } : null
    });

    if (!response.success) {
      throw new Error(response.message || '선택 처리 실패');
    }

    toast.info(response.result);

    // 캐릭터 상태 업데이트
    if (response.updatedCharacter) {
      setCharacter(response.updatedCharacter);
      console.log('👤 [Game Page] Character updated:', {
        charId: response.updatedCharacter.charId,
        health: `${response.updatedCharacter.charHealth}/100`,
        sanity: `${response.updatedCharacter.charSanity}/100`,
        isAlive: response.updatedCharacter.isAlive,
        statusMessage: response.updatedCharacter.statusMessage
      });
    }

    // 게임 종료 처리
    if (response.isGameOver) {
      console.log('🏁 [Game Page] Game over:', {
        reason: response.gameOverReason,
        isCharacterDead: !response.updatedCharacter?.isAlive
      });
      
      setGameState('GAME_OVER');
      
      if (response.gameOverReason === '스토리 완료') {
        toast.success('🎉 축하합니다! 스토리를 완료했습니다!');
      } else if (response.gameOverReason === '캐릭터 사망') {
        toast.error('💀 캐릭터가 사망했습니다');
      } else {
        toast.error(`게임 오버: ${response.gameOverReason}`);
      }
    } 
    // 다음 페이지로 이동
    else if (response.nextPage && gameData) {
      console.log('📄 [Game Page] Moving to next page:', {
        currentPageId: gameData.currentPage?.pageId,
        nextPageId: response.nextPage.pageId,
        nextPageNumber: response.nextPage.pageNumber,
        totalPages: response.nextPage.totalPages
      });
      
      setGameData({
        ...gameData,
        currentPage: response.nextPage
      });
      
      // 새 페이지로 이동 시 선택 비활성화 (타이핑 완료까지)
      setCanMakeChoice(false);
    } else {
      console.warn('⚠️ [Game Page] No next page but game not over');
    }

  } catch (error: unknown) {
    console.error('❌ [Game Page] Choice processing failed:', {
      error,
      optionId,
      errorType: error?.constructor?.name,
      message: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    });

    // 에러 타입별 상세 처리
    if (error && typeof error === 'object' && 'response' in error) {
      const axiosError = error as { 
        response: { 
          status: number;
          data: { message: string };
          statusText?: string;
        };
        message?: string;
        config?: { url?: string; method?: string };
      };

      console.error('📡 [Game Page] HTTP Error Details:', {
        status: axiosError.response?.status,
        statusText: axiosError.response?.statusText,
        data: axiosError.response?.data,
        url: axiosError.config?.url,
        method: axiosError.config?.method
      });

      const errorMessage = axiosError.response?.data?.message || '선택을 처리할 수 없습니다';
      
      // 특정 상태 코드별 처리
      if (axiosError.response?.status === 404) {
        toast.error('게임 세션을 찾을 수 없습니다. 게임을 다시 시작해주세요.');
        setGameState('ERROR');
        setError('게임 세션이 만료되었습니다');
      } else if (axiosError.response?.status === 400) {
        toast.error('잘못된 선택입니다. 다시 시도해주세요.');
      } else if (axiosError.response?.status === 401) {
        toast.error('로그인이 필요합니다');
        router.push('/auth/login');
      } else {
        toast.error(errorMessage);
      }
    } else if (error instanceof Error) {
      console.error('💥 [Game Page] Client Error:', {
        name: error.name,
        message: error.message,
        stack: error.stack
      });
      toast.error(`클라이언트 오류: ${error.message}`);
    } else {
      console.error('🤔 [Game Page] Unknown Error:', error);
      toast.error('알 수 없는 오류가 발생했습니다');
    }
  } finally {
    setIsChoiceLoading(false);
    console.log('🏁 [Game Page] Choice processing complete:', {
      timestamp: new Date().toISOString(),
      optionId
    });
  }
};

  // 게임 포기
  const handleQuitGame = async () => {
    if (confirm('정말로 게임을 포기하시겠습니까?')) {
      try {
        console.log('🚪 [Game Page] Quitting game...');
        await api.post('/game/quit');
        console.log('✅ [Game Page] Game quit successful');
        toast.info('게임을 포기했습니다');
        router.push('/');
      } catch (error: any) {
        console.error('❌ [Game Page] Game quit failed:', {
          error,
          message: error.message,
          response: error.response?.data
        });
        toast.error('게임 종료 중 오류가 발생했습니다');
      }
    }
  };

  // 타이핑 완료 시 선택 가능하게
  const handleTypingComplete = () => {
    setCanMakeChoice(true);
  };

  // 🔥 useEffect 개선 - 의존성 최소화 및 중복 실행 방지
  useEffect(() => {
    console.log('🎮 [Game Page] Component mounted');
    
    // 초기화되지 않았을 때만 실행
    if (!hasInitialized && !initializeRef.current) {
      initializeGame();
    }

    return () => {
      console.log('🎮 [Game Page] Component unmounting');
    };
  }, []); // 🔥 빈 의존성 배열로 변경

  return (
    <AppLayout>
      <GameContainer>
        <GameHeader>
          <BackButton onClick={() => router.push('/')}>
            <ArrowLeft size={20} />
            <span>돌아가기</span>
          </BackButton>
          
          <HeaderTitle>
            {stationName && lineNumber && `${stationName}역 ${lineNumber}호선`}
          </HeaderTitle>

          <HeaderActions>
            {gameState === 'GAME_PLAYING' && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleQuitGame}
                leftIcon={<LogOut size={16} />}
              >
                포기
              </Button>
            )}
          </HeaderActions>
        </GameHeader>

        <GameContent>
          {gameState === 'LOADING' && (
            <LoadingSection>
              <Spinner />
              <p>게임을 준비하는 중...</p>
            </LoadingSection>
          )}
          
          {gameState === 'CHARACTER_CREATE' && (
            <CharacterCreateSection
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <CharacterCreationForm
                stationName={stationName!}
                lineNumber={parseInt(lineNumber!)}
                onCharacterCreated={handleCharacterCreated}
                onError={(error) => {
                  console.error('❌ [Game Page] Character creation error:', error);
                  setError(error);
                  setGameState('ERROR');
                }}
              />
            </CharacterCreateSection>
          )}
          
          {gameState === 'GAME_PLAYING' && gameData && (
            <GamePlayingSection>
              <CharacterSection>
                <CharacterStatus 
                  character={character} 
                  animated={true}
                />
              </CharacterSection>

              <StorySection>
                <StoryDisplay
                  page={gameData.currentPage}
                  storyTitle={gameData.storyTitle}
                  isLoading={false}
                  typingSpeed={30}
                  onTypingComplete={handleTypingComplete}
                />

                {gameData.currentPage?.options && (
                  <ChoiceButtons
                    options={gameData.currentPage.options}
                    onChoice={handleChoice}
                    disabled={!canMakeChoice || isChoiceLoading}
                    isLoading={isChoiceLoading}
                    showEffectPreview={true}
                  />
                )}
              </StorySection>
            </GamePlayingSection>
          )}
          
          {gameState === 'GAME_OVER' && (
            <GameOverSection
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <GameOverTitle>🎉 게임 종료</GameOverTitle>
              <GameOverMessage>스토리가 완료되었습니다!</GameOverMessage>
              <GameOverActions>
                <Button onClick={() => {
                  setHasInitialized(false);
                  setGameState('CHARACTER_CREATE');
                }} leftIcon={<RotateCcw size={16} />}>
                  새 게임 시작
                </Button>
                <Button variant="outline" onClick={() => router.push('/')}>
                  메인으로
                </Button>
              </GameOverActions>
            </GameOverSection>
          )}
          
          {gameState === 'ERROR' && (
            <ErrorSection
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <ErrorTitle>
                <AlertTriangle size={24} />
                오류 발생
              </ErrorTitle>
              <ErrorMessage>{error}</ErrorMessage>
              <ErrorActions>
                <Button onClick={() => {
                  setHasInitialized(false);
                  initializeGame();
                }} leftIcon={<RotateCcw size={16} />}>
                  다시 시도
                </Button>
                <Button variant="outline" onClick={() => router.push('/')}>
                  메인으로
                </Button>
              </ErrorActions>
            </ErrorSection>
          )}
        </GameContent>
      </GameContainer>
    </AppLayout>
  );
}

// Styled Components (기존과 동일)
const GameContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: ${({ theme }) => theme.spacing[6]};
  min-height: 100vh;

  @media (max-width: 768px) {
    padding: ${({ theme }) => theme.spacing[4]};
  }
`;

const GameHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${({ theme }) => theme.spacing[8]};
  padding-bottom: ${({ theme }) => theme.spacing[4]};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border.light};
`;

const BackButton = styled.button`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[2]};
  padding: ${({ theme }) => theme.spacing[2]} ${({ theme }) => theme.spacing[3]};
  background: transparent;
  border: none;
  color: ${({ theme }) => theme.colors.text.secondary};
  cursor: pointer;
  transition: color 0.2s ease;

  &:hover {
    color: ${({ theme }) => theme.colors.text.primary};
  }
`;

const HeaderTitle = styled.h1`
  font-size: ${({ theme }) => theme.typography.fontSize['2xl']};
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text.primary};
  margin: 0;
`;

const HeaderActions = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing[3]};
`;

const GameContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 60vh;
`;

const LoadingSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: ${({ theme }) => theme.colors.text.secondary};

  p {
    margin-top: ${({ theme }) => theme.spacing[4]};
  }
`;

const Spinner = styled.div`
  width: 48px;
  height: 48px;
  border: 4px solid ${({ theme }) => theme.colors.border.light};
  border-top-color: ${({ theme }) => theme.colors.primary[500]};
  border-radius: 50%;
  animation: spin 1s linear infinite;

  @keyframes spin {
    to { transform: rotate(360deg); }
  }
`;

const CharacterCreateSection = styled(motion.div)`
  text-align: center;
  max-width: 500px;
  width: 100%;
`;

const GamePlayingSection = styled.div`
  width: 100%;
  display: grid;
  grid-template-columns: 300px 1fr;
  gap: ${({ theme }) => theme.spacing[6]};

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const CharacterSection = styled.div`
  @media (max-width: 768px) {
    order: 2;
  }
`;

const StorySection = styled.div`
  @media (max-width: 768px) {
    order: 1;
  }
`;

const GameOverSection = styled(motion.div)`
  text-align: center;
  max-width: 500px;
  width: 100%;
`;

const GameOverTitle = styled.h2`
  font-size: ${({ theme }) => theme.typography.fontSize['3xl']};
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text.primary};
  margin-bottom: ${({ theme }) => theme.spacing[4]};
`;

const GameOverMessage = styled.p`
  font-size: ${({ theme }) => theme.typography.fontSize.lg};
  color: ${({ theme }) => theme.colors.text.secondary};
  margin-bottom: ${({ theme }) => theme.spacing[6]};
`;

const GameOverActions = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing[4]};
  justify-content: center;
`;

const ErrorSection = styled(motion.div)`
  text-align: center;
  max-width: 500px;
  width: 100%;
`;

const ErrorTitle = styled.h2`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: ${({ theme }) => theme.spacing[3]};
  font-size: ${({ theme }) => theme.typography.fontSize['2xl']};
  font-weight: 700;
  color: ${({ theme }) => theme.colors.error};
  margin-bottom: ${({ theme }) => theme.spacing[4]};
`;

const ErrorMessage = styled.p`
  font-size: ${({ theme }) => theme.typography.fontSize.base};
  color: ${({ theme }) => theme.colors.text.secondary};
  margin-bottom: ${({ theme }) => theme.spacing[6]};
`;

const ErrorActions = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing[4]};
  justify-content: center;
`;