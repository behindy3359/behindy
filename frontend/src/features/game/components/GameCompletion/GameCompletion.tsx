"use client";

import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { 
  Trophy, 
  Heart, 
  Brain, 
  MapPin, 
  RotateCcw, 
  Home,
  BookOpen
} from 'lucide-react';
import { Button } from '@/shared/components/ui/button/Button';
import { Character } from '../../types/gameTypes';

interface GameCompletionProps {
  character: Character;
  storyTitle: string;
  stationName: string;
  stationLine: number;
  gameStartTime: string;
  totalPages: number;
  completionType: 'success' | 'death';
  onNewGame: () => void;
  onBackToMain: () => void;
  onShareResult?: () => void;
}

export const GameCompletion: React.FC<GameCompletionProps> = ({
  character,
  storyTitle,
  stationName,
  stationLine,
  completionType,
  onNewGame,
  onBackToMain,
}) => {

  const getCompletionGrade = () => {
    if (completionType === 'death') return 'F';
    
    const totalStats = character.charHealth + character.charSanity;
    if (totalStats >= 180) return 'S';
    if (totalStats >= 160) return 'A';
    if (totalStats >= 140) return 'B';
    if (totalStats >= 120) return 'C';
    return 'D';
  };

  const getGradeColor = (grade: string) => {
    switch (grade) {
      case 'S': return '#FFD700';
      case 'A': return '#C0C0C0';
      case 'B': return '#CD7F32';
      case 'C': return '#4ade80';
      case 'F': return '#ef4444';
      default: return '#6b7280';
    }
  };

  const getCompletionMessage = () => {
    if (completionType === 'death') {
      return {
        title: '게임 오버',
        subtitle: '아쉽게도 여정이 끝났습니다',
        emoji: '💀'
      };
    }
    
    const grade = getCompletionGrade();
    const messages = {
      'S': { title: '완벽한 모험!', subtitle: '당신은 진정한 탐험가입니다', emoji: '🏆' },
      'A': { title: '훌륭한 모험!', subtitle: '매우 성공적인 여정이었습니다', emoji: '🌟' },
      'B': { title: '좋은 모험!', subtitle: '잘 해냈습니다', emoji: '⭐' },
      'C': { title: '무난한 모험', subtitle: '괜찮은 결과입니다', emoji: '👍' },
      'D': { title: '아슬아슬한 모험', subtitle: '간신히 살아남았네요', emoji: '😅' }
    };
    
    return messages[grade as keyof typeof messages];
  };

  const completion = getCompletionMessage();
  const grade = getCompletionGrade();

  return (
    <Container
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* 완료 헤더 */}
      <CompletionHeader>
        <CompletionEmoji>{completion.emoji}</CompletionEmoji>
        <CompletionTitle>{completion.title}</CompletionTitle>
        <CompletionSubtitle>{completion.subtitle}</CompletionSubtitle>
        
        <GradeBadge $color={getGradeColor(grade)}>
          {grade}급
        </GradeBadge>
      </CompletionHeader>

      {/* 게임 결과 요약 */}
      <ResultSummary>
        <SummaryHeader>
          <BookOpen size={20} />
          <span>모험 기록</span>
        </SummaryHeader>
        
        <StoryInfo>
          <StoryTitle>{storyTitle}</StoryTitle>
          <StoryLocation>
            <MapPin size={16} />
            <span>{stationName}역 {stationLine}호선</span>
          </StoryLocation>
        </StoryInfo>

        <StatsGrid>
          <StatCard>
            <StatIcon style={{ backgroundColor: '#667eea' }}>
              <Trophy size={20} />
            </StatIcon>
            <StatInfo>
              <StatLabel>탐험가</StatLabel>
              <StatValue>{character.charName}</StatValue>
            </StatInfo>
          </StatCard>

          <StatCard>
            <StatIcon style={{ backgroundColor: '#ef4444' }}>
              <Heart size={20} />
            </StatIcon>
            <StatInfo>
              <StatLabel>최종 체력</StatLabel>
              <StatValue>{character.charHealth}/100</StatValue>
            </StatInfo>
          </StatCard>

          <StatCard>
            <StatIcon style={{ backgroundColor: '#667eea' }}>
              <Brain size={20} />
            </StatIcon>
            <StatInfo>
              <StatLabel>최종 정신력</StatLabel>
              <StatValue>{character.charSanity}/100</StatValue>
            </StatInfo>
          </StatCard>

        </StatsGrid>
      </ResultSummary>

      {/* 액션 버튼들 */}
      <ActionButtons>
        <Button
          variant="primary"
          size="lg"
          onClick={onNewGame}
          leftIcon={<RotateCcw size={18} />}
          fullWidth
        >
          새로운 모험 시작
        </Button>

        <Button
          variant="outline"
          size="lg"
          onClick={onBackToMain}
          leftIcon={<Home size={18} />}
          fullWidth
        >
          메인으로 돌아가기
        </Button>
      </ActionButtons>
    </Container>
  );
};

