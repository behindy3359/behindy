"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { User, Heart, Brain, Trophy, Clock, Plus, Play, TrendingUp } from 'lucide-react';
import { api } from '@/config/axiosConfig';
import { useAuthStore } from '@/shared/store/authStore';
import { useToast } from '@/shared/store/uiStore';
import { Button } from '@/shared/components/ui/button/Button';
import { AppLayout } from '@/shared/components/layout/applayout/AppLayout';
import { CharacterGameStatus } from '@/features/game/types/gameTypes';
import { resumeGame } from '@/features/game/utils/gameNavigation';

export default function CharacterPage() {
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
      const response = await api.get<CharacterGameStatus>('/api/characters/game-status');
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

  // 게임 재개
  const handleResumeGame = () => {
    resumeGame(
      () => toast.success('게임을 재개합니다'),
      (error) => toast.error(error)
    );
  };

  // 새 게임 시작
  const handleNewGame = () => {
    router.push('/');  // 메인 페이지로 이동하여 역 선택
  };

  // 캐릭터 생성 페이지로 이동
  const handleCreateCharacter = () => {
    router.push('/character/create');
  };

  useEffect(() => {
    fetchCharacterInfo();
  }, []);

  if (isLoading) {
    return (
      <AppLayout>
        <Container>
          <LoadingState>
            <Spinner />
            <p>캐릭터 정보를 불러오는 중...</p>
          </LoadingState>
        </Container>
      </AppLayout>
    );
  }

  // 캐릭터가 없는 경우
  if (!character) {
    return (
      <AppLayout>
        <Container>
          <EmptyStateCard
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <EmptyIcon>
              <User size={64} />
            </EmptyIcon>
            <EmptyTitle>캐릭터가 없습니다</EmptyTitle>
            <EmptyDescription>
              지하철 모험을 시작하려면 먼저 캐릭터를 생성해주세요
            </EmptyDescription>
            <Button
              size="lg"
              onClick={handleCreateCharacter}
              leftIcon={<Plus size={20} />}
            >
              캐릭터 생성하기
            </Button>
          </EmptyStateCard>
        </Container>
      </AppLayout>
    );
  }

  // 캐릭터가 있는 경우
  return (
    <AppLayout>
      <Container>
        <PageHeader>
          <PageTitle>내 캐릭터</PageTitle>
        </PageHeader>

        <ContentGrid>
          {/* 캐릭터 정보 카드 */}
          <CharacterInfoCard
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <CardHeader>
              <CardTitle>캐릭터 정보</CardTitle>
            </CardHeader>
            
            <CharacterProfile>
              <ProfileIcon>
                <User size={48} />
              </ProfileIcon>
              <ProfileInfo>
                <CharacterName>{character.charName}</CharacterName>
                <StatusBadge $status={character.statusMessage}>
                  {character.statusMessage}
                </StatusBadge>
              </ProfileInfo>
            </CharacterProfile>

            <StatsGrid>
              <StatCard>
                <StatIcon $type="health">
                  <Heart size={20} />
                </StatIcon>
                <StatInfo>
                  <StatLabel>체력</StatLabel>
                  <StatValue>{character.charHealth}/100</StatValue>
                  <StatBar>
                    <StatBarFill 
                      $percentage={character.charHealth} 
                      $color="#ef4444"
                    />
                  </StatBar>
                </StatInfo>
              </StatCard>

              <StatCard>
                <StatIcon $type="sanity">
                  <Brain size={20} />
                </StatIcon>
                <StatInfo>
                  <StatLabel>정신력</StatLabel>
                  <StatValue>{character.charSanity}/100</StatValue>
                  <StatBar>
                    <StatBarFill 
                      $percentage={character.charSanity} 
                      $color="#667eea"
                    />
                  </StatBar>
                </StatInfo>
              </StatCard>
            </StatsGrid>

            {!character.isAlive && (
              <DeathNotice>
                ⚰️ 이 캐릭터는 사망했습니다
              </DeathNotice>
            )}
          </CharacterInfoCard>

          {/* 게임 통계 카드 */}
          <GameStatsCard
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <CardHeader>
              <CardTitle>게임 통계</CardTitle>
            </CardHeader>

            <StatsList>
              <StatsItem>
                <StatsIcon>
                  <Trophy size={20} />
                </StatsIcon>
                <StatsText>
                  <span>완료한 스토리</span>
                  <strong>{character.totalClears}개</strong>
                </StatsText>
              </StatsItem>

              <StatsItem>
                <StatsIcon>
                  <Play size={20} />
                </StatsIcon>
                <StatsText>
                  <span>플레이한 게임</span>
                  <strong>{character.totalPlays}회</strong>
                </StatsText>
              </StatsItem>

              <StatsItem>
                <StatsIcon>
                  <TrendingUp size={20} />
                </StatsIcon>
                <StatsText>
                  <span>클리어율</span>
                  <strong>{character.clearRate.toFixed(1)}%</strong>
                </StatsText>
              </StatsItem>

              {character.gameStartTime && (
                <StatsItem>
                  <StatsIcon>
                    <Clock size={20} />
                  </StatsIcon>
                  <StatsText>
                    <span>게임 시작 시간</span>
                    <strong>{new Date(character.gameStartTime).toLocaleString()}</strong>
                  </StatsText>
                </StatsItem>
              )}
            </StatsList>
          </GameStatsCard>

          {/* 현재 게임 상태 카드 */}
          <CurrentGameCard
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <CardHeader>
              <CardTitle>현재 게임</CardTitle>
            </CardHeader>

            {character.hasActiveGame ? (
              <ActiveGameInfo>
                <GameTitle>{character.currentStoryTitle}</GameTitle>
                <GameProgress>
                  <span>페이지 {character.currentPageNumber}</span>
                </GameProgress>
                <ButtonGroup>
                  <Button 
                    onClick={handleResumeGame}
                    fullWidth
                    leftIcon={<Play size={16} />}
                  >
                    게임 재개
                  </Button>
                </ButtonGroup>
              </ActiveGameInfo>
            ) : (
              <NoGameInfo>
                <NoGameMessage>진행 중인 게임이 없습니다</NoGameMessage>
                {character.canEnterNewGame ? (
                  <Button 
                    onClick={handleNewGame}
                    variant="outline"
                    fullWidth
                    leftIcon={<Plus size={16} />}
                  >
                    새 게임 시작
                  </Button>
                ) : (
                  <CannotEnterMessage>
                    {character.cannotEnterReason}
                  </CannotEnterMessage>
                )}
              </NoGameInfo>
            )}
          </CurrentGameCard>
        </ContentGrid>
      </Container>
    </AppLayout>
  );
}

