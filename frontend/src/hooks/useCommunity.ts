import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api, buildApiUrl, API_ENDPOINTS } from '@/config';
import type { 
  Post, 
  Comment, 
  CreatePostRequest, 
  CreateCommentRequest,
  PaginatedResponse 
} from '@/types/community/community';

// 게시글 목록 조회
export const usePosts = (page = 0, size = 10, search = '') => {
  return useQuery({
    queryKey: ['posts', page, size, search],
    queryFn: async () => {
      const url = buildApiUrl.posts({ page, size });
      return await api.get<PaginatedResponse<Post>>(url);
    },
  });
};

// 단일 게시글 조회
export const usePost = (postId: number) => {
  return useQuery({
    queryKey: ['post', postId],
    queryFn: async () => {
      return await api.get<Post>(API_ENDPOINTS.POSTS.BY_ID(postId));
    },
    enabled: !!postId,
  });
};

// 댓글 목록 조회
export const useComments = (postId: number, page = 0, size = 10) => {
  return useQuery({
    queryKey: ['comments', postId, page, size],
    queryFn: async () => {
      const url = buildApiUrl.commentsByPost(postId, { page, size });
      return await api.get<PaginatedResponse<Comment>>(url);
    },
    enabled: !!postId,
  });
};

// 게시글 생성
export const useCreatePost = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: CreatePostRequest) => {
      return await api.post<Post>(API_ENDPOINTS.POSTS.BASE, data);
    },
    onSuccess: () => {
      // 게시글 목록 새로고침
      queryClient.invalidateQueries({ queryKey: ['posts'] });
    },
  });
};

// 게시글 수정
export const useUpdatePost = (postId: number) => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: CreatePostRequest) => {
      return await api.put<Post>(API_ENDPOINTS.POSTS.BY_ID(postId), data);
    },
    onSuccess: () => {
      // 해당 게시글과 목록 새로고침
      queryClient.invalidateQueries({ queryKey: ['post', postId] });
      queryClient.invalidateQueries({ queryKey: ['posts'] });
    },
  });
};

// 게시글 삭제
export const useDeletePost = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (postId: number) => {
      await api.delete(API_ENDPOINTS.POSTS.BY_ID(postId));
    },
    onSuccess: () => {
      // 게시글 목록 새로고침
      queryClient.invalidateQueries({ queryKey: ['posts'] });
    },
  });
};

// 댓글 생성
export const useCreateComment = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: CreateCommentRequest) => {
      return await api.post<Comment>(API_ENDPOINTS.COMMENTS.BASE, data);
    },
    onSuccess: (_, variables) => {
      // 해당 게시글의 댓글 목록 새로고침
      queryClient.invalidateQueries({ queryKey: ['comments', variables.postId] });
    },
  });
};

// 댓글 수정
export const useUpdateComment = (commentId: number, postId: number) => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: { content: string }) => {
      return await api.put<Comment>(API_ENDPOINTS.COMMENTS.BY_ID(commentId), data);
    },
    onSuccess: () => {
      // 댓글 목록 새로고침
      queryClient.invalidateQueries({ queryKey: ['comments', postId] });
    },
  });
};

// 댓글 삭제
export const useDeleteComment = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ commentId, postId }: { commentId: number; postId: number }) => {
      await api.delete(API_ENDPOINTS.COMMENTS.BY_ID(commentId));
      return { commentId, postId };
    },
    onSuccess: (data) => {
      // 댓글 목록 새로고침
      queryClient.invalidateQueries({ queryKey: ['comments', data.postId] });
    },
  });
};