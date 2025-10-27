"use client";

import React from 'react';
import dynamic from 'next/dynamic';
import { AppLayout } from '@/shared/components/layout/applayout/AppLayout';

// Dynamic Import: 게임 페이지는 필요시에만 로드 (번들 크기 최적화)
const GamePageContainer = dynamic(
  () => import('@/features/game/components/GamePageContainer').then(mod => ({ default: mod.GamePageContainer })),
  {
    loading: () => (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '50vh',
        fontSize: '1.2rem',
        color: '#666'
      }}>
        게임 로딩 중...
      </div>
    ),
    ssr: true, // 게임 페이지는 SEO 중요
  }
);

export default function GameRoute() {
  return (
    <AppLayout>
      <GamePageContainer />
    </AppLayout>
  );
}