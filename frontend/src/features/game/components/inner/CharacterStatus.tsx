import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { Heart, Brain, User, AlertTriangle, Skull } from 'lucide-react';
import { Character } from '../../types/gameTypes';
import { 
  isCharacterAlive, 
  isCharacterDying, 
  getCharacterStatusColor,
  getCharacterStatusMessage
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

  // 실시간 상태 계산
  const isAlive = isCharacterAlive(character.charHealth, character.charSanity);
  const isDying = isCharacterDying(character.charHealth, character.charSanity);
  const statusMessage = getCharacterStatusMessage(character.charHealth, character.charSanity);

  const getHealthColor = (health: number) => {
    if (health > 70) return 'var(--game-success)';
    if (health > 30) return 'var(--warning)';
    return 'var(--game-health)';
  };

  const getSanityColor = (sanity: number) => {
    if (sanity > 70) return 'var(--game-sanity)';
    if (sanity > 30) return 'var(--warning)';
    return 'var(--game-danger)';
  };

  const getStatusIcon = () => {
    if (!isAlive) return <Skull size={16} />;
    if (isDying) return <AlertTriangle size={16} />;
    return null;
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
          <StatusBadge $status={statusMessage}>
            {getStatusIcon()}
            {statusMessage}
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
            <StatValue $type="health">{character.charHealth}/100</StatValue>
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
            <StatValue $type="sanity">{character.charSanity}/100</StatValue>
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

      {/* 실시간 계산된 상태로 조건부 렌더링 */}
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
  background: var(--bg-primary);
  border-radius: var(--border-radius-xl, 1rem);
  border: 1px solid var(--border-light);
  padding: ${({ $compact }) => $compact ? '1rem' : '1.5rem'};
  box-shadow: var(--shadow-card);
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
`;

const CharacterName = styled.h3`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1.125rem;
  font-weight: 600;
  color: var(--text-primary);
  margin: 0;
`;

const StatusBadge = styled.div<{ $status: string }>`
  display: flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.5rem 0.75rem;
  background: ${({ $status }) => {
    if ($status.includes('위험') || $status.includes('사망')) {
      return 'rgba(239, 68, 68, 0.1)';
    }
    if ($status.includes('주의')) {
      return 'rgba(245, 158, 11, 0.1)';
    }
    return 'var(--bg-secondary)';
  }};
  color: ${({ $status }) => {
    if ($status.includes('위험') || $status.includes('사망')) {
      return 'var(--error)';
    }
    if ($status.includes('주의')) {
      return 'var(--warning)';
    }
    return 'var(--text-secondary)';
  }};
  border-radius: 0.5rem;
  font-size: 0.875rem;
  font-weight: 500;
`;

const StatsContainer = styled.div<{ $compact?: boolean }>`
  display: flex;
  flex-direction: column;
  gap: ${({ $compact }) => $compact ? '0.75rem' : '1rem'};
`;

const StatBar = styled.div``;

const StatHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
`;

const StatLabel = styled.span`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  color: var(--text-secondary);
  font-weight: 500;
`;

const StatValue = styled.span<{ $type: 'health' | 'sanity' }>`
  font-size: 0.875rem;
  color: var(--text-primary);
  font-weight: 600;
`;

const ProgressBar = styled.div`
  width: 100%;
  height: 8px;
  background: var(--bg-tertiary);
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
  gap: 0.5rem;
  margin-top: 1rem;
  padding: 0.75rem;
  background: rgba(245, 158, 11, 0.1);
  color: var(--warning);
  border-radius: 0.5rem;
  font-size: 0.875rem;
  font-weight: 500;
`;

const DeathMessage = styled(motion.div)`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-top: 1rem;
  padding: 0.75rem;
  background: rgba(239, 68, 68, 0.1);
  color: var(--error);
  border-radius: 0.5rem;
  font-size: 0.875rem;
  font-weight: 500;
`;

const EmptyState = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 1.5rem;
  color: var(--text-tertiary);
`;