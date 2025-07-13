import { 
  METRO_STATIONS, 
  getStationsByLine,
  getStationByApiId
} from '@/features/metro/data/stationsData';

import type { 
  MetroApiResponse, 
  ProcessedTrainData, 
  LineStats 
} from '../types/metroMapTypes';
import { METRO_CONFIG } from '@/shared/utils/common/constants';

/**
 * 🎯 실시간 데이터 처리 - 역명 기반으로 완전 개선
 * 복잡한 매핑 로직 제거, 직접적인 API ID → 역명 변환
 */
export const processRealtimeData = (realtimeData: MetroApiResponse['data'] | null): ProcessedTrainData[] => {
  if (!realtimeData?.positions) {
    return [];
  }
  
  const processedData: ProcessedTrainData[] = [];
  let successCount = 0;
  let failCount = 0;
  
  realtimeData.positions.forEach((train, index) => {
    try {
      // API ID로 역 정보 직접 조회
      const station = getStationByApiId(train.stationId);
      
      if (!station) {
        failCount++;
        return;
      }
      
      // 역명 기반 데이터로 변환
      const processedTrain: ProcessedTrainData = {
        frontendStationId: station.id,   
        stationName: station.id,      
        lineNumber: train.lineNumber,
        direction: train.direction,
        trainCount: 1,
        lastUpdated: new Date(train.lastUpdated),
        trainId: train.trainId,
      };
      
      processedData.push(processedTrain);
      successCount++;
      
    } catch (error) {
      failCount++;
    }
  });
  
  return processedData;
};

// ================================================================
// 🔥 도착 역 관련 함수들 (역명 기반)
// ================================================================

/**
 * 🎯 도착 역 ID 목록 조회 (역명 기반)
 */
export const getArrivalStationIds = (processedRealtimeData: ProcessedTrainData[]): string[] => {
  const stationNames = processedRealtimeData.map(train => train.stationName);
  const uniqueStationNames = [...new Set(stationNames)];
  
  console.log(`🚇 현재 도착 역: ${uniqueStationNames.length}개 (${uniqueStationNames.join(', ')})`);
  return uniqueStationNames;
};

/**
 * 🎯 모든 도착 역이 표시되어 있는지 확인 (역명 기반)
 */
export const areAllArrivalStationsShown = (
  arrivalStationNames: string[], 
  clickedStations: Set<string>      // 🔥 Set<number> → Set<string>으로 변경
): boolean => {
  if (arrivalStationNames.length === 0) return false;
  
  const allShown = arrivalStationNames.every(stationName => clickedStations.has(stationName));
  
  return allShown;
};

// ================================================================
// 🔥 노선 및 역 필터링 (역명 기반)
// ================================================================

/**
 * 🎯 보이는 역들 조회 (역명 기반)
 */
export const getVisibleStations = (visibleLines: number[]) => {
  if (visibleLines.length === 0) {
    return [];
  }
  
  const visibleStations = METRO_STATIONS.filter(station => {
    return station.lines.some(line => visibleLines.includes(line));
  });
  
  return visibleStations;
};

/**
 *? 🎯 노선별 통계 계산 (역명 기반)
 */
export const calculateLineStats = (
  visibleLines: number[], 
  processedRealtimeData: ProcessedTrainData[]
): LineStats[] => {
  
  return Object.entries(METRO_CONFIG.LINE_COLORS).map(([lineNum, color]) => {
    const line = parseInt(lineNum);
    const stations = getStationsByLine(line);
    
    const trainsOnLine = processedRealtimeData.filter(train => {
      // 열차가 위치한 역이 해당 노선을 지나는지 확인
      const station = METRO_STATIONS.find(s => s.id === train.stationName);
      return station && station.lines.includes(line);
    });
    
    const trainCount = trainsOnLine.length;
    const isVisible = visibleLines.includes(line);
    
    return {
      line,
      color,
      totalStations: stations.length,
      trainCount,
      visible: isVisible
    };
  });
};

/**
 * 🎯 역 클릭 토글 (역명 기반)
 */
export const toggleStationInSet = (stationName: string, currentSet: Set<string>): Set<string> => {
  const newSet = new Set(currentSet);
  
  if (newSet.has(stationName)) {
    newSet.delete(stationName);
  } else {
    newSet.add(stationName);
  }
  
  return newSet;
};

/**
 * 🎯 도착 역 일괄 토글 (역명 기반)
 */
export const toggleArrivalStations = (
  arrivalStationNames: string[],
  currentClickedStations: Set<string>,
  areAllShown: boolean
): Set<string> => {
  const newSet = new Set(currentClickedStations);
  
  if (areAllShown) {
    // 모든 도착 역이 표시되어 있으면 → 모든 도착 역 제거
    arrivalStationNames.forEach(stationName => newSet.delete(stationName));
  } else {
    // 일부만 표시되어 있거나 없으면 → 모든 도착 역 추가
    arrivalStationNames.forEach(stationName => newSet.add(stationName));
  }
  
  return newSet;
};

/**
 * 🎯 노선 토글 (기존과 동일)
 */
export const toggleLineInArray = (line: number, currentLines: number[]): number[] => {
  const newLines = currentLines.includes(line) 
    ? currentLines.filter(l => l !== line)
    : [...currentLines, line];
  
  return newLines;
};

export default {
  processRealtimeData,
  getArrivalStationIds,
  areAllArrivalStationsShown,
  getVisibleStations,
  calculateLineStats,
  toggleStationInSet,
  toggleArrivalStations,
  toggleLineInArray,
};