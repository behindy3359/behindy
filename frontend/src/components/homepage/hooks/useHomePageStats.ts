import { useMemo } from 'react';
import { MessageSquare, TrendingUp, User } from 'lucide-react';

interface HomePageStats {
  totalPosts: number;
  todayPosts: number;
  activeUsers: number;
}

export const useHomePageStats = (stats: HomePageStats) => {
  const statItems = useMemo(() => [
    {
      icon: MessageSquare,
      title: '전체 게시글',
      value: stats.totalPosts.toLocaleString(),
      change: `+${stats.todayPosts} 오늘`
    },
    {
      icon: TrendingUp,
      title: '공사중',
      value: '1234',
      change: '여기엔 뭘 넣을까요'
    },
    {
      icon: User,
      title: '공사중',
      value: '1234',
      change: '여기엔 뭘 넣을까요'
    }
  ], [stats]);

  return {
    statItems,
  };
};