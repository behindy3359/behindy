import React from 'react';
import { Plus, MessageSquare } from 'lucide-react';
import { Button } from '@/shared/components/ui/button/Button';
import { CommunityHeader as StyledCommunityHeader } from '../styles';

interface CommunityHeaderProps {
  onWritePost: () => void;
}

export const CommunityHeader: React.FC<CommunityHeaderProps> = ({
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
    </StyledCommunityHeader>
  );
};