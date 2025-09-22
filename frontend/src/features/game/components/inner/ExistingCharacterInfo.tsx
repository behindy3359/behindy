import React from 'react';
import { Info } from 'lucide-react';

interface ExistingCharacterInfoProps {
  stationName: string | null;
  lineNumber: string | null;
}

export const ExistingCharacterInfo: React.FC<ExistingCharacterInfoProps> = ({
  stationName,
  lineNumber
}) => {
  return (
    <div style={{ marginBottom: '1.5rem' }}>
      {/* 안내 메시지 */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        padding: '0.75rem',
        background: 'rgba(102, 126, 234, 0.1)',
        borderRadius: '0.5rem',
        color: 'var(--primary-500)',
        fontSize: '0.875rem',
        marginBottom: '1rem'
      }}>
        <Info size={16} />
        <span>한 번에 하나의 캐릭터만 플레이할 수 있습니다.</span>
      </div>

      {/* 목적지 정보 */}
      {stationName && lineNumber && (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '0.75rem',
          background: 'rgba(102, 126, 234, 0.1)',
          borderRadius: '0.5rem',
          color: 'var(--primary-600)',
          fontSize: '0.875rem',
          fontWeight: '500'
        }}>
          🚉 목적지: {stationName}역 {lineNumber}호선
        </div>
      )}
    </div>
  );
};