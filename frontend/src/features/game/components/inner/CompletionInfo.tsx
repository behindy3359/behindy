import React from 'react';

interface CompletionInfoProps {
  storyTitle: string;
  stationLine: number;
}

export const CompletionInfo: React.FC<CompletionInfoProps> = ({
  storyTitle,
  stationLine
}) => {
  return (
    <div style={{
      background: 'var(--bg-secondary)',
      border: '1px solid var(--border-light)',
      borderRadius: '0.75rem',
      padding: '1.25rem',
      display: 'flex',
      flexDirection: 'column',
      gap: '0.75rem'
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        color: 'var(--text-secondary)',
        fontSize: '0.875rem'
      }}>
        <span style={{
          color: 'var(--text-tertiary)',
          minWidth: '60px'
        }}>
          스토리
        </span>
        <span style={{
          color: 'var(--text-primary)',
          fontWeight: '500'
        }}>
          {storyTitle}
        </span>
      </div>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        color: 'var(--text-secondary)',
        fontSize: '0.875rem'
      }}>
        <span style={{
          color: 'var(--text-tertiary)',
          minWidth: '60px'
        }}>
          노선
        </span>
        <span style={{
          color: 'var(--text-primary)',
          fontWeight: '500'
        }}>
          {stationLine}호선
        </span>
      </div>
    </div>
  );
};
