import React from 'react';
import { Share2, MessageSquare } from 'lucide-react';
import { PostActions as StyledPostActions, ActionButton } from '../styles';
import type { CommentListResponse } from '@/shared/types/community/community';
import { CommonWrapper } from '@/shared/styles/commonStyles';

interface PostActionsProps {
  enableInteractions: boolean;
  commentsData?: CommentListResponse;
  onShare: () => void;
}

export const PostActions: React.FC<PostActionsProps> = ({
  enableInteractions,
  commentsData,
  onShare,
}) => {
  return (
    <StyledPostActions>
      {enableInteractions && (
        <CommonWrapper>
          <ActionButton
            onClick={onShare}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Share2 size={16} />
            공유
          </ActionButton>
        </CommonWrapper>
      )}

      <CommonWrapper>
        <ActionButton>
          <MessageSquare size={16} />
          <span className="count">
            {commentsData?.totalElements || 0}
          </span>
        </ActionButton>
      </CommonWrapper>
    </StyledPostActions>
  );
};
