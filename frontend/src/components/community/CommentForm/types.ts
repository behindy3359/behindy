import { Comment } from "@/types/community/community";

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
