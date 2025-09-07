import { Character } from '../types/gameTypes';

/**
 * 체력/정신력 기반으로 캐릭터 생존 여부 판단
 */
export const isCharacterAlive = (health: number, sanity: number): boolean => {
  return health > 0 && sanity > 0;
};

/**
 * 캐릭터가 위험 상태인지 판단 (체력 또는 정신력이 30 이하)
 */
export const isCharacterDying = (health: number, sanity: number): boolean => {
  if (!isCharacterAlive(health, sanity)) return false;
  return health <= 30 || sanity <= 30;
};

/**
 * 체력/정신력 기반 상태 메시지 생성
 */
export const getCharacterStatusMessage = (health: number, sanity: number): string => {
  if (!isCharacterAlive(health, sanity)) {
    return '사망';
  }
  
  const minStat = Math.min(health, sanity);
  
  if (minStat <= 20) return '위험';
  if (minStat <= 40) return '주의';  
  if (minStat <= 60) return '보통';
  return '건강';
};

/**
 * 백엔드 응답을 완전한 Character 객체로 보완
 */
export const enrichCharacterData = (
  baseCharacter: Character,
  updatedData: Partial<Character>
): Character => {
  const health = updatedData.charHealth ?? baseCharacter.charHealth;
  const sanity = updatedData.charSanity ?? baseCharacter.charSanity;
  
  return {
    ...baseCharacter,
    ...updatedData,
    isAlive: isCharacterAlive(health, sanity),
    isDying: isCharacterDying(health, sanity),
    statusMessage: getCharacterStatusMessage(health, sanity)
  };
};

/**
 * 체력/정신력 변화량을 적용한 새 캐릭터 상태 계산
 */
export const applyCharacterChanges = (
  character: Character,
  healthChange: number = 0,
  sanityChange: number = 0
): Character => {
  const newHealth = Math.max(0, Math.min(100, character.charHealth + healthChange));
  const newSanity = Math.max(0, Math.min(100, character.charSanity + sanityChange));
  
  return enrichCharacterData(character, {
    charHealth: newHealth,
    charSanity: newSanity
  });
};

/**
 * 캐릭터 상태에 따른 색상 코드 반환
 */
export const getCharacterStatusColor = (health: number, sanity: number): string => {
  if (!isCharacterAlive(health, sanity)) return '#ef4444'; // 빨간색
  if (isCharacterDying(health, sanity)) return '#f59e0b';   // 주황색
  
  const minStat = Math.min(health, sanity);
  if (minStat <= 40) return '#f59e0b'; // 주황색
  if (minStat <= 60) return '#eab308'; // 노란색
  return '#10b981'; // 초록색
};