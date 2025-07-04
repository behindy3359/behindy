"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, 
  Search, 
  Filter, 
  Calendar, 
  User, 
  MessageSquare,
  ChevronRight,
  TrendingUp,
  Clock
} from 'lucide-react';
import { Button, Input } from '@/components/ui';
import { useQuery } from '@tanstack/react-query';
import { api, buildApiUrl } from '@/config';
import type { Post, PostListResponse } from '@/types/community/community';
import { useAuthStore } from '@/store/authStore';

// ================================================================
// Styled Components
// ================================================================

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 24px;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 32px;
  
  @media (max-width: 768px) {
    flex-direction: column;
    gap: 16px;
    align-items: stretch;
  }
`;

const Title = styled.h1`
  font-size: 28px;
  font-weight: 700;
  color: #111827;
  margin: 0;
  
  @media (max-width: 768px) {
    font-size: 24px;
    text-align: center;
  }
`;

const Actions = styled.div`
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
  gap: 12px;
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
  gap: 16px;
  margin-bottom: 24px;
`;

const StatCard = styled(motion.div)`
  background: white;
  padding: 20px;
  border-radius: 12px;
  border: 1px solid #e5e7eb;
  display: flex;
  align-items: center;
  gap: 12px;
  
  .stat-icon {
    width: 40px;
    height: 40px;
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #f0f4ff;
    color: #667eea;
  }
  
  .stat-content {
    flex: 1;
    
    .stat-number {
      font-size: 20px;
      font-weight: 700;
      color: #111827;
      margin-bottom: 4px;
    }
    
    .stat-label {
      font-size: 14px;
      color: #6b7280;
    }
  }
`;

const PostListContainer = styled.div`
  background: white;
  border-radius: 12px;
  border: 1px solid #e5e7eb;
  overflow: hidden;
`;

const PostItem = styled(motion.div)<{ $isHot?: boolean }>`
  padding: 20px;
  border-bottom: 1px solid #f3f4f6;
  cursor: pointer;
  transition: all 0.2s ease;
  position: relative;
  
  ${({ $isHot }) => $isHot && `
    background: linear-gradient(90deg, #fef2f2 0%, white 100%);
    border-left: 4px solid #ef4444;
  `}
  
  &:hover {
    background: #f9fafb;
  }
  
  &:last-child {
    border-bottom: none;
  }
`;

const PostMeta = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 8px;
  font-size: 14px;
  color: #6b7280;
  
  .meta-item {
    display: flex;
    align-items: center;
    gap: 4px;
  }
  
  .author {
    font-weight: 600;
    color: #374151;
  }
  
  .hot-badge {
    background: #ef4444;
    color: white;
    padding: 2px 8px;
    border-radius: 12px;
    font-size: 12px;
    font-weight: 600;
  }
`;

const PostTitle = styled.h3`
  font-size: 18px;
  font-weight: 600;
  color: #111827;
  margin: 0 0 8px 0;
  line-height: 1.4;
  
  &:hover {
    color: #667eea;
  }
`;

const PostPreview = styled.p`
  color: #6b7280;
  font-size: 14px;
  line-height: 1.5;
  margin: 0 0 12px 0;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const PostStats = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const PostStatsLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  font-size: 14px;
  color: #6b7280;
  
  .stat-item {
    display: flex;
    align-items: center;
    gap: 4px;
  }
`;

const PostDate = styled.div`
  font-size: 14px;
  color: #9ca3af;
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 60px 20px;
  
  .empty-icon {
    width: 64px;
    height: 64px;
    margin: 0 auto 16px;
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
    margin-bottom: 24px;
  }
`;

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 40px;
`;

const Pagination = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 8px;
  margin-top: 24px;
`;

