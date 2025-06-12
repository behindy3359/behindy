// 기본 API 응답 래퍼
export interface ApiResponse<T = any> {
  success: boolean;
  data: T;
  message?: string;
  error?: string;
}

// 에러 응답
export interface ApiError {
  status: number;
  message: string;
  code?: string;
  details?: any;
}

// 페이지네이션 파라미터
export interface PaginationParams {
  page?: number;
  size?: number;
}

// 정렬 파라미터
export interface SortParams {
  sortBy?: string;
  sortDirection?: 'asc' | 'desc';
}

// HTTP 메서드
export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

// 요청 상태
export type RequestStatus = 'idle' | 'loading' | 'success' | 'error';