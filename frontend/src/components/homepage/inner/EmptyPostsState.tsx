import React from 'react';
import { Plus, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button/Button';
import { EmptyState } from '../styles';

interface EmptyPostsStateProps {
  onWritePost: () => void;
}

export const EmptyPostsState: React.FC<EmptyPostsStateProps> = ({ onWritePost }) => {
  return (
    <EmptyState>
      <MessageSquare className="empty-icon" />
      <div className="empty-title">첫 번째 이야기를 들려주세요</div>
      <div className="empty-description">
        지하철에서 경험한 흥미로운 이야기나<br />
        신기한 경험을 공유해보세요
      </div>
      <Button
        variant="primary"
        onClick={onWritePost}
        leftIcon={<Plus />}
      >
        첫 게시글 작성하기
      </Button>
    </EmptyState>
  );
};