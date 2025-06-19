// src/components/metroMap/data/lines.ts

import { STATIONS_BY_LINE } from './stations';

/**
 * 노선 연결 정보
 */
export interface LineConnection {
  from: string;
  to: string;
  line: number;
  distance?: number;
  travelTime?: number; // 예상 소요시간 (분)
}

/**
 * 지하철 노선 정보
 */
export interface SubwayLine {
  number: number;
  name: string;
  color: string;
  stations: string[];
  connections: LineConnection[];
  isCircular?: boolean; // 순환선 여부 (2호선)
  totalLength?: number; // 총 연장 (km)
}

/**
 * 노선별 색상 정보 (서울교통공사 공식 색상)
 */
export const LINE_COLORS: Record<number, string> = {
  1: '#0052A4', // 남색
  2: '#00A84D', // 초록색
  3: '#EF7C1C', // 주황색
  4: '#00A5DE', // 하늘색
  5: '#996CAC', // 보라색
  6: '#CD7C2F', // 갈색
  7: '#747F00', // 올리브색
  8: '#E6186C', // 분홍색
  9: '#BDB092', // 금색
};

/**
 * 노선별 이름
 */
export const LINE_NAMES: Record<number, string> = {
  1: '1호선',
  2: '2호선',
  3: '3호선',
  4: '4호선',
  5: '5호선',
  6: '6호선',
  7: '7호선',
  8: '8호선',
  9: '9호선',
};

/**
 * 1호선 연결 정보 (수직선 구조)
 */
const LINE1_CONNECTIONS: LineConnection[] = [
  { from: 'line1-dobongsan', to: 'line1-dobong', line: 1 },
  { from: 'line1-dobong', to: 'line1-banghak', line: 1 },
  { from: 'line1-banghak', to: 'line1-changdong', line: 1 },
  { from: 'line1-changdong', to: 'line1-nockcheon', line: 1 },
  { from: 'line1-nockcheon', to: 'line1-wolkye', line: 1 },
  { from: 'line1-wolkye', to: 'line1-kwangwoondae', line: 1 },
  { from: 'line1-kwangwoondae', to: 'line1-seokkye', line: 1 },
  { from: 'line1-seokkye', to: 'line1-gireum', line: 1 },
  { from: 'line1-gireum', to: 'line1-seongshin', line: 1 },
  { from: 'line1-seongshin', to: 'line1-hansung', line: 1 },
  { from: 'line1-hansung', to: 'line1-hyehwa', line: 1 },
  { from: 'line1-hyehwa', to: 'line1-dongdaemun', line: 1 },
  { from: 'line1-dongdaemun', to: 'line1-jongro5ga', line: 1 },
  { from: 'line1-jongro5ga', to: 'line1-jongro3ga', line: 1 },
  { from: 'line1-jongro3ga', to: 'line1-jonggak', line: 1 },
  { from: 'line1-jonggak', to: 'line1-cityhall', line: 1 },
  { from: 'line1-cityhall', to: 'line1-seoul', line: 1 },
  { from: 'line1-seoul', to: 'line1-namyeong', line: 1 },
  { from: 'line1-namyeong', to: 'line1-yongsan', line: 1 },
  { from: 'line1-yongsan', to: 'line1-noryangjin', line: 1 },
  { from: 'line1-noryangjin', to: 'line1-daebang', line: 1 },
  { from: 'line1-daebang', to: 'line1-singil', line: 1 },
  { from: 'line1-singil', to: 'line1-yeongdeungpo', line: 1 },
  { from: 'line1-yeongdeungpo', to: 'line1-guro', line: 1 },
  { from: 'line1-guro', to: 'line1-gasandigital', line: 1 },
  { from: 'line1-gasandigital', to: 'line1-dogsan', line: 1 },
  // 지선
  { from: 'line1-guro', to: 'line1-guil', line: 1 },
  { from: 'line1-guil', to: 'line1-gaebong', line: 1 },
  { from: 'line1-gaebong', to: 'line1-oryudong', line: 1 },
  { from: 'line1-oryudong', to: 'line1-onsu', line: 1 },
];

