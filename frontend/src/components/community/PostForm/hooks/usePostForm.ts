import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useAuthStore } from '@/store/authStore';
import { api } from '@/services/api/axiosConfig';
import { API_ENDPOINTS, apiErrorHandler } from '@/utils/common/api';
import { ERROR_MESSAGES } from '@/utils/common/constants';
import { postFormSchema } from '../utils';
import { validateFormContent } from '../utils';
import type { PostFormData, UsePostFormReturn, PostFormProps } from '../types';
import type { Post, CreatePostRequest } from '@/types/community/community';

export const usePostForm = ({ 
  mode, 
  postId, 
  onSuccess, 
  onCancel 
}: PostFormProps): UsePostFormReturn => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { user, isAuthenticated } = useAuthStore();
  const [submitError, setSubmitError] = useState<string>('');
  const isEditing = mode === 'edit';

  // 인증 확인
  useEffect(() => {
    if (!isAuthenticated()) {
      router.push('/auth/login');
    }
  }, [isAuthenticated, router]);

  // 편집 모드일 때 기존 게시글 데이터 가져오기
  const { data: existingPost, isLoading: isLoadingPost, error: fetchError } = useQuery({
    queryKey: ['post', postId],
    queryFn: async () => {
      if (!postId) return null;
      try {
        return await api.get<Post>(API_ENDPOINTS.POSTS.BY_ID(postId));
      } catch (error) {
        console.error('게시글 로드 실패:', error);
        throw error;
      }
    },
    enabled: mode === 'edit' && !!postId,
    retry: 1,
  });

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
    reset
  } = useForm<PostFormData>({
    resolver: yupResolver(postFormSchema),
    defaultValues: {
      title: '',
      content: '',
    },
    mode: 'onChange',
  });

  // 기존 게시글 데이터로 폼 초기화
  useEffect(() => {
    if (mode === 'edit' && existingPost && !isLoadingPost) {
      reset({
        title: existingPost.title,
        content: existingPost.content,
      });
    }
  }, [mode, existingPost, isLoadingPost, reset]);

  const watchedTitle = watch('title', '');
  const watchedContent = watch('content', '');

  // 게시글 생성 뮤테이션
  const createPostMutation = useMutation({
    mutationFn: async (data: CreatePostRequest) => {
      try {
        console.group('📝 게시글 생성 시작');
        console.log('요청 데이터:', data);
        
        const response = await api.post<Post>(API_ENDPOINTS.POSTS.BASE, data);
        console.log('✅ 게시글 생성 성공:', response);
        console.groupEnd();
        return response;
      } catch (error) {
        console.group('❌ 게시글 생성 실패');
        console.error('에러:', error);
        console.groupEnd();
        throw error;
      }
    },
    onSuccess: (newPost) => {
      console.log('🎉 게시글 생성 완료:', newPost);
      queryClient.invalidateQueries({ queryKey: ['posts'] });
      onSuccess?.(newPost);
      router.push(`/community/${newPost.id}`);
    },
    onError: (error) => {
      const errorInfo = apiErrorHandler.parseError(error);
      setSubmitError(errorInfo.message);
    },
  });

  // 게시글 수정 뮤테이션
  const updatePostMutation = useMutation({
    mutationFn: async (data: CreatePostRequest) => {
      if (!postId) throw new Error('Post ID is required');
      try {
        console.log('게시글 수정 요청:', { postId, data });
        const response = await api.put<Post>(API_ENDPOINTS.POSTS.BY_ID(postId), data);
        console.log('게시글 수정 성공:', response);
        return response;
      } catch (error) {
        console.error('게시글 수정 실패:', error);
        throw error;
      }
    },
    onSuccess: (updatedPost) => {
      console.log('게시글 수정 완료:', updatedPost);
      queryClient.invalidateQueries({ queryKey: ['posts'] });
      queryClient.invalidateQueries({ queryKey: ['post', postId] });
      onSuccess?.(updatedPost);
      router.push(`/community/${updatedPost.id}`);
    },
    onError: (error) => {
      const errorInfo = apiErrorHandler.parseError(error);
      setSubmitError(errorInfo.message);
    },
  });

  const handleFormSubmit = async (data: PostFormData) => {
    try {
      console.log('폼 제출 시작:', { mode, data });
      setSubmitError('');
      
      if (!validateFormContent(data.title, data.content)) {
        setSubmitError(ERROR_MESSAGES.REQUIRED_FIELD);
        return;
      }
      
      const postData: CreatePostRequest = {
        title: data.title.trim(),
        content: data.content.trim(),
      };

      if (mode === 'create') {
        await createPostMutation.mutateAsync(postData);
      } else {
        await updatePostMutation.mutateAsync(postData);
      }
    } catch (error) {
      console.error('폼 제출 에러:', error);
    }
  };

  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    } else if (mode === 'edit' && postId) {
      router.push(`/community/${postId}`);
    } else {
      router.push('/community');
    }
  };

  const isLoading = isSubmitting || 
                   createPostMutation.isPending || 
                   updatePostMutation.isPending ||
                   isLoadingPost;

  return {
    // Form state
    register,
    handleSubmit: handleSubmit(handleFormSubmit),
    watchedTitle,
    watchedContent,
    errors,
    
    // Component state
    submitError,
    isLoading,
    isEditing,
    
    // Actions
    handleCancel,
    setError: setSubmitError,
    clearError: () => setSubmitError(''),
  };
};