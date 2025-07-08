"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { 
  Save, 
  X, 
  ArrowLeft, 
  AlertCircle, 
  Eye,
  Edit3,
  FileText
} from 'lucide-react';
import { Button } from '@/components/ui/button/Button';
import { Input } from '@/components/ui/input/Input';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '@/services/api/axiosConfig';
import type { Post, CreatePostRequest } from '@/types/community/community';
import { useAuthStore } from '@/store/authStore';
import { 
  INPUT_LIMITS,
  SUCCESS_MESSAGES,
  ERROR_MESSAGES,
  LOADING_MESSAGES, 
  ACTION_MESSAGES 
} from '@/utils/common/constants';

import { validators } from '@/utils/common/validation';
import { apiErrorHandler, API_ENDPOINTS } from '@/utils/common/api';

// ================================================================
// Types & Validation
// ================================================================

interface PostFormData {
  title: string;
  content: string;
}

// 상수를 활용한 검증 스키마
const postSchema = yup.object({
  title: yup
    .string()
    .required('제목을 입력해주세요')
    .test('title-validation', function(value) {
      if (!value) return this.createError({ message: '제목을 입력해주세요' });
      
      const result = validators.postTitle(value);
      if (!result.isValid) {
        return this.createError({ message: result.message });
      }
      return true;
    }),
  content: yup
    .string()
    .required('내용을 입력해주세요')
    .test('content-validation', function(value) {
      if (!value) return this.createError({ message: '내용을 입력해주세요' });
      
      const result = validators.postContent(value);
      if (!result.isValid) {
        return this.createError({ message: result.message });
      }
      return true;
    }),
});

// ================================================================
// Component Props
// ================================================================

export interface PostFormProps {
  mode: 'create' | 'edit';
  postId?: number;
  onSuccess?: (post: Post) => void;
  onCancel?: () => void;
}

// ================================================================
// Styled Components
// ================================================================

const Container = styled.div`
  max-width: ${({ theme }) => theme.container.lg};
  margin: 0 auto;
  padding: ${({ theme }) => theme.spacing[6]};
  
  @media (max-width: 1200px) {
    padding: ${({ theme }) => theme.spacing[4]};
  }
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${({ theme }) => theme.spacing[8]};
  padding-bottom: ${({ theme }) => theme.spacing[4]};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border.light};
`;

const HeaderLeft = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[4]};
`;

const BackButton = styled(motion.button)`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[2]};
  padding: ${({ theme }) => theme.spacing[2]} ${({ theme }) => theme.spacing[4]};
  background: none;
  border: 1px solid ${({ theme }) => theme.colors.border.light};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  color: ${({ theme }) => theme.colors.text.secondary};
  cursor: pointer;
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  transition: all 0.2s ease;
  
  &:hover {
    background: ${({ theme }) => theme.colors.background.secondary};
    color: ${({ theme }) => theme.colors.text.primary};
  }
`;

const Title = styled.h1`
  font-size: ${({ theme }) => theme.typography.fontSize['2xl']};
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text.primary};
  margin: 0;
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[2]};
`;

const Actions = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing[4]};
  align-items: center;
`;

const FormContainer = styled(motion.div)`
  background: ${({ theme }) => theme.colors.background.primary};
  border-radius: ${({ theme }) => theme.borderRadius.xl};
  border: 1px solid ${({ theme }) => theme.colors.border.light};
  overflow: hidden;
  box-shadow: ${({ theme }) => theme.shadows.card};
`;

const FormSection = styled.div`
  padding: ${({ theme }) => theme.spacing[6]};
  
  &:not(:last-child) {
    border-bottom: 1px solid ${({ theme }) => theme.colors.border.light};
  }
`;

const TitleSection = styled(FormSection)`
  .title-input {
    .input-wrapper {
      margin-bottom: ${({ theme }) => theme.spacing[2]};
    }
    
    input {
      font-size: ${({ theme }) => theme.typography.fontSize.xl};
      font-weight: 600;
      border: none;
      padding: ${({ theme }) => theme.spacing[4]} 0;
      
      &:focus {
        box-shadow: none;
        border-bottom: 2px solid ${({ theme }) => theme.colors.primary[500]};
      }
      
      &::placeholder {
        color: ${({ theme }) => theme.colors.text.tertiary};
        font-weight: 400;
      }
    }
  }
  
  .char-count {
    text-align: right;
    font-size: ${({ theme }) => theme.typography.fontSize.xs};
    color: ${({ theme }) => theme.colors.text.tertiary};
  }
`;