// Styled Components
const Container = styled(motion.div)`
  max-width: 600px;
  width: 100%;
  background: #ffffff;
  border-radius: ${({ theme }) => theme.borderRadius['2xl']};
  border: 1px solid #e2e8f0;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
  overflow: hidden;
`;

const CompletionHeader = styled.div`
  text-align: center;
  padding: ${({ theme }) => theme.spacing[12]} ${({ theme }) => theme.spacing[8]};
  background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
  border-bottom: 1px solid #e2e8f0;
`;

const CompletionEmoji = styled.div`
  font-size: 4rem;
  margin-bottom: ${({ theme }) => theme.spacing[4]};
`;

const CompletionTitle = styled.h1`
  font-size: ${({ theme }) => theme.typography.fontSize['3xl']};
  font-weight: 700;
  color: #1e293b;
  margin-bottom: ${({ theme }) => theme.spacing[2]};
`;

const CompletionSubtitle = styled.p`
  font-size: ${({ theme }) => theme.typography.fontSize.lg};
  color: #64748b;
  margin-bottom: ${({ theme }) => theme.spacing[6]};
`;

const GradeBadge = styled.div<{ $color: string }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 80px;
  height: 80px;
  background: ${({ $color }) => $color};
  color: white;
  border-radius: 50%;
  font-size: ${({ theme }) => theme.typography.fontSize['2xl']};
  font-weight: 700;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
`;

const ResultSummary = styled.div`
  padding: ${({ theme }) => theme.spacing[8]};
`;

const SummaryHeader = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[2]};
  margin-bottom: ${({ theme }) => theme.spacing[6]};
  font-size: ${({ theme }) => theme.typography.fontSize.lg};
  font-weight: 600;
  color: #1e293b;
`;

const StoryInfo = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing[8]};
  text-align: center;
`;

const StoryTitle = styled.h2`
  font-size: ${({ theme }) => theme.typography.fontSize.xl};
  font-weight: 600;
  color: #1e293b;
  margin-bottom: ${({ theme }) => theme.spacing[2]};
`;

const StoryLocation = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: ${({ theme }) => theme.spacing[2]};
  font-size: ${({ theme }) => theme.typography.fontSize.base};
  color: #64748b;
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: ${({ theme }) => theme.spacing[4]};

  @media (max-width: 480px) {
    grid-template-columns: 1fr;
  }
`;

const StatCard = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[3]};
  padding: ${({ theme }) => theme.spacing[4]};
  background: #f8fafc;
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  border: 1px solid #e2e8f0;
`;

const StatIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  color: white;
`;

const StatInfo = styled.div`
  flex: 1;
`;

const StatLabel = styled.div`
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  color: #64748b;
  margin-bottom: ${({ theme }) => theme.spacing[1]};
`;

const StatValue = styled.div`
  font-size: ${({ theme }) => theme.typography.fontSize.base};
  font-weight: 600;
  color: #1e293b;
`;

const ActionButtons = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing[3]};
  padding: ${({ theme }) => theme.spacing[8]};
  border-top: 1px solid #e2e8f0;
`;


export default GameCompletion;