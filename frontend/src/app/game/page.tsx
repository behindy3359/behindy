"use client";

import React, { Suspense } from 'react';
import { AppLayout } from '@/shared/components/layout/applayout/AppLayout';
import { GamePageContainer } from '@/features/game/components/GamePageContainer';

function GameLoadingFallback() {
  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '100vh',
      color: 'var(--text-secondary)'
    }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{
          width: '48px',
          height: '48px',
          border: '4px solid var(--border-light)',
          borderTopColor: 'var(--primary-500)',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite',
          margin: '0 auto 1rem'
        }} />
        <p>게임을 준비하는 중...</p>
      </div>
    </div>
  );
}

export default function GameRoute() {
  return (
    <AppLayout>
      <Suspense fallback={<GameLoadingFallback />}>
        <GamePageContainer />
      </Suspense>
    </AppLayout>
  );
}