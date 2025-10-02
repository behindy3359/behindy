import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useAuthStore } from '@/shared/store/authStore';
import { api } from '@/config/axiosConfig';
import { API_ENDPOINTS, apiErrorHandler } from '@/shared/utils/common/api';
import { ERROR_MESSAGES } from '@/shared/utils/common/constants';
import { postFormSchema } from '../utils/postFormUtils';
import { validateFormContent } from '../utils/postFormUtils';
import type { PostFormData, UsePostFormReturn, PostFormProps } from '../types/postFormTypes';
import type { Post, CreatePostRequest } from '@/shared/types/community/community';

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
  // useEffect(() => {
  //   if (!isAuthenticated()) {
  //     router.push('/auth/login');
  //   }
  // }, [isAuthenticated, router]);

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
        console.group('🚀 API 호출 시작');
        console.log('📍 URL:', API_ENDPOINTS.POSTS.BASE);
        console.log('📤 요청 데이터:', data);

        
        const response = await api.post<Post>(API_ENDPOINTS.POSTS.BASE, data);
        
        console.log('✅ API 응답 성공:', response);
        console.groupEnd();
        return response;
      } catch (error) {
        console.group('❌ API 호출 실패');
        console.error('API 에러:', error);
        console.log('에러 상태:', (error as any)?.response?.status);
        console.log('에러 데이터:', (error as any)?.response?.data);
        console.groupEnd();
        throw error;
      }
    },
    onSuccess: (newPost) => {
      console.log('🎉 생성 성공 콜백:', newPost);
      queryClient.invalidateQueries({ queryKey: ['posts'] });
      onSuccess?.(newPost);
      
      console.log('🔄 라우터 이동 시도...');
      router.push(`/community/${newPost.id}`);
    },
    onError: (error) => {
      console.group('💥 생성 실패 콜백');
      console.error('뮤테이션 에러:', error);
      const errorInfo = apiErrorHandler.parseError(error);
      console.log('파싱된 에러:', errorInfo);
      setSubmitError(errorInfo.message);
      console.groupEnd();
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
      console.group('📝 게시글 제출 프로세스 시작');
      console.log('1️⃣ 제출 데이터:', data);
      console.log('2️⃣ 현재 사용자:', user);
      console.log('3️⃣ 인증 상태:', isAuthenticated());
      
      setSubmitError('');
      
      if (!validateFormContent(data.title, data.content)) {
        console.error('❌ 폼 검증 실패');
        setSubmitError(ERROR_MESSAGES.REQUIRED_FIELD);
        console.groupEnd();
        return;
      }
      
      const postData: CreatePostRequest = {
        title: data.title.trim(),
        content: data.content.trim(),
      };
      
      console.log('5️⃣ API 요청 직전');
  
      if (mode === 'create') {
        console.log('📤 게시글 생성 요청 시작...');
        await createPostMutation.mutateAsync(postData);
      } else {
        console.log('📤 게시글 수정 요청 시작...');
        await updatePostMutation.mutateAsync(postData);
      }
      
      console.log('✅ 제출 완료!');
      console.groupEnd();
    } catch (error) {
      console.group('❌ 게시글 제출 실패');
      console.error('에러 상세:', error);
      console.log('에러 타입:', typeof error);
      console.log('에러 메시지:', (error as any)?.message);
      console.log('에러 응답:', (error as any)?.response);
      console.groupEnd();
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