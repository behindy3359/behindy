"use client";

import React from 'react';
import { useSearchParams } from 'next/navigation';
import { Container } from '../styles/gameStyles';
import { useCharacterCreate } from '../hooks/useCharacterCreate';
import { CharacterCreateContent } from './inner/CharacterCreateContent';
import { LoadingStates } from './inner/LoadingStates';

export const CharacterCreatePageContainer: React.FC = () => {
  const searchParams = useSearchParams();
  
  const returnUrl = searchParams.get('returnUrl') || '/';
  const stationName = searchParams.get('station');
  const lineNumber = searchParams.get('line');

  const {
    isChecking,
    existingCharacter,
    charName,
    isLoading,
    nameError,
    setCharName,
    setNameError,
    handleCreateCharacter,
    handleContinueWithExisting,
    handleGoHome,
    handleAbandonAndCreate,
    generateRandomName,
    validateName,
  } = useCharacterCreate({
    returnUrl,
    stationName,
    lineNumber,
  });

  if (isChecking) {
    return (
      <Container>
        <LoadingStates.Character />
      </Container>
    );
  }

  const handleCharacterCreated = async (character: any) => {
    console.log('✅ 캐릭터 생성 완료:', character);
    await handleCreateCharacter();
  };

  const handleError = (error: string) => {
    console.error('❌ 캐릭터 생성 에러:', error);
    setNameError(error);
  };

  return (
    <Container>
      <CharacterCreateContent
        existingCharacter={existingCharacter}
        charName={charName}
        isLoading={isLoading}
        nameError={nameError}
        stationName={stationName}
        lineNumber={lineNumber}
        returnUrl={returnUrl}
        onCharNameChange={setCharName}
        onNameErrorChange={setNameError}
        onCreateCharacter={handleCreateCharacter}
        onContinueWithExisting={handleContinueWithExisting}
        onGoHome={handleGoHome}
        onAbandonAndCreate={handleAbandonAndCreate}
        onGenerateRandomName={generateRandomName}
        onValidateName={validateName}
        onCharacterCreated={handleCharacterCreated}
        onError={handleError}
      />
    </Container>
  );
};

export default CharacterCreatePageContainer;