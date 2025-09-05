// frontend/src/shared/store/uiStore.ts

import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import type { ModalState, ToastState, LoadingState } from '@/shared/types/common';

interface UIState {
  modal: ModalState;
  toasts: ToastState[];
  globalLoading: LoadingState;
  sidebar: {
    isOpen: boolean;
    activeTab: string | null;
  };
  theme: {
    isDark: boolean;
    mode: 'light' | 'dark' | 'system';
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
  setSidebarOpen: (isOpen: boolean) => void;
  setSidebarTab: (tab: string | null) => void;
  
  // 테마 관리
  toggleTheme: () => void;
  setTheme: (mode: 'light' | 'dark' | 'system') => void;
}

type UIStore = UIState & UIActions;

// 초기 사이드바 상태 결정 함수
const getInitialSidebarState = (): boolean => {
  if (typeof window === 'undefined') return true;
  
  // 저장된 사용자 설정 확인
  const savedState = localStorage.getItem('sidebar-state');
  if (savedState !== null) {
    return JSON.parse(savedState);
  }
  
  // 화면 크기에 따른 기본값
  const isDesktop = window.innerWidth >= 768;
  return isDesktop;
};

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
    isOpen: getInitialSidebarState(),
    activeTab: null,
  },
  theme: {
    isDark: false,
    mode: 'light',
  },
};

export const useUIStore = create<UIStore>()(
  devtools(
    persist(
      (set, get) => ({
        ...initialUIState,

        // 모달 관리
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

        // 토스트 관리
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

        // 로딩 관리
        setGlobalLoading: (isLoading, message) => {
          set({
            globalLoading: {
              isLoading,
              message,
            },
          });
        },

        // 사이드바 관리
        toggleSidebar: () => {
          set((state) => {
            const newIsOpen = !state.sidebar.isOpen;
            
            // 사용자 선택 저장
            if (typeof window !== 'undefined') {
              localStorage.setItem('sidebar-state', JSON.stringify(newIsOpen));
            }
            
            return {
              sidebar: {
                ...state.sidebar,
                isOpen: newIsOpen,
              },
            };
          });
        },

        setSidebarOpen: (isOpen) => {
          set((state) => {
            // 사용자 선택 저장
            if (typeof window !== 'undefined') {
              localStorage.setItem('sidebar-state', JSON.stringify(isOpen));
            }
            
            return {
              sidebar: {
                ...state.sidebar,
                isOpen,
              },
            };
          });
        },

        setSidebarTab: (tab) => {
          set((state) => ({
            sidebar: {
              ...state.sidebar,
              activeTab: tab,
            },
          }));
        },

        // 테마 관리
        toggleTheme: () => {
          set((state) => ({
            theme: {
              ...state.theme,
              isDark: !state.theme.isDark,
              mode: state.theme.isDark ? 'light' : 'dark',
            },
          }));
        },

        setTheme: (mode) => {
          set((state) => ({
            theme: {
              ...state.theme,
              mode,
              isDark: mode === 'dark' || (mode === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches),
            },
          }));
        },
      }),
      {
        name: 'ui-store',
        // 사이드바 상태와 테마만 persist
        partialize: (state) => ({
          sidebar: {
            isOpen: state.sidebar.isOpen,
            activeTab: state.sidebar.activeTab,
          },
          theme: state.theme,
        }),
      }
    ),
    { name: 'ui-store' }
  )
);

// 편의성을 위한 커스텀 훅들
export const useSidebar = () => {
  const { sidebar, toggleSidebar, setSidebarOpen, setSidebarTab } = useUIStore();
  return {
    ...sidebar,
    toggle: toggleSidebar,
    open: () => setSidebarOpen(true),
    close: () => setSidebarOpen(false),
    setTab: setSidebarTab,
  };
};

export const useTheme = () => {
  const { theme, toggleTheme, setTheme } = useUIStore();
  return {
    ...theme,
    toggle: toggleTheme,
    setMode: setTheme,
  };
};

export const useToast = () => {
  const { showToast, hideToast, clearToasts } = useUIStore();
  return {
    show: showToast,
    hide: hideToast,
    clear: clearToasts,
    success: (message: string) => showToast({ type: 'success', message }),
    error: (message: string) => showToast({ type: 'error', message }),
    info: (message: string) => showToast({ type: 'info', message }),
    warning: (message: string) => showToast({ type: 'warning', message }),
  };
};