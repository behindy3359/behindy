"use client";

import React from 'react';
import { PostList } from '@/features/community/components/PostList/PostList';
import { AppLayout } from '@/shared/components/layout/applayout/AppLayout';

export default function CommunityPage() {
  return (
    <AppLayout>
      <PostList />
    </AppLayout>
  );
}