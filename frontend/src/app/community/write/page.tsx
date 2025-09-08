"use client";

import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { PostForm } from '@/features/community/components/PostForm/PostForm';
import { AppLayout } from '@/shared/components/layout/applayout/AppLayout'; // 🔥 수정

const queryClient = new QueryClient();

export default function WritePostPage() {
  return (
    <QueryClientProvider client={queryClient}>
      <AppLayout> {/* 🔥 DashboardLayout → AppLayout */}
        <PostForm mode="create" />
      </AppLayout>
    </QueryClientProvider>
  );
}