// Styled Components
const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: ${({ theme }) => theme.spacing[6]};

  @media (max-width: 768px) {
    padding: ${({ theme }) => theme.spacing[4]};
  }
`;

const PageHeader = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing[8]};
`;

const PageTitle = styled.h1`
  font-size: ${({ theme }) => theme.typography.fontSize['3xl']};
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text.primary};
  margin: 0;
`;

const ContentGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: ${({ theme }) => theme.spacing[6]};

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const Card = styled(motion.div)`
  background: ${({ theme }) => theme.colors.background.primary};
  border-radius: ${({ theme }) => theme.borderRadius.xl};
  border: 1px solid ${({ theme }) => theme.colors.border.light};
  box-shadow: ${({ theme }) => theme.shadows.card};
  overflow: hidden;
`;

const CharacterInfoCard = styled(Card)``;
const GameStatsCard = styled(Card)``;
const CurrentGameCard = styled(Card)``;

const CardHeader = styled.div`
  padding: ${({ theme }) => theme.spacing[6]};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border.light};
`;

const CardTitle = styled.h2`
  font-size: ${({ theme }) => theme.typography.fontSize.lg};
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text.primary};
  margin: 0;
`;

const CharacterProfile = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[4]};
  padding: ${({ theme }) => theme.spacing[6]};
`;

const ProfileIcon = styled.div`
  width: 80px;
  height: 80px;
  background: linear-gradient(135deg, ${({ theme }) => theme.colors.primary[500]} 0%, ${({ theme }) => theme.colors.secondary[500]} 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
`;

const ProfileInfo = styled.div`
  flex: 1;
`;

const CharacterName = styled.h3`
  font-size: ${({ theme }) => theme.typography.fontSize.xl};
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text.primary};
  margin: 0 0 ${({ theme }) => theme.spacing[2]} 0;
`;

const StatusBadge = styled.div<{ $status: string }>`
  display: inline-flex;
  padding: ${({ theme }) => theme.spacing[2]} ${({ theme }) => theme.spacing[3]};
  background: ${({ theme }) => theme.colors.background.secondary};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  color: ${({ theme }) => theme.colors.text.secondary};
`;

const StatsGrid = styled.div`
  padding: 0 ${({ theme }) => theme.spacing[6]} ${({ theme }) => theme.spacing[6]};
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing[4]};
`;

const StatCard = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing[3]};
`;

