import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/shared/store/uiStore';
import { api } from '@/shared/services/api/axiosConfig';
import { API_ENDPOINTS, apiErrorHandler } from '@/shared/utils/common/api';
import type { CommentListResponse } from '@/shared/types/community/community';

export const usePostComments = (postId: number) => {
  const queryClient = useQueryClient();
  const { show: showToast } = useToast();

  const { data: commentsData, isLoading: isLoadingComments, error: commentsError } = useQuery({
    queryKey: ['comments', postId],
    queryFn: async () => {
      try {
        return await api.get<CommentListResponse>(
          API_ENDPOINTS.COMMENTS.BY_POST(postId)
        );
      } catch (error) {
        const errorInfo = apiErrorHandler.parseError(error);
        console.error('Comments load error:', errorInfo);
        
        showToast({
          type: 'warning',
          message: `댓글 로드 실패: ${errorInfo.message}`
        });
        
        throw error;
      }
    },
    retry: 1,
  });

  const refreshComments = () => {
    queryClient.invalidateQueries({ queryKey: ['comments', postId] });
  };

  return {
    commentsData,
    isLoadingComments,
    commentsError,
    refreshComments,
  };
};
