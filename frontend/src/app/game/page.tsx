"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { ArrowLeft, RotateCcw, LogOut } from 'lucide-react';
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
  Story,
  GameStatus
} from '@/features/game/types/gameTypes';
import { StoryDisplay } from '@/features/game/components/StoryDisplay/StoryDisplay';
import { ChoiceButtons } from '@/features/game/components/ChoiceButtons/ChoiceButtons';
import { CharacterStatus } from '@/features/game/components/CharacterStatus/CharacterStatus';
import { quitGame } from '@/features/game/utils/gameNavigation';

export default function GamePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const toast = useToast();
  const { isAuthenticated } = useAuthStore();

  // URL 파라미터에서 역 정보 가져오기
  const stationName = searchParams.get('station');
  const lineNumber = searchParams.get('line');

  // 게임 상태
  const [isLoading, setIsLoading] = useState(true);
  const [isChoiceLoading, setIsChoiceLoading] = useState(false);
  const [character, setCharacter] = useState<Character | null>(null);
  const [currentStory, setCurrentStory] = useState<Story | null>(null);
  const [currentPage, setCurrentPage] = useState<GamePageType | null>(null);
  const [isGameOver, setIsGameOver] = useState(false);
  const [gameOverReason, setGameOverReason] = useState<string>('');
  const [canMakeChoice, setCanMakeChoice] = useState(false);

  // 게임 초기화
  const initializeGame = useCallback(async () => {
    if (!isAuthenticated()) {
      router.push('/auth/login');
      return;
    }

    if (!stationName || !lineNumber) {
      // URL 파라미터가 없으면 기존 게임 상태 확인
      try {
        const status = await api.get<GameStatus>('/api/game/status');
        if (status.hasActiveGame) {
          setCurrentStory({
            storyId: status.storyId!,
            storyTitle: status.storyTitle!,
            stationName: '',
            stationLine: 0
          });
          setCurrentPage(status.currentPage || null);
          setCharacter(status.character || null);
        } else {
          toast.error('진행 중인 게임이 없습니다');
          router.push('/');
        }
      } catch (error) {
        toast.error('게임 정보를 불러올 수 없습니다');
        router.push('/');
      }
      setIsLoading(false);
      return;
    }

    // 역 정보가 있으면 게임 진입
    try {
      setIsLoading(true);
      const response = await api.post<GameEnterResponse>(
        `/api/game/enter/station/${encodeURIComponent(stationName)}/line/${lineNumber}`
      );

      if (!response.success) {
        throw new Error(response.message);
      }

      setCharacter(response.character);

      switch (response.action) {
        case 'START_NEW':
          setCurrentStory({
            storyId: response.selectedStoryId!,
            storyTitle: response.selectedStoryTitle!,
            stationName: response.stationName,
            stationLine: response.stationLine
          });
          setCurrentPage(response.firstPage!);
          toast.success('새로운 스토리를 시작합니다!');
          break;

        case 'RESUME_EXISTING':
          setCurrentStory({
            storyId: response.resumeStoryId!,
            storyTitle: response.resumeStoryTitle!,
            stationName: response.stationName,
            stationLine: response.stationLine
          });
          setCurrentPage(response.currentPage!);
          toast.info('진행 중인 게임을 재개합니다');
          break;

        case 'NO_STORIES':
          toast.error('플레이 가능한 스토리가 없습니다');
          router.push('/');
          break;
      }
    } catch (error) {
      console.error('게임 진입 실패:', error);
      toast.error('게임을 시작할 수 없습니다');
      router.push('/');
    } finally {
      setIsLoading(false);
    }
  }, [stationName, lineNumber, isAuthenticated, router, toast]);

  // 선택지 선택 처리
  const handleChoice = async (optionId: number) => {
    if (!character?.isAlive || isChoiceLoading) return;

    try {
      setIsChoiceLoading(true);
      setCanMakeChoice(false);

      const response = await api.post<ChoiceResponse>(`/api/game/choice/${optionId}`);

      if (!response.success) {
        throw new Error(response.message);
      }

      // 결과 표시
      toast.info(response.result);

      // 캐릭터 상태 업데이트
      if (response.updatedCharacter) {
        setCharacter(response.updatedCharacter);
      }

      // 게임 종료 체크
      if (response.isGameOver) {
        setIsGameOver(true);
        setGameOverReason(response.gameOverReason || '게임 종료');
        
        if (response.gameOverReason === '스토리 완료') {
          toast.success('축하합니다! 스토리를 완료했습니다!');
        } else {
          toast.error(`게임 오버: ${response.gameOverReason}`);
        }
      } else if (response.nextPage) {
        // 다음 페이지로 진행
        setCurrentPage(response.nextPage);
      }
    } catch (error) {
      console.error('선택 처리 실패:', error);
      toast.error('선택을 처리할 수 없습니다');
    } finally {
      setIsChoiceLoading(false);
    }
  };

  // 게임 포기
  const handleQuitGame = async () => {
    if (confirm('정말로 게임을 포기하시겠습니까?')) {
      await quitGame(
        () => {
          toast.info('게임을 포기했습니다');
          router.push('/');
        },
        (error) => toast.error(error)
      );
    }
  };

  // 새 게임 시작
  const handleNewGame = () => {
    router.push('/character/create');
  };

  // 타이핑 완료 시 선택 가능하게
  const handleTypingComplete = () => {
    setCanMakeChoice(true);
  };

  useEffect(() => {
    initializeGame();
  }, [initializeGame]);

  return (
    <AppLayout>
      <GameContainer>
        {/* 헤더 */}
        <GameHeader>
          <BackButton onClick={() => router.push('/')}>
            <ArrowLeft size={20} />
            <span>돌아가기</span>
          </BackButton>
          
          <HeaderTitle>
            {currentStory?.storyTitle || '게임'}
          </HeaderTitle>

          <HeaderActions>
            {!isGameOver && character?.isAlive && (
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

        {/* 게임 콘텐츠 */}
        <GameContent>
          {isLoading ? (
            <LoadingState>
              <Spinner />
              <p>게임을 불러오는 중...</p>
            </LoadingState>
          ) : (
            <>
              {/* 캐릭터 상태 */}
              <CharacterSection>
                <CharacterStatus 
                  character={character} 
                  animated={true}
                />
              </CharacterSection>

              {/* 스토리 표시 */}
              <StorySection>
                <StoryDisplay
                  page={currentPage}
                  storyTitle={currentStory?.storyTitle}
                  isLoading={false}
                  typingSpeed={30}
                  onTypingComplete={handleTypingComplete}
                />

                {/* 선택지 */}
                {!isGameOver && currentPage?.options && (
                  <ChoiceButtons
                    options={currentPage.options}
                    onChoice={handleChoice}
                    disabled={!canMakeChoice || isChoiceLoading}
                    isLoading={isChoiceLoading}
                    showEffectPreview={true}
                  />
                )}

                {/* 게임 오버 화면 */}
                {isGameOver && (
                  <GameOverSection
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                  >
                    <GameOverTitle>
                      {gameOverReason === '스토리 완료' ? '🎉 스토리 완료!' : '💀 게임 오버'}
                    </GameOverTitle>
                    <GameOverMessage>{gameOverReason}</GameOverMessage>
                    <GameOverActions>
                      <Button onClick={handleNewGame} leftIcon={<RotateCcw size={16} />}>
                        새 게임 시작
                      </Button>
                      <Button variant="outline" onClick={() => router.push('/')}>
                        메인으로
                      </Button>
                    </GameOverActions>
                  </GameOverSection>
                )}
              </StorySection>
            </>
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
  padding: ${({ theme }) => theme.spacing[6]};

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

const LoadingState = styled.div`
  grid-column: 1 / -1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 400px;
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

const GameOverSection = styled(motion.div)`
  text-align: center;
  padding: ${({ theme }) => theme.spacing[8]};
  background: ${({ theme }) => theme.colors.background.secondary};
  border-radius: ${({ theme }) => theme.borderRadius.xl};
  margin-top: ${({ theme }) => theme.spacing[6]};
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