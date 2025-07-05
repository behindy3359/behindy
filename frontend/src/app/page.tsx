"use client";

import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { PublicLayout } from '@/components/layout';
import { HomePage } from '@/components/homepage/HomePage';
import type { Metadata } from 'next'


const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5분
      retry: 1,
    },
  },
});

export const metadata: Metadata = {
  title: '홈',
  description: 'Behindy 메인 페이지.',
}

export default function Home() {
  return (
    <QueryClientProvider client={queryClient}>
      <PublicLayout>
        <HomePage />
      </PublicLayout>
    </QueryClientProvider>
  );
}