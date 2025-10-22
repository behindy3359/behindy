import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuthStore } from '@/shared/store/authStore';
import { useToast } from '@/shared/store/uiStore';
import { api } from '@/config/axiosConfig';
import { API_ENDPOINTS, apiErrorHandler } from '@/shared/utils/common/api';
import { SUCCESS_MESSAGES, CONFIRM_MESSAGES } from '@/shared/utils/common/constants';
import type { Post } from '@/shared/types/community/community';

export const usePostDetail = (postId: number) => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { show: showToast } = useToast();
  const { user, isAuthenticated } = useAuthStore();
  const [apiError, setApiError] = useState<string | null>(null);

  const { data: post, isLoading, error } = useQuery({
    queryKey: ['post', postId],
    queryFn: async () => {
      try {
        return await api.get<Post>(API_ENDPOINTS.POSTS.BY_ID(postId));
      } catch (error) {
        const errorInfo = apiErrorHandler.parseError(error);
        setApiError(errorInfo.message);
        throw error;
      }
    },
    retry: (failureCount, error) => {
      const errorInfo = apiErrorHandler.parseError(error);
      if (errorInfo.code === 'NETWORK_ERROR' && failureCount < 2) {
        return true;
      }
      return false;
    },
  });

  const deletePostMutation = useMutation({
    mutationFn: async () => {
      return await api.delete(API_ENDPOINTS.POSTS.BY_ID(postId));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
      showToast({
        type: 'success',
        message: SUCCESS_MESSAGES.POST_DELETED
      });
      router.push('/community');
    },
    onError: (error: unknown) => {
      console.error('[usePostDetail] 삭제 실패:', error);
      const errorInfo = apiErrorHandler.parseError(error);
      showToast({
        type: 'error',
        message: errorInfo.message
      });

      const actionInfo = apiErrorHandler.getErrorAction(errorInfo.code);
      if (actionInfo.action === 'login') {
        setTimeout(() => {
          router.push('/auth/login');
        }, 2000);
      }
    },
  });

  const handleDelete = async () => {
    if (window.confirm(CONFIRM_MESSAGES.DELETE_POST)) {
      try {
        await deletePostMutation.mutateAsync();
      } catch (error) {
        console.error('❌ [usePostDetail] Delete post error:', error);
      }
    }
  };

  const canEdit = Boolean(post && user && (post.authorId === user.id || post.isEditable));
  const canDelete = Boolean(post && user && (post.authorId === user.id || post.isDeletable));

  return {
    post,
    user,
    apiError,
    
    isLoading,
    error,
    isAuthenticated,
    
    canEdit,
    canDelete,
    
    handleDelete,
    
    isDeleting: deletePostMutation.isPending,
  };
};