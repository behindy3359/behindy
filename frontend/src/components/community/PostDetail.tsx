"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, 
  Edit3, 
  Trash2, 
  MessageSquare, 
  User, 
  Calendar,
  MoreHorizontal,
  Heart,
  Share2,
  Flag
} from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { Post, CommentListResponse } from '@/types/community/community';
import { useAuthStore } from '@/store/authStore';
import { SUCCESS_MESSAGES, LOADING_MESSAGES, ERROR_MESSAGES } from '@/utils/common/constants';
import { API_ENDPOINTS } from '@/utils/common/api'; 

import { api } from '@/services/api/axiosConfig'

import { domUtils } from '@/utils/common/dom';
import { useToast } from '@/store/uiStore';

import { CommentList } from './CommentList';
import { CommentForm } from './CommentForm/CommentForm';
import { PageContainer } from '@/styles/commonStyles';

// ================================================================
// Styled Components
// ================================================================

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 32px;
`;

const BackButton = styled(motion.button)`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  background: none;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  color: #6b7280;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.2s ease;
  
  &:hover {
    background: #f9fafb;
    color: #374151;
  }
`;

const ActionMenu = styled.div`
  position: relative;
`;

const MenuButton = styled(motion.button)`
  padding: 8px;
  background: none;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  color: #6b7280;
  cursor: pointer;
  
  &:hover {
    background: #f9fafb;
    color: #374151;
  }
`;

const MenuDropdown = styled(motion.div)`
  position: absolute;
  top: 100%;
  right: 0;
  margin-top: 8px;
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
  z-index: 100;
  min-width: 120px;
  overflow: hidden;
`;

const MenuItem = styled.button<{ $danger?: boolean }>`
  width: 100%;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 16px;
  background: none;
  border: none;
  cursor: pointer;
  font-size: 14px;
  color: ${({ $danger }) => $danger ? '#ef4444' : '#374151'};
  transition: background 0.2s ease;
  
  &:hover {
    background: ${({ $danger }) => $danger ? '#fef2f2' : '#f9fafb'};
  }
`;

const PostContainer = styled(motion.div)`
  background: white;
  border-radius: 12px;
  border: 1px solid #e5e7eb;
  overflow: hidden;
  margin-bottom: 24px;
`;

const PostHeader = styled.div`
  padding: 24px 24px 16px 24px;
  border-bottom: 1px solid #f3f4f6;
`;

const PostMeta = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 16px;
  font-size: 14px;
  color: #6b7280;
  
  .meta-item {
    display: flex;
    align-items: center;
    gap: 6px;
  }
  
  .author {
    font-weight: 600;
    color: #374151;
  }
`;

const PostTitle = styled.h1`
  font-size: 28px;
  font-weight: 700;
  color: #111827;
  margin: 0;
  line-height: 1.3;
`;

const PostContent = styled.div`
  padding: 24px;
  font-size: 16px;
  line-height: 1.8;
  color: #374151;
  white-space: pre-wrap;
  word-break: break-word;
  
  h1, h2, h3 {
    margin: 1.5em 0 0.5em 0;
    font-weight: 600;
  }
  
  h1 { font-size: 1.5em; }
  h2 { font-size: 1.3em; }
  h3 { font-size: 1.1em; }
  
  p {
    margin: 0 0 1em 0;
  }
  
  strong {
    font-weight: 600;
  }
  
  em {
    font-style: italic;
  }
  
  blockquote {
    border-left: 4px solid #e5e7eb;
    padding-left: 16px;
    margin: 1em 0;
    color: #6b7280;
    font-style: italic;
  }
  
  code {
    background: #f3f4f6;
    padding: 2px 4px;
    border-radius: 4px;
    font-family: 'Monaco', 'Consolas', monospace;
    font-size: 0.9em;
  }
`;

const PostActions = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 24px;
  background: #f9fafb;
  border-top: 1px solid #e5e7eb;
`;

const ActionGroup = styled.div`
  display: flex;
  gap: 12px;
  align-items: center;
