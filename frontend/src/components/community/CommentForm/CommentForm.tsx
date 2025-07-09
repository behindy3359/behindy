"use client";

import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

import { Send, X, AlertCircle } from 'lucide-react';
import { useMutation } from '@tanstack/react-query';
import { api } from '@/services/api/axiosConfig';

import type { Comment, CreateCommentRequest } from '@/types/community/community';
import { useAuthStore } from '@/store/authStore';
import { API_ENDPOINTS, apiErrorHandler } from '@/utils/common/api';
import { CommentFormData, CommentFormProps } from './types';


import { Button } from '@/components/ui/button/Button';
import { ActionGroup, Actions, CancelButton, CharCount, ErrorMessage, FormContainer, Textarea, TextareaContainer, Tips, UserInfo } from './styles';

export const commentSchema = yup.object({
  content: yup
    .string()
    .required('댓글 내용을 입력해주세요')
    .min(2, '댓글은 최소 2자 이상이어야 합니다')
    .max(1000, '댓글은 최대 1000자까지 입력 가능합니다'),
});

// Component
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

  useEffect(() => {
    if (autoFocus) {
      setFocus('content');
    }
  }, [autoFocus, setFocus]);

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
      const errorInfo = apiErrorHandler.parseError(error);
      setSubmitError(errorInfo.message);
  
      console.log('User action suggestion:', apiErrorHandler.getErrorAction(errorInfo.code));
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
      const errorInfo = apiErrorHandler.parseError(error);
      setSubmitError(errorInfo.message);
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