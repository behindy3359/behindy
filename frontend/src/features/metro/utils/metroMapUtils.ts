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
 * 실시간 데이터 처리 - 역명 기반으로 완전 개선
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

/**
 * 보이는 역들 조회
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
 * 노선별 통계 계산
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
 * 노선 토글
 */
export const toggleLineInArray = (line: number, currentLines: number[]): number[] => {
  const newLines = currentLines.includes(line) 
    ? currentLines.filter(l => l !== line)
    : [...currentLines, line];
  
  return newLines;
};

export default {
  processRealtimeData,
  getVisibleStations,
  calculateLineStats,
  toggleLineInArray,
};