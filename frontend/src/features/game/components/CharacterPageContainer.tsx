"use client";

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Container } from '../styles/gameStyles';
import { useCharacterData } from '../hooks/useCharacterData';
import { useCharacterActions } from '../hooks/useCharacterActions';
import { CharacterHeader } from './inner/CharacterHeader';
import { CharacterContent } from './inner/CharacterContent';
import { LoadingStates } from './inner/LoadingStates';

export const CharacterPageContainer: React.FC = () => {
  const router = useRouter();
  const { character, isLoading } = useCharacterData();
  const { handleResumeGame, handleNewGame, handleCreateCharacter } = useCharacterActions();

  // 캐릭터가 없으면 생성 페이지로 자동 리다이렉트
  useEffect(() => {
    if (!isLoading && !character) {
      router.push('/character/create');
    }
  }, [isLoading, character, router]);

  if (isLoading) {
    return (
      <Container>
        <LoadingStates.Character />
      </Container>
    );
  }

  // 캐릭터가 없으면 null 반환 (리다이렉트 중)
  if (!character) {
    return null;
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