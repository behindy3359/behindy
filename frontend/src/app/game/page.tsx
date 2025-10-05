"use client";

import React from 'react';
import dynamic from 'next/dynamic';
import { AppLayout } from '@/shared/components/layout/applayout/AppLayout';

// 순수 HTML/CSS 로딩 컴포넌트 (SSR 안전)
function GameLoadingFallback() {
  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '100vh',
      flexDirection: 'column',
      gap: '1rem'
    }}>
      <div style={{
        width: '48px',
        height: '48px',
        border: '4px solid #e5e7eb',
        borderTopColor: '#3b82f6',
        borderRadius: '50%',
        animation: 'spin 1s linear infinite'
      }} />
      <p style={{ color: '#6b7280' }}>게임을 준비하는 중...</p>
    </div>
  );
}

const GamePageContainer = dynamic(
  () => import('@/features/game/components/GamePageContainer').then(mod => mod.GamePageContainer),
  {
    ssr: false,
    loading: () => <GameLoadingFallback />
  }
);

export default function GameRoute() {
  return (
    <AppLayout>
      <GamePageContainer />
    </AppLayout>
  );
}