
import React from 'react';
import { Heart, Brain, Sparkles } from 'lucide-react';

export const CharacterStats: React.FC = () => {
  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(3, 1fr)',
      gap: '1rem',
      marginBottom: '2rem',
      padding: '1.5rem',
      background: 'var(--bg-secondary)',
      borderRadius: '1rem',
      border: '1px solid var(--border-light)'
    }}>
      <div style={{ 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        gap: '0.5rem' 
      }}>
        <Heart size={20} style={{ color: 'var(--primary-500)' }} />
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
          100/100
        </span>
      </div>

      <div style={{ 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        gap: '0.5rem' 
      }}>
        <Brain size={20} style={{ color: 'var(--primary-500)' }} />
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
          100/100
        </span>
      </div>

      <div style={{ 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        gap: '0.5rem' 
      }}>
        <Sparkles size={20} style={{ color: 'var(--primary-500)' }} />
        <span style={{ 
          fontSize: '0.875rem', 
          color: 'var(--text-secondary)',
          fontWeight: '500'
        }}>
          상태
        </span>
        <span style={{ 
          fontSize: '1rem', 
          color: 'var(--text-primary)',
          fontWeight: '600'
        }}>
          건강
        </span>
      </div>
    </div>
  );
};