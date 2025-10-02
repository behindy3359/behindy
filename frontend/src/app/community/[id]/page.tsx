
"use client";

import React from 'react';
import { useParams } from 'next/navigation';
import { PostDetail } from '@/features/community/components/PostDetail/PostDetail';
import { AppLayout } from '@/shared/components/layout/applayout/AppLayout';

export default function PostDetailPage() {
  const params = useParams();
  const postId = parseInt(params.id as string);

  if (isNaN(postId)) {
    return (
      <AppLayout>
        <div style={{
          textAlign: 'center',
          padding: '40px',
          color: '#ef4444'
        }}>
          잘못된 게시글 ID입니다.
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <PostDetail postId={postId} />
    </AppLayout>
  );
}