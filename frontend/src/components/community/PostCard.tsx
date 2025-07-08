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
import { formatters } from '@/utils/common';

// ================================================================
// Styled Components
// ================================================================

const CardContainer = styled(motion.div)`
  background: white;
  border-radius: 12px;
  border: 1px solid #e5e7eb;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.3s ease;
  height: 320px; /* 🔥 고정 높이 */
  display: flex;
  flex-direction: column; /* 🎯 flex 컨테이너로 설정 */
  
  &:hover {
    border-color: #667eea;
    box-shadow: 0 8px 25px rgba(102, 126, 234, 0.15);
    transform: translateY(-2px);
  }
`;

const CardHeader = styled.div`
  padding: 16px 20px 12px 20px;
  background: #f9fafb;
  border-bottom: 1px solid #f3f4f6;
  flex-shrink: 0; /* 🎯 헤더 크기 고정 */
`;

const AuthorInfo = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 8px;
`;

const AuthorLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const Avatar = styled.div`
  width: 32px;
  height: 32px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 600;
  font-size: 14px;
`;

const AuthorName = styled.span`
  font-weight: 600;
  color: #374151;
  font-size: 14px;
`;

const PostTime = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  color: #9ca3af;
  font-size: 12px;
`;

const MetroLine = styled.div<{ $lineNumber?: string }>`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 11px;
  font-weight: 600;
  color: white;
  
  ${({ $lineNumber }) => {
    switch($lineNumber) {
      case '1': return 'background: #0052A4;'; // 1호선 블루
      case '2': return 'background: #00A84D;'; // 2호선 그린
      case '3': return 'background: #EF7C1C;'; // 3호선 오렌지
      case '4': return 'background: #00A5DE;'; // 4호선 블루
      default: return 'background: #6b7280;';  // 기본 회색
    }
  }}
`;

const CardContent = styled.div`
  padding: 20px;
  flex: 1; /* 🎯 남은 공간 모두 차지 */
  display: flex;
  flex-direction: column;
  overflow: hidden; /* 내용이 넘치지 않도록 */
`;

const PostTitle = styled.h3`
  font-size: 16px;
  font-weight: 600;
  color: #111827;
  margin: 0 0 12px 0;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  flex-shrink: 0; /* 🎯 타이틀 크기 고정 */
`;

const PostPreview = styled.p`
  color: #6b7280;
  font-size: 14px;
  line-height: 1.6;
  margin: 0;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
  flex: 1; /* 🎯 남은 공간에서 늘어남 */
`;

const CardFooter = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 20px;
  background: #f9fafb;
  border-top: 1px solid #f3f4f6;
  flex-shrink: 0; /* 🎯 푸터를 하단에 고정 */
  margin-top: auto; /* 🎯 푸터를 맨 아래로 밀어냄 */
`;

const StatsGroup = styled.div`
  display: flex;
  gap: 16px;
  align-items: center;
`;

const StatItem = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  color: #6b7280;
  font-size: 13px;
  
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
  gap: 4px;
  color: #667eea;
  font-size: 13px;
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
  top: 12px;
  right: 12px;
  background: #ef4444;
  color: white;
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 11px;
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

const getAuthorInitial = (name: string): string => {
  return name.charAt(0).toUpperCase();
};

const extractMetroLine = (content: string): string | null => {
  // 게시글 내용에서 지하철 호선 추출 (1호선, 2호선 등)
  const lineMatch = content.match(/([1-4])호선/);
  return lineMatch ? lineMatch[1] : null;
};

const isHotPost = (post: Post): boolean => {
  // HOT 게시글 판단 로직 (24시간 내 작성, 임시)
  const postDate = new Date(post.createdAt);
  const now = new Date();
  const hoursDiff = (now.getTime() - postDate.getTime()) / (1000 * 60 * 60);
  return hoursDiff < 24;
};

const truncateText = (text: string, maxLength: number): string => {
  const cleanText = text.replace(/<[^>]*>/g, ''); // HTML 태그 제거
  return cleanText.length > maxLength 
    ? cleanText.substring(0, maxLength) + '...'
    : cleanText;
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
              {getAuthorInitial(post.authorName)}
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
          {truncateText(post.content, compact ? 80 : 120)}
        </PostPreview>
      </CardContent>

      <CardFooter>
        <StatsGroup>
          <StatItem>
            <MessageSquare />
            <span className="count">0</span> {/* 추후 API에서 댓글 수 제공 */}
          </StatItem>
          
          <StatItem>
            <Heart />
            <span className="count">0</span> {/* 추후 API에서 좋아요 수 제공 */}
          </StatItem>
          
          <StatItem>
            <Eye />
            <span className="count">0</span> {/* 추후 API에서 조회 수 제공 */}
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