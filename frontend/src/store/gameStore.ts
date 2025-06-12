import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import type { 
  GameEligibilityResponse, 
  GameStartResponse, 
  GameChoiceResponse, 
  GamePage 
} from '@/types/game/game';
import type { Character } from '@/types/character/character';
import { api, API_ENDPOINTS } from '@/config';

interface GameState {
  // 게임 상태
  isPlaying: boolean;
  currentStory: {
    storyId: number;
    storyTitle: string;
  } | null;
  currentPage: GamePage | null;
  character: Character | null;
  
  // UI 상태
  isLoading: boolean;
  error: string | null;
  
  // 게임 진행 상태
  gameHistory: GameChoiceResponse[];
  lastSaveTime: number | null;
}

interface GameActions {
  // 게임 시작/종료
  startGame: (storyId: number) => Promise<boolean>;
  resumeGame: () => Promise<boolean>;
  quitGame: () => Promise<void>;
  
  // 게임 플레이
  makeChoice: (optionId: number) => Promise<boolean>;
  saveGame: () => Promise<void>;
  
  // 상태 관리
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
  reset: () => void;
  
  // 자격 확인
  checkEligibility: () => Promise<GameEligibilityResponse | null>;
}

type GameStore = GameState & GameActions;

const initialGameState: GameState = {
  isPlaying: false,
  currentStory: null,
  currentPage: null,
  character: null,
  isLoading: false,
  error: null,
  gameHistory: [],
  lastSaveTime: null,
};

export const useGameStore = create<GameStore>()(
  devtools(
    (set, get) => ({
      ...initialGameState,

      startGame: async (storyId: number): Promise<boolean> => {
        try {
          set({ isLoading: true, error: null });
          
          const response = await api.post<GameStartResponse>(
            API_ENDPOINTS.GAME.START(storyId)
          );
          
          set({
            isPlaying: true,
            currentStory: {
              storyId: response.storyId,
              storyTitle: response.storyTitle,
            },
            currentPage: response.currentPage,
            character: response.character,
            isLoading: false,
            gameHistory: [],
            lastSaveTime: Date.now(),
          });
          
          return true;
        } catch (error: unknown) {
          const apiError = error as { response?: { data?: { message?: string } } };
          set({
            error: apiError.response?.data?.message || '게임 시작에 실패했습니다.',
            isLoading: false,
          });
          return false;
        }
      },

      makeChoice: async (optionId: number): Promise<boolean> => {
        try {
          set({ isLoading: true, error: null });
          
          const response = await api.post<GameChoiceResponse>(
            API_ENDPOINTS.GAME.CHOICE(optionId)
          );
          
          const { gameHistory } = get();
          
          set({
            currentPage: response.nextPage,
            character: response.updatedCharacter,
            gameHistory: [...gameHistory, response],
            isLoading: false,
            isPlaying: !response.isGameOver,
            lastSaveTime: Date.now(),
          });
          
          return true;
        } catch (error: unknown) {
          const apiError = error as { response?: { data?: { message?: string } } };
          set({
            error: apiError.response?.data?.message || '선택 처리에 실패했습니다.',
            isLoading: false,
          });
          return false;
        }
      },

      quitGame: async (): Promise<void> => {
        try {
          await api.post(API_ENDPOINTS.GAME.QUIT);
        } catch (error) {
          console.warn('Game quit API failed:', error);
        } finally {
          set({
            isPlaying: false,
            currentStory: null,
            currentPage: null,
            gameHistory: [],
            lastSaveTime: null,
          });
        }
      },

      checkEligibility: async (): Promise<GameEligibilityResponse | null> => {
        try {
          const response = await api.get<GameEligibilityResponse>(
            API_ENDPOINTS.GAME.ELIGIBILITY
          );
          return response;
        } catch (error) {
          return null;
        }
      },

      setLoading: (loading: boolean) => set({ isLoading: loading }),
      setError: (error: string | null) => set({ error }),
      clearError: () => set({ error: null }),
      reset: () => set(initialGameState),

      resumeGame: async (): Promise<boolean> => {
        // 구현 필요
        return false;
      },
      saveGame: async (): Promise<void> => {
        // 자동 저장 로직 구현
      },
    }),
    { name: 'game-store' }
  )
);