const ContentSection = styled(FormSection)`
  .content-textarea {
    width: 100%;
    min-height: 400px;
    border: none;
    resize: vertical;
    font-size: ${({ theme }) => theme.typography.fontSize.base};
    line-height: 1.6;
    font-family: inherit;
    padding: 0;
    color: ${({ theme }) => theme.colors.text.primary};
    
    &:focus {
      outline: none;
    }
    
    &::placeholder {
      color: ${({ theme }) => theme.colors.text.tertiary};
    }
  }
  
  .char-count {
    text-align: right;
    font-size: ${({ theme }) => theme.typography.fontSize.xs};
    color: ${({ theme }) => theme.colors.text.tertiary};
    margin-top: ${({ theme }) => theme.spacing[2]};
  }
`;

const PreviewMode = styled.div`
  .preview-content {
    line-height: 1.8;
    color: ${({ theme }) => theme.colors.text.primary};
    white-space: pre-wrap;
    word-break: break-word;
    
    h1, h2, h3 {
      margin: 1.5em 0 0.5em 0;
      font-weight: 600;
    }
    
    p {
      margin: 0 0 1em 0;
    }
    
    strong {
      font-weight: 600;
    }
    
    em {
      font-style: italic;
    }
  }
`;

const BottomActions = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: ${({ theme }) => theme.spacing[6]};
  background: ${({ theme }) => theme.colors.background.secondary};
  border-top: 1px solid ${({ theme }) => theme.colors.border.light};
`;

const ActionGroup = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing[4]};
  align-items: center;
`;

const PreviewToggle = styled.button<{ $active: boolean }>`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[2]};
  padding: ${({ theme }) => theme.spacing[2]} ${({ theme }) => theme.spacing[4]};
  border: 1px solid ${({ theme }) => theme.colors.border.light};
  background: ${({ $active, theme }) => 
    $active ? theme.colors.primary[500] : theme.colors.background.primary};
  color: ${({ $active, theme }) => 
    $active ? theme.colors.text.inverse : theme.colors.text.secondary};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  cursor: pointer;
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  transition: all 0.2s ease;
  
  &:hover {
    background: ${({ $active, theme }) => 
      $active ? theme.colors.primary[600] : theme.colors.background.secondary};
  }
`;

const ErrorMessage = styled(motion.div)`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[2]};
  padding: ${({ theme }) => theme.spacing[4]};
  background: #fef2f2;
  border: 1px solid #fecaca;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  color: ${({ theme }) => theme.colors.error};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  margin-bottom: ${({ theme }) => theme.spacing[4]};
`;

const LoadingOverlay = styled(motion.div)`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10;
`;

// ================================================================
// Component
// ================================================================