const StatIcon = styled.div<{ $type: 'health' | 'sanity' }>`
  width: 40px;
  height: 40px;
  background: ${({ theme, $type }) => 
    $type === 'health' 
      ? 'rgba(239, 68, 68, 0.1)' 
      : 'rgba(102, 126, 234, 0.1)'};
  color: ${({ theme, $type }) => 
    $type === 'health' 
      ? theme.colors.error 
      : theme.colors.primary[500]};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  display: flex;
  align-items: center;
  justify-content: center;
`;

const StatInfo = styled.div`
  flex: 1;
`;

const StatLabel = styled.div`
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  color: ${({ theme }) => theme.colors.text.secondary};
  margin-bottom: ${({ theme }) => theme.spacing[1]};
`;

const StatValue = styled.div`
  font-size: ${({ theme }) => theme.typography.fontSize.base};
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text.primary};
  margin-bottom: ${({ theme }) => theme.spacing[2]};
`;

const StatBar = styled.div`
  width: 100%;
  height: 6px;
  background: ${({ theme }) => theme.colors.background.tertiary};
  border-radius: 3px;
  overflow: hidden;
`;

const StatBarFill = styled.div<{ $percentage: number; $color: string }>`
  width: ${({ $percentage }) => `${$percentage}%`};
  height: 100%;
  background: ${({ $color }) => $color};
  transition: width 0.3s ease;
`;

const DeathNotice = styled.div`
  margin: 0 ${({ theme }) => theme.spacing[6]} ${({ theme }) => theme.spacing[6]};
  padding: ${({ theme }) => theme.spacing[4]};
  background: rgba(239, 68, 68, 0.1);
  color: ${({ theme }) => theme.colors.error};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  text-align: center;
  font-weight: 500;
`;

const StatsList = styled.div`
  padding: ${({ theme }) => theme.spacing[6]};
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing[4]};
`;

const StatsItem = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[3]};
`;

const StatsIcon = styled.div`
  width: 36px;
  height: 36px;
  background: ${({ theme }) => theme.colors.background.secondary};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${({ theme }) => theme.colors.text.secondary};
`;

const StatsText = styled.div`
  flex: 1;
  display: flex;
  justify-content: space-between;
  align-items: center;
  
  span {
    font-size: ${({ theme }) => theme.typography.fontSize.sm};
    color: ${({ theme }) => theme.colors.text.secondary};
  }
  
  strong {
    font-size: ${({ theme }) => theme.typography.fontSize.base};
    color: ${({ theme }) => theme.colors.text.primary};
    font-weight: 600;
  }
`;

const ActiveGameInfo = styled.div`
  padding: ${({ theme }) => theme.spacing[6]};
`;

const GameTitle = styled.h3`
  font-size: ${({ theme }) => theme.typography.fontSize.lg};
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text.primary};
  margin-bottom: ${({ theme }) => theme.spacing[2]};
`;

const GameProgress = styled.div`
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  color: ${({ theme }) => theme.colors.text.secondary};
  margin-bottom: ${({ theme }) => theme.spacing[4]};
`;

const NoGameInfo = styled.div`
  padding: ${({ theme }) => theme.spacing[6]};
  text-align: center;
`;

const NoGameMessage = styled.p`
  color: ${({ theme }) => theme.colors.text.secondary};
  margin-bottom: ${({ theme }) => theme.spacing[4]};
`;

const CannotEnterMessage = styled.p`
  color: ${({ theme }) => theme.colors.warning};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  padding: ${({ theme }) => theme.spacing[3]};
  background: rgba(245, 158, 11, 0.1);
  border-radius: ${({ theme }) => theme.borderRadius.md};
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing[3]};
`;

const LoadingState = styled.div`
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

const EmptyStateCard = styled(motion.div)`
  background: ${({ theme }) => theme.colors.background.primary};
  border-radius: ${({ theme }) => theme.borderRadius.xl};
  border: 1px solid ${({ theme }) => theme.colors.border.light};
  box-shadow: ${({ theme }) => theme.shadows.card};
  padding: ${({ theme }) => theme.spacing[12]};
  text-align: center;
  max-width: 500px;
  width: 100%;
`;

const EmptyIcon = styled.div`
  margin: 0 auto ${({ theme }) => theme.spacing[6]};
  width: 120px;
  height: 120px;
  background: ${({ theme }) => theme.colors.background.secondary};
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${({ theme }) => theme.colors.text.tertiary};
`;

const EmptyTitle = styled.h2`
  font-size: ${({ theme }) => theme.typography.fontSize['2xl']};
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text.primary};
  margin-bottom: ${({ theme }) => theme.spacing[3]};
`;

const EmptyDescription = styled.p`
  font-size: ${({ theme }) => theme.typography.fontSize.base};
  color: ${({ theme }) => theme.colors.text.secondary};
  margin-bottom: ${({ theme }) => theme.spacing[8]};
`;