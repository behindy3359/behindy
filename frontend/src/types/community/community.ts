// ================================================================
// 게시글 관련 타입
// ================================================================

// 게시글 생성 요청 (백엔드 PostCreateRequest와 일치)
export interface CreatePostRequest {
  title: string;
  content: string;
}

// 게시글 수정 요청 (백엔드 PostUpdateRequest와 일치)
export interface UpdatePostRequest {
  title: string;
  content: string;
}

// 게시글 응답 (백엔드 PostResponse와 일치)
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

// 게시글 목록 응답 (백엔드 PostListResponse와 일치)
export interface PostListResponse {
  posts: Post[];           // ✅ content가 아닌 posts
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
}

// ================================================================
// 댓글 관련 타입
// ================================================================

// 댓글 생성 요청 (백엔드 CommentCreateRequest와 일치)
export interface CreateCommentRequest {
  content: string;
  postId: number;
  // parentCommentId는 백엔드에 없으므로 제거
}

// 댓글 수정 요청 (백엔드 CommentUpdateRequest와 일치)
export interface UpdateCommentRequest {
  content: string;
}

// 댓글 응답 (백엔드 CommentResponse와 일치)
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

// 댓글 목록 응답 (백엔드 CommentListResponse와 일치)
export interface CommentListResponse {
  comments: Comment[];      // ✅ content가 아닌 comments
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  hasNext: boolean;
  hasPrevious: boolean;
}

// ================================================================
// 기존 범용 타입들 (호환성 유지)
// ================================================================

// 범용 페이지네이션 (다른 API에서 사용할 수 있도록 유지)
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

// ================================================================
// 추가 기능용 타입들 (프론트엔드 전용)
// ================================================================

// 검색 및 필터 요청
export interface PostSearchRequest {
  query?: string;
  category?: string;
  authorId?: number;
  startDate?: string;
  endDate?: string;
  tags?: string[];
}

// 게시글 통계 (프론트엔드에서 계산용)
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

// 댓글 통계 (프론트엔드에서 계산용)
export interface CommentStats {
  totalComments: number;
  todayComments: number;
  averageCommentsPerPost: number;
}

// 사용자 활동 통계 (프론트엔드에서 계산용)
export interface UserActivity {
  postsCount: number;
  commentsCount: number;
  likesReceived: number;
  joinDate: string;
  lastActivity: string;
}

// ================================================================
// API 응답 래퍼 타입들
// ================================================================

// 성공 응답
export interface ApiSuccessResponse<T = any> {
  success: true;
  data: T;
  message?: string;
}

// 에러 응답
export interface ApiErrorResponse {
  success: false;
  error: {
    code: string;
    message: string;
    details?: any;
  };
}

// 통합 API 응답
export type ApiResponse<T = any> = ApiSuccessResponse<T> | ApiErrorResponse;