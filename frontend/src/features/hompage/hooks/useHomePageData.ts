import { useMemo } from 'react';
import { useRecentPosts } from './useRecentPosts';
import type { PostListResponse } from '@/shared/types/community/community';

export const useHomePageData = (postLimit: number = 6) => {
  const { data: postsData, isLoading, error } = useRecentPosts(postLimit);

  const stats = useMemo(() => {
    if (!postsData) {
      return {
        totalPosts: 0,
        todayPosts: 0,
        totalComments: 0,
        activeUsers: 1234 // TODO: API에서 가져올 데이터
      };
    }

    const today = new Date();
    const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate());

    const todayPostsCount = postsData.posts?.filter(post => {
      const postDate = new Date(post.createdAt);
      return postDate >= todayStart;
    }).length || 0;

    return {
      totalPosts: postsData.totalElements || 0,
      todayPosts: todayPostsCount,
      activeUsers: 1234 // TODO: API에서 실제 활성 사용자 수 가져오기
    };
  }, [postsData]);

  const recentPosts = useMemo(() => {
    if (!postsData?.posts) return [];
    return postsData.posts.slice(0, postLimit);
  }, [postsData?.posts, postLimit]);

  return {
    postsData,
    stats,
    recentPosts,
    isLoading,
    error,
  };
};