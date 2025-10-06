"use client";

import React from 'react';
import { AppLayout } from '@/shared/components/layout/applayout/AppLayout';
import { GamePageContainer } from '@/features/game/components/GamePageContainer';

export default function GameRoute() {
  return (
    <AppLayout>
      <GamePageContainer />
    </AppLayout>
  );
}