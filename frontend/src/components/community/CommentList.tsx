"use client";

import React, { useState } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Calendar, 
  Edit3, 
  Trash2, 
  MoreHorizontal,
  Heart,
  Flag
} from 'lucide-react';
import { useMutation } from '@tanstack/react-query';
import { api } from '@/services/api/axiosConfig';
import { API_ENDPOINTS } from '@/utils/common/api'
import type { Comment } from '@/types/community/community';
import { useAuthStore } from '@/store/authStore';
import { CommentForm } from './CommentForm/CommentForm';
import { formatters } from '@/utils/common/formatting';

// ================================================================
// Styled Components
// ================================================================

const CommentContainer = styled(motion.div)`
  & + & {
    margin-top: ${({ theme }) => theme.spacing[4]};
  }
`;

const CommentItem = styled.div<{ $isReply?: boolean }>`
  padding: ${({ theme }) => theme.spacing[4]};
  background: ${({ $isReply, theme }) => 
    $isReply ? theme.colors.background.secondary : theme.colors.background.primary};
  border: 1px solid ${({ theme }) => theme.colors.border.light};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  margin-left: ${({ $isReply }) => $isReply ? '32px' : '0'};
  position: relative;
  
  ${({ $isReply, theme }) => $isReply && `
    &::before {
      content: '';
      position: absolute;
      left: -16px;
      top: ${theme.spacing[4]};
      width: 12px;
      height: 12px;
      border-left: 2px solid ${theme.colors.border.dark};
      border-bottom: 2px solid ${theme.colors.border.dark};
      border-bottom-left-radius: ${theme.borderRadius.sm};
    }
  `}
`;

const CommentHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: ${({ theme }) => theme.spacing[2]};
`;

const CommentMeta = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[4]};
  
  .user-info {
    display: flex;
    align-items: center;
    gap: ${({ theme }) => theme.spacing[2]};
    
    .avatar {
      width: 28px;
      height: 28px;
      background: linear-gradient(135deg, ${({ theme }) => theme.colors.primary[500]} 0%, ${({ theme }) => theme.colors.secondary[500]} 100%);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      color: ${({ theme }) => theme.colors.text.inverse};
      font-weight: 600;
      font-size: ${({ theme }) => theme.typography.fontSize.xs};
    }
    
    .name {
      font-weight: 600;
      color: ${({ theme }) => theme.colors.text.primary};
      font-size: ${({ theme }) => theme.typography.fontSize.sm};
    }
  }
  
  .date {
    font-size: ${({ theme }) => theme.typography.fontSize.xs};
    color: ${({ theme }) => theme.colors.text.tertiary};
    display: flex;
    align-items: center;
    gap: ${({ theme }) => theme.spacing[1]};
  }
`;

const CommentActions = styled.div`
  position: relative;
`;

const ActionButton = styled(motion.button)`
  padding: ${({ theme }) => theme.spacing[1]};
  background: none;
  border: none;
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  color: ${({ theme }) => theme.colors.text.tertiary};
  cursor: pointer;
  
  &:hover {
    background: ${({ theme }) => theme.colors.background.secondary};
    color: ${({ theme }) => theme.colors.text.secondary};
  }
`;

const ActionMenu = styled(motion.div)`
  position: absolute;
  top: 100%;
  right: 0;
  margin-top: ${({ theme }) => theme.spacing[1]};
  background: ${({ theme }) => theme.colors.background.primary};
  border: 1px solid ${({ theme }) => theme.colors.border.light};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  box-shadow: ${({ theme }) => theme.shadows.lg};
  z-index: 100;
  min-width: 120px;
  overflow: hidden;
`;

const MenuItem = styled.button<{ $danger?: boolean }>`
  width: 100%;
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[2]};
  padding: ${({ theme }) => theme.spacing[2]} ${({ theme }) => theme.spacing[4]};
  background: none;
  border: none;
  cursor: pointer;
  font-size: ${({ theme }) => theme.typography.fontSize.xs};
  color: ${({ $danger, theme }) => 
    $danger ? theme.colors.error : theme.colors.text.primary};
  transition: background 0.2s ease;
  
  &:hover {
    background: ${({ $danger, theme }) => 
      $danger ? '#fef2f2' : theme.colors.background.secondary};
  }
`;

const CommentContent = styled.div`
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  line-height: 1.6;
  color: ${({ theme }) => theme.colors.text.primary};
  margin-bottom: ${({ theme }) => theme.spacing[4]};
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
  gap: ${({ theme }) => theme.spacing[4]};
  align-items: center;
`;

const FooterButton = styled(motion.button)<{ $active?: boolean }>`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[1]};
  padding: ${({ theme }) => theme.spacing[1]} ${({ theme }) => theme.spacing[2]};
  background: none;
  border: none;
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  font-size: ${({ theme }) => theme.typography.fontSize.xs};
  color: ${({ $active, theme }) => 
    $active ? theme.colors.primary[500] : theme.colors.text.tertiary};
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background: ${({ theme }) => theme.colors.background.secondary};
    color: ${({ $active, theme }) => 
      $active ? theme.colors.primary[600] : theme.colors.text.secondary};
  }
  
  .count {
    font-weight: 500;
  }
`;

const CommentTime = styled.div`
  font-size: ${({ theme }) => theme.typography.fontSize.xs};
  color: ${({ theme }) => theme.colors.text.tertiary};
`;

const EditingContainer = styled.div`
  margin-top: ${({ theme }) => theme.spacing[4]};
  padding: ${({ theme }) => theme.spacing[4]};
  background: #f0f4ff;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  border: 1px solid #c7d2fe;
`;

const ReplyContainer = styled.div`
  margin-top: ${({ theme }) => theme.spacing[4]};
`;

const LoadingState = styled.div`
  text-align: center;
  padding: ${({ theme }) => theme.spacing[6]};
  color: ${({ theme }) => theme.colors.text.tertiary};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
`;

// ================================================================
// Component Props
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

const CommentItemComponent = React.memo<{
  comment: Comment;
  onUpdate: () => void;
  isReply?: boolean;
}>(function CommentItemComponent({ comment, onUpdate, isReply = false }) {
  const { user } = useAuthStore();
  const [showMenu, setShowMenu] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);

  // 댓글 삭제 뮤테이션
  const deleteCommentMutation = useMutation({
    mutationFn: async () => {
      await api.delete(API_ENDPOINTS.COMMENTS.BY_ID(comment.id));
    },
    onSuccess: () => {
      onUpdate();
    },
  });

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
                {formatters.getUserInitial(comment.authorName)}
              </div>
              <span className="name">{comment.authorName}</span>
            </div>
            <div className="date">
              <Calendar size={12} />
              {formatters.relativeTime(comment.createdAt)} {/* 🔥 통합된 시간 포맷팅 */}
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
}, (prevProps, nextProps) => {
  // 댓글 내용이 변경되지 않았으면 리렌더링 스킵
  return (
    prevProps.comment.id === nextProps.comment.id &&
    prevProps.comment.updatedAt === nextProps.comment.updatedAt &&
    prevProps.isReply === nextProps.isReply
  );
});

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