import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useToast } from '@/shared/store/uiStore';
import { SUCCESS_MESSAGES } from '@/shared/utils/common/constants';
import { domUtils } from '@/shared/utils/common';
import type { Post } from '@/shared/types/community/community';

export const usePostInteractions = (post: Post | undefined) => {
  const router = useRouter();
  const { show: showToast } = useToast();
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);

  const handleBack = useCallback(() => {
    router.push('/community');
  }, [router]);

  const handleEdit = useCallback(() => {
    console.log('🔵 [usePostInteractions] handleEdit 호출됨', { postId: post?.id });
    if (post) {
      const editUrl = `/community/${post.id}/edit`;
      console.log('🔵 [usePostInteractions] 수정 페이지로 이동:', editUrl);
      try {
        router.push(editUrl);
        console.log('✅ [usePostInteractions] router.push 호출 성공');
      } catch (error) {
        console.error('❌ [usePostInteractions] router.push 실패:', error);
      }
    } else {
      console.warn('⚠️ [usePostInteractions] post가 없어서 수정 페이지로 이동 불가');
    }
  }, [router, post]);

  const handleLike = useCallback(() => {
    setIsLiked(!isLiked);
    setLikeCount(prev => isLiked ? prev - 1 : prev + 1);
  }, [isLiked]);

  const handleShare = useCallback(async () => {
    if (!post) return;

    if (navigator.share) {
      try {
        await navigator.share({
          title: post.title,
          url: window.location.href,
        });
      } catch (error) {
        // Share cancelled or failed - silently handle
      }
    } else {
      const success = await domUtils.clipboard.writeText(window.location.href);
      
      if (success) {
        showToast({ 
          type: 'success', 
          message: SUCCESS_MESSAGES.COPIED_TO_CLIPBOARD 
        });
      } else {
        showToast({ 
          type: 'error', 
          message: '링크 복사에 실패했습니다.' 
        });
      }
    }
  }, [post, showToast]);

  return {
    // 상태
    isLiked,
    likeCount,
    
    // 액션
    handleBack,
    handleEdit,
    handleLike,
    handleShare,
  };
};