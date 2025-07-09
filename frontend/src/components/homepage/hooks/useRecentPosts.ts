import { publicApi } from "@/services/api/axiosConfig";
import { PostListResponse } from "@/types/community/community";
import { buildApiUrl } from "@/utils/common/api";
import { useQuery } from "@tanstack/react-query";

export const useRecentPosts = (limit: number = 6) => {
  return useQuery({
    queryKey: ['recent-posts', limit],
    queryFn: async () => {
      const url = buildApiUrl.posts({ page: 0, size: limit });
      return await publicApi.getPosts<PostListResponse>(url);
    },
    staleTime: 2 * 60 * 1000,
    retry: 1,
  });
};