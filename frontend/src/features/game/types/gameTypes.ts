// frontend/src/features/game/types/gameTypes.ts

// 캐릭터 관련
export interface Character {
  charId: number;
  charName: string;
  charHealth: number;
  charSanity: number;
  isAlive: boolean;
  isDying: boolean;
  statusMessage: string;
  hasGameProgress?: boolean;
  createdAt?: string;
}

export interface CharacterGameStatus extends Character {
  hasActiveGame: boolean;
  currentStoryId?: number;
  currentStoryTitle?: string;
  currentPageNumber?: number;
  gameStartTime?: string;
  totalClears: number;
  totalPlays: number;
  clearRate: number;
  canEnterNewGame: boolean;
  cannotEnterReason?: string;
}

// 스토리 관련
export interface Story {
  storyId: number;
  storyTitle: string;
  estimatedLength?: number;
  difficulty?: string;
  theme?: string;
  description?: string;
  stationName: string;
  stationLine: number;
  canPlay?: boolean;
  playStatus?: string;
}

// 페이지 관련
export interface GameOption {
  optionId: number;
  content: string;
  effect?: 'health' | 'sanity' | 'both' | 'none';
  amount?: number;
  effectPreview?: string | null;
}

export interface GamePage {
  pageId: number;
  pageNumber: number;
  content: string;
  options: GameOption[];
  isLastPage: boolean;
  totalPages?: number;
}

// 게임 진입 관련
export type GameAction = 'START_NEW' | 'RESUME_EXISTING' | 'NO_STORIES';

export interface GameEnterResponse {
  success: boolean;
  action: GameAction;
  message: string;
  selectedStoryId?: number;
  selectedStoryTitle?: string;
  resumeStoryId?: number;
  resumeStoryTitle?: string;
  firstPage?: GamePage;
  currentPage?: GamePage;
  character: Character;
  stationName: string;
  stationLine: number;
}

// 선택 결과 관련
export interface ChoiceResponse {
  success: boolean;
  result: string;
  updatedCharacter: Character | null;
  nextPage: GamePage | null;
  isGameOver: boolean;
  gameOverReason?: string;
  message: string;
}

// 게임 상태 관련
export interface GameStatus {
  hasActiveGame: boolean;
  storyId?: number;
  storyTitle?: string;
  currentPage?: GamePage;
  character?: Character;
  gameStartTime?: string;
  message: string;
}

// 게임 스토어 상태
export interface GameState {
  // 게임 진행 상태
  isPlaying: boolean;
  isLoading: boolean;
  
  // 현재 게임 정보
  currentStory: Story | null;
  currentPage: GamePage | null;
  character: Character | null;
  
  // 게임 메타 정보
  gameStartTime: string | null;
  lastChoice: GameOption | null;
  
  // 타이핑 효과 상태
  isTyping: boolean;
  displayedText: string;
  
  // 에러 상태
  error: string | null;
}