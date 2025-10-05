"use client";

import React from 'react';
import dynamic from 'next/dynamic';
import { CharacterLoadingFallback } from '@/shared/components/LoadingFallback';

// AppLayout과 CharacterCreatePageContainer 모두 Dynamic import
const AppLayout = dynamic(
  () => import('@/shared/components/layout/applayout/AppLayout').then(mod => ({ default: mod.AppLayout })),
  { ssr: false }
);

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