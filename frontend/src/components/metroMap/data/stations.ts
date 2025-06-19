// src/components/metroMap/data/stations.ts

import { parseStations, RAW_STATIONS } from '../utils/svgParser';

/**
 * 지하철역 인터페이스
 */
export interface Station {
  id: string;
  name: string;
  line: number;
  originalCoords: { cx: number; cy: number };
  normalizedCoords: { x: number; y: number };
  hasStory: boolean;
  isTransfer: boolean;
  transferLines: number[];
  stationCode?: string; // 역 번호 (예: 101, 201)
  exits?: string[]; // 출구 정보
}

/**
 * 파싱된 지하철역 데이터
 */
export const STATIONS: Station[] = parseStations(RAW_STATIONS);

/**
 * 노선별 지하철역 그룹핑
 */
export const STATIONS_BY_LINE: Record<number, Station[]> = STATIONS.reduce((acc, station) => {
  if (!acc[station.line]) {
    acc[station.line] = [];
  }
  acc[station.line].push(station);
  return acc;
}, {} as Record<number, Station[]>);

/**
 * 환승역 리스트
 */
export const TRANSFER_STATIONS: Station[] = STATIONS.filter(station => station.isTransfer);

/**
 * 스토리가 있는 역 리스트
 */
export const STORY_STATIONS: Station[] = STATIONS.filter(station => station.hasStory);

/**
 * 역 ID로 역 찾기
 */
export const getStationById = (stationId: string): Station | undefined => {
  return STATIONS.find(station => station.id === stationId);
};

/**
 * 역 이름으로 역 찾기 (환승역의 경우 배열 반환)
 */
export const getStationsByName = (stationName: string): Station[] => {
  return STATIONS.filter(station => station.name === stationName);
};

/**
 * 특정 노선의 역들 가져오기
 */
export const getStationsByLine = (lineNumber: number): Station[] => {
  return STATIONS_BY_LINE[lineNumber] || [];
};

/**
 * 좌표 기준으로 가장 가까운 역 찾기
 */
export const findNearestStation = (x: number, y: number): Station | null => {
  let nearestStation: Station | null = null;
  let minDistance = Infinity;

  STATIONS.forEach(station => {
    const dx = station.normalizedCoords.x - x;
    const dy = station.normalizedCoords.y - y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    if (distance < minDistance) {
      minDistance = distance;
      nearestStation = station;
    }
  });

  return nearestStation;
};

/**
 * 두 역 사이의 거리 계산
 */
export const getDistanceBetweenStations = (stationId1: string, stationId2: string): number => {
  const station1 = getStationById(stationId1);
  const station2 = getStationById(stationId2);

  if (!station1 || !station2) return 0;

  const dx = station1.normalizedCoords.x - station2.normalizedCoords.x;
  const dy = station1.normalizedCoords.y - station2.normalizedCoords.y;

  return Math.sqrt(dx * dx + dy * dy);
};

/**
 * 지하철역 통계 정보
 */
export const STATION_STATISTICS = {
  total: STATIONS.length,
  byLine: Object.entries(STATIONS_BY_LINE).reduce((acc, [line, stations]) => {
    acc[parseInt(line)] = stations.length;
    return acc;
  }, {} as Record<number, number>),
  transferStations: TRANSFER_STATIONS.length,
  storyStations: STORY_STATIONS.length,
  lines: Object.keys(STATIONS_BY_LINE).map(Number).sort()
};

/**
 * 개발용 디버깅 함수
 */
export const debugStationData = () => {
  console.group('🚇 지하철역 데이터 분석');
  console.log('총 역 수:', STATION_STATISTICS.total);
  console.log('노선별 역 수:', STATION_STATISTICS.byLine);
  console.log('환승역 수:', STATION_STATISTICS.transferStations);
  console.log('스토리 역 수:', STATION_STATISTICS.storyStations);
  console.log('운영 노선:', STATION_STATISTICS.lines);
  
  console.group('환승역 목록');
  TRANSFER_STATIONS.forEach(station => {
    console.log(`${station.name}: ${station.transferLines.join('호선, ')}호선`);
  });
  console.groupEnd();
  
  console.group('스토리 역 목록');
  STORY_STATIONS.forEach(station => {
    console.log(`${station.name} (${station.line}호선)`);
  });
  console.groupEnd();
  
  console.groupEnd();
};

// 개발 환경에서 자동 실행
if (typeof process !== 'undefined' && process.env?.NODE_ENV === 'development') {
  debugStationData();
}