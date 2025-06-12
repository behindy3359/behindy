import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import type { ModalState, ToastState, LoadingState } from '@/types/ui/ui';

interface UIState {
  modal: ModalState;
  toasts: ToastState[];
  globalLoading: LoadingState;
  sidebar: {
    isOpen: boolean;
    activeTab: string | null;
  };
}

interface UIActions {
  // 모달 관리
  openModal: (modal: Omit<ModalState, 'isOpen'>) => void;
  closeModal: () => void;
  
  // 토스트 관리
  showToast: (toast: Omit<ToastState, 'id' | 'isVisible'>) => void;
  hideToast: (id: string) => void;
  clearToasts: () => void;
  
  // 로딩 관리
  setGlobalLoading: (loading: boolean, message?: string) => void;
  
  // 사이드바 관리
  toggleSidebar: () => void;
  setSidebarTab: (tab: string | null) => void;
}

type UIStore = UIState & UIActions;

const initialUIState: UIState = {
  modal: {
    isOpen: false,
    type: 'info',
  },
  toasts: [],
  globalLoading: {
    isLoading: false,
  },
  sidebar: {
    isOpen: false,
    activeTab: null,
  },
};

export const useUIStore = create<UIStore>()(
  devtools(
    (set, get) => ({
      ...initialUIState,

      openModal: (modal) => {
        set({
          modal: {
            ...modal,
            isOpen: true,
          },
        });
      },

      closeModal: () => {
        set({
          modal: {
            isOpen: false,
            type: 'info',
          },
        });
      },

      showToast: (toast) => {
        const id = Date.now().toString();
        const newToast: ToastState = {
          ...toast,
          id,
          isVisible: true,
          duration: toast.duration || 3000,
        };

        set((state) => ({
          toasts: [...state.toasts, newToast],
        }));

        // 자동 제거
        setTimeout(() => {
          get().hideToast(id);
        }, newToast.duration);
      },

      hideToast: (id) => {
        set((state) => ({
          toasts: state.toasts.filter((toast) => toast.id !== id),
        }));
      },

      clearToasts: () => {
        set({ toasts: [] });
      },

      setGlobalLoading: (isLoading, message) => {
        set({
          globalLoading: {
            isLoading,
            message,
          },
        });
      },

      toggleSidebar: () => {
        set((state) => ({
          sidebar: {
            ...state.sidebar,
            isOpen: !state.sidebar.isOpen,
          },
        }));
      },

      setSidebarTab: (tab) => {
        set((state) => ({
          sidebar: {
            ...state.sidebar,
            activeTab: tab,
          },
        }));
      },
    }),
    { name: 'ui-store' }
  )
);