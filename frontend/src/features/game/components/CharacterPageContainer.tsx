"use client";

import React from 'react';
import { Container } from '../styles/gameStyles';
import { useCharacterData } from '../hooks/useCharacterData';
import { useCharacterActions } from '../hooks/useCharacterActions';
import { CharacterHeader } from './inner/CharacterHeader';
import { CharacterContent } from './inner/CharacterContent';
import { LoadingStates } from './inner/LoadingStates';

export const CharacterPageContainer: React.FC = () => {
  const { character, isLoading } = useCharacterData();
  const { handleResumeGame, handleNewGame, handleCreateCharacter } = useCharacterActions();

  if (isLoading) {
    return (
      <Container>
        <LoadingStates.Character />
      </Container>
    );
  }

  return (
    <Container>
      <CharacterHeader />
      
      <CharacterContent
        character={character}
        onResumeGame={handleResumeGame}
        onNewGame={handleNewGame}
        onCreateCharacter={handleCreateCharacter}
      />
    </Container>
  );
};

export default CharacterPageContainer;