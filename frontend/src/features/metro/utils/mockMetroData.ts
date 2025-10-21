import { METRO_STATIONS } from '../data/stationsData';
import type { MetroApiResponse } from '../types/metroMapTypes';

/**
 * Mock 지하철 실시간 위치 데이터 생성기
 * API 호출 제한이나 운행 종료 시 사용할 테스트 데이터 생성
 */

// 각 호선별 열차 수 (실제 운영 열차 수 참고)
const TRAINS_PER_LINE: Record<number, number> = {
  1: 8,  // 1호선: 8대
  2: 12, // 2호선: 12대 (순환선)
  3: 6,  // 3호선: 6대
  4: 8,  // 4호선: 8대
};

/**
 * 특정 호선의 역 목록 필터링
 */
const getStationsByLine = (lineNumber: number) => {
  return METRO_STATIONS.filter(station => station.lines.includes(lineNumber));
};

/**
 * 랜덤하게 열차 배치 (각 호선별로 균등 분포)
 */
const generateTrainsForLine = (lineNumber: number): MetroApiResponse['data']['positions'] => {
  const stations = getStationsByLine(lineNumber);
  const trainCount = TRAINS_PER_LINE[lineNumber] || 6;
  const trains: MetroApiResponse['data']['positions'] = [];

  if (stations.length === 0) return trains;

  // 역들을 균등하게 나눠서 열차 배치
  const stationsPerTrain = Math.floor(stations.length / trainCount);

  for (let i = 0; i < trainCount; i++) {
    const stationIndex = (i * stationsPerTrain) % stations.length;
    const station = stations[stationIndex];
    const direction = Math.random() > 0.5 ? 'up' : 'down';

    trains.push({
      trainId: `MOCK_${lineNumber}_${String(i + 1).padStart(3, '0')}`,
      lineNumber,
      stationId: station.realApiIds[0] || station.id,
      stationName: station.id,
      direction,
      lastUpdated: new Date().toISOString(),
      dataSource: 'MOCK_FALLBACK',
      isRealtime: false,
      fresh: true,
    });
  }

  return trains;
};

/**
 * 전체 Mock 데이터 생성
 * @param enabledLines 활성화된 호선 목록 (기본: 1,2,3,4호선)
 */
export const generateMockMetroData = (
  enabledLines: number[] = [1, 2, 3, 4]
): MetroApiResponse['data'] => {
  const allTrains: MetroApiResponse['data']['positions'] = [];
  const lineStatistics: Record<string, number> = {};

  // 각 호선별로 열차 생성
  enabledLines.forEach(lineNumber => {
    const trains = generateTrainsForLine(lineNumber);
    allTrains.push(...trains);
    lineStatistics[lineNumber.toString()] = trains.length;
  });

  return {
    positions: allTrains,
    totalTrains: allTrains.length,
    lineStatistics,
    lastUpdated: new Date().toISOString(),
    dataSource: 'MOCK_FALLBACK',
    systemStatus: 'MOCK_MODE',
    isRealtime: false,
  };
};

/**
 * Mock 데이터가 필요한지 판단
 * - API 에러
 * - 운행 종료 (totalTrains === 0)
 * - Rate Limit
 */
export const shouldUseMockData = (
  data: MetroApiResponse['data'] | null,
  error: string | null
): boolean => {
  // 에러가 있으면 Mock 사용
  if (error) return true;

  // 데이터가 없으면 Mock 사용
  if (!data) return true;

  // 열차가 0대면 Mock 사용 (운행 종료 대신 테스트 데이터 표시)
  if (data.totalTrains === 0) return true;

  return false;
};
