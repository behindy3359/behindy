import React from 'react';
import { Play, Plus } from 'lucide-react';
import { Button } from '@/shared/components/ui/button/Button';
import { CharacterGameStatus } from '@/features/game/types/gameTypes';
import {
  Card,
  CardHeader,
  CardTitle,
  ActiveGameInfo,
  GameTitle,
  GameProgress,
  ButtonGroup,
  NoGameInfo,
  NoGameMessage,
  CannotEnterMessage,
} from '../../styles/gameStyles';

interface CurrentGameCardProps {
  character: CharacterGameStatus;
  onResumeGame: () => void;
  onNewGame: () => void;
}

export const CurrentGameCard: React.FC<CurrentGameCardProps> = ({
  character,
  onResumeGame,
  onNewGame,
}) => {
  return (
    <Card
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
              onClick={onResumeGame}
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
              onClick={onNewGame}
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
    </Card>
  );
};