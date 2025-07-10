import { useQuery } from '@tanstack/react-query';
import { publicApi } from '@/services/api/axiosConfig';
import { PostListResponse } from '@/types/community/community';
import { buildApiUrl } from '@/utils/common/api';

export const usePosts = (
  page: number = 0, 
  size: number = 12, 
  search: string = '', 
  sort: string = 'latest'
) => {
  return useQuery({
    queryKey: ['posts', page, size, search, sort],
    queryFn: async () => {
      const url = buildApiUrl.posts({ page, size });
      return await publicApi.getPosts<PostListResponse>(url);
    },
    staleTime: 5 * 60 * 1000, // 5분
    retry: 1,
  });
};
