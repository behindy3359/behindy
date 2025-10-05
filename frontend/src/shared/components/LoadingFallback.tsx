/**
 * 공통 로딩 Fallback 컴포넌트
 * Dynamic import 시 사용하는 로딩 UI
 */

import React from 'react';
import { CommonLoadingState } from '@/shared/styles/components/common';

interface LoadingFallbackProps {
  message?: string;
  variant?: 'page' | 'section' | 'inline';
}

export const LoadingFallback: React.FC<LoadingFallbackProps> = ({
  message = '로딩 중...',
  variant = 'section'
}) => {
  return (
    <CommonLoadingState $variant={variant}>
      <div className="loading-spinner" />
      <p className="loading-text">{message}</p>
    </CommonLoadingState>
  );
};

export const GameLoadingFallback = () => (
  <LoadingFallback message="게임을 준비하는 중..." variant="page" />
);

export const CharacterLoadingFallback = () => (
  <LoadingFallback message="캐릭터 정보를 확인하는 중..." variant="page" />
);

export const PostListLoadingFallback = () => (
  <LoadingFallback message="게시글 목록을 불러오는 중..." variant="section" />
);

export const PostDetailLoadingFallback = () => (
  <LoadingFallback message="게시글을 불러오는 중..." variant="section" />
);

export const EditorLoadingFallback = () => (
  <LoadingFallback message="에디터를 준비하는 중..." variant="section" />
);
