import { Comment } from "@/types/community/community";
import { UseFormRegister, FieldErrors } from 'react-hook-form';

export interface CommentFormData {
  content: string;
}

export interface CommentFormProps {
  postId: number;
  parentCommentId?: number;
  editingComment?: Comment;
  onSuccess?: () => void;
  onCancel?: () => void;
  placeholder?: string;
  autoFocus?: boolean;
}

export interface UseCommentFormReturn {
  // Form state
  register: UseFormRegister<CommentFormData>;
  handleSubmit: (e?: React.BaseSyntheticEvent) => Promise<void>;
  watchedContent: string;
  errors: FieldErrors<CommentFormData>;
  
  // Component state
  submitError: string;
  isLoading: boolean;
  isEditing: boolean;
  isOverLimit: boolean;
  
  // Actions
  handleCancel: () => void;
  setFocus: (name: keyof CommentFormData) => void;
}