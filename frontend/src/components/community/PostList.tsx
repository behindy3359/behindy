"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, 
  Search, 
  MessageSquare,
  TrendingUp,
  User,
  Grid,
  List,
  SlidersHorizontal
} from 'lucide-react';
import { Button } from '@/components/ui/button/Button';
import { Input } from '@/components/ui/input/Input';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/services/api/axiosConfig';
import type { PostListResponse } from '@/types/community/community';
import { useAuthStore } from '@/store/authStore';
import { PostCard } from './PostCard';
import { ERROR_MESSAGES, LOADING_MESSAGES } from '@/utils/common/constants';
import { buildApiUrl } from '@/utils/common/api';

// ================================================================
// Styled Components
// ================================================================

const Container = styled.div`
  max-width: 900px;
  margin: 0 auto;
  padding: 24px;
  
  @media (max-width: 1200px) {
    padding: 16px;
  }
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 32px;
  gap: 20px;
  
  @media (max-width: 768px) {
    flex-direction: column;
    gap: 16px;
    align-items: stretch;
  }
`;

const HeaderLeft = styled.div`
  flex: 1;
`;

const Title = styled.h1`
  font-size: 28px;
  font-weight: 700;
  color: #111827;
  margin: 0 0 16px 0;
  display: flex;
  align-items: center;
  gap: 12px;
  
  @media (max-width: 768px) {
    font-size: 24px;
    text-align: center;
    justify-content: center;
  }
`;

const Subtitle = styled.p`
  color: #6b7280;
  font-size: 16px;
  margin: 0;
  line-height: 1.5;
`;

const HeaderRight = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  align-items: flex-end;
  
  @media (max-width: 768px) {
    align-items: stretch;
  }
`;

const ActionBar = styled.div`
  display: flex;
  gap: 12px;
  align-items: center;
  
  @media (max-width: 768px) {
    flex-direction: column;
    width: 100%;
  }
`;

const SearchContainer = styled.div`
  display: flex;
  gap: 8px;
  align-items: center;
  min-width: 300px;
  
  @media (max-width: 768px) {
    min-width: 100%;
    flex-direction: column;
  }
`;

const StatsBar = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
  margin-bottom: 32px;
`;

const StatCard = styled(motion.div)`
  background: white;
  padding: 24px;
  border-radius: 12px;
  border: 1px solid #e5e7eb;
  display: flex;
  align-items: center;
  gap: 16px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  
  .stat-icon {
    width: 48px;
    height: 48px;
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #f0f4ff;
    color: #667eea;
  }
  
  .stat-content {
    flex: 1;
    
    .stat-number {
      font-size: 24px;
      font-weight: 700;
      color: #111827;
      margin-bottom: 4px;
    }
    
    .stat-label {
      font-size: 14px;
      color: #6b7280;
      font-weight: 500;
    }
    
    .stat-change {
      font-size: 12px;
      color: #10b981;
      font-weight: 500;
      margin-top: 4px;
    }
  }
`;

const FilterBar = styled.div`
  background: white;
  border-radius: 12px;
  border: 1px solid #e5e7eb;
  padding: 20px 24px;
  margin-bottom: 24px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  
  @media (max-width: 768px) {
    flex-direction: column;
    gap: 16px;
    align-items: stretch;
  }
`;

const FilterLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  
  .filter-title {
    font-weight: 600;
    color: #374151;
    display: flex;
    align-items: center;
    gap: 8px;
  }
  
  .post-count {
    color: #6b7280;
    font-size: 14px;
  }
`;

const FilterRight = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const ViewToggle = styled.div`
  display: flex;
  background: #f3f4f6;
  border-radius: 8px;
  padding: 4px;
`;

const ViewButton = styled.button<{ $active: boolean }>`
  padding: 8px 12px;
  border: none;
  background: ${({ $active }) => $active ? 'white' : 'transparent'};
  color: ${({ $active }) => $active ? '#374151' : '#6b7280'};
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  display: flex;
  align-items: center;
  gap: 6px;
  transition: all 0.2s ease;
  box-shadow: ${({ $active }) => $active ? '0 1px 3px rgba(0, 0, 0, 0.1)' : 'none'};
  
  &:hover {
    color: #374151;
  }
