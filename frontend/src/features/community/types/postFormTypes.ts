import { Post } from "@/shared/types/community/community";
import { UseFormRegister, FieldErrors } from 'react-hook-form';

export interface PostFormData {
  title: string;
  content: string;
}

export interface PostFormProps {
  mode: 'create' | 'edit';
  postId?: number;
  onSuccess?: (post: Post) => void;
  onCancel?: () => void;
}

export interface UsePostFormReturn {
  register: UseFormRegister<PostFormData>;
  handleSubmit: (e?: React.BaseSyntheticEvent) => Promise<void>;
  watchedTitle: string;
  watchedContent: string;
  errors: FieldErrors<PostFormData>;
  
  submitError: string;
  isLoading: boolean;
  isEditing: boolean;
  
  handleCancel: () => void;
  setError: (error: string) => void;
  clearError: () => void;
}

export interface PostFormHeaderProps {
  mode: 'create' | 'edit';
  isPreview: boolean;
  onTogglePreview: () => void;
  onBack: () => void;
}

export interface PostFormContentProps {
  register: UseFormRegister<PostFormData>;
  watchedTitle: string;
  watchedContent: string;
  errors: FieldErrors<PostFormData>;
  isLoading: boolean;
  isPreview: boolean;
}

export interface PostFormActionsProps {
  mode: 'create' | 'edit';
  isLoading: boolean;
  hasValidContent: boolean;
  authorName: string;
  onCancel: () => void;
}