import { useAuthStore, useAuth } from './authStore';
import { useGameStore } from './gameStore';
import { useCharacterStore } from './characterStore';
import { useUIStore } from './uiStore';

// 전체 앱 상태 타입
export type AppState = {
  auth: ReturnType<typeof useAuthStore.getState>;
  game: ReturnType<typeof useGameStore.getState>;
  character: ReturnType<typeof useCharacterStore.getState>;
  ui: ReturnType<typeof useUIStore.getState>;
};