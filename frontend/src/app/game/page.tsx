"use client";

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { ArrowLeft, RotateCcw, LogOut, AlertTriangle } from 'lucide-react';
import { api } from '@/config/axiosConfig';
import { useAuthStore } from '@/shared/store/authStore';
import { useToast } from '@/shared/store/uiStore';
import { gameThemeControls } from '@/shared/hooks/useAutoTheme';
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
import { GameCompletion } from '@/features/game/components/GameCompletion/GameCompletion';
import { 
  enrichCharacterData, 
  createCharacterFromAPI,
} from '@/features/game/utils/characterUtils';

export type GameFlowState = 
  | 'LOADING'           
  | 'CHARACTER_CREATE'  
  | 'GAME_PLAYING'        
  | 'GAME_COMPLETED'    
  | 'ERROR';            

interface GameData {
  storyId: number;
  storyTitle: string;
  currentPage: GamePageType;
  stationName: string;
  stationLine: number;
}

interface GameCompletionData {
  completionType: 'success' | 'death';
  finalCharacter: Character;
  gameStartTime: string;
  storyData: GameData;
}

export default function UnifiedGamePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const toast = useToast();
  const { isAuthenticated } = useAuthStore();
  const initializeRef = useRef(false);

  const stationName = searchParams.get('station');
  const lineNumber = searchParams.get('line');

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
            // ✅ 게임 성공 시에만 다크모드 적용
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
            // ✅ 게임 재개 시에도 다크모드 적용
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
            // ✅ 스토리 없으면 라이트모드 유지하고 즉시 복귀
            setError('플레이 가능한 스토리가 없습니다');
            setGameState('ERROR');
            toast.error('이 역에는 아직 스토리가 없습니다');
            router.push('/');
            break;

          default:
            console.error('❌ [Game] Unknown game action:', gameResponse.action); // ✅ 유지
            throw new Error('알 수 없는 게임 상태');
        }
      } else {
        setGameState('CHARACTER_CREATE');
      }

      setHasInitialized(true);

    } catch (error: any) {
      console.error('❌ [Game] Initialization failed:', error.message); // ✅ 유지 (간소화)
      
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
      
      // ✅ 예상치 못한 상황 로그 유지
      console.warn('⚠️ [Game] Unexpected game end state');
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
      // ✅ 에러 로그 유지 (간소화)
      console.error('❌ [Game] Choice failed:', error instanceof Error ? error.message : 'Unknown');

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
            console.error('❌ [Game] Session not found'); // ✅ 유지
            toast.error('게임 세션을 찾을 수 없습니다. 게임을 다시 시작해주세요.');
            setGameState('ERROR');
            setError('게임 세션이 만료되었습니다');
            break;
          case 401:
            console.error('❌ [Game] Authentication failed'); // ✅ 유지
            toast.error('로그인이 필요합니다');
            router.push('/auth/login');
            break;
          case 400:
            toast.error('잘못된 선택입니다. 다시 시도해주세요.');
            break;
          case 500:
            console.error('❌ [Game] Server error'); // ✅ 유지
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
        
        // 게임 포기 시 라이트모드 복원
        gameThemeControls.disableGameMode();
        
        toast.info('게임을 포기했습니다');
        router.push('/');
      } catch (error: any) {
        console.error('❌ [Game] Quit failed:', error.message); // ✅ 유지
        toast.error('게임 종료 중 오류가 발생했습니다');
      }
    }
  };

  const handleTypingComplete = () => {
    setCanMakeChoice(true);
  };

  useEffect(() => {
    if (!hasInitialized && !initializeRef.current) {
      initializeGame();
    }
  }, []);

  return (
    <AppLayout>
      <GameContainer>
        <GameHeader>
          <BackButton onClick={() => {
            gameThemeControls.disableGameMode();
            router.push('/');
          }}>
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
                    showEffectPreview={false}
                    allowEffectToggle={true}
                  />
                )}
              </StorySection>
            </GamePlayingSection>
          )}
          
          {gameState === 'GAME_COMPLETED' && gameCompletionData && (
            <GameCompletionSection>
              <GameCompletion
                character={gameCompletionData.finalCharacter}
                storyTitle={gameCompletionData.storyData.storyTitle}
                stationName={gameCompletionData.storyData.stationName}
                stationLine={gameCompletionData.storyData.stationLine}
                gameStartTime={gameCompletionData.gameStartTime}
                totalPages={gameCompletionData.storyData.currentPage?.totalPages || 0}
                completionType={gameCompletionData.completionType}
                onNewGame={() => {
                  setGameState('CHARACTER_CREATE');
                  setGameCompletionData(null);
                  setGameStartTime(null);
                  setHasInitialized(false);
                  toast.info('새로운 모험을 시작해보세요!');
                }}
                onBackToMain={() => {
                  gameThemeControls.disableGameMode();
                  router.push('/');
                }}
                onShareResult={() => {
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
                }}
              />
            </GameCompletionSection>
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
                <Button variant="outline" onClick={() => {
                  gameThemeControls.disableGameMode();
                  router.push('/');
                }}>
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

// Styled Components
const GameContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 1.5rem;
  min-height: 100vh;

  @media (max-width: 768px) {
    padding: 1rem;
  }
`;

const GameHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid var(--border-light);
`;

const BackButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 0.75rem;
  background: transparent;
  border: none;
  color: var(--text-secondary);
  cursor: pointer;
  transition: color 0.2s ease;

  &:hover {
    color: var(--text-primary);
  }
`;

const HeaderTitle = styled.h1`
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--text-primary);
  margin: 0;
`;

const HeaderActions = styled.div`
  display: flex;
  gap: 0.75rem;
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
  color: var(--text-secondary);

  p {
    margin-top: 1rem;
  }
`;

const Spinner = styled.div`
  width: 48px;
  height: 48px;
  border: 4px solid var(--border-light);
  border-top-color: var(--primary-500);
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
  gap: 1.5rem;

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

const GameCompletionSection = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  min-height: 60vh;
  padding: 1rem;
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
  gap: 0.75rem;
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--error);
  margin-bottom: 1rem;
`;

const ErrorMessage = styled.p`
  font-size: 1rem;
  color: var(--text-secondary);
  margin-bottom: 1.5rem;
`;

const ErrorActions = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: center;
`;