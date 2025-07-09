"use client";

import React, { useMemo, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { 
  MessageSquare, 
  Plus, 
  ArrowRight,
  Train,
  TrendingUp,
  User,
} from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { buildApiUrl } from '@/utils/common/api';
import type { PostListResponse } from '@/types/community/community';
import { RealtimeMetroMap } from '@/components/metroMap/RealtimeMetroMap';
import { PostCard } from '@/components/community/PostCard/PostCard';
import { Button } from '@/components/ui/button/Button';
import { useAuthStore } from '@/store/authStore';
import { publicApi } from '@/services/api/axiosConfig';
import { ERROR_MESSAGES, LOADING_MESSAGES } from '@/utils/common/constants';
import { PageContainer } from '@/styles/commonStyles';
import { SectionContainer } from '@/styles/commonStyles';

// ================================================================
// Styled Components
// ================================================================

const MetroHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 24px 16px 24px;
  border-bottom: 1px solid #f3f4f6;
  background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
  
  h2 {
    font-size: 20px;
    font-weight: 700;
    color: #111827;
    margin: 0;
    display: flex;
    align-items: center;
    gap: 10px;
  }
  
  .live-indicator {
    display: flex;
    align-items: center;
    gap: 6px;
    color: #ef4444;
    font-size: 14px;
    font-weight: 600;
    background: rgba(239, 68, 68, 0.1);
    padding: 4px 8px;
    border-radius: 12px;
    
    &::before {
      content: '';
      width: 8px;
      height: 8px;
      background: #ef4444;
      border-radius: 50%;
      animation: pulse 2s infinite;
    }
  }
  
  @keyframes pulse {
    0%, 100% { opacity: 1; transform: scale(1); }
    50% { opacity: 0.7; transform: scale(1.1); }
  }
`;

const MetroMapContainer = styled.div`
  padding: 0;
  background: none;
  
  & > div {
    padding: 0 !important;
    background: none !important;
    margin: 0 !important;
  }
  
  & > div > div {
    background: none !important;
    border-radius: 0 !important;
    padding: 20px !important;
    box-shadow: none !important;
    margin: 0 !important;
    border: none !important;
  }
`;

const CommunitySection = styled.div`
  background: white;
  border-radius: 16px;
  border: 1px solid #e5e7eb;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
`;

const CommunityHeader = styled.div`
  padding: 24px;
  border-bottom: 1px solid #f3f4f6;
  background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
  
  .header-top {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
  }
  
  .section-title {
    font-size: 20px;
    font-weight: 700;
    color: #111827;
    margin: 0;
    display: flex;
    align-items: center;
    gap: 10px;
  }
  
  .stats-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
    gap: 20px;
  }
  
  @media (max-width: 768px) {
    .header-top {
      flex-direction: column;
      gap: 16px;
      align-items: stretch;
    }
    
    .stats-grid {
      grid-template-columns: repeat(2, 1fr);
      gap: 12px;
    }
  }
`;

const PostGrid = styled.div`
  padding: 24px;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 20px;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 16px;
    padding: 16px;
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 60px 20px;
  
  .empty-icon {
    width: 64px;
    height: 64px;
    margin: 0 auto 20px;
    color: #d1d5db;
  }
  
  .empty-title {
    font-size: 18px;
    font-weight: 600;
    color: #374151;
    margin-bottom: 8px;
  }
  
  .empty-description {
    color: #6b7280;
    font-size: 14px;
    margin-bottom: 24px;
    line-height: 1.5;
  }
`;

const LoadingState = styled.div`
  text-align: center;
  padding: 60px 20px;
  color: #6b7280;
  font-size: 16px;
`;

const ViewAllButton = styled(motion.div)`
  margin: 0 24px 24px 24px;
  padding: 16px 24px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 12px;
  cursor: pointer;
  text-align: center;
  color: white;
  font-weight: 600;
  font-size: 15px;
  transition: all 0.2s ease;
  
  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
  }
  
  .view-all-content {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
  }
`;

const StatItem = styled(motion.div)`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 16px;
  background: white;
  border-radius: 10px;
  border: 1px solid #e5e7eb;
  
  .stat-icon {
    width: 36px;
    height: 36px;
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
  }
  
  .stat-content {
    .stat-number {
      font-size: 18px;
      font-weight: 700;
      color: #111827;
      line-height: 1;
      margin-bottom: 2px;
    }
    
    .stat-label {
      font-size: 12px;
      color: #6b7280;
      font-weight: 500;
    }
    
    .stat-change {
      font-size: 11px;
      color: #10b981;
      font-weight: 500;
      margin-top: 2px;
    }
  }
