import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { MessageSquare, Plus } from 'lucide-react';
import { Button } from '@/shared/components/ui/button/Button';
import { PostCard } from '../../PostCard/PostCard';
import { getEmptyStateMessage } from '../../../utils/postListUtils';
import { LOADING_MESSAGES } from '@/shared/utils/common/constants';
import { PostsContainer, PostGrid, EmptyState, LoadingContainer } from '../styles';
import type { PostListContentProps } from '../../../types/postListTypes';

export const PostListContent = React.memo<PostListContentProps>(
  function PostListContent({ 
    posts, 
    viewMode, 
    isLoading, 
    error, 
    onPostClick, 
    onWritePost 
  }) {
    if (isLoading) {
      return (
        <PostsContainer>
          <LoadingContainer
          >
            <div className="loading-content">
              <div className="loading-spinner"></div>
              <div className="loading-text">
                {LOADING_MESSAGES.POSTS_LOADING}
              </div>
            </div>
          </LoadingContainer>
        </PostsContainer>
      );
    }

    if (error) {
      return (
        <PostsContainer>
          <EmptyState>
            <MessageSquare className="empty-icon" />
            <div className="empty-title">게시글을 불러올 수 없습니다</div>
            <div className="empty-description">
              잠시 후 다시 시도해주세요.
            </div>
          </EmptyState>
        </PostsContainer>
      );
    }

    if (!posts || posts.length === 0) {
      const { title, description } = getEmptyStateMessage('');
      
      return (
        <PostsContainer>
          <EmptyState>
            <MessageSquare className="empty-icon" />
            <div className="empty-title">{title}</div>
            <div className="empty-description">{description}</div>
            <Button
              variant="primary"
              onClick={onWritePost}
              leftIcon={<Plus />}
            >
              첫 게시글 작성하기
            </Button>
          </EmptyState>
        </PostsContainer>
      );
    }

    return (
      <PostsContainer>
        <PostGrid $viewMode={viewMode}>
          <AnimatePresence>
            {posts.map((post, index) => (
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
                  onClick={() => onPostClick(post.id)}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </PostGrid>
      </PostsContainer>
    );
  }
);
