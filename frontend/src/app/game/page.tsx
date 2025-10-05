"use client";

import React from 'react';
import dynamic from 'next/dynamic';
import { AppLayout } from '@/shared/components/layout/applayout/AppLayout';
import { GameLoadingFallback } from '@/shared/components/LoadingFallback';

// Dynamic import로 SSR 비활성화
const GamePageContainer = dynamic(
  () => import('@/features/game/components/GamePageContainer').then(mod => ({ default: mod.GamePageContainer })),
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