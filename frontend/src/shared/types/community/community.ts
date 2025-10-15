// ================================================================
// 게시글 관련 타입
// ================================================================

// 게시글 생성 요청
export interface CreatePostRequest {
  title: string;
  content: string;
}

// 게시글 수정 요청
export interface UpdatePostRequest {
  title: string;
  content: string;
}

// 게시글 응답
export interface Post {
  id: number;
  title: string;
  content: string;
  authorName: string;
  authorId: number;
  viewCount: number;
  commentCount: number;
  isEditable: boolean;
  isDeletable: boolean;
  createdAt: string;
  updatedAt: string;
}

// 게시글 목록 응답
export interface PostListResponse {
  posts: Post[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
}

// ================================================================
// 댓글 관련 타입
// ================================================================

// 댓글 생성 요청
export interface CreateCommentRequest {
  content: string;
  postId: number;
}

// 댓글 수정 요청
export interface UpdateCommentRequest {
  content: string;
}

// 댓글 응답
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

// 댓글 목록 응답
export interface CommentListResponse {
  comments: Comment[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  hasNext: boolean;
  hasPrevious: boolean;
}

// ================================================================
// 범용 타입들
// ================================================================

// 범용 페이지네이션
export interface PaginatedResponse<T> {
  content: T[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  hasNext?: boolean;
  hasPrevious?: boolean;
  first?: boolean;
  last?: boolean;
}

// 검색 및 필터 요청
export interface PostSearchRequest {
  query?: string;
  category?: string;
  authorId?: number;
  startDate?: string;
  endDate?: string;
  tags?: string[];
}

// 게시글 통계
export interface PostStats {
  totalPosts: number;
  todayPosts: number;
  totalComments: number;
  totalViews: number;
  activeUsers: number;
  popularTags: Array<{
    name: string;
    count: number;
  }>;
}

// 댓글 통계
export interface CommentStats {
  totalComments: number;
  todayComments: number;
  averageCommentsPerPost: number;
}

// 사용자 활동 통계
export interface UserActivity {
  postsCount: number;
  commentsCount: number;
  likesReceived: number;
  joinDate: string;
  lastActivity: string;
}