import * as yup from 'yup';
import { INPUT_LIMITS } from '@/shared/utils/common/constants';
import { validators } from '@/shared/utils/common/validation';
import DOMPurify from 'dompurify';
import { marked } from 'marked';

export const postFormSchema = yup.object({
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

export const getHeaderTitle = (mode: 'create' | 'edit'): string => {
  return mode === 'create' ? '새 게시글 작성' : '게시글 수정';
};

export const getSubmitButtonText = (mode: 'create' | 'edit', isLoading: boolean): string => {
  if (isLoading) {
    return mode === 'create' ? '게시글을 작성하는 중...' : '게시글을 수정하는 중...';
  }
  return mode === 'create' ? '게시글 작성' : '수정 완료';
};

export const getPreviewToggleText = (isPreview: boolean): string => {
  return isPreview ? '편집' : '미리보기';
};

export const validateFormContent = (title: string, content: string): boolean => {
  return Boolean(title.trim() && content.trim());
};

export const formatCharacterCount = (current: number, max: number): string => {
  return `${current.toLocaleString()}/${max.toLocaleString()}`;
};

export const getTitleCharacterCount = (title: string): string => {
  return formatCharacterCount(title.length, INPUT_LIMITS.POST_TITLE_MAX_LENGTH);
};

export const getContentCharacterCount = (content: string): string => {
  return formatCharacterCount(content.length, INPUT_LIMITS.POST_CONTENT_MAX_LENGTH);
};

export const isOverLimit = (text: string, limit: number): boolean => {
  return text.length > limit;
};

/**
 * 안전한 마크다운 미리보기 생성 (XSS 방지)
 * DOMPurify를 사용하여 위험한 HTML/JavaScript 제거
 */
export const createPostPreview = (content: string): string => {
  if (!content) return '내용을 입력하세요';

  try {
    // marked로 마크다운을 HTML로 변환
    const rawHtml = marked.parse(content, { async: false }) as string;

    // DOMPurify로 안전한 HTML만 허용
    const sanitizedHtml = DOMPurify.sanitize(rawHtml, {
      ALLOWED_TAGS: [
        'p', 'br', 'strong', 'em', 'b', 'i', 'u',
        'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
        'ul', 'ol', 'li', 'blockquote', 'code', 'pre',
        'a', 'img'
      ],
      ALLOWED_ATTR: ['href', 'src', 'alt', 'title'],
      ALLOWED_URI_REGEXP: /^(?:(?:https?|mailto):|[^a-z]|[a-z+.-]+(?:[^a-z+.\-:]|$))/i,
    });

    return sanitizedHtml;
  } catch (error) {
    console.error('마크다운 렌더링 오류:', error);
    // 에러 발생 시 텍스트만 반환
    return content.replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }
};