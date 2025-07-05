import { METRO_STATIONS, STORY_STATIONS } from '@/data/metro/stationsData';
import type { Station } from '@/data/metro/stationsData';

/**
 * 게임 시작 가능한 역인지 확인
 */
export const canStartGameAtStation = (stationId: number): boolean => {
  const station = METRO_STATIONS.find(s => s.id === stationId);
  return station?.hasStory || false;
};

/**
 * 역에서 시작할 수 있는 스토리 정보 가져오기
 */
export const getStationStoryInfo = (stationId: number) => {
  const station = METRO_STATIONS.find(s => s.id === stationId);
  if (!station || !station.hasStory) return null;

  // STORY_STATIONS에서 해당 역의 스토리 정보 찾기
  const storyStation = STORY_STATIONS.find(s => s.id === stationId);
  
  return {
    stationId,
    stationName: station.name,
    lines: station.lines,
    storyAvailable: true,
    storyPreview: `${station.name}역에서 시작되는 특별한 이야기...`,
    difficulty: 'normal', // 기본 난이도
    estimatedTime: '15-20분'
  };
};

/**
 * 노선별 스토리 역들 가져오기
 */
export const getStoryStationsByLine = (lineNumber: number): Station[] => {
  return METRO_STATIONS.filter(station => 
    station.hasStory && station.lines.includes(lineNumber)
  );
};

/**
 * 가장 가까운 스토리 역 찾기
 */
export const findNearestStoryStation = (currentStationId: number): Station | null => {
  const currentStation = METRO_STATIONS.find(s => s.id === currentStationId);
  if (!currentStation) return null;

  const storyStations = METRO_STATIONS.filter(s => s.hasStory);
  
  let nearestStation: Station | null = null;
  let minDistance = Infinity;

  storyStations.forEach(storyStation => {
    const distance = Math.sqrt(
      Math.pow(currentStation.x - storyStation.x, 2) + 
      Math.pow(currentStation.y - storyStation.y, 2)
    );
    
    if (distance < minDistance) {
      minDistance = distance;
      nearestStation = storyStation;
    }
  });

  return nearestStation;
};

/**
 * 역 클릭 시 게임 시작 가능 여부와 액션 결정
 */
export const handleStationGameAction = (stationId: number) => {
  const station = METRO_STATIONS.find(s => s.id === stationId);
  if (!station) return { type: 'invalid' };

  if (station.hasStory) {
    return {
      type: 'start_game',
      stationId,
      stationName: station.name,
      storyInfo: getStationStoryInfo(stationId)
    };
  }

  const nearestStory = findNearestStoryStation(stationId);
  if (nearestStory) {
    return {
      type: 'suggest_nearest',
      currentStation: station,
      nearestStoryStation: nearestStory,
      message: `${station.name}역에는 스토리가 없습니다. 가장 가까운 ${nearestStory.name}역에서 게임을 시작하시겠습니까?`
    };
  }

  return {
    type: 'no_story',
    stationName: station.name,
    message: `${station.name}역에는 아직 이용 가능한 스토리가 없습니다.`
  };
};

/**
 * 사용자 위치 기반 추천 스토리
 */
export const getRecommendedStories = (userLocation?: { lat: number; lng: number }) => {
  // 실제 구현에서는 사용자 위치를 기반으로 가까운 역들을 찾을 수 있습니다
  // 현재는 간단히 스토리가 있는 주요 역들을 반환
  const recommendedStations = STORY_STATIONS.slice(0, 3).map(storyStation => {
    const station = METRO_STATIONS.find(s => s.id === storyStation.id);
    return {
      ...storyStation,
      stationInfo: station,
      storyPreview: getStationStoryInfo(storyStation.id)
    };
  });

  return recommendedStations;
};

/**
 * 노선 테마별 스토리 분류
 */
export const getStoriesByTheme = () => {
  const themes = {
    1: { name: '1호선', theme: '역사와 전통', color: '#0052A4' },
    2: { name: '2호선', theme: '도시의 활력', color: '#00A84D' },
    3: { name: '3호선', theme: '문화와 예술', color: '#EF7C1C' },
    4: { name: '4호선', theme: '미스터리', color: '#00A5DE' }
  };

  return Object.entries(themes).map(([lineNum, info]) => {
    const lineNumber = parseInt(lineNum);
    const storyStations = getStoryStationsByLine(lineNumber);
    
    return {
      line: lineNumber,
      ...info,
      storyCount: storyStations.length,
      stations: storyStations,
      difficulty: lineNumber <= 2 ? 'easy' : lineNumber === 3 ? 'medium' : 'hard'
    };
  });
};

const gameUtils = {
  canStartGameAtStation,
  getStationStoryInfo,
  getStoryStationsByLine,
  findNearestStoryStation,
  handleStationGameAction,
  getRecommendedStories,
  getStoriesByTheme
};

export default gameUtils