import React from 'react';
import styled from 'styled-components';
import { Character } from '../../types/gameTypes';
import { CompletionHeader } from './CompletionHeader';
import { CompletionStats } from './CompletionStats';
import { CompletionInfo } from './CompletionInfo';
import { CompletionActions } from './CompletionActions';

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

// 스타일드 컴포넌트
const Container = styled.div`
  width: 100%;
  max-width: 600px;
  margin: 0 auto;
  padding: 2rem;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const CompletionCard = styled.div`
  background: linear-gradient(135deg, var(--primary-500) 0%, var(--secondary-500) 100%);
  border-radius: 1rem;
  padding: 2rem;
  color: white;
  box-shadow: 0 10px 30px rgba(102, 126, 234, 0.3);
`;

export const GameCompletion: React.FC<GameCompletionProps> = ({
  character,
  storyTitle,
  stationName,
  stationLine,
  completionType,
  onBackToMain,
}) => {
  const getCompletionMessage = () => {
    if (completionType === 'death') {
      return {
        title: '게임 오버',
        subtitle: '아쉽게도 여정이 끝났습니다'
      };
    }
    return {
      title: '모험 완료!',
      subtitle: '성공적으로 여정을 마쳤습니다'
    };
  };

  const completion = getCompletionMessage();

  return (
    <Container>
      <CompletionCard>
        <CompletionHeader
          title={completion.title}
          subtitle={completion.subtitle}
        />

        <CompletionStats
          character={character}
          stationName={stationName}
        />
      </CompletionCard>

      <CompletionInfo
        storyTitle={storyTitle}
        stationLine={stationLine}
      />

      <CompletionActions
        onBackToMain={onBackToMain}
      />
    </Container>
  );
};