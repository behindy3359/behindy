"use client";

import React from 'react';
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

// ================================================================
// Styled Components
// ================================================================

const CardContainer = styled(motion.div)`
  background: ${({ theme }) => theme.colors.background.primary};
  border-radius: ${({ theme }) => theme.borderRadius.xl};
  border: 1px solid ${({ theme }) => theme.colors.border.light};
  overflow: hidden;
  cursor: pointer;
  transition: all 0.3s ease;
  height: 320px;
  display: flex;
  flex-direction: column;
  box-shadow: ${({ theme }) => theme.shadows.card};
  
  &:hover {
    border-color: ${({ theme }) => theme.colors.primary[500]};
    box-shadow: ${({ theme }) => theme.shadows.lg};
    transform: translateY(-2px);
  }
`;

const CardHeader = styled.div`
  padding: ${({ theme }) => theme.spacing[4]} ${({ theme }) => theme.spacing[6]} ${({ theme }) => theme.spacing[4]} ${({ theme }) => theme.spacing[6]};
  background: ${({ theme }) => theme.colors.background.secondary};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border.light};
  flex-shrink: 0;
`;

const AuthorInfo = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: ${({ theme }) => theme.spacing[2]};
`;

const AuthorLeft = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[2]};
`;

const Avatar = styled.div`
  width: 32px;
  height: 32px;
  background: linear-gradient(135deg, ${({ theme }) => theme.colors.primary[500]} 0%, ${({ theme }) => theme.colors.secondary[500]} 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${({ theme }) => theme.colors.text.inverse};
  font-weight: 600;
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
`;

const AuthorName = styled.span`
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
`;

const PostTime = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[1]};
  color: ${({ theme }) => theme.colors.text.tertiary};
  font-size: ${({ theme }) => theme.typography.fontSize.xs};
`;

const MetroLine = styled.div<{ $lineNumber?: string }>`
  display: inline-flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[1]};
  padding: ${({ theme }) => theme.spacing[1]} ${({ theme }) => theme.spacing[2]};
  border-radius: ${({ theme }) => theme.borderRadius.xl};
  font-size: ${({ theme }) => theme.typography.fontSize.xs};
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text.inverse};
  
  ${({ $lineNumber, theme }) => {
    switch($lineNumber) {
      case '1': return `background: ${theme.colors.metro.line1};`;
      case '2': return `background: ${theme.colors.metro.line2};`;
      case '3': return `background: ${theme.colors.metro.line3};`;
      case '4': return `background: ${theme.colors.metro.line4};`;
      default: return `background: ${theme.colors.gray[500]};`;
    }
  }}
`;

const CardContent = styled.div`
  padding: ${({ theme }) => theme.spacing[6]};
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
`;

const PostTitle = styled.h3`
  font-size: ${({ theme }) => theme.typography.fontSize.base};
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text.primary};
  margin: 0 0 ${({ theme }) => theme.spacing[4]} 0;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  flex-shrink: 0;
`;

const PostPreview = styled.p`
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  line-height: 1.6;
  margin: 0;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
  flex: 1;
`;

const CardFooter = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: ${({ theme }) => theme.spacing[4]} ${({ theme }) => theme.spacing[6]};
  background: ${({ theme }) => theme.colors.background.secondary};
  border-top: 1px solid ${({ theme }) => theme.colors.border.light};
  flex-shrink: 0;
  margin-top: auto;
`;

const StatsGroup = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing[4]};
  align-items: center;
`;

const StatItem = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[1]};
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: ${({ theme }) => theme.typography.fontSize.xs};
  
  svg {
    width: 14px;
    height: 14px;
  }
  
  .count {
    font-weight: 500;
  }
`;

const ReadMoreButton = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[1]};
  color: ${({ theme }) => theme.colors.primary[500]};
  font-size: ${({ theme }) => theme.typography.fontSize.xs};
  font-weight: 500;
  
  svg {
    width: 14px;
    height: 14px;
    transition: transform 0.2s ease;
  }
  
  ${CardContainer}:hover & svg {
    transform: translateX(2px);
  }
`;

const HotBadge = styled.div`
  position: absolute;
  top: ${({ theme }) => theme.spacing[4]};
  right: ${({ theme }) => theme.spacing[4]};
  background: ${({ theme }) => theme.colors.error};
  color: ${({ theme }) => theme.colors.text.inverse};
  padding: ${({ theme }) => theme.spacing[1]} ${({ theme }) => theme.spacing[2]};
  border-radius: ${({ theme }) => theme.borderRadius.xl};
  font-size: ${({ theme }) => theme.typography.fontSize.xs};
  font-weight: 600;
  z-index: 1;
`;

// ================================================================
// Component Props
// ================================================================

export interface PostCardProps {
  post: Post;
  showMetroLine?: boolean;
  compact?: boolean;
  onClick?: (post: Post) => void;
}

// ================================================================
// Helper Functions
// ================================================================

const extractMetroLine = (content: string): string | null => {
  const lineMatch = content.match(/([1-4])호선/);
  return lineMatch ? lineMatch[1] : null;
};

const isHotPost = (post: Post): boolean => {
  const postDate = new Date(post.createdAt);
  const now = new Date();
  const hoursDiff = (now.getTime() - postDate.getTime()) / (1000 * 60 * 60);
  return hoursDiff < 24;
};

// ================================================================
// Component
// ================================================================

export const PostCard: React.FC<PostCardProps> = ({
  post,
  showMetroLine = true,
  compact = false,
  onClick
}) => {
  const router = useRouter();
  const metroLine = showMetroLine ? extractMetroLine(post.content) : null;
  const isHot = isHotPost(post);

  const handleClick = () => {
    if (onClick) {
      onClick(post);
    } else {
      router.push(`/community/${post.id}`);
    }
  };

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
            <Avatar>
              {formatters.getUserInitial(post.authorName)}
            </Avatar>
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
            {formatters.relativeTime(post.createdAt)}
          </PostTime>
        </AuthorInfo>
      </CardHeader>

      <CardContent>
        <PostTitle>{post.title}</PostTitle>
        <PostPreview>
          {formatters.createPostPreview(post.content, compact ? 80 : 120)}
        </PostPreview>
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
};

export default PostCard;