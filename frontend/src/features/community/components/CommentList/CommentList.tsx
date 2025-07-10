"use client";

import React, { useMemo } from 'react';
import { AnimatePresence } from 'framer-motion';
import { CommentListProps } from '../../types/commentListTypes';
import { CommentItemComponent } from './inner/CommentItemComponent';
import { CommonLoadingState } from '@/shared/styles/commonStyles';

export const CommentList: React.FC<CommentListProps> = ({ 
  comments, 
  onUpdate = () => {}
}) => {
  const memoizedComments = useMemo(() => comments || [], [comments]);

  if (memoizedComments.length === 0) {
    return (
      <CommonLoadingState>
        아직 작성된 댓글이 없습니다.
      </CommonLoadingState>
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