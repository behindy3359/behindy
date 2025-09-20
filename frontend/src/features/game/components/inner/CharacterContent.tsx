import React from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/shared/components/ui/button/Button';
import { CharacterGameStatus } from '@/features/game/types/gameTypes';
import { CharacterInfoCard } from './CharacterInfoCard';
import { GameStatsCard } from './GameStatsCard';
import { CurrentGameCard } from './CurrentGameCard';
import { EmptyCharacterState } from './EmptyCharacterState';
import { ContentGrid } from '../../styles/gameStyles';

interface CharacterContentProps {
  character: CharacterGameStatus | null;
  onResumeGame: () => void;
  onNewGame: () => void;
  onCreateCharacter: () => void;
}

export const CharacterContent: React.FC<CharacterContentProps> = ({
  character,
  onResumeGame,
  onNewGame,
  onCreateCharacter,
}) => {
  // 캐릭터가 없는 경우
  if (!character) {
    return <EmptyCharacterState onCreateCharacter={onCreateCharacter} />;
  }

  // 캐릭터가 있는 경우
  return (
    <ContentGrid>
      <CharacterInfoCard character={character} />
      
      <GameStatsCard character={character} />
      
      <CurrentGameCard
        character={character}
        onResumeGame={onResumeGame}
        onNewGame={onNewGame}
      />
    </ContentGrid>
  );
};