/**
 * 2호선 연결 정보 (순환선 구조)
 */
const LINE2_CONNECTIONS: LineConnection[] = [
  // 시계방향 연결
  { from: 'line2-hongdae', to: 'line2-hapjeong', line: 2 },
  { from: 'line2-hapjeong', to: 'line2-dangsan', line: 2 },
  { from: 'line2-dangsan', to: 'line2-yeongdeungpo-gu', line: 2 },
  { from: 'line2-yeongdeungpo-gu', to: 'line2-munrae', line: 2 },
  { from: 'line2-munrae', to: 'line2-gurodigital', line: 2 },
  { from: 'line2-gurodigital', to: 'line2-daelim', line: 2 },
  { from: 'line2-daelim', to: 'line2-sindorim', line: 2 },
  { from: 'line2-sindorim', to: 'line2-sindaebang', line: 2 },
  { from: 'line2-sindaebang', to: 'line2-boramae', line: 2 },
  { from: 'line2-boramae', to: 'line2-sadang', line: 2 },
  { from: 'line2-sadang', to: 'line2-bangbae', line: 2 },
  { from: 'line2-bangbae', to: 'line2-seocho', line: 2 },
  { from: 'line2-seocho', to: 'line2-kyodae', line: 2 },
  { from: 'line2-kyodae', to: 'line2-gangnam', line: 2 },
  { from: 'line2-gangnam', to: 'line2-yeoksam', line: 2 },
  { from: 'line2-yeoksam', to: 'line2-seonleung', line: 2 },
  { from: 'line2-seonleung', to: 'line2-samsung', line: 2 },
  { from: 'line2-samsung', to: 'line2-jamsil', line: 2 },
  { from: 'line2-jamsil', to: 'line2-jamsil-saenae', line: 2 },
  { from: 'line2-jamsil-saenae', to: 'line2-sports-complex', line: 2 },
  { from: 'line2-sports-complex', to: 'line2-gangbyeon', line: 2 },
  { from: 'line2-gangbyeon', to: 'line2-konkuk', line: 2 },
  { from: 'line2-konkuk', to: 'line2-seongsu', line: 2 },
  { from: 'line2-seongsu', to: 'line2-ttukseom', line: 2 },
  { from: 'line2-ttukseom', to: 'line2-hanyang', line: 2 },
  { from: 'line2-hanyang', to: 'line2-wangsimni', line: 2 },
  { from: 'line2-wangsimni', to: 'line2-sangwangsimni', line: 2 },
  { from: 'line2-sangwangsimni', to: 'line2-sindang', line: 2 },
  { from: 'line2-sindang', to: 'line2-euljirio4ga', line: 2 },
  { from: 'line2-euljirio4ga', to: 'line2-euljirio3ga', line: 2 },
  { from: 'line2-euljirio3ga', to: 'line2-euljirio-ipgu', line: 2 },
  { from: 'line2-euljirio-ipgu', to: 'line2-hongdae', line: 2 }, // 순환선 완성
];

/**
 * 3호선 연결 정보 (대각선 구조)
 */
