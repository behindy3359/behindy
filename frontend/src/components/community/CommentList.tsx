"use client";

import React, { useState } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Calendar, 
  Edit3, 
  Trash2, 
  MoreHorizontal,
  Reply,
  Heart,
  Flag
} from 'lucide-react';
import { useMutation } from '@tanstack/react-query';
import { api, API_ENDPOINTS } from '@/config';
import type { Comment } from '@/types/community/community';
import { useAuthStore } from '@/store/authStore';
import { CommentForm } from './CommentForm';

// ================================================================
// Styled Components
// ================================================================

const CommentContainer = styled(motion.div)`
  & + & {
    margin-top: 16px;
  }
`;

const CommentItem = styled.div<{ $isReply?: boolean }>`
  padding: 16px;
  background: ${({ $isReply }) => $isReply ? '#f9fafb' : 'white'};
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  margin-left: ${({ $isReply }) => $isReply ? '32px' : '0'};
  position: relative;
  
  ${({ $isReply }) => $isReply && `
    &::before {
      content: '';
      position: absolute;
      left: -16px;
      top: 16px;
      width: 12px;
      height: 12px;
      border-left: 2px solid #d1d5db;
      border-bottom: 2px solid #d1d5db;
      border-bottom-left-radius: 4px;
    }
  `}
`;

const CommentHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 8px;
`;

const CommentMeta = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  
  .user-info {
    display: flex;
    align-items: center;
    gap: 8px;
    
    .avatar {
      width: 28px;
      height: 28px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-weight: 600;
      font-size: 12px;
    }
    
    .name {
      font-weight: 600;
      color: #374151;
      font-size: 14px;
    }
  }
  
  .date {
    font-size: 12px;
    color: #9ca3af;
    display: flex;
    align-items: center;
    gap: 4px;
  }
`;

const CommentActions = styled.div`
  position: relative;
`;

const ActionButton = styled(motion.button)`
  padding: 4px;
  background: none;
  border: none;
  border-radius: 4px;
  color: #9ca3af;
  cursor: pointer;
  
  &:hover {
    background: #f3f4f6;
    color: #6b7280;
  }
`;

const ActionMenu = styled(motion.div)`
  position: absolute;
  top: 100%;
  right: 0;
  margin-top: 4px;
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  z-index: 100;
  min-width: 120px;
  overflow: hidden;
`;

const MenuItem = styled.button<{ $danger?: boolean }>`
  width: 100%;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  background: none;
  border: none;
  cursor: pointer;
  font-size: 13px;
  color: ${({ $danger }) => $danger ? '#ef4444' : '#374151'};
  transition: background 0.2s ease;
  
  &:hover {
    background: ${({ $danger }) => $danger ? '#fef2f2' : '#f9fafb'};
  }
`;

const CommentContent = styled.div`
  font-size: 14px;
  line-height: 1.6;
  color: #374151;
  margin-bottom: 12px;
  white-space: pre-wrap;
  word-break: break-word;
`;

const CommentFooter = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const FooterActions = styled.div`
  display: flex;
  gap: 16px;
  align-items: center;
`;

const FooterButton = styled(motion.button)<{ $active?: boolean }>`
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 4px 8px;
  background: none;
  border: none;
  border-radius: 4px;
  font-size: 12px;
  color: ${({ $active }) => $active ? '#667eea' : '#9ca3af'};
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background: #f3f4f6;
    color: ${({ $active }) => $active ? '#5a67d8' : '#6b7280'};
  }
  
  .count {
    font-weight: 500;
  }
`;

const CommentTime = styled.div`
  font-size: 12px;
  color: #9ca3af;
`;

const EditingContainer = styled.div`
  margin-top: 12px;
  padding: 12px;
  background: #f0f4ff;
  border-radius: 6px;
  border: 1px solid #c7d2fe;
`;

const ReplyContainer = styled.div`
  margin-top: 16px;
`;

const LoadingState = styled.div`
  text-align: center;
  padding: 20px;
  color: #9ca3af;
  font-size: 14px;
`;

// ================================================================
// Component Props (export 추가)
// ================================================================

export interface CommentListProps {
  comments: Comment[];
  onUpdate?: () => void;
  maxDepth?: number;
  showReplies?: boolean;
}

// ================================================================
// Single Comment Component
// ================================================================

