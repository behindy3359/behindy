import { useMemo } from 'react';
import { formatters } from '@/shared/utils/common';
import { extractMetroLine, isHotPost } from '../utils/postCardUtils';
import type { Post } from '@/shared/types/community/community';

export const usePostCardData = (post: Post, showMetroLine: boolean, compact: boolean) => {
  const metroLine = useMemo(() => 
    showMetroLine ? extractMetroLine(post.content) : null, 
    [post.content, showMetroLine]
  );
  
  const isHot = useMemo(() => 
    isHotPost(post), 
    [post.createdAt]
  );

  const postPreview = useMemo(() => 
    formatters.createPostPreview(post.content, compact ? 80 : 120),
    [post.content, compact]
  );

  const userInitial = useMemo(() => 
    formatters.getUserInitial(post.authorName),
    [post.authorName]
  );

  const relativeTime = useMemo(() => 
    formatters.relativeTime(post.createdAt),
    [post.createdAt]
  );

  return {
    metroLine,
    isHot,
    postPreview,
    userInitial,
    relativeTime,
  };
};