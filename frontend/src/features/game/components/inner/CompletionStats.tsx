import React from 'react';
import { User, MapPin, Heart, Brain } from 'lucide-react';
import { Character } from '../../types/gameTypes';

interface CompletionStatsProps {
  character: Character;
  stationName: string;
}

export const CompletionStats: React.FC<CompletionStatsProps> = ({
  character,
  stationName
}) => {
  const stats = [
    {
      icon: <User size={20} />,
      label: '캐릭터',
      value: character.charName
    },
    {
      icon: <MapPin size={20} />,
      label: '도착지',
      value: stationName
    },
    {
      icon: <Heart size={20} />,
      label: '체력',
      value: `${character.charHealth}/100`
    },
    {
      icon: <Brain size={20} />,
      label: '정신력',
      value: `${character.charSanity}/100`
    }
  ];

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(2, 1fr)',
      gap: '1rem',
      marginTop: '1.5rem'
    }}>
      {stats.map((stat, index) => (
        <div
          key={index}
          style={{
            background: 'rgba(255, 255, 255, 0.15)',
            backdropFilter: 'blur(10px)',
            borderRadius: '0.75rem',
            padding: '1rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem'
          }}
        >
          <div style={{
            width: '40px',
            height: '40px',
            background: 'rgba(255, 255, 255, 0.2)',
            borderRadius: '0.5rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            color: 'white'
          }}>
            {stat.icon}
          </div>
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '0.125rem',
            minWidth: 0
          }}>
            <span style={{
              fontSize: '0.75rem',
              opacity: 0.9,
              color: 'white'
            }}>
              {stat.label}
            </span>
            <span style={{
              fontSize: '1.125rem',
              fontWeight: '600',
              color: 'white'
            }}>
              {stat.value}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
};
