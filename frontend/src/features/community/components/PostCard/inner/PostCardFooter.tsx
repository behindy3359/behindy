import React from 'react';
import { MessageSquare, Eye, ArrowRight } from 'lucide-react';
import { CardFooter, StatsGroup, StatItem, ReadMoreButton } from '../styles';

interface PostCardFooterProps {
  // TODO: 실제 데이터가 연동되면 props 타입 수정
}

export const PostCardFooter: React.FC<PostCardFooterProps> = () => {
  return (
    <CardFooter>
      <StatsGroup>
        <StatItem>
          <MessageSquare />
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
  );
};