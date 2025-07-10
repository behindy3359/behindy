import { useCallback } from 'react';
import { useRouter } from 'next/navigation';
import type { Post } from '@/types/community/community';

export const usePostCardActions = (post: Post, onClick?: (post: Post) => void) => {
  const router = useRouter();

  const handleClick = useCallback(() => {
    if (onClick) {
      onClick(post);
    } else {
      router.push(`/community/${post.id}`);
    }
  }, [post.id, post, onClick, router]);

  return {
    handleClick,
  };
};