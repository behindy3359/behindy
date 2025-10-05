"use client";

import React from 'react';
import dynamic from 'next/dynamic';
import { AppLayout } from '@/shared/components/layout/applayout/AppLayout';
import { EditorLoadingFallback } from '@/shared/components/LoadingFallback';

// Dynamic import로 SSR 비활성화
const PostForm = dynamic(
  () => import('@/features/community/components/PostForm/PostForm').then(mod => ({ default: mod.PostForm })),
  {
    ssr: false,
    loading: () => <EditorLoadingFallback />
  }
);

export default function WritePostPage() {
  return (
    <AppLayout>
      <PostForm mode="create" />
    </AppLayout>
  );
}