const LINE3_CONNECTIONS: LineConnection[] = [
  { from: 'line3-gupabal', to: 'line3-yeonsinne', line: 3 },
  { from: 'line3-yeonsinne', to: 'line3-bulgwang', line: 3 },
  { from: 'line3-bulgwang', to: 'line3-nokbeon', line: 3 },
  { from: 'line3-nokbeon', to: 'line3-hongje', line: 3 },
  { from: 'line3-hongje', to: 'line3-muakjae', line: 3 },
  { from: 'line3-muakjae', to: 'line3-dongnimmun', line: 3 },
  { from: 'line3-dongnimmun', to: 'line3-gyeongbokgung', line: 3 },
  { from: 'line3-gyeongbokgung', to: 'line3-anguk', line: 3 },
  { from: 'line3-anguk', to: 'line3-chungmuro', line: 3 },
  { from: 'line3-chungmuro', to: 'line3-dongdaeipmgu', line: 3 },
  { from: 'line3-dongdaeipmgu', to: 'line3-yaksu', line: 3 },
  { from: 'line3-yaksu', to: 'line3-geumho', line: 3 },
  { from: 'line3-geumho', to: 'line3-oksu', line: 3 },
  { from: 'line3-oksu', to: 'line3-apgujeong', line: 3 },
  { from: 'line3-apgujeong', to: 'line3-sinsa', line: 3 },
  { from: 'line3-sinsa', to: 'line3-jamwon', line: 3 },
  { from: 'line3-jamwon', to: 'line3-express-terminal', line: 3 },
  { from: 'line3-express-terminal', to: 'line3-nambu-terminal', line: 3 },
  { from: 'line3-nambu-terminal', to: 'line3-yangjae', line: 3 },
];

/**
 * 4호선 연결 정보 (수직선 구조)
 */
const LINE4_CONNECTIONS: LineConnection[] = [
  { from: 'line4-dangogae', to: 'line4-sanggyei', line: 4 },
  { from: 'line4-sanggyei', to: 'line4-nowon', line: 4 },
  { from: 'line4-nowon', to: 'line4-changdong', line: 4 },
  { from: 'line4-changdong', to: 'line4-ssangmun', line: 4 },
  { from: 'line4-ssangmun', to: 'line4-suyu', line: 4 },
  { from: 'line4-suyu', to: 'line4-mia', line: 4 },
  { from: 'line4-mia', to: 'line4-miasageori', line: 4 },
  { from: 'line4-miasageori', to: 'line4-gireum', line: 4 },
  { from: 'line4-gireum', to: 'line4-seongshin', line: 4 },
  { from: 'line4-seongshin', to: 'line4-hansung', line: 4 },
  { from: 'line4-hansung', to: 'line4-hyehwa', line: 4 },
  { from: 'line4-hyehwa', to: 'line4-dongdaemun', line: 4 },
  { from: 'line4-dongdaemun', to: 'line4-chungmuro', line: 4 },
  { from: 'line4-chungmuro', to: 'line4-myeongdong', line: 4 },
  { from: 'line4-myeongdong', to: 'line4-hoehyeon', line: 4 },
  { from: 'line4-hoehyeon', to: 'line4-seoul', line: 4 },
  { from: 'line4-seoul', to: 'line4-samsangji', line: 4 },
  { from: 'line4-samsangji', to: 'line4-ichon', line: 4 },
  { from: 'line4-ichon', to: 'line4-dongjak', line: 4 },
  { from: 'line4-dongjak', to: 'line4-sadang', line: 4 },
];

/**
 * 모든 노선 연결 정보
 */
export const ALL_CONNECTIONS: LineConnection[] = [
  ...LINE1_CONNECTIONS,
  ...LINE2_CONNECTIONS,
  ...LINE3_CONNECTIONS,
  ...LINE4_CONNECTIONS,
];

/**
 * 노선별 연결 정보 그룹핑
 */
export const CONNECTIONS_BY_LINE: Record<number, LineConnection[]> = {
  1: LINE1_CONNECTIONS,
  2: LINE2_CONNECTIONS,
  3: LINE3_CONNECTIONS,
  4: LINE4_CONNECTIONS,
};

/**
 * 지하철 노선 정보
 */
