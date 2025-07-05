"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { 
  MessageSquare, 
  Plus, 
  ArrowRight,
  Train
} from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { api, buildApiUrl } from '@/config';
import type { PostListResponse } from '@/types/community/community';
import { RealtimeMetroMap } from '@/components/metromap/RealtimeMetroMap';
import { PostCard } from '@/components/community';
import { Button } from '@/components/ui';
import { useAuthStore } from '@/store/authStore';

// ================================================================
// Styled Components
// ================================================================

const Container = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  padding: 24px;
  display: grid;
  grid-template-columns: 1fr 400px;
  gap: 32px;
  min-height: calc(100vh - 80px);
  
  @media (max-width: 1200px) {
    grid-template-columns: 1fr;
    gap: 24px;
    padding: 16px;
  }
`;

const MetroSection = styled.div`
  background: white;
  border-radius: 16px;
  border: 1px solid #e5e7eb;
  padding: 24px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  
  .metro-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 20px;
    
    h2 {
      font-size: 20px;
      font-weight: 700;
      color: #111827;
      margin: 0;
      display: flex;
      align-items: center;
      gap: 8px;
    }
    
    .live-indicator {
      display: flex;
      align-items: center;
      gap: 6px;
      color: #10b981;
      font-size: 14px;
      font-weight: 500;
      
      &::before {
        content: '';
        width: 8px;
        height: 8px;
        background: #10b981;
        border-radius: 50%;
        animation: pulse 2s infinite;
      }
    }
  }
  
  @keyframes pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.5; }
  }
`;

const CommunitySection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const SectionHeader = styled.div`
  background: white;
  border-radius: 12px;
  border: 1px solid #e5e7eb;
  padding: 20px 24px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  
  .header-top {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 16px;
  }
  
  .section-title {
    font-size: 18px;
    font-weight: 700;
    color: #111827;
    margin: 0;
    display: flex;
    align-items: center;
    gap: 8px;
  }
  
  .stats-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 16px;
  }
  
  .stat-item {
    text-align: center;
    
    .stat-number {
      font-size: 20px;
      font-weight: 700;
      color: #667eea;
      margin-bottom: 4px;
    }
    
    .stat-label {
      font-size: 12px;
      color: #6b7280;
      font-weight: 500;
    }
  }
`;

const PostGrid = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const EmptyState = styled.div`
  background: white;
  border-radius: 12px;
  border: 1px solid #e5e7eb;
  padding: 40px 24px;
  text-align: center;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  
  .empty-icon {
    width: 48px;
    height: 48px;
    margin: 0 auto 16px;
    color: #d1d5db;
  }
  
  .empty-title {
    font-size: 16px;
    font-weight: 600;
    color: #374151;
    margin-bottom: 8px;
  }
  
  .empty-description {
    color: #6b7280;
    font-size: 14px;
    margin-bottom: 20px;
    line-height: 1.5;
  }
`;

const LoadingState = styled.div`
  background: white;
  border-radius: 12px;
  border: 1px solid #e5e7eb;
  padding: 40px 24px;
  text-align: center;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  color: #6b7280;
`;

const ViewAllButton = styled(motion.div)`
  background: white;
  border-radius: 12px;
  border: 1px solid #e5e7eb;
  padding: 16px 24px;
  cursor: pointer;
  text-align: center;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  transition: all 0.2s ease;
  
  &:hover {
    border-color: #667eea;
    background: #f8faff;
  }
  
  .view-all-content {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    color: #667eea;
    font-weight: 600;
    font-size: 14px;
  }
`;

// ================================================================
// Hook
// ================================================================

const useRecentPosts = (limit: number = 5) => {
  return useQuery({
    queryKey: ['recent-posts', limit],
    queryFn: async () => {
      const url = buildApiUrl.posts({ page: 0, size: limit });
      return await api.get<PostListResponse>(url);
    },
    staleTime: 2 * 60 * 1000, // 2분
  });
};

// ================================================================
// Component
// ================================================================

export const HomePage: React.FC = () => {
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();
  
  const { data: postsData, isLoading, error } = useRecentPosts(5);

  const handleWritePost = () => {
    if (!isAuthenticated()) {
      router.push('/auth/login');
      return;
    }
    router.push('/community/write');
  };

  const handleViewAllPosts = () => {
    router.push('/community');
  };

  // 임시 통계 데이터 (추후 API에서 제공)
  const stats = {
    totalPosts: postsData?.totalElements || 0,
    activeUsers: 24,
    todayPosts: 8
  };

  return (
    <Container>
      {/* 지하철 노선도 섹션 */}
      <MetroSection>
        <div className="metro-header">
          <h2>
            <Train size={24} />
            실시간 지하철 노선도
          </h2>
          <div className="live-indicator">
            LIVE
          </div>
        </div>
        
        <RealtimeMetroMap />
      </MetroSection>

      {/* 커뮤니티 섹션 */}
      <CommunitySection>
        {/* 커뮤니티 헤더 & 통계 */}
        <SectionHeader>
          <div className="header-top">
            <h3 className="section-title">
              <MessageSquare size={20} />
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
            <div className="stat-item">
              <div className="stat-number">{stats.totalPosts}</div>
              <div className="stat-label">총 게시글</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">{stats.todayPosts}</div>
              <div className="stat-label">오늘 작성</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">{stats.activeUsers}</div>
              <div className="stat-label">활성 사용자</div>
            </div>
          </div>
        </SectionHeader>

        {/* 게시글 목록 */}
        <PostGrid>
          {isLoading ? (
            <LoadingState>
              최근 게시글을 불러오는 중...
            </LoadingState>
          ) : error ? (
            <EmptyState>
              <MessageSquare className="empty-icon" />
              <div className="empty-title">게시글을 불러올 수 없습니다</div>
              <div className="empty-description">
                잠시 후 다시 시도해주세요
              </div>
            </EmptyState>
          ) : postsData?.posts && postsData.posts.length > 0 ? (
            <>
              {postsData.posts.map((post, index) => (
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
              
              {/* 더보기 버튼 */}
              <ViewAllButton
                onClick={handleViewAllPosts}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="view-all-content">
                  <span>모든 게시글 보기</span>
                  <ArrowRight size={16} />
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
        </PostGrid>
      </CommunitySection>
    </Container>
  );
};

export default HomePage;