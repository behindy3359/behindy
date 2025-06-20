// frontend/src/data/metro/metroLineConnections.ts

import { METRO_STATIONS, LINE_COLORS } from './stationsData';

export interface LineSegment {
  lineNumber: number;
  fromStationId: number;
  toStationId: number;
  path: string; // SVG path 데이터
  color: string;
}

export interface LineConnection {
  lineNumber: number;
  segments: LineSegment[];
  fullPath: string; // 전체 노선 path
  color: string;
}

/**
 * 두 점 사이의 SVG path 생성 (직선)
 */
const createStraightPath = (x1: number, y1: number, x2: number, y2: number): string => {
  return `M ${x1} ${y1} L ${x2} ${y2}`;
};

/**
 * 두 점 사이의 SVG path 생성 (곡선)
 */
const createCurvedPath = (
  x1: number, y1: number, 
  x2: number, y2: number, 
  curvature: number = 0.2
): string => {
  const midX = (x1 + x2) / 2;
  const midY = (y1 + y2) / 2;
  const distance = Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
  const controlOffset = distance * curvature;
  
  // 수직 방향으로 제어점 오프셋
  const perpX = -(y2 - y1) / distance * controlOffset;
  const perpY = (x2 - x1) / distance * controlOffset;
  
  const controlX = midX + perpX;
  const controlY = midY + perpY;
  
  return `M ${x1} ${y1} Q ${controlX} ${controlY} ${x2} ${y2}`;
};

/**
 * 노선별 역 연결 순서 정의
 */
const LINE_STATION_ORDERS = {
  1: [
    1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 
    21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33
  ],
  2: [
    19, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 75, 76, 44, 45, 46, 47, 48, 
    49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62, 63, 64, 65, 66, 
    67, 68, 69, 70, 71, 72, 73, 74
  ],
  3: [
    77, 78, 79, 80, 81, 82, 83, 84, 85, 17, 34, 86, 87, 88, 89, 90, 91, 92, 
    93, 55, 94, 95, 96, 97, 98, 99, 100, 101, 102, 103, 104, 105, 106
  ],
  4: [
    107, 108, 109, 4, 110, 111, 112, 113, 114, 115, 116, 117, 118, 37, 86, 
    119, 120, 20, 121, 122, 123, 124, 125, 58, 126, 127
  ]
};

const SPECIAL_CONNECTIONS = {
  2: [
    { from: 43, to: 75, type: 'branch' }, 
    { from: 75, to: 76, type: 'branch' }, 
    { from: 76, to: 14, type: 'branch' } 
  ]
};

/**
 * 노선별 연결 경로 생성
 */
export const generateLineConnections = (): LineConnection[] => {
  const connections: LineConnection[] = [];

  Object.entries(LINE_STATION_ORDERS).forEach(([lineNumStr, stationIds]) => {
    const lineNumber = parseInt(lineNumStr);
    const color = LINE_COLORS[lineNumber as keyof typeof LINE_COLORS];
    const segments: LineSegment[] = [];
    const pathParts: string[] = [];

    // 기본 순차 연결
    for (let i = 0; i < stationIds.length - 1; i++) {
      const fromStationId = stationIds[i];
      const toStationId = stationIds[i + 1];
      
      const fromStation = METRO_STATIONS.find(s => s.id === fromStationId);
      const toStation = METRO_STATIONS.find(s => s.id === toStationId);

      if (fromStation && toStation) {
        // 환승역이나 특수 연결의 경우 곡선 사용
        const isSpecialConnection = fromStation.isTransfer || toStation.isTransfer;
        const path = isSpecialConnection 
          ? createCurvedPath(fromStation.x, fromStation.y, toStation.x, toStation.y, 0.1)
          : createStraightPath(fromStation.x, fromStation.y, toStation.x, toStation.y);

        segments.push({
          lineNumber,
          fromStationId,
          toStationId,
          path,
          color
        });

        pathParts.push(path);
      }
    }

    // 특수 연결 처리 (분기선 등)
    const specialConnections = SPECIAL_CONNECTIONS[lineNumber as keyof typeof SPECIAL_CONNECTIONS];
    if (specialConnections) {
      specialConnections.forEach(conn => {
        const fromStation = METRO_STATIONS.find(s => s.id === conn.from);
        const toStation = METRO_STATIONS.find(s => s.id === conn.to);

        if (fromStation && toStation) {
          const path = createCurvedPath(
            fromStation.x, fromStation.y, 
            toStation.x, toStation.y, 
            0.3 // 분기선은 더 큰 곡률
          );

          segments.push({
            lineNumber,
            fromStationId: conn.from,
            toStationId: conn.to,
            path,
            color
          });

          pathParts.push(path);
        }
      });
    }

    connections.push({
      lineNumber,
      segments,
      fullPath: pathParts.join(' '),
      color
    });
  });

  return connections;
};

/**
 * 특정 노선의 연결만 가져오기
 */
export const getLineConnection = (lineNumber: number): LineConnection | undefined => {
  const connections = generateLineConnections();
  return connections.find(conn => conn.lineNumber === lineNumber);
};

/**
 * 보이는 노선들의 연결만 가져오기
 */
export const getVisibleLineConnections = (visibleLines: number[]): LineConnection[] => {
  const allConnections = generateLineConnections();
  return allConnections.filter(conn => visibleLines.includes(conn.lineNumber));
};

/**
 * 두 역 사이의 직접 연결 여부 확인
 */
export const areStationsConnected = (stationId1: number, stationId2: number): boolean => {
  const connections = generateLineConnections();
  
  return connections.some(lineConn => 
    lineConn.segments.some(segment => 
      (segment.fromStationId === stationId1 && segment.toStationId === stationId2) ||
      (segment.fromStationId === stationId2 && segment.toStationId === stationId1)
    )
  );
};

/**
 * 역 간 최단 경로 찾기 (간단한 BFS)
 */
export const findShortestPath = (fromStationId: number, toStationId: number): number[] => {
  const connections = generateLineConnections();
  const graph: { [key: number]: number[] } = {};

  // 그래프 구성
  connections.forEach(lineConn => {
    lineConn.segments.forEach(segment => {
      if (!graph[segment.fromStationId]) graph[segment.fromStationId] = [];
      if (!graph[segment.toStationId]) graph[segment.toStationId] = [];
      
      graph[segment.fromStationId].push(segment.toStationId);
      graph[segment.toStationId].push(segment.fromStationId);
    });
  });

  // BFS로 최단 경로 찾기
  const queue: { stationId: number; path: number[] }[] = [{ stationId: fromStationId, path: [fromStationId] }];
  const visited = new Set<number>();

  while (queue.length > 0) {
    const { stationId, path } = queue.shift()!;

    if (stationId === toStationId) {
      return path;
    }

    if (visited.has(stationId)) continue;
    visited.add(stationId);

    const neighbors = graph[stationId] || [];
    neighbors.forEach(neighborId => {
      if (!visited.has(neighborId)) {
        queue.push({
          stationId: neighborId,
          path: [...path, neighborId]
        });
      }
    });
  }

  return []; // 경로 없음
};

export default {
  generateLineConnections,
  getLineConnection,
  getVisibleLineConnections,
  areStationsConnected,
  findShortestPath
};