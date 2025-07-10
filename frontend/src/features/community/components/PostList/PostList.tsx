"use client";

import React from 'react';
import { PageContainer } from '@/styles/commonStyles';
import { usePostList } from '../../hooks/usePostList';
import { PostListHeader } from './inner/PostListHeader';
import { PostListActionBar } from './inner/PostListActionBar';
import { PostListFilters } from './inner/PostListFilters';
import { PostListContent } from './inner/PostListContent';
import { PostListPagination } from './inner/PostListPagination';
import { Header } from './styles';
import type { PostListProps } from '../../types/postListTypes';

export const PostList: React.FC<PostListProps> = ({
  initialPage = 0,
  pageSize = 12,
  enableSearch = true,
  viewMode: initialViewMode = 'grid'
}) => {
  const {
    postsData,
    isLoading,
    error,
    
    state,
    
    handlePostClick,
    handleWritePost,
    handleSearch,
    handleSortChange,
    handleViewModeChange,
    handlePageChange,
    setSearchQuery,
    setShowSearch,
  } = usePostList({ initialPage, pageSize, enableSearch, viewMode: initialViewMode });

  return (
    <PageContainer>
      <Header>
        <PostListHeader onWritePost={handleWritePost} />
        
        <PostListActionBar
          searchQuery={state.searchQuery}
          showSearch={state.showSearch}
          enableSearch={enableSearch}
          onSearch={handleSearch}
          onSearchQueryChange={setSearchQuery}
          onToggleSearch={() => setShowSearch(!state.showSearch)}
          onWritePost={handleWritePost}
        />
      </Header>

      <PostListFilters
        sortBy={state.sortBy}
        viewMode={state.viewMode}
        totalElements={postsData?.totalElements || 0}
        onSortChange={handleSortChange}
        onViewModeChange={handleViewModeChange}
      />

      <PostListContent
        posts={postsData?.posts || []}
        viewMode={state.viewMode}
        isLoading={isLoading}
        error={error}
        onPostClick={handlePostClick}
        onWritePost={handleWritePost}
      />

      <PostListPagination
        currentPage={state.currentPage}
        totalPages={postsData?.totalPages || 0}
        onPageChange={handlePageChange}
      />
    </PageContainer>
  );
};

export default PostList;