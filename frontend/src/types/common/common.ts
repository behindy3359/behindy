// 기본 API 응답 타입
export interface ApiResponse<T = any> {
  success: boolean;
  data: T;
  message?: string;
  error?: string;
}

// API 에러 타입
export interface ApiError {
  code: string;
  message: string;
  details?: any;
}

// 페이지네이션 응답 타입
export interface PaginatedResponse<T> {
  content: T[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  hasNext?: boolean;
  hasPrevious?: boolean;
}

// 에러 정보
export interface ErrorInfo {
  code: string;
  message: string;
  details?: any;
}

// 검증 결과
export interface ValidationResult {
  isValid: boolean;
  message?: string;
}

// 모달 상태
export interface ModalState {
  isOpen: boolean;
  type: 'info' | 'confirm' | 'error' | 'success';
  title?: string;
  message?: string;
  onConfirm?: () => void;
  onCancel?: () => void;
}

// 토스트 알림
export interface ToastState {
  id: string;
  type: 'info' | 'success' | 'warning' | 'error';
  message: string;
  duration?: number;
  isVisible: boolean;
}

// 로딩 상태 (기존 프로젝트 전반에서 사용)
export interface LoadingState {
  isLoading: boolean;
  message?: string;
}