import React from 'react';
import { User, Info } from 'lucide-react';
import { Character } from '../../types/gameTypes';

interface ExistingCharacterDisplayProps {
  character: Character;
}

export const ExistingCharacterDisplay: React.FC<ExistingCharacterDisplayProps> = ({
  character
}) => {
  return (
    <div style={{
      display: 'flex',
      gap: '1.5rem',
      padding: '1.5rem',
      background: 'var(--bg-secondary)',
      borderRadius: '1rem',
      border: '1px solid var(--border-light)',
      marginBottom: '1rem'
    }}>
      {/* 캐릭터 아이콘 */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '80px',
        height: '80px',
        background: 'linear-gradient(135deg, var(--primary-500) 0%, var(--secondary-500) 100%)',
        borderRadius: '50%',
        color: 'var(--text-inverse)',
        flexShrink: 0
      }}>
        <User size={48} />
      </div>

      {/* 캐릭터 정보 */}
      <div style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        gap: '0.75rem'
      }}>
        <h3 style={{
          fontSize: '1.25rem',
          fontWeight: '700',
          color: 'var(--text-primary)',
          margin: 0
        }}>
          {character.charName}
        </h3>

        <div style={{
          display: 'flex',
          gap: '1.5rem'
        }}>
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '0.25rem'
          }}>
            <span style={{
              fontSize: '0.875rem',
              color: 'var(--text-secondary)',
              fontWeight: '500'
            }}>
              체력
            </span>
            <span style={{
              fontSize: '1rem',
              color: 'var(--text-primary)',
              fontWeight: '600'
            }}>
              {character.charHealth}/100
            </span>
          </div>

          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '0.25rem'
          }}>
            <span style={{
              fontSize: '0.875rem',
              color: 'var(--text-secondary)',
              fontWeight: '500'
            }}>
              정신력
            </span>
            <span style={{
              fontSize: '1rem',
              color: 'var(--text-primary)',
              fontWeight: '600'
            }}>
              {character.charSanity}/100
            </span>
          </div>
        </div>

        <div style={{
          display: 'inline-flex',
          padding: '0.5rem 0.75rem',
          background: 'var(--bg-tertiary)',
          borderRadius: '0.5rem',
          fontSize: '0.875rem',
          color: 'var(--text-secondary)',
          alignSelf: 'flex-start'
        }}>
          {character.statusMessage || '건강'}
        </div>
      </div>
    </div>
  );
};