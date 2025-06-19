  import type { 
  Station, 
  MetroLine, 
  District, 
  Coordinates, 
  SVGStationData,
  ViewBox 
} from '@/types/metro/metro';

/**
 * SVG ellipse 요소에서 역 데이터 추출
 */
export function extractStationsFromSVG(svgContent: string): SVGStationData[] {
  const stations: SVGStationData[] = [];
  
  // ellipse 요소를 정규식으로 추출
  const ellipseRegex = /<ellipse[^>]*id="([^"]*)"[^>]*cx="([^"]*)"[^>]*cy="([^"]*)"[^>]*\/>/g;
  
  let match;
  while ((match = ellipseRegex.exec(svgContent)) !== null) {
    const [, id, cx, cy] = match;
    
    // 지하철역 요소만 필터링 (id 패턴으로 판단)
    if (id.includes('line') || id.includes('station') || id.includes('-')) {
      stations.push({
        id: id,
        cx: parseFloat(cx),
        cy: parseFloat(cy),
        label: extractStationNameFromId(id)
      });
    }
  }
  
  return stations;
}

/**
 * ID에서 역명 추출
 */
function extractStationNameFromId(id: string): string {
  // 다양한 패턴에 대응
  const patterns = [
    /line\d+-(.+)/,           // line1-jonggak
    /(.+)-line\d+/,           // jonggak-line1
    /(.+)-\d+-\d+/,           // station-1-1
    /([^-]+)$/                // 마지막 단어
  ];
  
  for (const pattern of patterns) {
    const match = id.match(pattern);
    if (match) {
      return formatStationName(match[1]);
    }
  }
  
  return id; // 패턴에 맞지 않으면 ID 그대로 반환
}

/**
 * 역명 정규화
 */
function formatStationName(name: string): string {
  // 언더스코어를 공백으로, 영어는 첫글자 대문자
  return name
    .replace(/_/g, ' ')
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .toLowerCase()
    .replace(/\b\w/g, l => l.toUpperCase());
}

/**
 * SVG 역 데이터를 Station 객체로 변환
 */
export function convertSVGStationsToStations(
  svgStations: SVGStationData[],
  viewBox: ViewBox = { x: 0, y: 0, width: 640, height: 760 }
): Station[] {
  return svgStations.map((svgStation, index) => {
    const lineNumber = extractLineNumberFromId(svgStation.id);
    
    return {
      id: svgStation.id,
      name: svgStation.label || `역 ${index + 1}`,
      position: {
        x: svgStation.cx,
        y: svgStation.cy
      },
      normalizedPosition: normalizeCoordinates(
        { x: svgStation.cx, y: svgStation.cy },
        viewBox
      ),
      lineNumber: lineNumber,
      lines: [lineNumber],
      isTransfer: false, // 나중에 환승역 로직으로 업데이트
      hasStory: Math.random() > 0.7, // 임시: 30% 확률로 스토리 있음
    };
  });
}

/**
 * ID에서 노선 번호 추출
 */
function extractLineNumberFromId(id: string): number {
  const match = id.match(/line(\d+)/i);
  if (match) {
    return parseInt(match[1], 10);
  }
  
  // 다른 패턴들 시도
  const altMatch = id.match(/(\d+)-/);
  if (altMatch) {
    return parseInt(altMatch[1], 10);
  }
  
  return 1; // 기본값
}

/**
 * 좌표 정규화 (0~1 범위로)
 */
function normalizeCoordinates(coord: Coordinates, viewBox: ViewBox): Coordinates {
  return {
    x: (coord.x - viewBox.x) / viewBox.width,
    y: (coord.y - viewBox.y) / viewBox.height
  };
}

/**
 * 환승역 감지 및 병합
 */
export function detectTransferStations(stations: Station[]): Station[] {
  const stationGroups = new Map<string, Station[]>();
  
  // 역명으로 그룹화
  stations.forEach(station => {
    const normalizedName = normalizeStationName(station.name);
    const existing = stationGroups.get(normalizedName) || [];
    existing.push(station);
    stationGroups.set(normalizedName, existing);
  });
  
  const result: Station[] = [];
  
  stationGroups.forEach((group, name) => {
    if (group.length === 1) {
      // 단일 노선 역
      result.push(group[0]);
    } else {
      // 환승역 - 병합
      const merged = mergeTransferStations(group);
      result.push(merged);
    }
  });
  
  return result;
}

/**
 * 역명 정규화 (환승역 감지용)
 */
function normalizeStationName(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^\w가-힣]/g, '')
    .replace(/역$/, '')
    .trim();
}

/**
 * 환승역 병합
 */
function mergeTransferStations(stations: Station[]): Station {
  const baseStation = stations[0];
  const allLines = [...new Set(stations.flatMap(s => s.lines))].sort();
  
  // 중심점 계산 (평균 좌표)
  const avgPosition = {
    x: stations.reduce((sum, s) => sum + s.position.x, 0) / stations.length,
    y: stations.reduce((sum, s) => sum + s.position.y, 0) / stations.length
  };
  
  return {
    ...baseStation,
    id: `transfer-${baseStation.name}-${allLines.join('-')}`,
    position: avgPosition,
    lines: allLines,
    lineNumber: allLines[0], // 주 노선은 첫 번째로
    isTransfer: true,
    hasStory: stations.some(s => s.hasStory), // 하나라도 스토리가 있으면
  };
}

