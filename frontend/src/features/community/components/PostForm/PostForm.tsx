"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import { AnimatePresence } from 'framer-motion';
import { AlertCircle } from 'lucide-react';
import { useAuthStore } from '@/shared/store/authStore';
import { PageContainer } from '@/shared/styles/commonStyles';
import { usePostForm } from '../../hooks/usePostForm';
import { usePostFormPreview } from '../../hooks/usePostFormPreview';
import { validateFormContent } from '../../utils/postFormUtils';
import { PostFormHeader } from './inner/PostFormHeader';
import { PostFormContent } from './inner/PostFormContent';
import { PostFormActions } from './inner/PostFormActions';
import { FormContainer, ErrorMessage, LoadingOverlay } from './styles';
import type { PostFormProps } from '../../types/postFormTypes';

export const PostForm: React.FC<PostFormProps> = ({ 
  mode, 
  postId,
  onSuccess,
  onCancel 
}) => {
  const router = useRouter();
  const { user } = useAuthStore();
  
  const {
    register,
    handleSubmit,
    watchedTitle,
    watchedContent,
    errors,
    submitError,
    isLoading,
    handleCancel,
  } = usePostForm({ mode, postId, onSuccess, onCancel });

  const { isPreview, togglePreview } = usePostFormPreview();

  const handleBack = () => {
    router.push('/community');
  };

  const hasValidContent = validateFormContent(watchedTitle, watchedContent);

  return (
    <PageContainer>
      <PostFormHeader
        mode={mode}
        isPreview={isPreview}
        onTogglePreview={togglePreview}
        onBack={handleBack}
      />

      <AnimatePresence>
        {submitError && (
          <ErrorMessage
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <AlertCircle size={16} />
            {submitError}
          </ErrorMessage>
        )}
      </AnimatePresence>

      <FormContainer
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <form onSubmit={handleSubmit}>
          <PostFormContent
            register={register}
            watchedTitle={watchedTitle}
            watchedContent={watchedContent}
            errors={errors}
            isLoading={isLoading}
            isPreview={isPreview}
          />

          <PostFormActions
            mode={mode}
            isLoading={isLoading}
            hasValidContent={hasValidContent}
            authorName={user?.name || '사용자'}
            onCancel={handleCancel}
          />
        </form>

        {/* 로딩 오버레이 */}
        <AnimatePresence>
          {isLoading && (
            <LoadingOverlay
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <div className="loading-content">
                {mode === 'create' ? '게시글을 작성하는 중...' : '게시글을 수정하는 중...'}
              </div>
            </LoadingOverlay>
          )}
        </AnimatePresence>
      </FormContainer>
    </PageContainer>
  );
};

export default PostForm;