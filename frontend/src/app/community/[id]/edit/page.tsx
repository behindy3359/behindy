"use client";

import React from 'react';
import { useParams } from 'next/navigation';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { PostForm } from '@/features/community/components/PostForm/PostForm';
import { AppLayout } from '@/shared/components/layout/applayout/AppLayout'; // 🔥 수정

const queryClient = new QueryClient();

export default function EditPostPage() {
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
    <QueryClientProvider client={queryClient}>
      <AppLayout>
        <PostForm mode="edit" postId={postId} />
      </AppLayout>
    </QueryClientProvider>
  );
}