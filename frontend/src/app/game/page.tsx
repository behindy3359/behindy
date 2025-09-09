"use client";

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { ArrowLeft, RotateCcw, LogOut, User, AlertTriangle } from 'lucide-react';
import { api } from '@/config/axiosConfig';
import { useAuthStore } from '@/shared/store/authStore';
import { useToast } from '@/shared/store/uiStore';
import { useAutoTheme, confirmGameEntry, handleGameEntryFailure } from '@/shared/hooks/useAutoTheme';
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
  isCharacterAlive,
  getCharacterStatusMessage
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
  const { isGameMode } = useAutoTheme();
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

  // 완료 등급 계산 함수
  const getCompletionGrade = (character: Character): string => {
    const totalStats = character.charHealth + character.charSanity;
    if (totalStats >= 180) return 'S';
    if (totalStats >= 160) return 'A';
    if (totalStats >= 140) return 'B';
    if (totalStats >= 120) return 'C';
    return 'D';
  };

  // 게임 초기화 로직
  const initializeGame = useCallback(async () => {
    if (initializeRef.current || hasInitialized) {
      console.log('🔄 [Game Page] Already initializing or initialized, skipping...');
      return;
    }

    initializeRef.current = true;
    console.log('🎮 [Game Page] initializeGame started');
    
    if (!isAuthenticated()) {
      console.log('❌ [Game Page] Not authenticated, redirecting to login');
      handleGameEntryFailure(); // 🔥 테마 전환 제어
      router.push('/auth/login');
      return;
    }

    if (!stationName || !lineNumber) {
      console.log('❌ [Game Page] Missing params:', { stationName, lineNumber });
      handleGameEntryFailure(); // 🔥 테마 전환 제어
      setError('역 정보가 올바르지 않습니다');
      setGameState('ERROR');
      toast.error('역 정보가 올바르지 않습니다');
      
      setTimeout(() => {
        router.push('/');
      }, 2000);
      return;
    }

    try {
      setGameState('LOADING');
      setError('');

      console.log('📡 [Game Page] Checking character status...');
      
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
          characterStatus = createCharacterFromAPI(characterResponse.data);
        } else {
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
        
        if (characterError.response?.status === 404) {
          console.log('👤 [Game Page] Character not found (404), redirecting to creation');
          redirectToCharacterCreation();
          return;
        } else {
          throw characterError;
        }
      }

      if (characterStatus && characterStatus.charId) {
        setCharacter(characterStatus);
        
        console.log('📡 [Game Page] Attempting to enter game...', {
          stationName,
          lineNumber,
          charId: characterStatus.charId,
          charName: characterStatus.charName
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
          stationLine: gameResponse.stationLine
        });

        // 게임 응답에서 받은 캐릭터 정보로 업데이트
        if (gameResponse.character) {
          console.log('🔄 [Game Page] Updating character from game response');
          const enrichedCharacter = enrichCharacterData(characterStatus, gameResponse.character);
          setCharacter(enrichedCharacter);
        }

        // 게임 시작 시간 기록
        if (!gameStartTime) {
          setGameStartTime(new Date().toISOString());
        }

        switch (gameResponse.action) {
          case 'START_NEW':
            console.log('🆕 [Game Page] Starting new game:', {
              storyId: gameResponse.selectedStoryId,
              storyTitle: gameResponse.selectedStoryTitle,
              firstPageId: gameResponse.firstPage?.pageId
            });
            
            confirmGameEntry(); // 🔥 게임 진입 성공 확인
            
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
              originalRequest: `${stationName} ${lineNumber}호선`,
              actualLocation: `${gameResponse.stationName} ${gameResponse.stationLine}호선`
            });

            confirmGameEntry(); // 🔥 게임 진입 성공 확인

            setGameData({
              storyId: gameResponse.resumeStoryId!,
              storyTitle: gameResponse.resumeStoryTitle!,
              currentPage: gameResponse.currentPage!,
              stationName: gameResponse.stationName,  
              stationLine: gameResponse.stationLine 
            });
            
            setGameState('GAME_PLAYING');
            
            // 다른 역에서 요청했지만 기존 게임을 재개하는 경우 알림
            if (stationName !== gameResponse.stationName || lineNumber !== gameResponse.stationLine.toString()) {
              toast.info(`진행 중인 게임을 재개합니다 (${gameResponse.stationName}역 ${gameResponse.stationLine}호선)`);
            } else {
              toast.info('진행 중인 게임을 재개합니다');
            }
            break;

          case 'NO_STORIES':
            console.log('⚠️ [Game Page] No stories available - 홈 복귀');
            
            handleGameEntryFailure();
            
            setError('플레이 가능한 스토리가 없습니다');
            setGameState('ERROR');
            
            setTimeout(() => {
              router.push('/');
            }, 2500);
            break;

          default:
            console.error('❌ [Game Page] Unknown game action:', gameResponse.action);
            handleGameEntryFailure(); // 🔥 에러 시에도 실패 처리
            throw new Error('알 수 없는 게임 상태');
        }
      } else {
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
      
      handleGameEntryFailure(); // 🔥 에러 시에도 실패 처리
      
      const errorMessage = error.response?.data?.message || error.message || '게임을 시작할 수 없습니다';
      setError(errorMessage);
      setGameState('ERROR');
      toast.error(errorMessage);
      
      // 에러 시에도 지연 후 홈으로 이동
      setTimeout(() => {
        router.push('/');
      }, 2000);
    } finally {
      initializeRef.current = false;
      console.log('🏁 [Game Page] Game initialization complete');
    }
  }, [stationName, lineNumber, isAuthenticated, router, toast, hasInitialized, gameStartTime]);

  // 캐릭터 생성 페이지로 이동
  const redirectToCharacterCreation = () => {
    console.log('👤 [Game Page] 캐릭터 생성 페이지로 이동');
    
    handleGameEntryFailure(); // 🔥 테마 전환 제어
    
    const createUrl = `/character/create?station=${encodeURIComponent(stationName!)}&line=${lineNumber}&returnUrl=${encodeURIComponent(window.location.href)}`;
    
    router.push(createUrl);
  };

  // 캐릭터 생성 완료 핸들러
  const handleCharacterCreated = useCallback((newCharacter: Character) => {
    console.log('✅ [Game Page] Character created, continuing with game:', {
      charId: newCharacter.charId,
      charName: newCharacter.charName,
      originalDestination: { stationName, lineNumber }
    });
    
    const enrichedCharacter = createCharacterFromAPI(newCharacter);
    setCharacter(enrichedCharacter);
    setHasInitialized(false);
    toast.success(`${enrichedCharacter.charName} 캐릭터로 게임을 시작합니다!`);
    
    setTimeout(() => {
      console.log('🔄 [Game Page] Restarting game initialization after character creation');
      initializeGame();
    }, 1000);
  }, [initializeGame, toast, stationName, lineNumber]);

  const handleChoice = async (optionId: number) => {
    console.log('🎯 [Game Page] Choice selected:', {
      optionId,
      character: character ? {
        charId: character.charId,
        charName: character.charName,
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
    
    // 기본 조건 체크
    if (!character || isChoiceLoading || !gameData) {
      console.warn('⚠️ [Game Page] Cannot make choice - invalid state:', {
        hasCharacter: !!character,
        isLoading: isChoiceLoading,
        hasGameData: !!gameData,
        canMakeChoice
      });
      return;
    }

    // 캐릭터 사망 체크
    if (character.isAlive === false) {
      console.warn('⚠️ [Game Page] Character is dead, cannot make choice');
      toast.error('사망한 캐릭터로는 선택할 수 없습니다');
      return;
    }

    try {
      setIsChoiceLoading(true);
      setCanMakeChoice(false);

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
          sanity: character.charSanity
        }
      });

      const response = await api.post<ChoiceResponse>(requestUrl);
      
      console.log('✅ [Game Page] Choice response received:', {
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
        } : null,
        timestamp: new Date().toISOString()
      });

      // 응답 성공 여부 체크
      if (!response.success) {
        throw new Error(response.message || '선택 처리에 실패했습니다');
      }

      // 결과 메시지 표시
      if (response.result) {
        toast.info(response.result);
      }

      // 캐릭터 상태 업데이트
      let updatedCharacter = character;
      if (response.updatedCharacter) {
        updatedCharacter = enrichCharacterData(character, response.updatedCharacter);
        setCharacter(updatedCharacter);
        
        console.log('👤 [Game Page] Character updated:', {
          charId: updatedCharacter.charId,
          health: `${updatedCharacter.charHealth}/100`,
          sanity: `${updatedCharacter.charSanity}/100`,
          isAlive: updatedCharacter.isAlive,
          statusMessage: updatedCharacter.statusMessage,
          timestamp: new Date().toISOString()
        });
      }

      // 게임 종료 조건 체크
      const isStoryComplete = response.gameOverReason === '스토리 완료';
      const isCharacterDead = response.gameOverReason === '캐릭터 사망';
      const hasNoNextPage = !response.nextPage;
      const isExplicitGameOver = response.isGameOver === true;
      
      const shouldEndGame = isStoryComplete || isCharacterDead || hasNoNextPage || isExplicitGameOver;

      if (shouldEndGame) {
        console.log('🏁 [Game Page] Game ending detected:', {
          isStoryComplete,
          isCharacterDead,
          hasNoNextPage,
          isExplicitGameOver,
          gameOverReason: response.gameOverReason,
          finalCharacterState: {
            health: updatedCharacter.charHealth,
            sanity: updatedCharacter.charSanity,
            isAlive: updatedCharacter.isAlive
          },
          timestamp: new Date().toISOString()
        });
        
        // 게임 완료 데이터 설정
        if (gameData && gameStartTime) {
          const completionType = isStoryComplete ? 'success' : 'death';
          
          setGameCompletionData({
            completionType,
            finalCharacter: updatedCharacter,
            gameStartTime,
            storyData: gameData
          });
          
          console.log('📊 [Game Page] Game completion data set:', {
            completionType,
            storyTitle: gameData.storyTitle,
            stationName: gameData.stationName,
            stationLine: gameData.stationLine,
            finalStats: {
              health: updatedCharacter.charHealth,
              sanity: updatedCharacter.charSanity
            }
          });
        }
        
        setGameState('GAME_COMPLETED');
        
        // 완료 유형별 토스트 메시지
        if (isStoryComplete) {
          toast.success('🎉 축하합니다! 스토리를 완료했습니다!');
        } else if (isCharacterDead) {
          toast.error('💀 캐릭터가 사망했습니다');
        } else {
          toast.info('🏁 게임이 종료되었습니다');
        }
        
        return;
      }
      
      // 다음 페이지로 진행
      if (response.nextPage && gameData) {
        console.log('📄 [Game Page] Moving to next page:', {
          currentPageId: gameData.currentPage?.pageId,
          currentPageNumber: gameData.currentPage?.pageNumber,
          nextPageId: response.nextPage.pageId,
          nextPageNumber: response.nextPage.pageNumber,
          totalPages: response.nextPage.totalPages,
          timestamp: new Date().toISOString()
        });
        
        // 게임 데이터 업데이트
        setGameData({
          ...gameData,
          currentPage: response.nextPage
        });
        
        // 타이핑 효과를 위해 선택 비활성화 (타이핑 완료 후 다시 활성화됨)
        setCanMakeChoice(false);
        
        console.log('✅ [Game Page] Successfully moved to next page');
        return;
      }
      
      // 예상치 못한 상황 처리
      console.error('⚠️ [Game Page] Unexpected response state:', {
        hasGameOver: !!response.isGameOver,
        gameOverReason: response.gameOverReason,
        hasNextPage: !!response.nextPage,
        fullResponse: response,
        timestamp: new Date().toISOString()
      });
      
      // 안전장치: 강제로 게임 종료 처리
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
      console.error('❌ [Game Page] Choice processing failed:', {
        error,
        optionId,
        errorType: error?.constructor?.name,
        message: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString()
      });

      // HTTP 에러 상세 처리
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
          method: axiosError.config?.method,
          timestamp: new Date().toISOString()
        });

        const errorMessage = axiosError.response?.data?.message || '선택을 처리할 수 없습니다';
        
        // 특정 에러 상황별 처리
        switch (axiosError.response?.status) {
          case 404:
            toast.error('게임 세션을 찾을 수 없습니다. 게임을 다시 시작해주세요.');
            setGameState('ERROR');
            setError('게임 세션이 만료되었습니다');
            break;
            
          case 401:
            toast.error('로그인이 필요합니다');
            router.push('/auth/login');
            break;
            
          case 400:
            toast.error('잘못된 선택입니다. 다시 시도해주세요.');
            break;
            
          case 500:
            toast.error('서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
            break;
            
          default:
            toast.error(errorMessage);
        }
      } else if (error instanceof Error) {
        console.error('💥 [Game Page] Client Error:', {
          name: error.name,
          message: error.message,
          stack: error.stack,
          timestamp: new Date().toISOString()
        });
        toast.error(`클라이언트 오류: ${error.message}`);
      } else {
        console.error('🤔 [Game Page] Unknown Error:', {
          error,
          timestamp: new Date().toISOString()
        });
        toast.error('알 수 없는 오류가 발생했습니다');
      }
    } finally {
      setIsChoiceLoading(false);
      console.log('🏁 [Game Page] Choice processing complete:', {
        optionId,
        timestamp: new Date().toISOString()
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

  useEffect(() => {
    console.log('🎮 [Game Page] Component mounted');
    
    if (!hasInitialized && !initializeRef.current) {
      initializeGame();
    }

    return () => {
      console.log('🎮 [Game Page] Component unmounting');
    };
  }, []);

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