"use client";

import React, { useCallback, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import {
  Clock, 
  MessageSquare, 
  Heart, 
  Eye,
  ArrowRight,
  MapPin
} from 'lucide-react';
import type { Post } from '@/types/community/community';
import { formatters } from '@/utils/common/formatting';
import { PostCardProps } from './types';
import { CardContainer } from '@/styles/commonStyles';
import { AuthorInfo, AuthorLeft, AuthorName, Avatar, CardContent, CardFooter, CardHeader, HotBadge, MetroLine, PostPreview, PostTime, PostTitle, ReadMoreButton, StatItem, StatsGroup } from './styles';
import { extractMetroLine, isHotPost } from './utils';

export const PostCard = React.memo<PostCardProps>(function PostCard({
  post, showMetroLine = true, compact = false, onClick
}) {
  const router = useRouter();

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

  const handleClick = useCallback(() => {
    if (onClick) {
      onClick(post);
    } else {
      router.push(`/community/${post.id}`);
    }
  }, [post.id, onClick, router]);

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
      {isHot && <HotBadge>🔥 HOT</HotBadge>}

      <CardHeader>
        <AuthorInfo>
          <AuthorLeft>
            <Avatar>{userInitial}</Avatar>
            <AuthorName>{post.authorName}</AuthorName>
            {metroLine && (
              <MetroLine $lineNumber={metroLine}>
                <MapPin size={10} />
                {metroLine}호선
              </MetroLine>
            )}
          </AuthorLeft>
          
          <PostTime>
            <Clock size={12} />
            {relativeTime}
          </PostTime>
        </AuthorInfo>
      </CardHeader>

      <CardContent>
        <PostTitle>{post.title}</PostTitle>
        <PostPreview>{postPreview}</PostPreview>
      </CardContent>

      <CardFooter>
        <StatsGroup>
          <StatItem>
            <MessageSquare />
            <span className="count">0</span>
          </StatItem>
          
          <StatItem>
            <Heart />
            <span className="count">0</span>
          </StatItem>
          
          <StatItem>
            <Eye />
            <span className="count">0</span>
          </StatItem>
        </StatsGroup>

        <ReadMoreButton>
          자세히 보기
          <ArrowRight />
        </ReadMoreButton>
      </CardFooter>
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