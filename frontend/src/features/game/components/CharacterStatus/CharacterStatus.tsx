"use client";

import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { Heart, Brain, User, AlertTriangle, Skull } from 'lucide-react';
import { Character } from '../../types/gameTypes';
import { 
  isCharacterAlive, 
  isCharacterDying, 
  getCharacterStatusColor 
} from '../../utils/characterUtils';

interface CharacterStatusProps {
  character: Character | null;
  showName?: boolean;
  compact?: boolean;
  animated?: boolean;
}

export const CharacterStatus: React.FC<CharacterStatusProps> = ({
  character,
  showName = true,
  compact = false,
  animated = true
}) => {
  if (!character) {
    return (
      <Container $compact={compact}>
        <EmptyState>
          <User size={20} />
          <span>캐릭터 정보 없음</span>
        </EmptyState>
      </Container>
    );
  }

  // 🔥 실시간 상태 계산
  const isAlive = isCharacterAlive(character.charHealth, character.charSanity);
  const isDying = isCharacterDying(character.charHealth, character.charSanity);
  const statusColor = getCharacterStatusColor(character.charHealth, character.charSanity);

  const getHealthColor = (health: number) => {
    if (health > 70) return '#10b981';
    if (health > 30) return '#f59e0b';
    return '#ef4444';
  };

  const getSanityColor = (sanity: number) => {
    if (sanity > 70) return '#667eea';
    if (sanity > 30) return '#f59e0b';
    return '#ef4444';
  };

  const getStatusIcon = () => {
    if (!isAlive) return <Skull size={16} />;
    if (isDying) return <AlertTriangle size={16} />;
    return null;
  };

  // 🔥 실시간 상태 메시지 계산
  const getStatusMessage = (): string => {
    if (!isAlive) return '사망';
    if (isDying) return '위험';
    
    const minStat = Math.min(character.charHealth, character.charSanity);
    if (minStat <= 40) return '주의';
    if (minStat <= 60) return '보통';
    return '건강';
  };

  const healthPercentage = Math.max(0, Math.min(100, character.charHealth));
  const sanityPercentage = Math.max(0, Math.min(100, character.charSanity));

  return (
    <Container
      $compact={compact}
      initial={animated ? { opacity: 0, y: -10 } : {}}
      animate={animated ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.3 }}
    >
      {showName && (
        <Header>
          <CharacterName>
            <User size={16} />
            {character.charName}
          </CharacterName>
          <StatusBadge $status={getStatusMessage()}>
            {getStatusIcon()}
            {getStatusMessage()}
          </StatusBadge>
        </Header>
      )}

      <StatsContainer $compact={compact}>
        <StatBar>
          <StatHeader>
            <StatLabel>
              <Heart size={16} />
              체력
            </StatLabel>
            <StatValue>{character.charHealth}/100</StatValue>
          </StatHeader>
          <ProgressBar>
            <ProgressFill
              $percentage={healthPercentage}
              $color={getHealthColor(character.charHealth)}
              initial={animated ? { width: 0 } : { width: `${healthPercentage}%` }}
              animate={{ width: `${healthPercentage}%` }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
            />
          </ProgressBar>
        </StatBar>

        <StatBar>
          <StatHeader>
            <StatLabel>
              <Brain size={16} />
              정신력
            </StatLabel>
            <StatValue>{character.charSanity}/100</StatValue>
          </StatHeader>
          <ProgressBar>
            <ProgressFill
              $percentage={sanityPercentage}
              $color={getSanityColor(character.charSanity)}
              initial={animated ? { width: 0 } : { width: `${sanityPercentage}%` }}
              animate={{ width: `${sanityPercentage}%` }}
              transition={{ duration: 0.5, ease: 'easeOut', delay: 0.1 }}
            />
          </ProgressBar>
        </StatBar>
      </StatsContainer>

      {/* 🔥 실시간 계산된 상태로 조건부 렌더링 */}
      {isDying && isAlive && (
        <WarningMessage
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <AlertTriangle size={16} />
          <span>위험: 캐릭터가 위급한 상태입니다!</span>
        </WarningMessage>
      )}

      {!isAlive && (
        <DeathMessage
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <Skull size={16} />
          <span>캐릭터가 사망했습니다</span>
        </DeathMessage>
      )}
    </Container>
  );
};

// Styled Components
const Container = styled(motion.div)<{ $compact?: boolean }>`
  background: ${({ theme }) => theme.colors.background.primary};
  border-radius: ${({ theme }) => theme.borderRadius.xl};
  border: 1px solid ${({ theme }) => theme.colors.border.light};
  padding: ${({ theme, $compact }) => $compact ? theme.spacing[4] : theme.spacing[6]};
  box-shadow: ${({ theme }) => theme.shadows.card};
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${({ theme }) => theme.spacing[4]};
`;

const CharacterName = styled.h3`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[2]};
  font-size: ${({ theme }) => theme.typography.fontSize.lg};
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text.primary};
  margin: 0;
`;

const StatusBadge = styled.div<{ $status: string }>`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[1]};
  padding: ${({ theme }) => theme.spacing[2]} ${({ theme }) => theme.spacing[3]};
  background: ${({ theme, $status }) => {
    if ($status.includes('위험') || $status.includes('사망')) {
      return 'rgba(239, 68, 68, 0.1)';
    }
    if ($status.includes('주의')) {
      return 'rgba(245, 158, 11, 0.1)';
    }
    return theme.colors.background.secondary;
  }};
  color: ${({ theme, $status }) => {
    if ($status.includes('위험') || $status.includes('사망')) {
      return theme.colors.error;
    }
    if ($status.includes('주의')) {
      return theme.colors.warning;
    }
    return theme.colors.text.secondary;
  }};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  font-weight: 500;
`;

const StatsContainer = styled.div<{ $compact?: boolean }>`
  display: flex;
  flex-direction: column;
  gap: ${({ theme, $compact }) => $compact ? theme.spacing[3] : theme.spacing[4]};
`;

const StatBar = styled.div``;

const StatHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${({ theme }) => theme.spacing[2]};
`;

const StatLabel = styled.span`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[2]};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  color: ${({ theme }) => theme.colors.text.secondary};
  font-weight: 500;
`;

const StatValue = styled.span`
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  color: ${({ theme }) => theme.colors.text.primary};
  font-weight: 600;
`;

const ProgressBar = styled.div`
  width: 100%;
  height: 8px;
  background: ${({ theme }) => theme.colors.background.tertiary};
  border-radius: 4px;
  overflow: hidden;
`;

const ProgressFill = styled(motion.div)<{ $percentage: number; $color: string }>`
  height: 100%;
  background: ${({ $color }) => $color};
  border-radius: 4px;
`;

const WarningMessage = styled(motion.div)`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[2]};
  margin-top: ${({ theme }) => theme.spacing[4]};
  padding: ${({ theme }) => theme.spacing[3]};
  background: rgba(245, 158, 11, 0.1);
  color: ${({ theme }) => theme.colors.warning};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  font-weight: 500;
`;

const DeathMessage = styled(motion.div)`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[2]};
  margin-top: ${({ theme }) => theme.spacing[4]};
  padding: ${({ theme }) => theme.spacing[3]};
  background: rgba(239, 68, 68, 0.1);
  color: ${({ theme }) => theme.colors.error};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  font-weight: 500;
`;

const EmptyState = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: ${({ theme }) => theme.spacing[2]};
  padding: ${({ theme }) => theme.spacing[6]};
  color: ${({ theme }) => theme.colors.text.tertiary};
`;

export default CharacterStatus;