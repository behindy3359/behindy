"use client";

import React from 'react';
import { PostForm } from '@/features/community/components/PostForm/PostForm';
import { AppLayout } from '@/shared/components/layout/applayout/AppLayout';

export default function WritePostPage() {
  return (
    <AppLayout>
      <PostForm mode="create" />
    </AppLayout>
  );
}