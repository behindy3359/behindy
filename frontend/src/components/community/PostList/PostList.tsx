"use client";

import React, { useCallback, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, 
  Search, 
  MessageSquare,
  Grid,
  List,
  SlidersHorizontal
} from 'lucide-react';
import { Button } from '@/components/ui/button/Button';
import { Input } from '@/components/ui/input/Input';
import { useAuthStore } from '@/store/authStore';
import { PostCard } from '../PostCard/PostCard';
import { ERROR_MESSAGES, LOADING_MESSAGES } from '@/utils/common/constants';
import { PageContainer } from '@/styles/commonStyles';
import { PostListProps } from './types';
import { usePosts } from './hooks/usePosts';
import { 
  ActionBar, 
  EmptyState, 
  FilterBar, 
  FilterLeft, 
  FilterRight, 
  Header, 
  HeaderLeft, 
  HeaderRight, 
  LoadingContainer, 
  PageButton, 
  Pagination, 
  PostGrid, 
  PostsContainer, 
  SearchContainer, 
  SortSelect, 
  Subtitle, 
  Title, 
  ViewButton, 
  ViewToggle 
} from './styles';


export const PostList: React.FC<PostListProps> = ({
  initialPage = 0,
  pageSize = 12,
  enableSearch = true,
  viewMode: initialViewMode = 'grid'
}) => {
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();
  
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const [sortBy, setSortBy] = useState('latest');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>(initialViewMode);

  const { data: postsData, isLoading, error } = usePosts(currentPage, pageSize, searchQuery, sortBy);

  const handlePostClick = useCallback((postId: number) => {
    router.push(`/community/${postId}`);
  }, [router]);

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
      <PageContainer>
        <div style={{ 
          textAlign: 'center', 
          padding: '40px', 
          color: '#ef4444' 
        }}>
          {ERROR_MESSAGES.POST_LOAD_ERROR}
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
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
    </PageContainer>
  );
};

export default PostList;