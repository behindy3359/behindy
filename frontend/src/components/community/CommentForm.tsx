"use client";

import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { Send, X, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui';
import { useMutation } from '@tanstack/react-query';
import { api, API_ENDPOINTS } from '@/config';
import type { Comment, CreateCommentRequest } from '@/types/community/community';
import { useAuthStore } from '@/store/authStore';

// ================================================================
// Types & Validation
// ================================================================

const isAxiosError = (error: unknown): error is {
  response?: {
    status?: number;
    data?: {
      message?: string;
      error?: string;
    };
  };
  message?: string;
} => {
  return (
    typeof error === 'object' &&
    error !== null &&
    'response' in error
  );
};

interface CommentFormData {
  content: string;
}

const commentSchema = yup.object({
  content: yup
    .string()
    .required('댓글 내용을 입력해주세요')
    .min(2, '댓글은 최소 2자 이상이어야 합니다')
    .max(1000, '댓글은 최대 1000자까지 입력 가능합니다'),
});

// ================================================================
// Styled Components
// ================================================================

const FormContainer = styled(motion.div)`
  background: #f9fafb;
  border-radius: 8px;
  padding: 16px;
  border: 1px solid #e5e7eb;
`;

const UserInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 12px;
  font-size: 14px;
  
  .avatar {
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
  }
  
  .name {
    font-weight: 600;
    color: #374151;
  }
`;

const TextareaContainer = styled.div`
  position: relative;
  margin-bottom: 12px;
`;

const Textarea = styled.textarea<{ $hasError: boolean }>`
  width: 100%;
  min-height: 80px;
  max-height: 200px;
  padding: 12px;
  border: 1px solid ${({ $hasError }) => $hasError ? '#ef4444' : '#d1d5db'};
  border-radius: 6px;
  font-size: 14px;
  line-height: 1.5;
  resize: vertical;
  font-family: inherit;
  
  &:focus {
    outline: none;
    border-color: ${({ $hasError }) => $hasError ? '#ef4444' : '#667eea'};
    box-shadow: 0 0 0 3px ${({ $hasError }) => 
      $hasError ? 'rgba(239, 68, 68, 0.1)' : 'rgba(102, 126, 234, 0.1)'
    };
  }
  
  &::placeholder {
    color: #9ca3af;
  }
`;

const CharCount = styled.div<{ $isOver: boolean }>`
  position: absolute;
  bottom: 8px;
  right: 12px;
  font-size: 12px;
  color: ${({ $isOver }) => $isOver ? '#ef4444' : '#9ca3af'};
  background: rgba(255, 255, 255, 0.9);
  padding: 2px 4px;
  border-radius: 4px;
`;

const ErrorMessage = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  color: #ef4444;
  font-size: 14px;
  margin-bottom: 12px;
  
  svg {
    width: 16px;
    height: 16px;
  }
`;

const Actions = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const ActionGroup = styled.div`
  display: flex;
  gap: 8px;
  align-items: center;
`;

const CancelButton = styled.button`
  padding: 6px 12px;
  background: none;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  color: #6b7280;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.2s ease;
  
  &:hover {
    background: #f3f4f6;
    color: #374151;
  }
`;

const Tips = styled.div`
  font-size: 12px;
  color: #9ca3af;
  
  .tip-item {
    margin-bottom: 2px;
  }
`;

// ================================================================
// Component Props (export 추가)
// ================================================================

export interface CommentFormProps {
  postId: number;
  parentCommentId?: number;
  editingComment?: Comment;
  onSuccess?: () => void;
  onCancel?: () => void;
  placeholder?: string;
  autoFocus?: boolean;
}

// ================================================================
// Component
// ================================================================

export const CommentForm: React.FC<CommentFormProps> = ({
  postId,
  editingComment,
  onSuccess,
  onCancel,
  placeholder = "댓글을 입력하세요...",
  autoFocus = false
}) => {
  const { user } = useAuthStore();
  const [submitError, setSubmitError] = useState<string>('');

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
    reset,
    setFocus
  } = useForm<CommentFormData>({
    resolver: yupResolver(commentSchema),
    defaultValues: {
      content: editingComment?.content || '',
    },
  });

  const watchedContent = watch('content', '');
  const isEditing = !!editingComment;

  // 자동 포커스
  useEffect(() => {
    if (autoFocus) {
      setFocus('content');
    }
  }, [autoFocus, setFocus]);

  // 댓글 생성 뮤테이션
  const createCommentMutation = useMutation({
    mutationFn: async (data: CreateCommentRequest) => {
      return await api.post<Comment>(API_ENDPOINTS.COMMENTS.BASE, data);
    },
    onSuccess: () => {
      reset();
      setSubmitError('');
      onSuccess?.();
    },
    onError: (error: unknown) => {
      let errorMessage = '댓글 작성에 실패했습니다.';
      
      if (isAxiosError(error)) {
        errorMessage = error.response?.data?.message || 
                      error.response?.data?.error || 
                      error.message || 
                      errorMessage;
      } else if (error instanceof Error) {
        errorMessage = error.message;
      }
      
      setSubmitError(errorMessage);
    },
  });
  
  const updateCommentMutation = useMutation({
    mutationFn: async (data: { content: string }) => {
      if (!editingComment) throw new Error('No comment to edit');
      return await api.put<Comment>(
        API_ENDPOINTS.COMMENTS.BY_ID(editingComment.id),
        data
      );
    },
    onSuccess: () => {
      setSubmitError('');
      onSuccess?.();
    },
    onError: (error: unknown) => {
      let errorMessage = '댓글 수정에 실패했습니다.';
      
      if (isAxiosError(error)) {
        errorMessage = error.response?.data?.message || 
                      error.response?.data?.error || 
                      error.message || 
                      errorMessage;
      } else if (error instanceof Error) {
        errorMessage = error.message;
      }
      
      setSubmitError(errorMessage);
    },
  });

  const onSubmit = async (data: CommentFormData) => {
    try {
      setSubmitError('');

      if (isEditing) {
        await updateCommentMutation.mutateAsync({
          content: data.content.trim(),
        });
      } else {
        const commentData: CreateCommentRequest = {
          content: data.content.trim(),
          postId,
        };
        await createCommentMutation.mutateAsync(commentData);
      }
    } catch (error) {
      // 에러는 mutation의 onError에서 처리
      console.error('Comment submission error:', error);
    }
  };

  const handleCancel = () => {
    if (isEditing) {
      onCancel?.();
    } else {
      reset();
    }
  };

  const getUserInitial = (name?: string) => {
    return name ? name.charAt(0).toUpperCase() : 'U';
  };

  const isLoading = isSubmitting || createCommentMutation.isPending || updateCommentMutation.isPending;
  const isOverLimit = watchedContent.length > 1000;

  return (
    <FormContainer
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {!isEditing && (
        <UserInfo>
          <div className="avatar">
            {getUserInitial(user?.name)}
          </div>
          <span className="name">{user?.name}</span>
        </UserInfo>
      )}

      <form onSubmit={handleSubmit(onSubmit)}>
        {submitError && (
          <ErrorMessage>
            <AlertCircle />
            {submitError}
          </ErrorMessage>
        )}

        <TextareaContainer>
          <Textarea
            {...register('content')}
            placeholder={placeholder}
            $hasError={!!errors.content}
            disabled={isLoading}
          />
          <CharCount $isOver={isOverLimit}>
            {watchedContent.length}/1000
          </CharCount>
        </TextareaContainer>

        {errors.content && (
          <ErrorMessage>
            <AlertCircle />
            {errors.content.message}
          </ErrorMessage>
        )}

        <Actions>
          <Tips>
            <div className="tip-item">• 다른 사용자를 존중하는 댓글을 작성해주세요</div>
            <div className="tip-item">• 스팸이나 광고성 댓글은 삭제될 수 있습니다</div>
          </Tips>

          <ActionGroup>
            {(isEditing || watchedContent.trim()) && (
              <CancelButton 
                type="button" 
                onClick={handleCancel}
                disabled={isLoading}
              >
                <X size={14} />
                {isEditing ? '취소' : '지우기'}
              </CancelButton>
            )}
            
            <Button
              type="submit"
              variant="primary"
              size="sm"
              isLoading={isLoading}
              disabled={isLoading || !watchedContent.trim() || isOverLimit}
              leftIcon={<Send />}
            >
              {isEditing ? '수정' : '댓글 작성'}
            </Button>
          </ActionGroup>
        </Actions>
      </form>
    </FormContainer>
  );
};

export default CommentForm;