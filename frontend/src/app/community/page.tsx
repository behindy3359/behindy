"use client";

import React from 'react';
import dynamic from 'next/dynamic';
import { AppLayout } from '@/shared/components/layout/applayout/AppLayout';
import { PostListLoadingFallback } from '@/shared/components/LoadingFallback';

// Dynamic import로 SSR 비활성화
const PostList = dynamic(
  () => import('@/features/community/components/PostList/PostList').then(mod => ({ default: mod.PostList })),
  {
    ssr: false,
    loading: () => <PostListLoadingFallback />
  }
);

export default function CommunityPage() {
  return (
    <AppLayout>
      <PostList />
    </AppLayout>
  );
}