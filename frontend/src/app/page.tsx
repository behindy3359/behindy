"use client";

import React, { useEffect } from 'react';
import { AppLayout } from '@/shared/components/layout/applayout/AppLayout';
import { HomePage } from '@/features/hompage/components/HomePage';
import { useAutoTheme } from '@/shared/hooks/useAutoTheme';

export default function Home() {
  const { isGameMode } = useAutoTheme();

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', 'light');
    document.documentElement.classList.remove('game-mode');
    document.body.setAttribute('data-theme', 'light');
    document.body.classList.remove('game-mode');
  }, [isGameMode]);

  return (
    <AppLayout>
      <HomePage />
    </AppLayout>
  );
}