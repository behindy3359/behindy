import React from 'react';
import { MessageSquare, Eye, ArrowRight } from 'lucide-react';
import { CardFooter, StatsGroup, StatItem, ReadMoreButton } from '../styles';

interface PostCardFooterProps {
  viewCount: number;
  commentCount: number;
}

export const PostCardFooter: React.FC<PostCardFooterProps> = ({
  viewCount,
  commentCount,
}) => {
  return (
    <CardFooter>
      <StatsGroup>
        <StatItem>
          <MessageSquare size={16} />
          <span className="count">{commentCount}</span>
        </StatItem>

        <StatItem>
          <Eye size={16} />
          <span className="count">{viewCount}</span>
        </StatItem>
      </StatsGroup>

      <ReadMoreButton>
        자세히 보기
        <ArrowRight />
      </ReadMoreButton>
    </CardFooter>
  );
};