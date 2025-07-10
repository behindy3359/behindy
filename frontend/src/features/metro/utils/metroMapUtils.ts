import { 
  METRO_STATIONS, 
  getStationsByLine,
  LineBitUtils
} from '@/data/metro/stationsData';

import type { 
  MetroApiResponse, 
  ProcessedTrainData, 
  LineStats 
} from '../types/metroMapTypes';
import { METRO_CONFIG } from '@/utils/common/constants';

// 실시간 데이터 처리
export const processRealtimeData = (realtimeData: MetroApiResponse['data'] | null): ProcessedTrainData[] => {
  if (!realtimeData?.positions) return [];
  
  return realtimeData.positions.map(train => {
    let frontendStation = METRO_STATIONS.find(station => 
      station.realApiId === train.stationId
    );
    
    if (!frontendStation) {
      frontendStation = METRO_STATIONS.find(station => 
        station.name === train.stationName && 
        station.lines.includes(train.lineNumber)
      );
    }
    
    if (!frontendStation) return null;
    
    return {
      frontendStationId: frontendStation.id,
      stationName: train.stationName,
      lineNumber: train.lineNumber,
      direction: train.direction,
      trainCount: 1,
      lastUpdated: new Date(train.lastUpdated),
      trainId: train.trainId
    };
  }).filter(train => train !== null);
};

export const getArrivalStationIds = (processedRealtimeData: ProcessedTrainData[]): number[] => {
  return processedRealtimeData.map(train => train.frontendStationId);
};

export const areAllArrivalStationsShown = (
  arrivalStationIds: number[], 
  clickedStations: Set<number>
): boolean => {
  if (arrivalStationIds.length === 0) return false;
  return arrivalStationIds.every(id => clickedStations.has(id));
};

export const getVisibleStations = (visibleLines: number[]) => {
  return METRO_STATIONS.filter(station => {
    return LineBitUtils.matchesFilter(
      LineBitUtils.linesToBits(station.lines), 
      visibleLines
    );
  });
};

export const calculateLineStats = (
  visibleLines: number[], 
  processedRealtimeData: ProcessedTrainData[]
): LineStats[] => {
  return Object.entries(METRO_CONFIG.LINE_COLORS).map(([lineNum, color]) => {
    const line = parseInt(lineNum);
    const stations = getStationsByLine(line);
    const trainCount = processedRealtimeData
      .filter(train => train.lineNumber === line)
      .length;
    
    return {
      line,
      color,
      totalStations: stations.length,
      trainCount,
      visible: visibleLines.includes(line)
    };
  });
};

export const toggleStationInSet = (stationId: number, currentSet: Set<number>): Set<number> => {
  const newSet = new Set(currentSet);
  if (newSet.has(stationId)) {
    newSet.delete(stationId);
  } else {
    newSet.add(stationId);
  }
  return newSet;
};

// 도착 역 일괄 토글 유틸리티
export const toggleArrivalStations = (
  arrivalStationIds: number[],
  currentClickedStations: Set<number>,
  areAllShown: boolean
): Set<number> => {
  const newSet = new Set(currentClickedStations);
  
  if (areAllShown) {
    // 모든 도착 역이 표시되어 있으면 → 모든 도착 역 제거
    arrivalStationIds.forEach(id => newSet.delete(id));
  } else {
    // 일부만 표시되어 있거나 없으면 → 모든 도착 역 추가
    arrivalStationIds.forEach(id => newSet.add(id));
  }
  
  return newSet;
};

// 노선 토글 유틸리티
export const toggleLineInArray = (line: number, currentLines: number[]): number[] => {
  return currentLines.includes(line) 
    ? currentLines.filter(l => l !== line)
    : [...currentLines, line];
};