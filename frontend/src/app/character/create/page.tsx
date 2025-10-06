"use client";

import React from 'react';
import { AppLayout } from '@/shared/components/layout/applayout/AppLayout';
import { CharacterCreatePageContainer } from '@/features/game/components/CharacterCreatePageContainer';

export default function CharacterCreateRoute() {
  return (
    <AppLayout>
      <CharacterCreatePageContainer />
    </AppLayout>
  );
}