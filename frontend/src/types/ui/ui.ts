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

// 로딩 상태
export interface LoadingState {
  isLoading: boolean;
  message?: string;
}

// 폼 상태
export interface FormState<T> {
  data: T;
  errors: Partial<Record<keyof T, string>>;
  isValid: boolean;
  isSubmitting: boolean;
}