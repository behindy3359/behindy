"use client";

import React from 'react';
import { LOADING_MESSAGES } from '@/utils/common/constants';
import { PageContainer } from '@/styles/commonStyles';
import { CommunitySection, LoadingState } from './styles';
import { useHomePageData } from './hooks/useHomePageData';
import { useHomePageActions } from './hooks/useHomePageActions';
import { useHomePageStats } from './hooks/useHomePageStats';
import { MetroMapSection } from './inner/MetroMapSection';
import { CommunityHeader } from './inner/CommunityHeader';
import { PostsGrid } from './inner/PostsGrid';
import { EmptyPostsState } from './inner/EmptyPostsState';
import { ViewAllButton } from './inner/ViewAllButton';
import { ErrorState } from './inner/ErrorState';

export const HomePage: React.FC = () => {
  // 훅들로 로직 분리
  const {
    stats,
    recentPosts,
    isLoading,
    error,
  } = useHomePageData(6);

  const {
    handleWritePost,
    handleViewAllPosts,
  } = useHomePageActions();

  const { statItems } = useHomePageStats(stats);

  return (
    <PageContainer>
      {/* 지하철 노선도 섹션 */}
      <MetroMapSection />

      {/* 커뮤니티 섹션 */}
      <CommunitySection>
        {/* 커뮤니티 헤더 */}
        <CommunityHeader
          statItems={statItems}
          onWritePost={handleWritePost}
        />

        {/* 게시글 내용 */}
        {isLoading ? (
          <LoadingState>
            {LOADING_MESSAGES.POSTS_LOADING}
          </LoadingState>
        ) : error ? (
          <ErrorState />
        ) : recentPosts.length > 0 ? (
          <>
            <PostsGrid posts={recentPosts} />
            <ViewAllButton onClick={handleViewAllPosts} />
          </>
        ) : (
          <EmptyPostsState onWritePost={handleWritePost} />
        )}
      </CommunitySection>
    </PageContainer>
  );
};

export default HomePage;