`;

const SortSelect = styled.select`
  padding: 8px 12px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  background: white;
  color: #374151;
  font-size: 14px;
  cursor: pointer;
  
  &:focus {
    outline: none;
    border-color: #667eea;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
  }
`;

const PostsContainer = styled.div`
  background: white;
  border-radius: 12px;
  border: 1px solid #e5e7eb;
  overflow: hidden;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
`;

const PostGrid = styled.div<{ $viewMode: 'grid' | 'list' }>`
  padding: 24px;
  
  ${({ $viewMode }) => $viewMode === 'grid' ? `
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(360px, 1fr));
    gap: 24px;
    
    @media (max-width: 768px) {
      grid-template-columns: 1fr;
      gap: 16px;
      padding: 16px;
    }
  ` : `
    display: flex;
    flex-direction: column;
    gap: 16px;
  `}
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 80px 20px;
  
  .empty-icon {
    width: 64px;
    height: 64px;
    margin: 0 auto 20px;
    color: #d1d5db;
  }
  
  .empty-title {
    font-size: 20px;
    font-weight: 600;
    color: #374151;
    margin-bottom: 12px;
  }
  
  .empty-description {
    color: #6b7280;
    margin-bottom: 32px;
    line-height: 1.6;
    max-width: 400px;
    margin-left: auto;
    margin-right: auto;
  }
`;

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 80px 20px;
  
  .loading-content {
    text-align: center;
    
    .loading-spinner {
      width: 40px;
      height: 40px;
      border: 3px solid #f3f4f6;
      border-top: 3px solid #667eea;
      border-radius: 50%;
      animation: spin 1s linear infinite;
      margin: 0 auto 16px;
    }
    
    .loading-text {
      color: #6b7280;
      font-size: 16px;
    }
  }
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

const Pagination = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 8px;
  margin-top: 32px;
  padding: 24px;
  background: white;
  border-radius: 12px;
  border: 1px solid #e5e7eb;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
`;

const PageButton = styled(motion.button)<{ $active?: boolean; $disabled?: boolean }>`
  padding: 10px 16px;
  border: 1px solid ${({ $active }) => $active ? '#667eea' : '#d1d5db'};
  background: ${({ $active }) => $active ? '#667eea' : 'white'};
  color: ${({ $active }) => $active ? 'white' : '#374151'};
  border-radius: 8px;
  cursor: ${({ $disabled }) => $disabled ? 'not-allowed' : 'pointer'};
  font-size: 14px;
  font-weight: 500;
  opacity: ${({ $disabled }) => $disabled ? 0.5 : 1};
  
  &:hover:not(:disabled) {
    background: ${({ $active }) => $active ? '#5a67d8' : '#f9fafb'};
    border-color: ${({ $active }) => $active ? '#5a67d8' : '#9ca3af'};
  }
`;

// ================================================================
// Hooks
// ================================================================

const usePosts = (page: number = 0, size: number = 12, search: string = '', sort: string = 'latest') => {
  return useQuery({
    queryKey: ['posts', page, size, search, sort],
    queryFn: async () => {
      const url = buildApiUrl.posts({ page, size });
      return await api.get<PostListResponse>(url);
    },
    staleTime: 5 * 60 * 1000, // 5분
  });
};

// ================================================================
// Component Props
// ================================================================

export interface PostListProps {
  initialPage?: number;
  pageSize?: number;
  showStats?: boolean;
  enableSearch?: boolean;
  viewMode?: 'grid' | 'list';
}

// ================================================================
// Component
// ================================================================

