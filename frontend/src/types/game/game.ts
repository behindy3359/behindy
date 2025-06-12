import { Character } from "../character/character";

// 게임 진입 자격 응답
export interface GameEligibilityResponse {
  canStartGame: boolean;
  reason: string;
  requiresLogin: boolean;
  requiresCharacterCreation: boolean;
  hasActiveGame: boolean;
  character: Character | null;
}

// 선택지 정보
export interface GameOption {
  optionId: number;
  content: string;
  effect: string;
  amount: number;
  effectPreview: string;
}

// 게임 페이지 정보
export interface GamePage {
  pageId: number;
  pageNumber: number;
  content: string;
  options: GameOption[];
  isLastPage: boolean;
  totalPages: number;
}

// 게임 시작 응답
export interface GameStartResponse {
  storyId: number;
  storyTitle: string;
  currentPage: GamePage;
  character: Character;
  message: string;
}

// 선택지 선택 응답
export interface GameChoiceResponse {
  success: boolean;
  result: string;
  updatedCharacter: Character;
  nextPage: GamePage | null;
  isGameOver: boolean;
  gameOverReason: string | null;
  message: string;
}