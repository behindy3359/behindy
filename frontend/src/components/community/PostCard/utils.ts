import { Post } from "@/types/community/community";

export const extractMetroLine = (content: string): string | null => {
  const lineMatch = content.match(/([1-4])호선/);
  return lineMatch ? lineMatch[1] : null;
};

const HOT_POST_CACHE = new Map<string, { result: boolean; timestamp: number }>();
const CACHE_DURATION = 60000;

export const isHotPost = (post: Post): boolean => {
  const cacheKey = `${post.id}-${post.createdAt}`;
  const cached = HOT_POST_CACHE.get(cacheKey);
  
  if (cached && (Date.now() - cached.timestamp) < CACHE_DURATION) {
    return cached.result;
  }
  
  const postDate = new Date(post.createdAt);
  const now = new Date();
  const hoursDiff = (now.getTime() - postDate.getTime()) / (1000 * 60 * 60);
  const result = hoursDiff < 24;
  
  HOT_POST_CACHE.set(cacheKey, { result, timestamp: Date.now() });
  
  if (HOT_POST_CACHE.size > 100) {
    const oldEntries = Array.from(HOT_POST_CACHE.entries())
      .filter(([, value]) => (Date.now() - value.timestamp) > CACHE_DURATION);
    oldEntries.forEach(([key]) => HOT_POST_CACHE.delete(key));
  }
  
  return result;
};