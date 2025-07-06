import { useAuthStore } from './authStore';
import { useUIStore } from './uiStore';

// 전체 앱 상태 타입
export type AppState = {
  auth: ReturnType<typeof useAuthStore.getState>;
  ui: ReturnType<typeof useUIStore.getState>;
};