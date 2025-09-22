import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { 
  Trophy, 
  Heart, 
  Brain, 
  MapPin, 
  Home,
  BookOpen
} from 'lucide-react';
import{
  Container,
  CompletionHeader,
  CompletionEmoji,
  CompletionTitle,
  CompletionSubtitle,
  GradeBadge,
  ResultSummary,
  SummaryHeader,
  StoryInfo,
  StoryTitle,
  StoryLocation,
  StatsGrid,
  StatIcon,
  StatCard,
  StatInfo,
  StatLabel,
  StatValue,
  ActionButtons,
}from '@/features/game/styles/gameStyles';

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
            <StatInfo>
              <StatLabel>탐험가</StatLabel>
              <StatValue>{character.charName}</StatValue>
            </StatInfo>
          </StatCard>

          <StatCard>
            <StatInfo>
              <StatLabel>최종 체력</StatLabel>
              <StatValue>{character.charHealth}/100</StatValue>
            </StatInfo>
          </StatCard>

          <StatCard>
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