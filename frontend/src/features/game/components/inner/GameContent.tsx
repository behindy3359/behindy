import React from 'react';
import { motion } from 'framer-motion';
import { RotateCcw, AlertTriangle } from 'lucide-react';
import { Button } from '@/shared/components/ui/button/Button';
import { CharacterCreationForm } from './CharacterCreationForm';
import { CharacterStatus } from './CharacterStatus';
import { StoryDisplay } from '@/features/game/components/StoryDisplay/StoryDisplay';
import { ChoiceButtons } from './ChoiceButtons';
import { GameCompletion } from './GameCompletion';
import { LoadingStates } from './LoadingStates';
import { GameFlowState, Character, GameData, GameCompletionData } from '../../types/gameTypes';
import {
  GameContent as StyledGameContent,
  CharacterCreateSection,
  GamePlayingSection,
  CharacterSection,
  StorySection,
  GameCompletionSection,
  ErrorSection,
  ErrorTitle,
  ErrorMessage,
  ErrorActions,
} from '../../styles/gameStyles';

interface GameContentProps {
  gameState: GameFlowState;
  character: Character | null;
  gameData: GameData | null;
  error: string;
  isChoiceLoading: boolean;
  canMakeChoice: boolean;
  gameCompletionData: GameCompletionData | null;
  stationName: string | null;
  lineNumber: string | null;
  onChoice: (optionId: number) => void;
  onTypingComplete: () => void;
  onCharacterCreated: (character: Character) => void;
  onNewGame: () => void;
  onBackToMain: () => void;
  onShareResult: () => void;
}

export const GameContent: React.FC<GameContentProps> = ({
  gameState,
  character,
  gameData,
  error,
  isChoiceLoading,
  canMakeChoice,
  gameCompletionData,
  stationName,
  lineNumber,
  onChoice,
  onTypingComplete,
  onCharacterCreated,
  onNewGame,
  onBackToMain,
  onShareResult,
}) => {
  const renderGameState = () => {
    switch (gameState) {
      case 'LOADING':
        return <LoadingStates.Game />;

      case 'CHARACTER_CREATE':
        return (
          <CharacterCreateSection
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <CharacterCreationForm
              stationName={stationName!}
              lineNumber={parseInt(lineNumber!)}
              onCharacterCreated={onCharacterCreated}
              onError={(error: string) => {
                console.error('Character creation error:', error);
              }}
            />
          </CharacterCreateSection>
        );

      case 'GAME_PLAYING':
        return gameData && (
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
                onTypingComplete={onTypingComplete}
              />

              {gameData.currentPage?.options && (
                <ChoiceButtons
                  options={gameData.currentPage.options}
                  onChoice={onChoice}
                  disabled={!canMakeChoice || isChoiceLoading}
                  isLoading={isChoiceLoading}
                  showEffectPreview={false}
                  allowEffectToggle={true}
                />
              )}
            </StorySection>
          </GamePlayingSection>
        );

      case 'GAME_COMPLETED':
        return gameCompletionData && (
          <GameCompletionSection>
            <GameCompletion
              character={gameCompletionData.finalCharacter}
              storyTitle={gameCompletionData.storyData.storyTitle}
              stationName={gameCompletionData.storyData.stationName}
              stationLine={gameCompletionData.storyData.stationLine}
              gameStartTime={gameCompletionData.gameStartTime}
              totalPages={gameCompletionData.storyData.currentPage?.totalPages || 0}
              completionType={gameCompletionData.completionType}
              onNewGame={onNewGame}
              onBackToMain={onBackToMain}
              onShareResult={onShareResult}
            />
          </GameCompletionSection>
        );

      case 'ERROR':
        return (
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
              <Button 
                onClick={() => window.location.reload()} 
                leftIcon={<RotateCcw size={16} />}
              >
                다시 시도
              </Button>
              <Button variant="outline" onClick={onBackToMain}>
                메인으로
              </Button>
            </ErrorActions>
          </ErrorSection>
        );

      default:
        return null;
    }
  };

  return (
    <StyledGameContent>
      {renderGameState()}
    </StyledGameContent>
  );
};