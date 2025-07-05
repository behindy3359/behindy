"use client";

import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { PostList } from '@/components/community/PostList';
import { DashboardLayout, PublicLayout } from '@/components/layout';
import { Metadata } from 'next';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5분
      retry: 1,
    },
  },
});

export const metadata: Metadata = {
  title: '커뮤니티',
  description: 'Behindy 의 게시판',
}

export default function CommunityPage() {
  return (
    <QueryClientProvider client={queryClient}>
      <PublicLayout>
        <PostList />
      </PublicLayout>
    </QueryClientProvider>
  );
}