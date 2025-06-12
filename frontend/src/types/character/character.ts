// 캐릭터 생성 요청
export interface CreateCharacterRequest {
  charName: string;
}

// 캐릭터 정보 (API 응답 기준)
export interface Character {
  charId: number;
  charName: string;
  charHealth: number;
  charSanity: number;
  userId: number;
  userName: string;
  isAlive: boolean;
  isDying: boolean;
  statusMessage: string;
  hasGameProgress: boolean;
  currentStoryId: number | null;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

// 캐릭터 존재 여부 응답
export interface CharacterExistsResponse {
  exists: boolean;
  character: Character | null;
}

// 캐릭터 스탯 업데이트 파라미터
export interface CharacterStatsUpdate {
  healthChange?: number;
  sanityChange?: number;
}