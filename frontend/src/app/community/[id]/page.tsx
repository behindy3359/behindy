"use client";

import React from 'react';
import dynamic from 'next/dynamic';
import { useParams } from 'next/navigation';
import { AppLayout } from '@/shared/components/layout/applayout/AppLayout';
import { PostDetailLoadingFallback } from '@/shared/components/LoadingFallback';
import { CommonErrorState } from '@/shared/styles/components/common';

// Dynamic import로 SSR 비활성화
const PostDetail = dynamic(
  () => import('@/features/community/components/PostDetail/PostDetail').then(mod => ({ default: mod.PostDetail })),
  {
    ssr: false,
    loading: () => <PostDetailLoadingFallback />
  }
);

export default function PostDetailPage() {
  const params = useParams();
  const postId = parseInt(params.id as string);

  if (isNaN(postId)) {
    return (
      <AppLayout>
        <CommonErrorState $variant="section">
          <p className="error-message">잘못된 게시글 ID입니다.</p>
        </CommonErrorState>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <PostDetail postId={postId} />
    </AppLayout>
  );
}