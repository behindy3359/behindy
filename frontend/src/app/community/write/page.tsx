"use client";

import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { PostForm } from '@/features/community/components/PostForm/PostForm';
import { DashboardLayout } from '@/shared/components/layout/applayout/AppLayout';

const queryClient = new QueryClient();

export default function WritePostPage() {
  return (
    <QueryClientProvider client={queryClient}>
      <DashboardLayout>
        <PostForm mode="create" />
      </DashboardLayout>
    </QueryClientProvider>
  );
}