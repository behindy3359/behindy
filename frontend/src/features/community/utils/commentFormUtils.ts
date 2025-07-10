import * as yup from 'yup';

export const commentSchema = yup.object({
  content: yup
    .string()
    .required('댓글 내용을 입력해주세요')
    .min(2, '댓글은 최소 2자 이상이어야 합니다')
    .max(1000, '댓글은 최대 1000자까지 입력 가능합니다'),
});

export const getTextareaPlaceholder = (isEditing: boolean, customPlaceholder?: string): string => {
  if (customPlaceholder) return customPlaceholder;
  return isEditing ? '댓글을 수정하세요...' : '댓글을 입력하세요...';
};

export const getSubmitButtonText = (isEditing: boolean, isLoading: boolean): string => {
  if (isLoading) {
    return isEditing ? '수정 중...' : '작성 중...';
  }
  return isEditing ? '수정' : '댓글 작성';
};

export const getCancelButtonText = (isEditing: boolean): string => {
  return isEditing ? '취소' : '지우기';
};