`;

const ActionButton = styled(motion.button)<{ $active?: boolean }>`
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 12px;
  background: ${({ $active }) => $active ? '#f0f4ff' : 'none'};
  border: 1px solid ${({ $active }) => $active ? '#667eea' : '#e5e7eb'};
  border-radius: 6px;
  color: ${({ $active }) => $active ? '#667eea' : '#6b7280'};
  cursor: pointer;
  font-size: 14px;
  transition: all 0.2s ease;
  
  &:hover {
    background: ${({ $active }) => $active ? '#e0e7ff' : '#f9fafb'};
    color: ${({ $active }) => $active ? '#5a67d8' : '#374151'};
  }
  
  .count {
    font-weight: 600;
  }
`;

const CommentsSection = styled.div`
  background: white;
  border-radius: 12px;
  border: 1px solid #e5e7eb;
  overflow: hidden;
`;

const CommentsSectionHeader = styled.div`
  padding: 20px 24px;
  border-bottom: 1px solid #f3f4f6;
  background: #f9fafb;
  
  h3 {
    font-size: 18px;
    font-weight: 600;
    color: #111827;
    margin: 0;
    display: flex;
    align-items: center;
    gap: 8px;
  }
`;

const LoadingState = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 40px;
  color: #6b7280;
`;

const ErrorState = styled.div`
  text-align: center;
  padding: 40px;
  color: #ef4444;
`;

// ================================================================
// Component Props
// ================================================================

export interface PostDetailProps {
  postId: number;
  showComments?: boolean;
  enableInteractions?: boolean;
}

// ================================================================
// Component
// ================================================================

