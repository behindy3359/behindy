"use client";

import React from 'react';
import dynamic from 'next/dynamic';
import { AppLayout } from '@/shared/components/layout/applayout/AppLayout';
import { CharacterLoadingFallback } from '@/shared/components/LoadingFallback';

// Dynamic import로 SSR 비활성화
const CharacterCreatePageContainer = dynamic(
  () => import('@/features/game/components/CharacterCreatePageContainer').then(mod => ({ default: mod.CharacterCreatePageContainer })),
  {
    ssr: false,
    loading: () => <CharacterLoadingFallback />
  }
);

export default function CharacterCreateRoute() {
  return (
    <AppLayout>
      <CharacterCreatePageContainer />
    </AppLayout>
  );
}