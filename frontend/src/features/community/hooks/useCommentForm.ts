import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useMutation } from '@tanstack/react-query';
import { api } from '@/services/api/axiosConfig';
import { API_ENDPOINTS, apiErrorHandler } from '@/utils/common/api';
import { commentSchema } from '../utils/commentFormUtils';
import type { CommentFormData, UseCommentFormReturn } from '../types/commentFormTypes';
import type { Comment, CreateCommentRequest } from '@/types/community/community';

export const useCommentForm = (
  postId: number,
  editingComment?: Comment,
  onSuccess?: () => void,
  onCancel?: () => void
): UseCommentFormReturn => {
  const [submitError, setSubmitError] = useState<string>('');
  const isEditing = !!editingComment;

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

  const handleFormSubmit = async (data: CommentFormData) => {
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

  const isLoading = isSubmitting || createCommentMutation.isPending || updateCommentMutation.isPending;
  const isOverLimit = watchedContent.length > 1000;

  return {
    // Form state
    register,
    handleSubmit: handleSubmit(handleFormSubmit),
    watchedContent,
    errors,
    
    // Component state
    submitError,
    isLoading,
    isEditing,
    isOverLimit,
    
    // Actions
    handleCancel,
    setFocus,
  };
};