import React from 'react';
import { UseFormRegister, FieldErrors } from 'react-hook-form';
import { CharCount, Textarea, TextareaContainer } from '../styles';
import type { CommentFormData } from '../types';

interface CommentTextAreaProps {
  register: UseFormRegister<CommentFormData>;
  placeholder: string;
  watchedContent: string;
  errors: FieldErrors<CommentFormData>;
  isLoading: boolean;
  isOverLimit: boolean;
}

export const CommentTextArea = React.memo<CommentTextAreaProps>(
  function CommentTextArea({ 
    register, 
    placeholder, 
    watchedContent, 
    errors, 
    isLoading, 
    isOverLimit 
  }) {
    return (
      <TextareaContainer>
        <Textarea
          {...register('content')}
          placeholder={placeholder}
          $hasError={!!errors.content}
          disabled={isLoading}
          style={{ 
            resize: 'none',
            minHeight: '80px',
            maxHeight: '80px'
          }}
        />
        <CharCount $isOver={isOverLimit}>
          {watchedContent.length}/1000
        </CharCount>
      </TextareaContainer>
    );
  }
);