export const SUBWAY_LINES: SubwayLine[] = [
  {
    number: 1,
    name: LINE_NAMES[1],
    color: LINE_COLORS[1],
    stations: STATIONS_BY_LINE[1]?.map(s => s.id) || [],
    connections: LINE1_CONNECTIONS,
    isCircular: false,
  },
  {
    number: 2,
    name: LINE_NAMES[2],
    color: LINE_COLORS[2],
    stations: STATIONS_BY_LINE[2]?.map(s => s.id) || [],
    connections: LINE2_CONNECTIONS,
    isCircular: true,
  },
  {
    number: 3,
    name: LINE_NAMES[3],
    color: LINE_COLORS[3],
    stations: STATIONS_BY_LINE[3]?.map(s => s.id) || [],
    connections: LINE3_CONNECTIONS,
    isCircular: false,
  },
  {
    number: 4,
    name: LINE_NAMES[4],
    color: LINE_COLORS[4],
    stations: STATIONS_BY_LINE[4]?.map(s => s.id) || [],
    connections: LINE4_CONNECTIONS,
    isCircular: false,
  },
];

/**
 * 특정 노선의 연결 정보 가져오기
 */
export const getConnectionsByLine = (lineNumber: number): LineConnection[] => {
  return CONNECTIONS_BY_LINE[lineNumber] || [];
};

/**
 * 특정 역에서 출발하는 연결 찾기
 */
export const getConnectionsFromStation = (stationId: string): LineConnection[] => {
  return ALL_CONNECTIONS.filter(conn => conn.from === stationId);
};

/**
 * 특정 역으로 도착하는 연결 찾기
 */
export const getConnectionsToStation = (stationId: string): LineConnection[] => {
  return ALL_CONNECTIONS.filter(conn => conn.to === stationId);
};

/**
 * 두 역이 직접 연결되어 있는지 확인
 */
export const areStationsConnected = (stationId1: string, stationId2: string): boolean => {
  return ALL_CONNECTIONS.some(conn => 
    (conn.from === stationId1 && conn.to === stationId2) ||
    (conn.from === stationId2 && conn.to === stationId1)
  );
};

/**
 * 노선 정보 가져오기
 */
export const getLineInfo = (lineNumber: number): SubwayLine | undefined => {
  return SUBWAY_LINES.find(line => line.number === lineNumber);
};

/**
 * 노선 색상 가져오기
 */
export const getLineColor = (lineNumber: number): string => {
  return LINE_COLORS[lineNumber] || '#888888';
};

/**
 * 지하철 노선 통계
 */
export const LINE_STATISTICS = {
  totalLines: SUBWAY_LINES.length,
  totalConnections: ALL_CONNECTIONS.length,
  circularLines: SUBWAY_LINES.filter(line => line.isCircular).map(line => line.number),
  longestLine: SUBWAY_LINES.reduce((longest, current) => 
    current.stations.length > longest.stations.length ? current : longest
  ),
  shortestLine: SUBWAY_LINES.reduce((shortest, current) => 
    current.stations.length < shortest.stations.length ? current : shortest
  ),
};

/**
 * 개발용 디버깅 함수
 */
export const debugLineData = () => {
  console.group('🚇 지하철 노선 데이터 분석');
  console.log('총 노선 수:', LINE_STATISTICS.totalLines);
  console.log('총 연결 수:', LINE_STATISTICS.totalConnections);
  console.log('순환선:', LINE_STATISTICS.circularLines);
  console.log('최장 노선:', `${LINE_STATISTICS.longestLine.name} (${LINE_STATISTICS.longestLine.stations.length}개역)`);
  console.log('최단 노선:', `${LINE_STATISTICS.shortestLine.name} (${LINE_STATISTICS.shortestLine.stations.length}개역)`);
  
  SUBWAY_LINES.forEach(line => {
    console.log(`${line.name}: ${line.stations.length}개역, ${line.connections.length}개 연결`);
  });
  
  console.groupEnd();
};

// 개발 환경에서 자동 실행
if (typeof process !== 'undefined' && process.env?.NODE_ENV === 'development') {
  debugLineData();
}