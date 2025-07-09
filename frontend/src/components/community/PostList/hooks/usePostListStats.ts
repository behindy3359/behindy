import { useMemo } from 'react';
import { PostListResponse } from '@/types/community/community';

export interface PostListStats {
  totalPosts: number;
  todayPosts: number;
  totalComments: number;
  activeUsers: number;
}

export const usePostListStats = (postsData: PostListResponse | undefined): PostListStats => {
  return useMemo(() => {
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
      totalComments: 0, // TODO: API에서 가져올 데이터
      activeUsers: 1234 // TODO: API에서 가져올 데이터
    };
  }, [postsData]);
};