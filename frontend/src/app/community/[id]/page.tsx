"use client";

import React from 'react';
import { useParams } from 'next/navigation';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { PostDetail } from '@/features/community/components/PostDetail/PostDetail';
import { DashboardLayout, PublicLayout } from '@/shared/components/layout/applayout/AppLayout';

const queryClient = new QueryClient();

export default function PostDetailPage() {
  const params = useParams();
  const postId = parseInt(params.id as string);

  if (isNaN(postId)) {
    return (
      <DashboardLayout>
        <div style={{ 
          textAlign: 'center', 
          padding: '40px', 
          color: '#ef4444' 
        }}>
          잘못된 게시글 ID입니다.
        </div>
      </DashboardLayout>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <PublicLayout>
        <PostDetail postId={postId} />
      </PublicLayout>
    </QueryClientProvider>
  );
}