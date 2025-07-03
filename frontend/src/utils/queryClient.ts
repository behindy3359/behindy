import { QueryClient } from '@tanstack/react-query';

export const createQueryClient = () => {
  return new QueryClient({
    defaultOptions: {
      queries: {
        // 5분간 데이터를 fresh로 간주
        staleTime: 5 * 60 * 1000,
        // 백그라운드에서 자동 refetch 비활성화 (모바일 배터리 절약)
        refetchOnWindowFocus: false,
        // 1번만 재시도
        retry: 1,
        // 에러 재시도 딜레이
        retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000),
      },
      mutations: {
        // 뮤테이션 재시도 비활성화
        retry: false,
      },
    },
  });
};

// 전역 쿼리 클라이언트 (필요한 경우)
export const queryClient = createQueryClient();