const CommentItemComponent: React.FC<{
  comment: Comment;
  onUpdate: () => void;
  isReply?: boolean;
}> = ({ comment, onUpdate, isReply = false }) => {
  const { user } = useAuthStore();
  const [showMenu, setShowMenu] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [isLiked, setIsLiked] = useState(false); // 추후 API 연동
  const [likeCount, setLikeCount] = useState(0); // 추후 API 연동

  // 댓글 삭제 뮤테이션
  const deleteCommentMutation = useMutation({
    mutationFn: async () => {
      await api.delete(API_ENDPOINTS.COMMENTS.BY_ID(comment.id));
    },
    onSuccess: () => {
      onUpdate();
    },
  });

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return '방금 전';
    if (diffInMinutes < 60) return `${diffInMinutes}분 전`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}시간 전`;
    return date.toLocaleDateString('ko-KR', { month: 'short', day: 'numeric' });
  };

  const getUserInitial = (name: string) => {
    return name.charAt(0).toUpperCase();
  };

  const handleEdit = () => {
    setIsEditing(true);
    setShowMenu(false);
  };

  const handleDelete = async () => {
    if (window.confirm('정말로 이 댓글을 삭제하시겠습니까?')) {
      await deleteCommentMutation.mutateAsync();
    }
    setShowMenu(false);
  };

  const handleLike = () => {
    setIsLiked(!isLiked);
    setLikeCount(prev => isLiked ? prev - 1 : prev + 1);
  };

  const handleReply = () => {
    setShowReplyForm(!showReplyForm);
  };

  const handleEditComplete = () => {
    setIsEditing(false);
    onUpdate();
  };

  const handleReplyComplete = () => {
    setShowReplyForm(false);
    onUpdate();
  };

  const canEdit = user && (comment.authorId === user.id || comment.isEditable);
  const canDelete = user && (comment.authorId === user.id || comment.isDeletable);

  return (
    <CommentContainer
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <CommentItem $isReply={isReply}>
        <CommentHeader>
          <CommentMeta>
            <div className="user-info">
              <div className="avatar">
                {getUserInitial(comment.authorName)}
              </div>
              <span className="name">{comment.authorName}</span>
            </div>
            <div className="date">
              <Calendar size={12} />
              {formatDate(comment.createdAt)}
            </div>
          </CommentMeta>

          {(canEdit || canDelete) && (
            <CommentActions>
              <ActionButton
                onClick={() => setShowMenu(!showMenu)}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <MoreHorizontal size={16} />
              </ActionButton>

              <AnimatePresence>
                {showMenu && (
                  <ActionMenu
                    initial={{ opacity: 0, y: -5, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -5, scale: 0.95 }}
                    transition={{ duration: 0.15 }}
                  >
                    {canEdit && (
                      <MenuItem onClick={handleEdit}>
                        <Edit3 size={12} />
                        수정
                      </MenuItem>
                    )}
                    {canDelete && (
                      <MenuItem $danger onClick={handleDelete}>
                        <Trash2 size={12} />
                        삭제
                      </MenuItem>
                    )}
                    <MenuItem>
                      <Flag size={12} />
                      신고
                    </MenuItem>
                  </ActionMenu>
                )}
              </AnimatePresence>
            </CommentActions>
          )}
        </CommentHeader>

        {isEditing ? (
          <EditingContainer>
            <CommentForm
              postId={comment.postId}
              editingComment={comment}
              onSuccess={handleEditComplete}
              onCancel={() => setIsEditing(false)}
              placeholder="댓글을 수정하세요..."
              autoFocus
            />
          </EditingContainer>
        ) : (
          <>
            <CommentContent>{comment.content}</CommentContent>

            <CommentFooter>
              <FooterActions>
                <FooterButton
                  $active={isLiked}
                  onClick={handleLike}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Heart size={12} />
                  {likeCount > 0 && <span className="count">{likeCount}</span>}
                </FooterButton>
              </FooterActions>

              <CommentTime>
                {comment.createdAt !== comment.updatedAt && (
                  <span style={{ color: '#9ca3af' }}>
                    (수정됨)
                  </span>
                )}
              </CommentTime>
            </CommentFooter>
          </>
        )}

        {/* 답글 작성 폼 */}
        <AnimatePresence>
          {showReplyForm && (
            <ReplyContainer>
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
              >
                <CommentForm
                  postId={comment.postId}
                  parentCommentId={comment.id}
                  onSuccess={handleReplyComplete}
                  onCancel={() => setShowReplyForm(false)}
                  placeholder={`${comment.authorName}님에게 답글을 작성하세요...`}
                  autoFocus
                />
              </motion.div>
            </ReplyContainer>
          )}
        </AnimatePresence>
      </CommentItem>

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
    </CommentContainer>
  );
};

// ================================================================
// Main Component
// ================================================================

export const CommentList: React.FC<CommentListProps> = ({ 
  comments, 
  onUpdate = () => {}
}) => {
  if (!comments || comments.length === 0) {
    return (
      <LoadingState>
        댓글이 없습니다.
      </LoadingState>
    );
  }

  return (
    <div>
      <AnimatePresence>
        {comments.map((comment) => (
          <CommentItemComponent
            key={comment.id}
            comment={comment}
            onUpdate={onUpdate}
            isReply={false}
          />
        ))}
      </AnimatePresence>
    </div>
  );
};

export default CommentList;