const PageButton = styled.button<{ $active?: boolean }>`
  padding: 8px 12px;
  border: 1px solid #d1d5db;
  background: ${({ $active }) => $active ? '#667eea' : 'white'};
  color: ${({ $active }) => $active ? 'white' : '#374151'};
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  
  &:hover:not(:disabled) {
    background: ${({ $active }) => $active ? '#5a67d8' : '#f9fafb'};
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

// ================================================================
// Hooks and API
// ================================================================

const usePosts = (page: number = 0, size: number = 10, search: string = '') => {
  return useQuery({
    queryKey: ['posts', page, size, search],
    queryFn: async () => {
      const url = buildApiUrl.posts({ page, size });
      return await api.get<PostListResponse>(url);
    },
    staleTime: 5 * 60 * 1000, // 5분
  });
};

// ================================================================
// Component Props (export 추가)
// ================================================================

export interface PostListProps {
  initialPage?: number;
  pageSize?: number;
  showStats?: boolean;
  enableSearch?: boolean;
}

// ================================================================
// Component
// ================================================================

export const PostList: React.FC<PostListProps> = ({
  initialPage = 0,
  pageSize = 10,
  showStats = true,
  enableSearch = true
}) => {
  const router = useRouter();
  const { user, isAuthenticated } = useAuthStore();
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);

  const { data: postsData, isLoading, error } = usePosts(currentPage, pageSize, searchQuery);

  // Mock stats - 실제로는 API에서 가져와야 함
  const stats = {
    totalPosts: postsData?.totalElements || 0,
    todayPosts: 12,
    totalComments: 156,
    activeUsers: 45
  };

  const handlePostClick = (postId: number) => {
    router.push(`/community/${postId}`);
  };

  const handleWritePost = () => {
    if (!isAuthenticated()) {
      router.push('/auth/login');
      return;
    }
    router.push('/community/write');
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(0);
    // searchQuery는 이미 state로 관리되므로 자동으로 refetch됨
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return '방금 전';
    if (diffInHours < 24) return `${diffInHours}시간 전`;
    if (diffInHours < 48) return '어제';
    return date.toLocaleDateString('ko-KR', { month: 'short', day: 'numeric' });
  };

  const isHotPost = (post: Post) => {
    // 24시간 내 작성된 게시글 중 인기글 판단 로직
    const postDate = new Date(post.createdAt);
    const now = new Date();
    const hoursDiff = (now.getTime() - postDate.getTime()) / (1000 * 60 * 60);
    return hoursDiff < 24; // 임시 로직
  };

  if (error) {
    return (
      <Container>
        <div style={{ 
          textAlign: 'center', 
          padding: '40px', 
          color: '#ef4444' 
        }}>
          게시글을 불러오는 중 오류가 발생했습니다.
        </div>
      </Container>
    );
  }

  return (
    <Container>
      <Header>
        <Title>💬 커뮤니티</Title>
        <Actions>
          <SearchContainer>
            <AnimatePresence>
              {(showSearch || !enableSearch) && enableSearch && (
                <motion.form
                  initial={{ width: 0, opacity: 0 }}
                  animate={{ width: 'auto', opacity: 1 }}
                  exit={{ width: 0, opacity: 0 }}
                  onSubmit={handleSearch}
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
            
            {enableSearch && (
              <Button
                variant="ghost"
                onClick={() => setShowSearch(!showSearch)}
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
        </Actions>
      </Header>

      {/* 통계 카드 */}
      <StatsBar>
        <StatCard
          whileHover={{ y: -2 }}
          transition={{ duration: 0.2 }}
        >
          <div className="stat-icon">
            <MessageSquare />
          </div>
          <div className="stat-content">
            <div className="stat-number">{stats.totalPosts}</div>
            <div className="stat-label">전체 게시글</div>
          </div>
        </StatCard>

        <StatCard
          whileHover={{ y: -2 }}
          transition={{ duration: 0.2 }}
        >
          <div className="stat-icon">
            <TrendingUp />
          </div>
          <div className="stat-content">
            <div className="stat-number">{stats.todayPosts}</div>
            <div className="stat-label">오늘 작성</div>
          </div>
        </StatCard>

        <StatCard
          whileHover={{ y: -2 }}
          transition={{ duration: 0.2 }}
        >
          <div className="stat-icon">
            <User />
          </div>
          <div className="stat-content">
            <div className="stat-number">{stats.activeUsers}</div>
            <div className="stat-label">활성 사용자</div>
          </div>
        </StatCard>
      </StatsBar>

      {/* 게시글 목록 */}
      <PostListContainer>
        {isLoading ? (
          <LoadingContainer>
            <div>게시글을 불러오는 중...</div>
          </LoadingContainer>
        ) : postsData?.posts && postsData.posts.length > 0 ? (
          <AnimatePresence>
            {postsData.posts.map((post, index) => {
              const hot = isHotPost(post);
              return (
                <PostItem
                  key={post.id}
                  $isHot={hot}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  onClick={() => handlePostClick(post.id)}
                  whileHover={{ x: 4 }}
                >
                  <PostMeta>
                    <div className="meta-item">
                      <User size={14} />
                      <span className="author">{post.authorName}</span>
                    </div>
                    <div className="meta-item">
                      <Calendar size={14} />
                      <span>{formatDate(post.createdAt)}</span>
                    </div>
                    {hot && <span className="hot-badge">HOT</span>}
                  </PostMeta>

                  <PostTitle>{post.title}</PostTitle>
                  
                  <PostPreview>
                    {post.content.replace(/<[^>]*>/g, '').substring(0, 120)}...
                  </PostPreview>

                  <PostStats>
                    <PostStatsLeft>
                      <div className="stat-item">
                        <MessageSquare size={14} />
                        <span>0</span> {/* 댓글 수 - 추후 API에서 제공 */}
                      </div>
                      <div className="stat-item">
                        <Clock size={14} />
                        <span>{formatDate(post.updatedAt)}</span>
                      </div>
                    </PostStatsLeft>
                    
                    <PostDate>
                      <ChevronRight size={16} />
                    </PostDate>
                  </PostStats>
                </PostItem>
              );
            })}
          </AnimatePresence>
        ) : (
          <EmptyState>
            <MessageSquare className="empty-icon" />
            <div className="empty-title">아직 게시글이 없습니다</div>
            <div className="empty-description">
              첫 번째 게시글을 작성해보세요!
            </div>
            <Button
              variant="primary"
              onClick={handleWritePost}
              leftIcon={<Plus />}
            >
              글쓰기
            </Button>
          </EmptyState>
        )}
      </PostListContainer>

      {/* 페이지네이션 */}
      {postsData && postsData.totalPages > 1 && (
        <Pagination>
          <PageButton
            onClick={() => setCurrentPage(0)}
            disabled={currentPage === 0}
          >
            처음
          </PageButton>
          
          <PageButton
            onClick={() => setCurrentPage(Math.max(0, currentPage - 1))}
            disabled={currentPage === 0}
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
              >
                {page + 1}
              </PageButton>
            );
          })}

          <PageButton
            onClick={() => setCurrentPage(Math.min(postsData.totalPages - 1, currentPage + 1))}
            disabled={currentPage >= postsData.totalPages - 1}
          >
            다음
          </PageButton>
          
          <PageButton
            onClick={() => setCurrentPage(postsData.totalPages - 1)}
            disabled={currentPage >= postsData.totalPages - 1}
          >
            마지막
          </PageButton>
        </Pagination>
      )}
    </Container>
  );
};

export default PostList;  