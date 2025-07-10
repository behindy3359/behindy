import React from 'react';
import { Send, X } from 'lucide-react';
import { Button } from '@/shared/components/ui/button/Button';
import { Actions, CancelButton, Tips } from '../styles';
import { getCancelButtonText, getSubmitButtonText } from '../../../utils/commentFormUtils';
import { CommonGroup } from '@/shared/styles/commonStyles';

interface CommentFormActionsProps {
  isEditing: boolean;
  isLoading: boolean;
  hasContent: boolean;
  isOverLimit: boolean;
  onCancel: () => void;
}

export const CommentFormActions = React.memo<CommentFormActionsProps>(
  function CommentFormActions({ 
    isEditing, 
    isLoading, 
    hasContent, 
    isOverLimit, 
    onCancel 
  }) {
    return (
      <Actions>
        <Tips>
          <div className="tip-item">• 다른 사용자를 존중하는 댓글을 작성해주세요</div>
          <div className="tip-item">• 스팸이나 광고성 댓글은 삭제될 수 있습니다</div>
        </Tips>

        <CommonGroup>
          {(isEditing || hasContent) && (
            <CancelButton 
              type="button" 
              onClick={onCancel}
              disabled={isLoading}
            >
              <X size={14} />
              {getCancelButtonText(isEditing)}
            </CancelButton>
          )}
          
          <Button
            type="submit"
            variant="primary"
            size="sm"
            isLoading={isLoading}
            disabled={isLoading || !hasContent || isOverLimit}
            leftIcon={<Send />}
          >
            {getSubmitButtonText(isEditing, isLoading)}
          </Button>
        </CommonGroup>
      </Actions>
    );
  }
);