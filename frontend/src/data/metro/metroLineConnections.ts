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
    1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 124, 16, 17, 18, 19, 20, 
    21, 22, 23, 24, 25, 26, 66, 27, 28, 29, 30, 31
  ],
  2: [
    19, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 
    49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62, 63, 64, 65, 66, 
    67, 68, 69, 70, 71, 72, 73, 74
  ],
  3: [
    83, 84, 85, 86, 87, 88, 89, 90, 91, 17, 35, 92, 93, 94, 95, 96, 97,
    98, 99, 100, 55, 101, 102, 103, 104, 105, 106, 107, 108, 109, 110, 111, 112
  ],
  4: [
    113, 114, 115, 4, 116, 117, 118, 119, 120, 121, 122, 123, 124, 37, 92, 125, 126, 20, 127,
    128, 129, 130, 131, 132, 58, 133
  ]
};

const SPECIAL_CONNECTIONS = {
  1:[
    {from: 27, to: 32, type: 'branch' },
    {from: 32, to: 33, type: 'branch' }
  ],
  2: [
    { from: 43, to: 75, type: 'branch' }, 
    { from: 75, to: 76, type: 'branch' }, 
    { from: 76, to: 77, type: 'branch' }, 
    { from: 77, to: 78, type: 'branch' }, 
    { from: 78, to: 14, type: 'branch' },
    { from: 66, to: 79, type: 'branch' },
    { from: 79, to: 80, type: 'branch' },
    { from: 80, to: 81, type: 'branch' },
    { from: 81, to: 82, type: 'branch' },
    { from: 19, to: 74, type: 'branch' },
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
            0.1 // 분기선은 더 큰 곡률
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
 * 보이는 노선들의 연결만 가져오기
 */
export const getVisibleLineConnections = (visibleLines: number[]): LineConnection[] => {
  const allConnections = generateLineConnections();
  return allConnections.filter(conn => visibleLines.includes(conn.lineNumber));
};

const metroLineConnections = {
  generateLineConnections,
  getVisibleLineConnections
};

export default metroLineConnections;