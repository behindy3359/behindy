"use client";

import React, { useCallback, useMemo, useState } from 'react';
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

const StyledCommentMeta = styled.div`
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

const StyledCommentActions = styled.div`
  position: relative;
`;

const CommentContent = styled.div`
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  line-height: 1.6;
  color: ${({ theme }) => theme.colors.text.primary};
  margin-bottom: ${({ theme }) => theme.spacing[4]};
  white-space: pre-wrap;
  word-break: break-word;
`;

const StyledCommentFooter = styled.div`
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

const LoadingState = styled.div`
  text-align: center;
  padding: ${({ theme }) => theme.spacing[6]};
  color: ${({ theme }) => theme.colors.text.tertiary};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
`;

const MenuButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  padding: 4px;
  color: ${({ theme }) => theme.colors.text.tertiary};
  display: flex;
  align-items: center;
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  transition: all 0.2s ease;

  &:hover {
    color: ${({ theme }) => theme.colors.text.primary};
    background: ${({ theme }) => theme.colors.background.secondary};
  }
`;

const DropdownMenu = styled(motion.div)`
  position: absolute;
  top: 100%;
  right: 0;
  margin-top: 8px;
  background: ${({ theme }) => theme.colors.background.primary};
  border: 1px solid ${({ theme }) => theme.colors.border.light};
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  z-index: 100;
  overflow: hidden;
  min-width: 120px;
`;

const MenuItem = styled.button`
  width: 100%;
  padding: 8px 12px;
  background: none;
  border: none;
  text-align: left;
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  color: ${({ theme }) => theme.colors.text.primary};
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: background 0.2s ease;

  &:hover {
    background-color: ${({ theme }) => theme.colors.background.secondary};
  }

  &.danger {
    color: ${({ theme }) => theme.colors.error};
    
    &:hover {
      background-color: #fef2f2;
    }
  }
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
// Optimized Sub-Components
// ================================================================

const CommentMeta = React.memo<{
  authorName: string;
  createdAt: string;
  updatedAt: string;
}>(function CommentMeta({ authorName, createdAt, updatedAt }) {
  
  const userInitial = useMemo(() => 
    formatters.getUserInitial(authorName), 
    [authorName]
  );
  
  const relativeTime = useMemo(() => 
    formatters.relativeTime(createdAt), 
    [createdAt]
  );

  const isEdited = useMemo(() => 
    createdAt !== updatedAt, 
    [createdAt, updatedAt]
  );

  return (
    <StyledCommentMeta>
      <div className="user-info">
        <div className="avatar">{userInitial}</div>
        <span className="name">{authorName}</span>
      </div>
      <div className="date">
        <Calendar size={12} />
        {relativeTime}
        {isEdited && (
          <span style={{ color: '#9ca3af', marginLeft: '4px' }}>
            (수정됨)
          </span>
        )}
      </div>
    </StyledCommentMeta>
  );
});

const CommentFooter = React.memo<{
  isLiked: boolean;
  likeCount: number;
  createdAt: string;
  updatedAt: string;
  onLike: () => void;
}>(function CommentFooter({ 
  isLiked, likeCount, createdAt, updatedAt, onLike 
}) {
  
  const handleLike = useCallback(() => {
    onLike();
  }, [onLike]);

  const isEdited = useMemo(() => 
    createdAt !== updatedAt, 
    [createdAt, updatedAt]
  );

  return (
    <StyledCommentFooter>
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
        {isEdited && (
          <span style={{ color: '#9ca3af' }}>
            (수정됨)
          </span>
        )}
      </CommentTime>
    </StyledCommentFooter>
  );
});

