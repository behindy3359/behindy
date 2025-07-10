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

// 공통 상태 타입들
export interface LoadingState {
  isLoading: boolean;
  message?: string;
}

export interface ErrorInfo {
  code: string;
  message: string;
  details?: any;
}

export interface ValidationResult {
  isValid: boolean;
  message?: string;
}

// UI 상태 타입들
export interface ModalState {
  isOpen: boolean;
  type: 'info' | 'confirm' | 'error' | 'success';
  title?: string;
  message?: string;
  onConfirm?: () => void;
  onCancel?: () => void;
}

export interface ToastState {
  id: string;
  type: 'info' | 'success' | 'warning' | 'error';
  message: string;
  duration?: number;
  isVisible: boolean;
}

// 폼 상태
export interface FormState<T> {
  data: T;
  errors: Partial<Record<keyof T, string>>;
  isValid: boolean;
  isSubmitting: boolean;
}