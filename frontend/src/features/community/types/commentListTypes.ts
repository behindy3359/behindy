import { Comment } from "@/shared/types/community/community";

export interface CommentListProps {
  comments: Comment[];
  onUpdate?: () => void;
  maxDepth?: number;
  showReplies?: boolean;
}