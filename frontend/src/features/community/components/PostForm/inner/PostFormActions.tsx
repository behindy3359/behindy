import React from 'react';
import { Save, X } from 'lucide-react';
import { Button } from '@/shared/components/ui/button/Button';
import { getSubmitButtonText } from '../../../utils/postFormUtils';
import { BottomActions, ActionGroup } from '../styles';
import type { PostFormActionsProps } from '../../../types/postFormTypes';

export const PostFormActions = React.memo<PostFormActionsProps>(
  function PostFormActions({ 
    mode, 
    isLoading, 
    hasValidContent, 
    authorName, 
    onCancel 
  }) {
    return (
      <BottomActions>
        <ActionGroup>
          <span style={{ fontSize: '14px', color: '#6b7280' }}>
            작성자: <strong>{authorName}</strong>
          </span>
        </ActionGroup>

        <ActionGroup>
          <Button
            type="button"
            variant="ghost"
            onClick={onCancel}
            disabled={isLoading}
          >
            <X size={16} />
            취소
          </Button>
          
          <Button
            type="submit"
            variant="primary"
            isLoading={isLoading}
            disabled={isLoading || !hasValidContent}
            leftIcon={<Save />}
          >
            {getSubmitButtonText(mode, isLoading)}
          </Button>
        </ActionGroup>
      </BottomActions>
    );
  }
);