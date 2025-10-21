import React from 'react';
import { Input } from '@/shared/components/ui/input/Input';
import { getTitleCharacterCount, getContentCharacterCount, createPostPreview } from '../../../utils/postFormUtils';
import { TitleSection, ContentSection, PreviewMode } from '../styles';
import type { PostFormContentProps } from '../../../types/postFormTypes';

export const PostFormContent = React.memo<PostFormContentProps>(
  function PostFormContent({ 
    register, 
    watchedTitle, 
    watchedContent, 
    errors, 
    isLoading, 
    isPreview 
  }) {
    return (
      <>
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
                {getTitleCharacterCount(watchedTitle)}
              </div>
            </div>
          )}
        </TitleSection>

        {/* 내용 섹션 */}
        <ContentSection>
          {isPreview ? (
            <PreviewMode>
              <div 
                className="preview-content"
                dangerouslySetInnerHTML={{ 
                  __html: createPostPreview(watchedContent) 
                }}
              />
            </PreviewMode>
          ) : (
            <>
              <textarea
                {...register('content')}
                className="content-textarea"
                placeholder="내용을 입력하세요"
                disabled={isLoading}
                style={{
                  resize: 'vertical',
                  minHeight: '400px',
                }}
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
                {getContentCharacterCount(watchedContent)}
              </div>
            </>
          )}
        </ContentSection>
      </>
    );
  }
);