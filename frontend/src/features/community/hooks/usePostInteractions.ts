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
    if (post) {
      router.push(`/community/${post.id}/edit`);
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
        console.log('Share cancelled or failed');
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