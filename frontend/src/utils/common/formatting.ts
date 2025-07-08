// src/utils/common/formatting.ts
import { formatDistanceToNow } from 'date-fns';
import { ko } from 'date-fns/locale';

/**
 * 시간 포맷팅 유틸리티 (기존 프로젝트에서 실제 사용)
 */
export const formatters = {
  /**
   * 상대적 시간 포맷팅 (예: "3분 전", "2시간 전")
   * 기존: formatTimeAgo, formatRelativeTime 통합
   */
  relativeTime: (dateString: string | Date): string => {
    const date = typeof dateString === 'string' ? new Date(dateString) : dateString;
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return '방금 전';
    if (diffInMinutes < 60) return `${diffInMinutes}분 전`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}시간 전`;
    if (diffInMinutes < 10080) return `${Math.floor(diffInMinutes / 1440)}일 전`;
    
    return formatDistanceToNow(date, { 
      addSuffix: true, 
      locale: ko 
    });
  },

  /**
   * 절대적 시간 포맷팅 (예: "2024년 3월 15일 오후 2:30")
   * 기존: formatDate, formatAbsoluteTime 통합
   */
  absoluteTime: (dateString: string | Date, options?: {
    includeTime?: boolean;
  }): string => {
    const date = typeof dateString === 'string' ? new Date(dateString) : dateString;
    const { includeTime = true } = options || {};

    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      ...(includeTime && {
        hour: '2-digit',
        minute: '2-digit',
      }),
    });
  },

  /**
   * 텍스트 길이 제한 및 말줄임표 추가
   * 기존: truncateText, createPostPreview에서 사용
   */
  truncateText: (text: string, maxLength: number): string => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  },

  /**
   * HTML 태그 제거 (게시글 미리보기용)
   * 기존: stripHtml, createPostPreview에서 사용
   */
  stripHtml: (html: string): string => {
    if (typeof document !== 'undefined') {
      const div = document.createElement('div');
      div.innerHTML = html;
      return div.textContent || div.innerText || '';
    } else {
      return html.replace(/<[^>]*>/g, '');
    }
  },

  /**
   * 사용자 이니셜 생성
   * 기존: getUserInitial에서 사용
   */
  getUserInitial: (name: string): string => {
    if (!name || !name.trim()) return 'U';
    return name.charAt(0).toUpperCase();
  },

  /**
   * 게시글 미리보기 생성
   * 기존: createPostPreview에서 사용
   */
  createPostPreview: (content: string, maxLength = 120): string => {
    const plainText = formatters.stripHtml(content);
    return formatters.truncateText(plainText, maxLength);
  },
};