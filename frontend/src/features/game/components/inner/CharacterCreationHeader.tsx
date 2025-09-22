import React from 'react';
import { User } from 'lucide-react';

interface CharacterCreationHeaderProps {
  stationName: string | null;
  lineNumber: string | null;
}

export const CharacterCreationHeader: React.FC<CharacterCreationHeaderProps> = ({
  stationName,
  lineNumber
}) => {
  return (
    <div style={{ marginBottom: '2rem', textAlign: 'center' }}>
      <div style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '80px',
        height: '80px',
        background: 'linear-gradient(135deg, var(--primary-500) 0%, var(--secondary-500) 100%)',
        borderRadius: '50%',
        color: 'var(--text-inverse)',
        marginBottom: '1rem'
      }}>
        <User size={32} />
      </div>
      
      <h2 style={{
        fontSize: '1.875rem',
        fontWeight: '700',
        color: 'var(--text-primary)',
        marginBottom: '1rem'
      }}>
        새로운 모험가 등록
      </h2>
      
      <p style={{
        fontSize: '1rem',
        color: 'var(--text-secondary)',
        lineHeight: '1.6'
      }}>
        {stationName && lineNumber ? (
          <>
            <strong>{stationName}역 {lineNumber}호선</strong>에서 펼쳐질 모험을 위해<br />
            새로운 캐릭터를 만들어보세요
          </>
        ) : (
          '지하철 모험을 함께할 캐릭터를 생성하세요'
        )}
      </p>
    </div>
  );
};