`;

// ================================================================
// Helper Functions
// ================================================================

const isToday = (date: Date): boolean => {
  const today = new Date();
  return date.toDateString() === today.toDateString();
};

// ================================================================
// Optimized Components
// ================================================================
interface StatCardProps {
  stat: {
    icon: React.ComponentType<{ size?: number }>;
    title: string;
    value: string;
    change: string;
  };
  index: number;
}

const StatCard = React.memo<StatCardProps>(function StatCard({ stat, index }) {
  const { icon: Icon, title, value, change } = stat;

  return (
    <StatItem
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      whileHover={{ y: -2 }}
    >
      <div className="stat-icon">
        <Icon size={20} />
      </div>
      <div className="stat-content">
        <div className="stat-number">{value}</div>
        <div className="stat-label">{title}</div>
        <div className="stat-change">{change}</div>
      </div>
    </StatItem>
  );
}, (prevProps, nextProps) => {
  return (
    prevProps.stat.value === nextProps.stat.value &&
    prevProps.stat.change === nextProps.stat.change &&
    prevProps.stat.title === nextProps.stat.title
  );
});

// ================================================================
// Hook
// ================================================================

const useRecentPosts = (limit: number = 6) => {
  return useQuery({
    queryKey: ['recent-posts', limit],
    queryFn: async () => {
      const url = buildApiUrl.posts({ page: 0, size: limit });
      return await publicApi.getPosts<PostListResponse>(url);
    },
    staleTime: 2 * 60 * 1000, // 2분 캐시
    retry: 1,
  });
};

// ================================================================
// Main Component
// ================================================================

export const HomePage: React.FC = () => {
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();
  
  const { data: postsData, isLoading, error } = useRecentPosts(6);

  const stats = useMemo(() => {
    if (!postsData) {
      return {
        totalPosts: 0,
        todayPosts: 0,
        totalComments: 0,
        activeUsers: 1234 // API에서 가져올 데이터
      };
    }

    const today = new Date();
    const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate());

    const todayPostsCount = postsData.posts?.filter(post => {
      const postDate = new Date(post.createdAt);
      return postDate >= todayStart;
    }).length || 0;

    // const totalCommentsCount = postsData.posts?.reduce((sum, post) => {
    //   // 실제 commentCount 필드가 있다면 사용, 없으면 0
    //   return sum + (post.commentCount || 0);
    // }, 0) || 0;

    return {
      totalPosts: postsData.totalElements || 0,
      todayPosts: todayPostsCount,
      // totalComments: totalCommentsCount,
      activeUsers: 1234 // TODO: API에서 실제 활성 사용자 수 가져오기
    };
  }, [postsData]);

  const recentPosts = useMemo(() => {
    if (!postsData?.posts) return [];
    return postsData.posts.slice(0, 6);
  }, [postsData?.posts]);

  const handleWritePost = useCallback(() => {
    if (!isAuthenticated()) {
      router.push('/auth/login');
      return;
    }
    router.push('/community/write');
  }, [isAuthenticated, router]);

  const handleViewAllPosts = useCallback(() => {
    router.push('/community');
  }, [router]);

  const statItems = useMemo(() => [
    {
      icon: MessageSquare,
      title: '전체 게시글',
      value: stats.totalPosts.toLocaleString(),
      change: `+${stats.todayPosts} 오늘`
    },
    // {
    //   icon: TrendingUp,
    //   title: '총 댓글',
    //   value: stats.totalComments.toLocaleString(),
    //   change: '활발한 소통'
    // },
    {
      icon: User,
      title: '활성 사용자',
      value: stats.activeUsers.toLocaleString(),
      change: '온라인'
    }
  ], [stats]);

  return (
    <PageContainer>
      <SectionContainer>
        <MetroHeader>
          <h2>
            <Train size={24} />
            실시간 지하철 노선도
          </h2>
          <div className="live-indicator">
            LIVE
          </div>
        </MetroHeader>
        
        <MetroMapContainer>
          <RealtimeMetroMap />
        </MetroMapContainer>
      </SectionContainer>

      <CommunitySection>
        <CommunityHeader>
          <div className="header-top">
            <h3 className="section-title">
              <MessageSquare size={22} />
              승객들의 이야기
            </h3>
            
            <Button
              variant="primary"
              size="sm"
              onClick={handleWritePost}
              leftIcon={<Plus size={16} />}
            >
              글쓰기
            </Button>
          </div>

          <div className="stats-grid">
            {statItems.map((stat, index) => (
              <StatCard
                key={stat.title}
                stat={stat}
                index={index}
              />
            ))}
          </div>
        </CommunityHeader>

        {isLoading ? (
          <LoadingState>
            {LOADING_MESSAGES.POSTS_LOADING}
          </LoadingState>
        ) : error ? (
          <EmptyState>
            <MessageSquare className="empty-icon" />
            <div className="empty-title">
              {ERROR_MESSAGES.POST_LOAD_ERROR}
            </div>
            <div className="empty-description">
              잠시 후 다시 시도해주세요
            </div>
          </EmptyState>
        ) : recentPosts.length > 0 ? (
          <>
            <PostGrid>
              {recentPosts.map((post, index) => (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <PostCard 
                    post={post} 
                    compact
                    showMetroLine 
                  />
                </motion.div>
              ))}
            </PostGrid>
            
            <ViewAllButton
              onClick={handleViewAllPosts}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="view-all-content">
                <span>모든 게시글 보기</span>
                <ArrowRight size={18} />
              </div>
            </ViewAllButton>
          </>
        ) : (
          <EmptyState>
            <MessageSquare className="empty-icon" />
            <div className="empty-title">첫 번째 이야기를 들려주세요</div>
            <div className="empty-description">
              지하철에서 경험한 흥미로운 이야기나<br />
              신기한 경험을 공유해보세요
            </div>
            <Button
              variant="primary"
              onClick={handleWritePost}
              leftIcon={<Plus />}
            >
              첫 게시글 작성하기
            </Button>
          </EmptyState>
        )}
      </CommunitySection>
    </PageContainer>
  );
};

export default HomePage;