/**
 * 관리자 대시보드 타입 정의
 */

export interface AdminStats {
  // 사용자 통계
  totalUsers: number;
  activeUsers: number;
  newUsersToday: number;
  newUsersThisWeek: number;

  // 게시글 통계
  totalPosts: number;
  activePosts: number;
  newPostsToday: number;
  newPostsThisWeek: number;

  // 댓글 통계
  totalComments: number;
  activeComments: number;
  newCommentsToday: number;
  newCommentsThisWeek: number;

  // AI 스토리 통계
  totalStories: number;
  storiesGeneratedToday: number;
  storiesGeneratedThisWeek: number;

  // 역 통계
  totalStations: number;
  totalLines: number;

  // 시스템 정보
  serverTime: string;
  serverStatus: 'HEALTHY' | 'WARNING' | 'ERROR';
}

export interface AdminUser {
  userId: number;
  userName: string;          // 마스킹됨
  userEmail: string;         // 마스킹됨
  role: 'ROLE_USER' | 'ROLE_ADMIN';
  postCount: number;
  commentCount: number;
  characterCount: number;
  createdAt: string;
  lastLoginAt?: string;
  isDeleted: boolean;
}

export interface AdminCheckResponse {
  isAdmin: boolean;
  message: string;
}
