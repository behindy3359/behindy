// 게시글 생성 요청
export interface CreatePostRequest {
  title: string;
  content: string;
}

// 게시글 정보
export interface Post {
  id: number;
  title: string;
  content: string;
  authorName: string;
  authorId: number;
  isEditable: boolean;
  isDeletable: boolean;
  createdAt: string;
  updatedAt: string;
}

// 댓글 생성 요청
export interface CreateCommentRequest {
  content: string;
  postId: number;
}

// 댓글 정보
export interface Comment {
  id: number;
  postId: number;
  content: string;
  authorName: string;
  authorId: number;
  isEditable: boolean;
  isDeletable: boolean;
  createdAt: string;
  updatedAt: string;
}

// 페이지네이션 응답
export interface PaginatedResponse<T> {
  content: T[]; // 또는 items, data 등 백엔드 구조에 따라
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  hasNext?: boolean;
  hasPrevious?: boolean;
}