// ================================================================
// 노선 데이터 생성
// ================================================================

/**
 * 역 데이터로부터 노선 정보 생성
 */
export function generateMetroLines(stations: Station[]): MetroLine[] {
  const lineMap = new Map<number, Station[]>();
  
  // 노선별로 역 그룹화
  stations.forEach(station => {
    station.lines.forEach(lineNum => {
      const existing = lineMap.get(lineNum) || [];
      existing.push(station);
      lineMap.set(lineNum, existing);
    });
  });
  
  const lines: MetroLine[] = [];
  
  lineMap.forEach((lineStations, lineNumber) => {
    const line: MetroLine = {
      number: lineNumber,
      name: `${lineNumber}호선`,
      color: getLineColor(lineNumber),
      stations: lineStations.map(s => s.id),
      totalStations: lineStations.length,
      connections: generateConnections(lineStations),
      isCircular: lineNumber === 2, // 2호선만 순환선
    };
    
    lines.push(line);
  });
  
  return lines.sort((a, b) => a.number - b.number);
}

/**
 * 노선별 기본 색상
 */
function getLineColor(lineNumber: number): string {
  const colors: Record<number, string> = {
    1: '#0052A4',  // 1호선 - 블루
    2: '#00A84D',  // 2호선 - 그린
    3: '#EF7C1C',  // 3호선 - 오렌지
    4: '#00A5DE',  // 4호선 - 라이트블루
    5: '#996CAC',  // 5호선 - 퍼플
    6: '#CD7C2F',  // 6호선 - 브라운
    7: '#747F00',  // 7호선 - 올리브
    8: '#E6186C',  // 8호선 - 핑크
    9: '#BDB092',  // 9호선 - 베이지
  };
  
  return colors[lineNumber] || '#666666';
}

/**
 * 역간 연결 정보 생성
 */
function generateConnections(stations: Station[]) {
  const connections = [];
  
  // 좌표 기준으로 정렬하여 연결 순서 결정
  const sortedStations = [...stations].sort((a, b) => {
    // Y 좌표 우선, 그 다음 X 좌표
    const yDiff = a.position.y - b.position.y;
    return yDiff !== 0 ? yDiff : a.position.x - b.position.x;
  });
  
  for (let i = 0; i < sortedStations.length - 1; i++) {
    connections.push({
      fromStationId: sortedStations[i].id,
      toStationId: sortedStations[i + 1].id,
      distance: calculateDistance(
        sortedStations[i].position,
        sortedStations[i + 1].position
      )
    });
  }
  
  return connections;
}

/**
 * 두 점 사이의 거리 계산
 */
function calculateDistance(from: Coordinates, to: Coordinates): number {
  const dx = to.x - from.x;
  const dy = to.y - from.y;
  return Math.sqrt(dx * dx + dy * dy);
}

/**
 * 제공된 SVG에서 지하철역 데이터 추출
 */
export function extractSeoulMetroData(): {
  stations: Station[];
  lines: MetroLine[];
  viewBox: ViewBox;
} {
  // 실제 SVG 내용에서 데이터 추출
  const svgContent = `
    <!-- 여기에 실제 SVG 내용이 들어갑니다 -->
    <!-- 현재는 샘플 데이터로 대체 -->
  `;
  
  // 임시 샘플 데이터 (실제 구현시 SVG에서 추출)
  const sampleStations: SVGStationData[] = [
    { id: 'line1-jonggak', cx: 300, cy: 470, label: '종각' },
    { id: 'line1-seoul', cx: 300, cy: 530, label: '서울역' },
    { id: 'line2-hongik', cx: 150, cy: 440, label: '홍대입구' },
    { id: 'line2-gangnam', cx: 460, cy: 580, label: '강남' },
    // ... 더 많은 역 데이터
  ];
  
  const viewBox: ViewBox = { x: 0, y: 0, width: 640, height: 760 };
  
  // SVG 데이터를 Station 객체로 변환
  let stations = convertSVGStationsToStations(sampleStations, viewBox);
  
  // 환승역 처리
  stations = detectTransferStations(stations);
  
  // 노선 정보 생성
  const lines = generateMetroLines(stations);
  
  return {
    stations,
    lines,
    viewBox
  };
}

/**
 * 추출된 데이터 검증
 */
export function validateMetroData(stations: Station[], lines: MetroLine[]): {
  isValid: boolean;
  errors: string[];
} {
  const errors: string[] = [];
  
  // 역 데이터 검증
  if (stations.length === 0) {
    errors.push('No stations found');
  }
  
  stations.forEach((station, index) => {
    if (!station.id) errors.push(`Station ${index}: missing id`);
    if (!station.name) errors.push(`Station ${station.id}: missing name`);
    if (station.lines.length === 0) errors.push(`Station ${station.id}: no lines`);
  });
  
  // 노선 데이터 검증
  if (lines.length === 0) {
    errors.push('No lines found');
  }
  
  lines.forEach(line => {
    if (!line.name) errors.push(`Line ${line.number}: missing name`);
    if (!line.color) errors.push(`Line ${line.number}: missing color`);
    if (line.stations.length === 0) errors.push(`Line ${line.number}: no stations`);
  });
  
  return {
    isValid: errors.length === 0,
    errors
  };
}

export default {
  extractStationsFromSVG,
  convertSVGStationsToStations,
  detectTransferStations,
  generateMetroLines,
  extractSeoulMetroData,
  validateMetroData
};