export const PostForm: React.FC<PostFormProps> = ({ 
  mode, 
  postId,
  onSuccess,
  onCancel 
}) => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { user, isAuthenticated } = useAuthStore();
  const [isPreview, setIsPreview] = useState(false);
  const [submitError, setSubmitError] = useState<string>('');

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
    resolver: yupResolver(postSchema),
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
      } catch (error: any) {
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
    onError: (error: any) => {
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
    onError: (error: any) => {
      const errorInfo = apiErrorHandler.parseError(error);
      setSubmitError(errorInfo.message);
    },
  });

  const onSubmit = async (data: PostFormData) => {
    try {
      console.log('폼 제출 시작:', { mode, data });
      setSubmitError('');
      
      if (!data.title?.trim() || !data.content?.trim()) {
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

  const handleBack = () => {
    router.push('/community');
  };

  const isLoading = isSubmitting || 
                   createPostMutation.isPending || 
                   updatePostMutation.isPending;

  // 로딩 중일 때
  if (mode === 'edit' && isLoadingPost) {
    return (
      <Container>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          height: '400px' 
        }}>
          {LOADING_MESSAGES.POST_LOADING}
        </div>
      </Container>
    );
  }

  // 게시글 로드 실패
  if (mode === 'edit' && fetchError) {
    return (
      <Container>
        <div style={{ 
          textAlign: 'center', 
          padding: '40px',
          color: '#ef4444' 
        }}>
          {ERROR_MESSAGES.UNKNOWN_ERROR}
          <br />
          <button 
            onClick={handleBack}
            style={{ 
              marginTop: '16px',
              padding: '8px 16px',
              background: '#667eea',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer'
            }}
          >
            {ACTION_MESSAGES.GO_TO_LIST}
          </button>
        </div>
      </Container>
    );
  }

  // 편집 권한 확인
  if (mode === 'edit' && existingPost && existingPost.authorId !== user?.id) {
    return (
      <Container>
        <div style={{ 
          textAlign: 'center', 
          padding: '40px',
          color: '#ef4444' 
        }}>
          {ERROR_MESSAGES.POST_PERMISSION_ERROR}
          <br />
          <button 
            onClick={() => router.push(`/community/${postId}`)}
            style={{ 
              marginTop: '16px',
              padding: '8px 16px',
              background: '#667eea',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer'
            }}
          >
            {ACTION_MESSAGES.GO_BACK}
          </button>
        </div>
      </Container>
    );
  }

  return (
    <Container>
      <Header>
        <HeaderLeft>
          <BackButton
            onClick={handleBack}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <ArrowLeft size={16} />
            {ACTION_MESSAGES.GO_TO_LIST}
          </BackButton>
          
          <Title>
            {mode === 'create' ? (
              <>
                <Edit3 size={24} />
                {ACTION_MESSAGES.WRITE_POST}
                {}
              </>
            ) : (
              <>
                <FileText size={24} />
                {ACTION_MESSAGES.EDIT_POST}
              </>
            )}
          </Title>
        </HeaderLeft>

        <Actions>
          <PreviewToggle
            $active={isPreview}
            onClick={() => setIsPreview(!isPreview)}
            type="button"
          >
            <Eye size={16} />
            {isPreview ? '편집' : '미리보기'}
          </PreviewToggle>
        </Actions>
      </Header>

      {submitError && (
        <ErrorMessage
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <AlertCircle size={16} />
          {submitError}
        </ErrorMessage>
      )}

      <FormContainer
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        style={{ position: 'relative' }}
      >
        <form onSubmit={handleSubmit(onSubmit)}>
          {/* 제목 섹션 */}
          <TitleSection>
            {isPreview ? (
              <h1 style={{ 
                fontSize: '20px', 
                fontWeight: '600', 
                margin: 0,
                color: '#111827',
                minHeight: '32px'
              }}>
                {watchedTitle || '제목을 입력하세요'}
              </h1>
            ) : (
              <div className="title-input">
                <Input
                  {...register('title')}
                  placeholder="제목을 입력하세요"
                  error={errors.title?.message}
                  fullWidth
                />
                <div className="char-count">
                  {watchedTitle.length}/{INPUT_LIMITS.POST_TITLE_MAX_LENGTH} {/* 🔥 상수 사용 */}
                </div>
              </div>
            )}
          </TitleSection>

          {/* 내용 섹션 */}
          <ContentSection>
            {isPreview ? (
              <PreviewMode>
                <div className="preview-content">
                  {watchedContent || '내용을 입력하세요'}
                </div>
              </PreviewMode>
            ) : (
              <>
                <textarea
                  {...register('content')}
                  className="content-textarea"
                  placeholder="내용을 입력하세요&#10;&#10;마크다운 문법을 지원합니다:&#10;- **굵은 글씨**&#10;- *기울인 글씨*&#10;- # 제목&#10;- ## 소제목"
                  disabled={isLoading}
                />
                {errors.content && (
                  <div style={{ 
                    color: '#ef4444', 
                    fontSize: '14px', 
                    marginTop: '8px' 
                  }}>
                    {errors.content.message}
                  </div>
                )}
                <div className="char-count">
                  {watchedContent.length}/{INPUT_LIMITS.POST_CONTENT_MAX_LENGTH} {/* 🔥 상수 사용 */}
                </div>
              </>
            )}
          </ContentSection>

          {/* 하단 액션 */}
          <BottomActions>
            <ActionGroup>
              <span style={{ fontSize: '14px', color: '#6b7280' }}>
                작성자: <strong>{user?.name || '사용자'}</strong>
              </span>
            </ActionGroup>

            <ActionGroup>
              <Button
                type="button"
                variant="ghost"
                onClick={handleCancel}
                disabled={isLoading}
              >
                <X size={16} />
                {ACTION_MESSAGES.CANCEL}
              </Button>
              
              <Button
                type="submit"
                variant="primary"
                isLoading={isLoading}
                disabled={isLoading || !watchedTitle.trim() || !watchedContent.trim()}
                leftIcon={<Save />}
              >
                {mode === 'create' ? '게시글 작성' : '수정 완료'}
              </Button>
            </ActionGroup>
          </BottomActions>
        </form>

        {/* 로딩 오버레이 */}
        {isLoading && (
          <LoadingOverlay
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <div style={{ 
              background: 'white', 
              padding: '20px', 
              borderRadius: '8px',
              boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
            }}>
              {mode === 'create' ? '게시글을 작성하는 중...' : '게시글을 수정하는 중...'}
            </div>
          </LoadingOverlay>
        )}
      </FormContainer>
    </Container>
  );
};

export default PostForm;