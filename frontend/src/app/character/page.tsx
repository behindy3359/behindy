"use client";

import React from 'react';
import { AppLayout } from '@/shared/components/layout/applayout/AppLayout';
import { CharacterPageContainer } from '@/features/game/components/CharacterPageContainer';

export default function CharacterRoute() {
  return (
    <AppLayout>
      <CharacterPageContainer />
    </AppLayout>
  );
}