export const PostList: React.FC<PostListProps> = ({
  initialPage = 0,
  pageSize = 12,
  showStats = true,
  enableSearch = true,
  viewMode: initialViewMode = 'grid'
}) => {
  const router = useRouter();
  const { user, isAuthenticated } = useAuthStore();
  
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const [sortBy, setSortBy] = useState('latest');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>(initialViewMode);

  const { data: postsData, isLoading, error } = usePosts(currentPage, pageSize, searchQuery, sortBy);

  // Mock stats - 실제로는 API에서 가져와야 함
  const stats = {
    totalPosts: postsData?.totalElements || 0,
    todayPosts: 1234,
    totalComments: 1234,
    activeUsers: 1234
  };

  const handlePostClick = (postId: number) => {
    router.push(`/community/${postId}`);
  };

  const handleWritePost = () => {
    if (!isAuthenticated()) {
      router.push('/auth/login?redirect=/community/write');
      return;
    }
    router.push('/community/write');
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(0);
  };

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSortBy(e.target.value);
    setCurrentPage(0);
  };

  if (error) {
    return (
      <Container>
        <div style={{ 
          textAlign: 'center', 
          padding: '40px', 
          color: '#ef4444' 
        }}>
          {ERROR_MESSAGES.POST_LOAD_ERROR}
        </div>
      </Container>
    );
  }

  return (
    <Container>
      <Header>
        <HeaderLeft>
          <Title>
            <MessageSquare size={32} />
            커뮤니티
          </Title>
          <Subtitle>
            흥미로운 이야기들을 공유해보세요
          </Subtitle>
        </HeaderLeft>

        <HeaderRight>
          <ActionBar>
            <SearchContainer>
              <AnimatePresence>
                {(showSearch || !enableSearch) && enableSearch && (
                  <motion.form
                    initial={{ width: 0, opacity: 0 }}
                    animate={{ width: 'auto', opacity: 1 }}
                    exit={{ width: 0, opacity: 0 }}
                    onSubmit={handleSearch}
                    style={{ display: 'flex', gap: '8px' }}
                  >
                    <Input
                      placeholder="게시글 검색..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      leftIcon={<Search />}
                      autoFocus
                    />
                  </motion.form>
                )}
              </AnimatePresence>
              
              {enableSearch && !showSearch && (
                <Button
                  variant="ghost"
                  onClick={() => setShowSearch(true)}
                  leftIcon={<Search />}
                >
                  검색
                </Button>
              )}
            </SearchContainer>
            
            <Button
              variant="primary"
              onClick={handleWritePost}
              leftIcon={<Plus />}
            >
              글쓰기
            </Button>
          </ActionBar>
        </HeaderRight>
      </Header>

      {/* 통계 카드 */}
      {showStats && (
        <StatsBar>
          <StatCard
            whileHover={{ y: -3 }}
            transition={{ duration: 0.2 }}
          >
            <div className="stat-icon">
              <MessageSquare />
            </div>
            <div className="stat-content">
              <div className="stat-number">{stats.totalPosts}</div>
              <div className="stat-label">전체 게시글</div>
              <div className="stat-change">+{stats.todayPosts} 오늘</div>
            </div>
          </StatCard>

          <StatCard
            whileHover={{ y: -3 }}
            transition={{ duration: 0.2 }}
          >
            <div className="stat-icon">
              <TrendingUp />
            </div>
            <div className="stat-content">
              <div className="stat-number">{stats.totalComments}</div>
              <div className="stat-label">총 댓글</div>
              <div className="stat-change">활발한 소통</div>
            </div>
          </StatCard>

          <StatCard
            whileHover={{ y: -3 }}
            transition={{ duration: 0.2 }}
          >
            <div className="stat-icon">
              <User />
            </div>
            <div className="stat-content">
              <div className="stat-number">{stats.activeUsers}</div>
              <div className="stat-label">활성 사용자</div>
              <div className="stat-change">온라인</div>
            </div>
          </StatCard>
        </StatsBar>
      )}

      {/* 필터 바 */}
      <FilterBar>
        <FilterLeft>
          <div className="filter-title">
            <SlidersHorizontal size={16} />
            게시글 목록
          </div>
          <div className="post-count">
            총 {postsData?.totalElements || 0}개
          </div>
        </FilterLeft>

        <FilterRight>
          <ViewToggle>
            <ViewButton
              $active={viewMode === 'grid'}
              onClick={() => setViewMode('grid')}
            >
              <Grid size={16} />
              카드
            </ViewButton>
            <ViewButton
              $active={viewMode === 'list'}
              onClick={() => setViewMode('list')}
            >
              <List size={16} />
              목록
            </ViewButton>
          </ViewToggle>

          <SortSelect value={sortBy} onChange={handleSortChange}>
            <option value="latest">최신순</option>
            <option value="popular">인기순</option>
            <option value="comments">댓글순</option>
            <option value="views">조회순</option>
          </SortSelect>
        </FilterRight>
      </FilterBar>

      {/* 게시글 목록 */}
      <PostsContainer>
        {isLoading ? (
          <LoadingContainer>
            <div className="loading-content">
              <div className="loading-spinner"></div>
              <div className="loading-text">
                {LOADING_MESSAGES.POSTS_LOADING}
              </div>
            </div>
          </LoadingContainer>
        ) : postsData?.posts && postsData.posts.length > 0 ? (
          <PostGrid $viewMode={viewMode}>
            <AnimatePresence>
              {postsData.posts.map((post, index) => (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <PostCard 
                    post={post}
                    showMetroLine={true}
                    compact={viewMode === 'list'}
                    onClick={() => handlePostClick(post.id)}
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          </PostGrid>
        ) : (
          <EmptyState>
            <MessageSquare className="empty-icon" />
            <div className="empty-title">아직 게시글이 없습니다</div>
            <div className="empty-description">
              지하철에서 경험한 흥미로운 이야기나 신기한 경험을<br />
              첫 번째로 공유해보세요!
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
      </PostsContainer>

      {/* 페이지네이션 */}
      {postsData && postsData.totalPages > 1 && (
        <Pagination>
          <PageButton
            $disabled={currentPage === 0}
            onClick={() => setCurrentPage(0)}
            whileHover={{ scale: currentPage === 0 ? 1 : 1.05 }}
            whileTap={{ scale: currentPage === 0 ? 1 : 0.95 }}
          >
            처음
          </PageButton>
          
          <PageButton
            $disabled={currentPage === 0}
            onClick={() => setCurrentPage(Math.max(0, currentPage - 1))}
            whileHover={{ scale: currentPage === 0 ? 1 : 1.05 }}
            whileTap={{ scale: currentPage === 0 ? 1 : 0.95 }}
          >
            이전
          </PageButton>

          {Array.from({ length: Math.min(5, postsData.totalPages) }, (_, i) => {
            const page = Math.max(0, Math.min(
              postsData.totalPages - 5,
              currentPage - 2
            )) + i;
            
            return (
              <PageButton
                key={page}
                $active={page === currentPage}
                onClick={() => setCurrentPage(page)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {page + 1}
              </PageButton>
            );
          })}

          <PageButton
            $disabled={currentPage >= postsData.totalPages - 1}
            onClick={() => setCurrentPage(Math.min(postsData.totalPages - 1, currentPage + 1))}
            whileHover={{ scale: currentPage >= postsData.totalPages - 1 ? 1 : 1.05 }}
            whileTap={{ scale: currentPage >= postsData.totalPages - 1 ? 1 : 0.95 }}
          >
            다음
          </PageButton>
          
          <PageButton
            $disabled={currentPage >= postsData.totalPages - 1}
            onClick={() => setCurrentPage(postsData.totalPages - 1)}
            whileHover={{ scale: currentPage >= postsData.totalPages - 1 ? 1 : 1.05 }}
            whileTap={{ scale: currentPage >= postsData.totalPages - 1 ? 1 : 0.95 }}
          >
            마지막
          </PageButton>
        </Pagination>
      )}
    </Container>
  );
};

export default PostList;