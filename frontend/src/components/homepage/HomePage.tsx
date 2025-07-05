"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { 
  MessageSquare, 
  Plus, 
  ArrowRight,
  Train,
  Users,
  TrendingUp,
  Clock
} from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { api, buildApiUrl } from '@/config';
import type { PostListResponse } from '@/types/community/community';
import { RealtimeMetroMap } from '@/components/metromap';
import { PostCard } from '@/components/community';
import { Button } from '@/components/ui';
import { useAuthStore } from '@/store/authStore';

// ================================================================
// Styled Components - 통일된 너비 적용
// ================================================================

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 24px;
  
  @media (max-width: 1200px) {
    padding: 16px;
  }
`;

// 상단 지하철 노선도 섹션
const MetroSection = styled.div`
  background: white;
  border-radius: 16px;
  border: 1px solid #e5e7eb;
  margin-bottom: 32px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
`;

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

// 지하철 노선도 컨테이너 - 레이어 간소화
const MetroMapContainer = styled.div`
  /* 기존의 복잡한 레이어 제거 */
  padding: 0;
  background: none;
  
  /* RealtimeMetroMap 컴포넌트의 내부 Container 스타일 무력화 */
  & > div {
    padding: 0 !important;
    background: none !important;
    margin: 0 !important;
  }
  
  /* 지도 래퍼의 불필요한 스타일 제거 */
  & > div > div {
    background: none !important;
    border-radius: 0 !important;
    padding: 20px !important;
    box-shadow: none !important;
    margin: 0 !important;
    border: none !important;
  }
`;

// 하단 커뮤니티 섹션
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
  
  .stat-item {
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
    }
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

// ================================================================
// Hook
// ================================================================

const useRecentPosts = (limit: number = 6) => {
  return useQuery({
    queryKey: ['recent-posts', limit],
    queryFn: async () => {
      const url = buildApiUrl.posts({ page: 0, size: limit });
      return await api.get<PostListResponse>(url);
    },
    staleTime: 2 * 60 * 1000,
  });
};

// ================================================================
// Component
// ================================================================

export const HomePage: React.FC = () => {
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();
  
  const { data: postsData, isLoading, error } = useRecentPosts(6);

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
  
  return (
    <Container>
      {/* 지하철 노선도 섹션 */}
      <MetroSection>
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
      </MetroSection>

      {/* 커뮤니티 섹션 */}
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
        </CommunityHeader>

        {/* 게시글 목록 */}
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
            <PostGrid>
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
    </Container>
  );
};

export default HomePage;