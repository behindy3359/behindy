"use client";

import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { PublicLayout } from '@/shared/components/layout/applayout/AppLayout';
import { HomePage } from '@/features/hompage/components/HomePage';


const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      retry: 1,
    },
  },
});

export default function Home() {
  return (
    <QueryClientProvider client={queryClient}>
      <PublicLayout>
        <HomePage />
      </PublicLayout>
    </QueryClientProvider>
  );
}