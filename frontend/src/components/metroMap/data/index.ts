// 지하철역 관련
export {
  STATIONS,
  STATIONS_BY_LINE,
  TRANSFER_STATIONS,
  STORY_STATIONS,
  STATION_STATISTICS,
  getStationById,
  getStationsByName,
  getStationsByLine,
  findNearestStation,
  getDistanceBetweenStations,
  debugStationData
} from './stations';

export type { Station } from './stations';

// 지하철 노선 관련
export {
  ALL_CONNECTIONS,
  CONNECTIONS_BY_LINE,
  SUBWAY_LINES,
  LINE_COLORS,
  LINE_NAMES,
  LINE_STATISTICS,
  getConnectionsByLine,
  getConnectionsFromStation,
  getConnectionsToStation,
  areStationsConnected,
  getLineInfo,
  getLineColor,
  debugLineData
} from './lines';

export type { LineConnection, SubwayLine } from './lines';

// 서울시 구청 관련
export {
  DISTRICTS,
  ENRICHED_DISTRICTS,
  DISTRICTS_BY_REGION,
  DISTRICT_STATISTICS,
  REGION_STATISTICS,
  DISTRICT_COLOR_THEMES,
  HAN_RIVER_PATH,
  getDistrictById,
  getDistrictByName,
  getDistrictsByRegion,
  getDistrictColorByPopulation,
  getDistrictColorByRegion,
  findDistrictByCoordinate,
  debugDistrictData
} from './districts';

export type { District } from './districts';

// SVG 파서 관련
export {
  parseAllSvgData,
  parseStations,
  parseDistricts,
  extractLineNumber,
  extractStationName,
  getDistrictKoreanName
} from '../utils/svgParser';

export type { 
  RawStationData, 
  RawDistrictData, 
  ParsedStation, 
  ParsedDistrict 
} from '../utils/svgParser';

// ================================================================
// 통합 데이터 객체
// ================================================================

/**
 * 지하철 노선도의 모든 데이터를 포함하는 통합 객체
 */
export const METRO_MAP_DATA = {
  // 기본 데이터
  stations: STATIONS,
  districts: ENRICHED_DISTRICTS,
  lines: SUBWAY_LINES,
  connections: ALL_CONNECTIONS,
  
  // 그룹핑된 데이터
  stationsByLine: STATIONS_BY_LINE,
  connectionsByLine: CONNECTIONS_BY_LINE,
  districtsByRegion: DISTRICTS_BY_REGION,
  
  // 특별 분류
  transferStations: TRANSFER_STATIONS,
  storyStations: STORY_STATIONS,
  
  // 설정값
  lineColors: LINE_COLORS,
  lineNames: LINE_NAMES,
  
  // 통계
  statistics: {
    stations: STATION_STATISTICS,
    lines: LINE_STATISTICS,
    districts: DISTRICT_STATISTICS,
    regions: REGION_STATISTICS
  }
} as const;

/**
 * 데이터 검증 함수
 */
export const validateMetroMapData = () => {
  const issues: string[] = [];
  
  // 지하철역 검증
  if (STATIONS.length === 0) {
    issues.push('지하철역 데이터가 없습니다.');
  }
  
  // 노선 검증
  if (SUBWAY_LINES.length === 0) {
    issues.push('지하철 노선 데이터가 없습니다.');
  }
  
  // 연결 검증
  if (ALL_CONNECTIONS.length === 0) {
    issues.push('지하철 연결 데이터가 없습니다.');
  }
  
  // 구청 검증
  if (DISTRICTS.length === 0) {
    issues.push('구청 데이터가 없습니다.');
  }
  
  // 환승역 검증
  const invalidTransfers = TRANSFER_STATIONS.filter(station => 
    station.transferLines.length < 2
  );
  if (invalidTransfers.length > 0) {
    issues.push(`잘못된 환승역 데이터: ${invalidTransfers.map(s => s.name).join(', ')}`);
  }
  
  // 연결 일관성 검증
  const invalidConnections = ALL_CONNECTIONS.filter(conn => {
    const fromStation = getStationById(conn.from);
    const toStation = getStationById(conn.to);
    return !fromStation || !toStation;
  });
  
  if (invalidConnections.length > 0) {
    issues.push(`존재하지 않는 역을 참조하는 연결: ${invalidConnections.length}개`);
  }
  
  return {
    isValid: issues.length === 0,
    issues,
    summary: {
      stations: STATIONS.length,
      lines: SUBWAY_LINES.length,
      connections: ALL_CONNECTIONS.length,
      districts: DISTRICTS.length,
      transferStations: TRANSFER_STATIONS.length,
      storyStations: STORY_STATIONS.length
    }
  };
};

/**
 * 전체 데이터 요약 정보
 */
export const getDataSummary = () => {
  return {
    지하철역: `${STATIONS.length}개`,
    지하철노선: `${SUBWAY_LINES.length}개`,
    노선연결: `${ALL_CONNECTIONS.length}개`,
    서울구청: `${DISTRICTS.length}개`,
    환승역: `${TRANSFER_STATIONS.length}개`,
    스토리역: `${STORY_STATIONS.length}개`,
    운영노선: STATION_STATISTICS.lines.join(', ') + '호선'
  };
};

/**
 * 개발용 전체 데이터 디버깅
 */
export const debugAllData = () => {
  console.group('🚇 지하철 노선도 전체 데이터');
  
  // 데이터 검증
  const validation = validateMetroMapData();
  console.log('데이터 검증:', validation.isValid ? '✅ 통과' : '❌ 실패');
  
  if (!validation.isValid) {
    console.group('❌ 발견된 문제들');
    validation.issues.forEach(issue => console.warn(issue));
    console.groupEnd();
  }
  
  // 요약 정보
  console.group('📊 데이터 요약');
  const summary = getDataSummary();
  Object.entries(summary).forEach(([key, value]) => {
    console.log(`${key}: ${value}`);
  });
  console.groupEnd();
  
  // 세부 디버깅 (다른 함수들 호출)
  debugStationData();
  debugLineData();
  debugDistrictData();
  
  console.groupEnd();
  
  return validation;
};

// 개발 환경에서 자동 실행
if (process.env.NODE_ENV === 'development') {
  debugAllData();
}

// ================================================================
// 타입 정의 재export (편의성)
// ================================================================

export type MetroMapData = typeof METRO_MAP_DATA;
export type DataValidation = ReturnType<typeof validateMetroMapData>;
export type DataSummary = ReturnType<typeof getDataSummary>;