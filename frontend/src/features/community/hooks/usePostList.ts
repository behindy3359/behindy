import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/shared/store/authStore';
import { usePosts } from './usePosts';
import type { PostListProps, PostListState, UsePostListReturn } from '../types/postListTypes';

export const usePostList = ({
  initialPage = 0,
  pageSize = 12,
  enableSearch = true,
  viewMode: initialViewMode = 'grid'
}: PostListProps): UsePostListReturn => {
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();
  
  const [state, setState] = useState<PostListState>({
    currentPage: initialPage,
    searchQuery: '',
    showSearch: false,
    sortBy: 'latest',
    viewMode: initialViewMode,
  });

  const { data: postsData, isLoading, error } = usePosts(
    state.currentPage, 
    pageSize, 
    state.searchQuery, 
    state.sortBy
  );

  const handlePostClick = useCallback((postId: number) => {
    router.push(`/community/${postId}`);
  }, [router]);

  const handleWritePost = useCallback(() => {
    // if (!isAuthenticated()) {
    //   router.push('/auth/login?redirect=/community/write');
    //   return;
    // }
    router.push('/community/write');
  }, [isAuthenticated, router]);

  const handleSearch = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    setState(prev => ({ ...prev, currentPage: 0 }));
  }, []);

  const handleSortChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    setState(prev => ({
      ...prev,
      sortBy: e.target.value,
      currentPage: 0
    }));
  }, []);

  const handleViewModeChange = useCallback((mode: 'grid' | 'list') => {
    setState(prev => ({ ...prev, viewMode: mode }));
  }, []);

  const handlePageChange = useCallback((page: number) => {
    setState(prev => ({ ...prev, currentPage: page }));
  }, []);

  const setSearchQuery = useCallback((query: string) => {
    setState(prev => ({ ...prev, searchQuery: query }));
  }, []);

  const setShowSearch = useCallback((show: boolean) => {
    setState(prev => ({ ...prev, showSearch: show }));
  }, []);

  return {
    // Data
    postsData,
    isLoading,
    error,
    
    // State
    state,
    
    // Actions
    handlePostClick,
    handleWritePost,
    handleSearch,
    handleSortChange,
    handleViewModeChange,
    handlePageChange,
    setSearchQuery,
    setShowSearch,
  };
};