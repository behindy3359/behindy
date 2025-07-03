"use client";

import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { PostForm } from '@/components/community/PostForm';
import { DashboardLayout } from '@/components/layout';

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