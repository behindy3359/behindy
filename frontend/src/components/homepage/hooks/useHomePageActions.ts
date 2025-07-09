import { useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';

export const useHomePageActions = () => {
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();

  const handleWritePost = useCallback(() => {
    if (!isAuthenticated()) {
      router.push('/auth/login');
      return;
    }
    router.push('/community/write');
  }, [isAuthenticated, router]);

  const handleViewAllPosts = useCallback(() => {
    router.push('/community');
  }, [router]);

  return {
    handleWritePost,
    handleViewAllPosts,
  };
};