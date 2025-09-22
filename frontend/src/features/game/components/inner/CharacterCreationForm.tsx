import React, { useState } from 'react';
import { Character } from '../../types/gameTypes';
import { useCharacterCreate } from '../../hooks/useCharacterCreate';
import { CharacterCreationHeader } from './CharacterCreationHeader';
import { CharacterStats } from './CharacterStats';
import { CharacterCreationFormUI } from './CharacterCreationFormUI';
import { CharacterFormInfo } from './CharacterFormInfo';

interface CharacterCreationFormProps {
  stationName: string;
  lineNumber: number;
  onCharacterCreated: (character: Character) => void;
  onError: (error: string) => void;
}

export const CharacterCreationForm: React.FC<CharacterCreationFormProps> = ({
  stationName,
  lineNumber,
  onCharacterCreated,
  onError
}) => {
  // 기존 useCharacterCreate 훅 사용
  const {
    charName,
    isLoading,
    nameError,
    setCharName,
    setNameError,
    handleCreateCharacter,
    generateRandomName,
    validateName,
  } = useCharacterCreate({
    returnUrl: '',
    stationName,
    lineNumber: lineNumber.toString(),
  });

  // 폼 제출 처리
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const isValid = validateName(charName);
    if (!isValid) {
      return;
    }

    try {
      await handleCreateCharacter();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '캐릭터 생성에 실패했습니다';
      onError(errorMessage);
    }
  };

  // 이름 변경 처리 (길이 제한 포함)
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // 10자 길이 제한
    if (value.length <= 10) {
      setCharName(value);
      if (nameError) setNameError('');
    }
  };

  return (
    <div style={{ 
      maxWidth: '500px', 
      width: '100%', 
      textAlign: 'center' 
    }}>
      {/* 헤더 */}
      <CharacterCreationHeader 
        stationName={stationName}
        lineNumber={lineNumber.toString()}
      />

      {/* 캐릭터 기본 스탯 정보 */}
      <CharacterStats />

      {/* 캐릭터 생성 폼 */}
      <CharacterCreationFormUI
        charName={charName}
        validationError={nameError}
        isLoading={isLoading}
        onNameChange={handleNameChange}
        onSubmit={handleSubmit}
        onGenerateRandomName={generateRandomName}
      />

      {/* 안내 정보 */}
      <div style={{ marginTop: '1.5rem' }}>
        <CharacterFormInfo />
      </div>

      {/* 도움말 */}
      <div style={{
        marginTop: '1rem',
        fontSize: '0.875rem',
        color: 'var(--text-tertiary)',
        textAlign: 'center'
      }}>
        💡 캐릭터는 한 번에 하나만 생성할 수 있습니다
      </div>
    </div>
  );
};