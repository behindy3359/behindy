import React from 'react';
import { Character } from '../../types/gameTypes';
import { ExistingCharacterCard } from './ExistingCharacterCard';
import { NewCharacterForm } from './NewCharacterForm';

interface CharacterCreateContentProps {
  existingCharacter: Character | null;
  charName: string;
  isLoading: boolean;
  nameError: string;
  stationName: string | null;
  lineNumber: string | null;
  returnUrl: string;
  onCharNameChange: (name: string) => void;
  onNameErrorChange: (error: string) => void;
  onCreateCharacter: () => void;
  onContinueWithExisting: () => void;
  onGoHome: () => void;
  onAbandonAndCreate: () => void;
  onGenerateRandomName: () => void;
  onValidateName: (name: string) => boolean;
}

export const CharacterCreateContent: React.FC<CharacterCreateContentProps> = ({
  existingCharacter,
  charName,
  isLoading,
  nameError,
  stationName,
  lineNumber,
  returnUrl,
  onCharNameChange,
  onNameErrorChange,
  onCreateCharacter,
  onContinueWithExisting,
  onGoHome,
  onAbandonAndCreate,
  onGenerateRandomName,
  onValidateName,
}) => {
  // 이미 캐릭터가 있는 경우
  if (existingCharacter) {
    return (
      <ExistingCharacterCard
        character={existingCharacter}
        stationName={stationName}
        lineNumber={lineNumber}
        isLoading={isLoading}
        onContinueWithExisting={onContinueWithExisting}
        onGoHome={onGoHome}
        onAbandonAndCreate={onAbandonAndCreate}
      />
    );
  }

  // 새 캐릭터 생성
  return (
    <NewCharacterForm
      charName={charName}
      isLoading={isLoading}
      nameError={nameError}
      stationName={stationName}
      lineNumber={lineNumber}
      onCharNameChange={onCharNameChange}
      onNameErrorChange={onNameErrorChange}
      onCreateCharacter={onCreateCharacter}
      onGoHome={onGoHome}
      onGenerateRandomName={onGenerateRandomName}
      onValidateName={onValidateName}
    />
  );
};