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
  GamePage as GamePageType,
  CharacterGameStatus
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

  // 🔥 게임 초기화 로직 개선 - 중복 실행 방지
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
      
      // 🔥 즉시 메인으로 이동 (setTimeout 제거)
      router.push('/');
      return;
    }

    try {
      setGameState('LOADING');
      setError('');

      console.log('📡 [Game Page] Checking character status...');
      
      // 🔥 캐릭터 상태 확인 API 수정
      let characterStatus: CharacterGameStatus | null = null;
      
      try {
        characterStatus = await api.get<CharacterGameStatus>('/api/characters/game-status');
        console.log('✅ [Game Page] Character status:', characterStatus);
      } catch (characterError: any) {
        console.log('⚠️ [Game Page] Character not found, will need to create');
        // 404는 정상적인 상황 (캐릭터 없음)
        if (characterError.response?.status === 404) {
          setGameState('CHARACTER_CREATE');
          setHasInitialized(true);
          return;
        } else {
          // 다른 에러는 실제 에러로 처리
          throw characterError;
        }
      }

      if (characterStatus && characterStatus.charId) {
        setCharacter(characterStatus);
        
        console.log('📡 [Game Page] Attempting to enter game...');
        const gameResponse = await api.post<GameEnterResponse>(
          `/api/game/enter/station/${encodeURIComponent(stationName)}/line/${lineNumber}`
        );
        
        console.log('✅ [Game Page] Game enter response:', gameResponse);

        if (!gameResponse.success) {
          throw new Error(gameResponse.message);
        }

        switch (gameResponse.action) {
          case 'START_NEW':
            console.log('🆕 [Game Page] Starting new game');
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
            console.log('▶️ [Game Page] Resuming existing game');
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
            
            // 🔥 즉시 메인으로 이동
            router.push('/');
            break;

          default:
            throw new Error('알 수 없는 게임 상태');
        }
      } else {
        // 캐릭터 없음
        setGameState('CHARACTER_CREATE');
      }

      setHasInitialized(true);

    } catch (error: any) {
      console.error('❌ [Game Page] Game initialization failed:', error);
      
      const errorMessage = error.response?.data?.message || error.message || '게임을 시작할 수 없습니다';
      setError(errorMessage);
      setGameState('ERROR');
      toast.error(errorMessage);
      
      // 🔥 즉시 메인으로 이동 (setTimeout 제거)
      router.push('/');
    } finally {
      initializeRef.current = false;
    }
  }, [stationName, lineNumber, isAuthenticated, router, toast, hasInitialized]);

  // 캐릭터 생성 완료 핸들러
  const handleCharacterCreated = useCallback((newCharacter: Character) => {
    console.log('✅ [Game Page] Character created:', newCharacter);
    setCharacter(newCharacter);
    setHasInitialized(false); // 🔥 재초기화 허용
    toast.success(`${newCharacter.charName} 캐릭터가 생성되었습니다!`);
    
    // 캐릭터 생성 후 게임 재시작
    setTimeout(() => {
      initializeGame();
    }, 500);
  }, [initializeGame, toast]);

  // 선택지 선택 처리
  const handleChoice = async (optionId: number) => {
    console.log('🎯 [Game Page] Choice selected:', optionId);
    
    if (!character?.isAlive || isChoiceLoading) {
      return;
    }

    try {
      setIsChoiceLoading(true);
      setCanMakeChoice(false);

      const response = await api.post<ChoiceResponse>(`/api/game/choice/${optionId}`);
      console.log('✅ [Game Page] Choice response:', response);

      if (!response.success) {
        throw new Error(response.message);
      }

      toast.info(response.result);

      if (response.updatedCharacter) {
        setCharacter(response.updatedCharacter);
      }

      if (response.isGameOver) {
        console.log('🏁 [Game Page] Game over:', response.gameOverReason);
        setGameState('GAME_OVER');
        
        if (response.gameOverReason === '스토리 완료') {
          toast.success('축하합니다! 스토리를 완료했습니다!');
        } else {
          toast.error(`게임 오버: ${response.gameOverReason}`);
        }
      } else if (response.nextPage && gameData) {
        setGameData({
          ...gameData,
          currentPage: response.nextPage
        });
      }
    } catch (error: any) {
      console.error('❌ [Game Page] Choice processing failed:', error);
      toast.error('선택을 처리할 수 없습니다');
    } finally {
      setIsChoiceLoading(false);
    }
  };

  // 게임 포기
  const handleQuitGame = async () => {
    if (confirm('정말로 게임을 포기하시겠습니까?')) {
      try {
        await api.post('/api/game/quit');
        toast.info('게임을 포기했습니다');
        router.push('/');
      } catch (error) {
        console.error('❌ [Game Page] Game quit failed:', error);
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