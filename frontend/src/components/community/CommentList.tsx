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

  &:hover {
    color: ${({ theme }) => theme.colors.text.primary};
  }
`;

const DropdownMenu = styled.div`
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

  &:hover {
    background-color: ${({ theme }) => theme.colors.background.secondary};
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

  return (
    <StyledCommentMeta>
      <div className="user-info">
        <div className="avatar">{userInitial}</div>
        <span className="name">{authorName}</span>
      </div>
      <div className="date">
        <Calendar size={12} />
        {relativeTime}
        {createdAt !== updatedAt && (
          <span style={{ color: '#9ca3af', marginLeft: '4px' }}>
            (수정됨)
          </span>
        )}
      </div>
    </StyledCommentMeta>
  );
}, (prevProps, nextProps) => {
  return (
    prevProps.authorName === nextProps.authorName &&
    prevProps.createdAt === nextProps.createdAt &&
    prevProps.updatedAt === nextProps.updatedAt
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
        {createdAt !== updatedAt && (
          <span style={{ color: '#9ca3af' }}>
            (수정됨)
          </span>
        )}
      </CommentTime>
    </StyledCommentFooter>
  );
}, (prevProps, nextProps) => {
  return (
    prevProps.isLiked === nextProps.isLiked &&
    prevProps.likeCount === nextProps.likeCount &&
    prevProps.createdAt === nextProps.createdAt &&
    prevProps.updatedAt === nextProps.updatedAt
  );
});
interface CommentActionsProps {
  commentId: number;
  isAuthor: boolean | null;
  onEdit: () => void;
  onDelete: () => Promise<void>;
  showMenu: boolean;
  onToggleMenu: () => void;
}

const CommentActions: React.FC<CommentActionsProps> = ({
  commentId,
  isAuthor,
  onEdit,
  onDelete,
  showMenu,
  onToggleMenu
}) => {
  return (
    <StyledCommentActions>
      <MenuButton onClick={onToggleMenu} aria-label="댓글 메뉴 열기">
        <MoreHorizontal size={18} />
      </MenuButton>

      {showMenu && (
        <DropdownMenu>
          {isAuthor && (
            <MenuItem onClick={onEdit}>
              <Edit3 size={14} /> 수정
            </MenuItem>
          )}
          <MenuItem onClick={onDelete}>
            <Trash2 size={14} /> 삭제
          </MenuItem>
        </DropdownMenu>
      )}
    </StyledCommentActions>
  );
};

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

  // 🔥 권한 확인 메모이제이션
  const permissions = useMemo(() => ({
    canEdit: user && (comment.authorId === user.id || comment.isEditable),
    canDelete: user && (comment.authorId === user.id || comment.isDeletable)
  }), [user, comment.authorId, comment.isEditable, comment.isDeletable]);

  // 🔥 댓글 삭제 뮤테이션
  const deleteCommentMutation = useMutation({
    mutationFn: async () => {
      await api.delete(API_ENDPOINTS.COMMENTS.BY_ID(comment.id));
    },
    onSuccess: () => {
      onUpdate();
    },
  });

  // 🔥 핸들러들 메모이제이션
  const handleEdit = useCallback(() => {
    setIsEditing(true);
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

  return (
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

          {(permissions.canEdit || permissions.canDelete) && (
            <CommentActions
              commentId={comment.id}
              isAuthor={permissions.canEdit}
              onEdit={handleEdit}
              onDelete={handleDelete}
              showMenu={showMenu}
              onToggleMenu={handleToggleMenu}
            />
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

            {/* 🔥 최적화된 푸터 */}
            <CommentFooter
              isLiked={isLiked}
              likeCount={likeCount}
              createdAt={comment.createdAt}
              updatedAt={comment.updatedAt}
              onLike={handleLike}
            />
          </>
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
      </CommentItem>
    </CommentContainer>
  );
}, (prevProps, nextProps) => {
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