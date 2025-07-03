// types/community/community.ts 파일을 다음과 같이 수정하세요

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
  // 추가 필드
  commentCount?: number;
  likeCount?: number;
  viewCount?: number;
  category?: string;
}

// 댓글 생성 요청 (수정됨)
export interface CreateCommentRequest {
  content: string;
  postId: number;
  parentCommentId?: number; // 대댓글용 추가
}

// 댓글 정보 (수정됨)
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
  // 대댓글 시스템용 추가 필드
  parentCommentId?: number;
  depth?: number;
  children?: Comment[];
  // 상호작용용 추가 필드
  likeCount?: number;
  isLiked?: boolean;
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