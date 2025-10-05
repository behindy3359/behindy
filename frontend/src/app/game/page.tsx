"use client";

import React from 'react';
import dynamic from 'next/dynamic';
import { GameLoadingFallback } from '@/shared/components/LoadingFallback';

// AppLayout과 GamePageContainer 모두 Dynamic import
const AppLayout = dynamic(
  () => import('@/shared/components/layout/applayout/AppLayout').then(mod => ({ default: mod.AppLayout })),
  { ssr: false }
);

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