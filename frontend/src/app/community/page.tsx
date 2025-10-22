"use client";

import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { PostList } from '@/features/community/components/PostList/PostList';
import { AppLayout } from '@/shared/components/layout/applayout/AppLayout';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      retry: 1,
    },
  },
});

export default function CommunityPage() {
  return (
    <QueryClientProvider client={queryClient}>
      <AppLayout>
        <PostList />
      </AppLayout>
    </QueryClientProvider>
  );
}