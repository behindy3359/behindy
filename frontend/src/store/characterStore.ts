import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import type { Character, CreateCharacterRequest, CharacterExistsResponse } from '@/types/character/character';
import { api, API_ENDPOINTS } from '@/config';

interface CharacterState {
  currentCharacter: Character | null;
  characterHistory: Character[];
  isLoading: boolean;
  error: string | null;
}

interface CharacterActions {
  // 캐릭터 관리
  createCharacter: (data: CreateCharacterRequest) => Promise<boolean>;
  fetchCurrentCharacter: () => Promise<void>;
  fetchCharacterHistory: () => Promise<void>;
  checkCharacterExists: () => Promise<CharacterExistsResponse | null>;
  
  // 상태 관리
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  reset: () => void;
}

type CharacterStore = CharacterState & CharacterActions;

const initialCharacterState: CharacterState = {
  currentCharacter: null,
  characterHistory: [],
  isLoading: false,
  error: null,
};

export const useCharacterStore = create<CharacterStore>()(
  devtools(
    (set, get) => ({
      ...initialCharacterState,

      createCharacter: async (data: CreateCharacterRequest): Promise<boolean> => {
        try {
          set({ isLoading: true, error: null });
          
          const response = await api.post<Character>(
            API_ENDPOINTS.CHARACTERS.BASE,
            data
          );
          
          set({
            currentCharacter: response,
            isLoading: false,
          });
          
          return true;
        } catch (error: unknown) {
          const apiError = error as { response?: { data?: { message?: string } } };
          set({
            error: apiError.response?.data?.message || '캐릭터 생성에 실패했습니다.',
            isLoading: false,
          });
          return false;
        }
      },

      fetchCurrentCharacter: async (): Promise<void> => {
        try {
          set({ isLoading: true, error: null });
          
          const response = await api.get<Character>(
            API_ENDPOINTS.CHARACTERS.CURRENT
          );
          
          set({
            currentCharacter: response,
            isLoading: false,
          });
        } catch (error: unknown) {
          const apiError = error as { response?: { data?: { message?: string } } };
          set({
            error: apiError.response?.data?.message || '캐릭터 정보를 가져올 수 없습니다.',
            isLoading: false,
          });
        }
      },

      checkCharacterExists: async (): Promise<CharacterExistsResponse | null> => {
        try {
          const response = await api.get<CharacterExistsResponse>(
            API_ENDPOINTS.CHARACTERS.EXISTS
          );
          return response;
        } catch (error) {
          return null;
        }
      },

      fetchCharacterHistory: async (): Promise<void> => {
        try {
          const response = await api.get<Character[]>(
            API_ENDPOINTS.CHARACTERS.HISTORY
          );
          set({ characterHistory: response });
        } catch (error) {
          console.warn('Failed to fetch character history:', error);
        }
      },

      setLoading: (loading: boolean) => set({ isLoading: loading }),
      setError: (error: string | null) => set({ error }),
      reset: () => set(initialCharacterState),
    }),
    { name: 'character-store' }
  )
);