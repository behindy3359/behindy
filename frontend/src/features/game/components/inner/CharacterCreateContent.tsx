import React from 'react';
import { User } from 'lucide-react';
import { Character } from '../../types/gameTypes';
import { CharacterCreationForm } from './CharacterCreationForm';
import { ExistingCharacterDisplay } from './ExistingCharacterDisplay';
import { ExistingCharacterInfo } from './ExistingCharacterInfo';
import { ExistingCharacterActions } from './ExistingCharacterActions';

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
  onCharacterCreated: (character: any) => void;
  onError: (error: string) => void;
}

export const CharacterCreateContent: React.FC<CharacterCreateContentProps> = ({
  existingCharacter,
  stationName,
  lineNumber,
  isLoading,
  onContinueWithExisting,
  onGoHome,
  onAbandonAndCreate,
  onCreateCharacter,
  onCharacterCreated,
  onError,
}) => {
  // 이미 캐릭터가 있는 경우
  if (existingCharacter) {
    return (
      <div style={{
        width: '100%',
        background: 'var(--bg-primary)',
        borderRadius: '1.25rem',
        border: '1px solid var(--border-light)',
        boxShadow: 'var(--shadow-lg)',
        overflow: 'hidden',
        maxWidth: '600px',
        margin: '0 auto'
      }}>
        {/* 헤더 */}
        <div style={{
          padding: '2rem',
          borderBottom: '1px solid var(--border-light)'
        }}>
          <h2 style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            fontSize: '1.5rem',
            fontWeight: '700',
            color: 'var(--text-primary)',
            margin: 0
          }}>
            <User size={24} />
            캐릭터 정보
          </h2>
        </div>

        {/* 콘텐츠 */}
        <div style={{ padding: '2rem' }}>
          <ExistingCharacterDisplay character={existingCharacter} />
          
          <ExistingCharacterInfo 
            stationName={stationName}
            lineNumber={lineNumber}
          />
          
          <ExistingCharacterActions
            stationName={stationName}
            lineNumber={lineNumber}
            isLoading={isLoading}
            onContinueWithExisting={onContinueWithExisting}
            onGoHome={onGoHome}
            onAbandonAndCreate={onAbandonAndCreate}
          />
        </div>
      </div>
    );
  }

  // 새 캐릭터 생성
  return (
    <div style={{
      width: '100%',
      background: 'var(--bg-primary)',
      borderRadius: '1.25rem',
      border: '1px solid var(--border-light)',
      boxShadow: 'var(--shadow-lg)',
      overflow: 'hidden',
      maxWidth: '500px',
      margin: '0 auto'
    }}>
      <div style={{ padding: '2rem' }}>
        <CharacterCreationForm
          stationName={stationName || ''}
          lineNumber={parseInt(lineNumber || '1')}
          onCharacterCreated={onCharacterCreated}
          onError={onError}
        />
      </div>
    </div>
  );
};