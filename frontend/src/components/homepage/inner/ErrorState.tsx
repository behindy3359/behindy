import React from 'react';
import { MessageSquare } from 'lucide-react';
import { EmptyState } from '../styles';
import { ERROR_MESSAGES } from '@/utils/common/constants';

export const ErrorState: React.FC = () => {
  return (
    <EmptyState>
      <MessageSquare className="empty-icon" />
      <div className="empty-title">
        {ERROR_MESSAGES.POST_LOAD_ERROR}
      </div>
      <div className="empty-description">
        잠시 후 다시 시도해주세요
      </div>
    </EmptyState>
  );
};