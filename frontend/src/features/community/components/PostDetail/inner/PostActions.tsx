import React from 'react';
import { Heart, Share2, MessageSquare } from 'lucide-react';
import { PostActions as StyledPostActions, ActionGroup, ActionButton } from '../styles';
import type { CommentListResponse } from '@/types/community/community';

interface PostActionsProps {
  enableInteractions: boolean;
  isLiked: boolean;
  likeCount: number;
  commentsData?: CommentListResponse;
  onLike: () => void;
  onShare: () => void;
}

export const PostActions: React.FC<PostActionsProps> = ({
  enableInteractions,
  isLiked,
  likeCount,
  commentsData,
  onLike,
  onShare,
}) => {
  return (
    <StyledPostActions>
      {enableInteractions && (
        <ActionGroup>
          <ActionButton
            $active={isLiked}
            onClick={onLike}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Heart size={16} />
            <span className="count">{likeCount}</span>
          </ActionButton>
          
          <ActionButton
            onClick={onShare}
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
    </StyledPostActions>
  );
};
