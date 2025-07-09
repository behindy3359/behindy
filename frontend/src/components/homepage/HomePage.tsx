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
import { RealtimeMetroMap } from '@/components/metroMap/RealtimeMetroMap';
import { PostCard } from '@/components/community/PostCard/PostCard';
import { Button } from '@/components/ui/button/Button';
import { useAuthStore } from '@/store/authStore';
import { ERROR_MESSAGES, LOADING_MESSAGES } from '@/utils/common/constants';
import { PageContainer } from '@/styles/commonStyles';
import { SectionContainer } from '@/styles/commonStyles';
import { useRecentPosts } from './hooks/useRecentPosts';
import { 
  CommunityHeader, 
  CommunitySection, 
  EmptyState, 
  LoadingState, 
  MetroHeader, 
  MetroMapContainer, 
  PostGrid, 
  ViewAllButton 
} from './styles';
import { StatCard } from './inner/StatCard';


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

    return {
      totalPosts: postsData.totalElements || 0,
      todayPosts: todayPostsCount,
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