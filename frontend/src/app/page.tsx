"use client";

import React, { useEffect } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AppLayout } from '@/shared/components/layout/applayout/AppLayout'; // 🔥 수정
import { HomePage } from '@/features/hompage/components/HomePage';
import { useAutoTheme } from '@/shared/hooks/useAutoTheme';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      retry: 1,
    },
  },
});

export default function Home() {
  const { isGameMode } = useAutoTheme();
  
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', 'light');
    document.documentElement.classList.remove('game-mode');
    document.body.setAttribute('data-theme', 'light');
    document.body.classList.remove('game-mode');
  }, [isGameMode]);

  return (
    <QueryClientProvider client={queryClient}>
      <AppLayout>
        <HomePage />
      </AppLayout>
    </QueryClientProvider>
  );
}