"use client";

import React from 'react';
import { CardContainer } from '@/styles/commonStyles';
import { PostCardProps } from './types';
import { usePostCardData } from './hooks/usePostCardData';
import { usePostCardActions } from './hooks/usePostCardActions';
import { PostCardHeader } from './inner/PostCardHeader';
import { PostCardContent } from './inner/PostCardContent';
import { PostCardFooter } from './inner/PostCardFooter';
import { PostCardBadge } from './inner/PostCardBadge';

export const PostCard = React.memo<PostCardProps>(function PostCard({
  post, 
  showMetroLine = true, 
  compact = false, 
  onClick
}) {
  const {
    metroLine,
    isHot,
    postPreview,
    userInitial,
    relativeTime,
  } = usePostCardData(post, showMetroLine, compact);

  const { handleClick } = usePostCardActions(post, onClick);

  return (
    <CardContainer
      onClick={handleClick}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      style={{ position: 'relative' }}
    >
      <PostCardBadge isHot={isHot} />
      <PostCardHeader
        authorName={post.authorName}
        userInitial={userInitial}
        relativeTime={relativeTime}
        metroLine={metroLine}
      />
      <PostCardContent
        title={post.title}
        preview={postPreview}
      />

      <PostCardFooter />
    </CardContainer>
  );
}, (prevProps, nextProps) => {
  return (
    prevProps.post.id === nextProps.post.id &&
    prevProps.post.updatedAt === nextProps.post.updatedAt &&
    prevProps.post.title === nextProps.post.title &&
    prevProps.compact === nextProps.compact &&
    prevProps.showMetroLine === nextProps.showMetroLine &&
    prevProps.onClick === nextProps.onClick
  );
});

export default PostCard;