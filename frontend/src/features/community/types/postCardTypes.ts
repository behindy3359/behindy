import { Post } from "@/shared/types/community/community";

export interface PostCardProps {
  post: Post;
  showMetroLine?: boolean;
  compact?: boolean;
  onClick?: (post: Post) => void;
}
