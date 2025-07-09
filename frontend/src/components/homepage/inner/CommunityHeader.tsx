import React from 'react';
import { Plus, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button/Button';
import { StatCard } from './StatCard';
import { CommunityHeader as StyledCommunityHeader } from '../styles';

interface CommunityHeaderProps {
  statItems: Array<{
    icon: React.ComponentType<{ size?: number }>;
    title: string;
    value: string;
    change: string;
  }>;
  onWritePost: () => void;
}

export const CommunityHeader: React.FC<CommunityHeaderProps> = ({
  statItems,
  onWritePost,
}) => {
  return (
    <StyledCommunityHeader>
      <div className="header-top">
        <h3 className="section-title">
          <MessageSquare size={22} />
          승객들의 이야기
        </h3>
        
        <Button
          variant="primary"
          size="sm"
          onClick={onWritePost}
          leftIcon={<Plus size={16} />}
        >
          글쓰기
        </Button>
      </div>

      <div className="stats-grid">
        {statItems.map((stat, index) => (
          <StatCard
            key={stat.title}
            stat={stat}
            index={index}
          />
        ))}
      </div>
    </StyledCommunityHeader>
  );
};