export const PostDetail: React.FC<PostDetailProps> = ({ 
  postId,
  showComments = true,
  enableInteractions = true 
}) => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { show: showToast } = useToast();
  const { user, isAuthenticated } = useAuthStore();
  const [showMenu, setShowMenu] = useState(false);
  const [isLiked, setIsLiked] = useState(false); // 추후 API 연동
  const [likeCount, setLikeCount] = useState(0); // 추후 API 연동

  // 게시글 데이터 가져오기
  const { data: post, isLoading, error } = useQuery({
    queryKey: ['post', postId],
    queryFn: async () => {
      return await api.get<Post>(API_ENDPOINTS.POSTS.BY_ID(postId));
    },
  });

  // 댓글 데이터 가져오기
  const { data: commentsData, isLoading: isLoadingComments } = useQuery({
    queryKey: ['comments', postId],
    queryFn: async () => {
      return await api.get<CommentListResponse>(
        API_ENDPOINTS.COMMENTS.BY_POST(postId)
      );
    },
  });

  // 게시글 삭제 뮤테이션
  const deletePostMutation = useMutation({
    mutationFn: async () => {
      await api.delete(API_ENDPOINTS.POSTS.BY_ID(postId));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
      router.push('/community');
    },
  });

  const handleBack = () => {
    router.push('/community');
  };

  const handleEdit = () => {
    router.push(`/community/${postId}/edit`);
  };

  const handleDelete = async () => {
    if (window.confirm('정말로 이 게시글을 삭제하시겠습니까?')) {
      await deletePostMutation.mutateAsync();
    }
  };

  const handleLike = () => {
    // 추후 API 연동
    setIsLiked(!isLiked);
    setLikeCount(prev => isLiked ? prev - 1 : prev + 1);
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: post?.title,
          url: window.location.href,
        });
      } catch (error) {
        console.log('Share cancelled or failed');
      }
    } else {
      // 클립보드 API 사용
      const success = await domUtils.clipboard.writeText(window.location.href);
      
      if (success) {
        showToast({ 
          type: 'success', 
          message: SUCCESS_MESSAGES.COPIED_TO_CLIPBOARD 
        });
      } else {
        showToast({ 
          type: 'error', 
          message: '링크 복사에 실패했습니다.' 
        });
      }
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const canEdit = post && user && (post.authorId === user.id || post.isEditable);
  const canDelete = post && user && (post.authorId === user.id || post.isDeletable);

  if (isLoading) {
    return (
      <PageContainer>
        <LoadingState>
          {LOADING_MESSAGES.POST_LOADING}
        </LoadingState>
      </PageContainer>
    );
  }

  if (error || !post) {
    return (
      <PageContainer>
        <ErrorState>
          {ERROR_MESSAGES.POST_LOAD_ERROR}
        </ErrorState>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <Header>
        <BackButton
          onClick={handleBack}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <ArrowLeft size={16} />
          목록으로
        </BackButton>

        {(canEdit || canDelete) && (
          <ActionMenu>
            <MenuButton
              onClick={() => setShowMenu(!showMenu)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <MoreHorizontal size={16} />
            </MenuButton>

            <AnimatePresence>
              {showMenu && (
                <MenuDropdown
                  initial={{ opacity: 0, y: -10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                >
                  {canEdit && (
                    <MenuItem onClick={handleEdit}>
                      <Edit3 size={14} />
                      수정
                    </MenuItem>
                  )}
                  {canDelete && (
                    <MenuItem $danger onClick={handleDelete}>
                      <Trash2 size={14} />
                      삭제
                    </MenuItem>
                  )}
                  <MenuItem>
                    <Flag size={14} />
                    신고
                  </MenuItem>
                </MenuDropdown>
              )}
            </AnimatePresence>
          </ActionMenu>
        )}
      </Header>

      <PostContainer
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <PostHeader>
          <PostMeta>
            <div className="meta-item">
              <User size={16} />
              <span className="author">{post.authorName}</span>
            </div>
            <div className="meta-item">
              <Calendar size={16} />
              <span>{formatDate(post.createdAt)}</span>
            </div>
            {post.createdAt !== post.updatedAt && (
              <div className="meta-item">
                <span style={{ color: '#9ca3af' }}>
                  (수정됨: {formatDate(post.updatedAt)})
                </span>
              </div>
            )}
          </PostMeta>
          
          <PostTitle>{post.title}</PostTitle>
        </PostHeader>

        <PostContent>
          {post.content}
        </PostContent>

        <PostActions>
          {enableInteractions && (
            <ActionGroup>
            <ActionButton
              $active={isLiked}
              onClick={handleLike}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Heart size={16} />
              <span className="count">{likeCount}</span>
            </ActionButton>
            
            <ActionButton
              onClick={handleShare}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Share2 size={16} />
              공유
            </ActionButton>
          </ActionGroup>
          )}

          <ActionGroup>
            <ActionButton>
              <MessageSquare size={16} />
              <span className="count">
                {commentsData?.totalElements || 0}
              </span>
            </ActionButton>
          </ActionGroup>
        </PostActions>
      </PostContainer>

      {/* 댓글 섹션 */}
      {showComments && (
        <CommentsSection>
        <CommentsSectionHeader>
          <h3>
            <MessageSquare size={20} />
            댓글 {commentsData?.totalElements || 0}개
          </h3>
        </CommentsSectionHeader>
        {isAuthenticated() && (
          <div style={{ padding: '24px', borderBottom: '1px solid #f3f4f6' }}>
            <CommentForm 
              postId={postId} 
              onSuccess={() => {
                queryClient.invalidateQueries({ queryKey: ['comments', postId] });
              }}
            />
          </div>
        )}

        {/* 댓글 목록 */}
        <div style={{ padding: '24px' }}>
          {isLoadingComments ? (
            <LoadingState>
              {LOADING_MESSAGES.COMMENT_LOADING}
            </LoadingState>
          ) : commentsData && commentsData.comments.length > 0 ? (
            <CommentList 
              comments={commentsData.comments}
              onUpdate={() => {
                queryClient.invalidateQueries({ queryKey: ['comments', postId] });
              }}
            />
          ) : (
            <div style={{ 
              textAlign: 'center', 
              padding: '40px', 
              color: '#6b7280' 
            }}>
              아직 댓글이 없습니다. 첫 번째 댓글을 작성해보세요!
            </div>
          )}
        </div>
      </CommentsSection>
      )}

      {/* 클릭 외부 영역 처리 */}
      {showMenu && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 50,
          }}
          onClick={() => setShowMenu(false)}
        />
      )}
    </PageContainer>
  );
};

export default PostDetail;