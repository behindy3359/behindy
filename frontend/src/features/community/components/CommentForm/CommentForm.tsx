"use client";

import React, { useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import { AlertCircle } from 'lucide-react';
import { useAuthStore } from '@/shared/store/authStore';
import { useCommentForm } from '../../hooks/useCommentForm';
import { getTextareaPlaceholder } from '../../utils/commentFormUtils';
import { CommentFormHeader } from './inner/CommentFormHeader';
import { CommentTextArea } from './inner/CommentTextArea';
import { CommentFormActions } from './inner/CommentFormActions';
import { ErrorMessage, FormContainer } from './styles';
import type { CommentFormProps } from '../../types/commentFormTypes';

export const CommentForm: React.FC<CommentFormProps> = ({
  postId,
  editingComment,
  onSuccess,
  onCancel,
  placeholder,
  autoFocus = false
}) => {
  const { user } = useAuthStore();
  
  const {
    register,
    handleSubmit,
    watchedContent,
    errors,
    submitError,
    isLoading,
    isEditing,
    isOverLimit,
    handleCancel,
    setFocus,
  } = useCommentForm(postId, editingComment, onSuccess, onCancel);

  useEffect(() => {
    if (autoFocus) {
      setFocus('content');
    }
  }, [autoFocus, setFocus]);

  const textareaPlaceholder = getTextareaPlaceholder(isEditing, placeholder);
  const hasContent = watchedContent.trim().length > 0;

  return (
    <FormContainer
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <CommentFormHeader 
        userName={user?.name} 
        isEditing={isEditing} 
      />

      <form onSubmit={handleSubmit}>
        <AnimatePresence>
          {submitError && (
            <ErrorMessage
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
            >
              <AlertCircle />
              {submitError}
            </ErrorMessage>
          )}
        </AnimatePresence>

        <CommentTextArea
          register={register}
          placeholder={textareaPlaceholder}
          watchedContent={watchedContent}
          errors={errors}
          isLoading={isLoading}
          isOverLimit={isOverLimit}
        />

        {errors.content && (
          <ErrorMessage>
            <AlertCircle />
            {errors.content.message}
          </ErrorMessage>
        )}

        <CommentFormActions
          isEditing={isEditing}
          isLoading={isLoading}
          hasContent={hasContent}
          isOverLimit={isOverLimit}
          onCancel={handleCancel}
        />
      </form>
    </FormContainer>
  );
};

export default CommentForm;