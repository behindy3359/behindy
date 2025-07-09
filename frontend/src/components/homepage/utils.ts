import type { Post } from '@/types/community/community';

export const isToday = (date: Date): boolean => {
  const today = new Date();
  return date.toDateString() === today.toDateString();
};

export const getTodayPosts = (posts: Post[]): Post[] => {
  return posts.filter(post => {
    const postDate = new Date(post.createdAt);
    return isToday(postDate);
  });
};

export const calculatePostStats = (posts: Post[]) => {
  const todayPosts = getTodayPosts(posts);
  
  return {
    totalPosts: posts.length,
    todayPosts: todayPosts.length,
    // TODO: 실제 댓글 수, 활성 사용자 수 등 추가
  };
};

export const getRecentPosts = (posts: Post[], limit: number): Post[] => {
  return posts
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, limit);
};

export const createPostPreviewData = (posts: Post[], limit: number) => {
  const recentPosts = getRecentPosts(posts, limit);
  const stats = calculatePostStats(posts);
  
  return {
    posts: recentPosts,
    stats,
    hasMore: posts.length > limit,
  };
};

export const formatStatValue = (value: number): string => {
  if (value >= 1000000) {
    return `${(value / 1000000).toFixed(1)}M`;
  }
  if (value >= 1000) {
    return `${(value / 1000).toFixed(1)}K`;
  }
  return value.toLocaleString();
};

export const formatStatChange = (current: number, previous: number): string => {
  const diff = current - previous;
  const percentage = previous > 0 ? Math.round((diff / previous) * 100) : 0;
  
  if (diff > 0) {
    return `+${diff} (+${percentage}%)`;
  } else if (diff < 0) {
    return `${diff} (${percentage}%)`;
  }
  return '변화 없음';
};