// 🔥 수정된 CommentActions 컴포넌트
const CommentActions = React.memo<{
  commentId: number;
  canEdit: boolean;
  canDelete: boolean;
  showMenu: boolean;
  onEdit: () => void;
  onDelete: () => Promise<void>;
  onToggleMenu: () => void;
}>(function CommentActions({
  commentId,
  canEdit,
  canDelete,
  showMenu,
  onEdit,
  onDelete,
  onToggleMenu
}) {

  const handleDelete = useCallback(async () => {
    if (window.confirm('정말로 이 댓글을 삭제하시겠습니까?')) {
      try {
        await onDelete();
      } catch (error) {
        console.error('댓글 삭제 실패:', error);
      }
    }
  }, [onDelete]);

  // 권한이 없으면 렌더링하지 않음
  if (!canEdit && !canDelete) {
    return null;
  }

  return (
    <StyledCommentActions>
      <MenuButton 
        onClick={onToggleMenu} 
        aria-label="댓글 메뉴 열기"
        type="button"
      >
        <MoreHorizontal size={18} />
      </MenuButton>

      <AnimatePresence>
        {showMenu && (
          <DropdownMenu
            initial={{ opacity: 0, scale: 0.95, y: -5 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -5 }}
            transition={{ duration: 0.15 }}
          >
            {canEdit && (
              <MenuItem onClick={onEdit} type="button">
                <Edit3 size={14} /> 수정
              </MenuItem>
            )}
            {canDelete && (
              <MenuItem onClick={handleDelete} className="danger" type="button">
                <Trash2 size={14} /> 삭제
              </MenuItem>
            )}
            <MenuItem type="button">
              <Flag size={14} /> 신고
            </MenuItem>
          </DropdownMenu>
        )}
      </AnimatePresence>
    </StyledCommentActions>
  );
});

// ================================================================
// 🔥 최적화된 CommentItem 컴포넌트
// ================================================================
const CommentItemComponent = React.memo<{
  comment: Comment;
  onUpdate: () => void;
  isReply?: boolean;
}>(function CommentItemComponent({ comment, onUpdate, isReply = false }) {
  const { user } = useAuthStore();
  const [showMenu, setShowMenu] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);

  // 🔥 권한 확인 메모이제이션 (boolean 타입 보장)
  const permissions = useMemo(() => ({
    canEdit: Boolean(user && (comment.authorId === user.id || comment.isEditable)),
    canDelete: Boolean(user && (comment.authorId === user.id || comment.isDeletable))
  }), [user, comment.authorId, comment.isEditable, comment.isDeletable]);

  // 🔥 댓글 삭제 뮤테이션
  const deleteCommentMutation = useMutation({
    mutationFn: async () => {
      await api.delete(API_ENDPOINTS.COMMENTS.BY_ID(comment.id));
    },
    onSuccess: () => {
      setShowMenu(false); // 메뉴 닫기
      onUpdate();
    },
  });

  // 🔥 핸들러들 메모이제이션
  const handleEdit = useCallback(() => {
    setIsEditing(true);
    setShowMenu(false);
  }, []);

  const handleDelete = useCallback(async () => {
    await deleteCommentMutation.mutateAsync();
  }, [deleteCommentMutation]);

  const handleLike = useCallback(() => {
    setIsLiked(!isLiked);
    setLikeCount(prev => isLiked ? prev - 1 : prev + 1);
  }, [isLiked]);

  const handleEditComplete = useCallback(() => {
    setIsEditing(false);
    onUpdate();
  }, [onUpdate]);

  const handleToggleMenu = useCallback(() => {
    setShowMenu(prev => !prev);
  }, []);

  // 🔥 메뉴 외부 클릭 처리
  const handleMenuOutsideClick = useCallback(() => {
    setShowMenu(false);
  }, []);

  return (
    <>
      <CommentContainer
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <CommentItem $isReply={isReply}>
          <CommentHeader>
            <CommentMeta
              authorName={comment.authorName}
              createdAt={comment.createdAt}
              updatedAt={comment.updatedAt}
            />

            <CommentActions
              commentId={comment.id}
              canEdit={permissions.canEdit}
              canDelete={permissions.canDelete}
              showMenu={showMenu}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onToggleMenu={handleToggleMenu}
            />
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

              <CommentFooter
                isLiked={isLiked}
                likeCount={likeCount}
                createdAt={comment.createdAt}
                updatedAt={comment.updatedAt}
                onLike={handleLike}
              />
            </>
          )}
        </CommentItem>
      </CommentContainer>

      {/* 메뉴 외부 클릭 오버레이 */}
      {showMenu && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 50,
            background: 'transparent',
          }}
          onClick={handleMenuOutsideClick}
        />
      )}
    </>
  );
});

// ================================================================
// Main Component
// ================================================================

export const CommentList: React.FC<CommentListProps> = ({ 
  comments, 
  onUpdate = () => {}
}) => {
  const memoizedComments = useMemo(() => comments || [], [comments]);

  if (memoizedComments.length === 0) {
    return (
      <LoadingState>
        댓글이 없습니다.
      </LoadingState>
    );
  }

  return (
    <div>
      <AnimatePresence>
        {memoizedComments.map((comment) => (
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