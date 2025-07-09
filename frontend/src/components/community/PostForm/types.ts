import { Post } from "@/types/community/community";

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