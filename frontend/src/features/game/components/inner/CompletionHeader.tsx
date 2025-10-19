import React from 'react';

interface CompletionHeaderProps {
  title: string;
  subtitle: string;
}

export const CompletionHeader: React.FC<CompletionHeaderProps> = ({
  title,
  subtitle
}) => {
  return (
    <div style={{
      textAlign: 'center'
    }}>
      <h1 style={{
        fontSize: '2rem',
        fontWeight: '700',
        marginBottom: '0.5rem',
        color: 'white'
      }}>
        {title}
      </h1>
      <p style={{
        fontSize: '1rem',
        opacity: 0.95,
        color: 'white',
        margin: 0
      }}>
        {subtitle}
      </p>
    </div>
  );
};
