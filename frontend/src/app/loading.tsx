"use client";

import { CommonLoadingState } from '@/shared/styles/components/common';

export default function Loading() {
  return (
    <CommonLoadingState $variant="page">
      <div className="loading-spinner" />
      <p className="loading-text">로딩 중...</p>
    </CommonLoadingState>
  );
}
