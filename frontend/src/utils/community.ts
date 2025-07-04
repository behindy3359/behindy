import { formatDistanceToNow } from 'date-fns';
import { ko } from 'date-fns/locale';
import type { Comment } from '@/types/community/community';

// 상대적 시간 포맷팅
export const formatRelativeTime = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
  
  if (diffInMinutes < 1) return '방금 전';
  if (diffInMinutes < 60) return `${diffInMinutes}분 전`;
  if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}시간 전`;
  
  return formatDistanceToNow(date, { 
    addSuffix: true, 
    locale: ko 
  });
};

// 절대적 시간 포맷팅
export const formatAbsoluteTime = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

// HTML 태그 제거 (게시글 미리보기용)
export const stripHtml = (html: string): string => {
  return html.replace(/<[^>]*>/g, '');
};

// 텍스트 길이 제한
export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

// 게시글 미리보기 생성
export const createPostPreview = (content: string, maxLength = 120): string => {
  const plainText = stripHtml(content);
  return truncateText(plainText, maxLength);
};

// 사용자 이니셜 생성
export const getUserInitial = (name: string): string => {
  return name ? name.charAt(0).toUpperCase() : 'U';
};

// 핫 게시글 판단 로직
export const isHotPost = (post: { createdAt: string; commentCount?: number; likeCount?: number }): boolean => {
  const postDate = new Date(post.createdAt);
  const now = new Date();
  const hoursDiff = (now.getTime() - postDate.getTime()) / (1000 * 60 * 60);
  
  // 24시간 내 게시글이고, 댓글이나 좋아요가 많은 경우
  return hoursDiff < 24 && ((post.commentCount || 0) >= 5 || (post.likeCount || 0) >= 10);
};

// 게시글 카테고리 색상 매핑
export const getCategoryColor = (category: string): string => {
  const colorMap: Record<string, string> = {
    '일반': '#6b7280',
    '질문': '#3b82f6',
    '정보': '#10b981',
    '공지': '#f59e0b',
    '자유': '#8b5cf6',
    '게임': '#ef4444',
  };
  
  return colorMap[category] || '#6b7280';
};
