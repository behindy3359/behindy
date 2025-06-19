// ================================================================
// 기본 좌표 및 지오메트리 타입
// ================================================================

export interface Coordinates {
  x: number;
  y: number;
}

export interface Bounds {
  minX: number;
  maxX: number;
  minY: number;
  maxY: number;
}

export interface ViewBox {
  x: number;
  y: number;
  width: number;
  height: number;
}

// ================================================================
// 지하철역 관련 타입
// ================================================================

export interface Station {
  id: string;                    // 역 고유 ID (예: "line1-dongdaemun")
  name: string;                  // 역명 (예: "동대문")
  nameEn?: string;              // 영문명 (선택적)
  position: Coordinates;         // SVG 좌표계 위치
  normalizedPosition?: Coordinates; // 정규화된 좌표 (0~1)
  
  // 노선 정보
  lineNumber: number;           // 주 노선 번호
  lines: number[];              // 소속 노선들 (환승역 고려)
  isTransfer: boolean;          // 환승역 여부
  
  // 게임 관련
  hasStory: boolean;            // 스토리 존재 여부
  storyId?: string;             // 관련 스토리 ID
  
  // 메타데이터
  district?: string;            // 소속 구
  opened?: string;              // 개통일
  exits?: number;               // 출구 수
}

// ================================================================
// 지하철 노선 관련 타입
// ================================================================

export interface MetroLine {
  number: number;               // 노선 번호 (1, 2, 3, 4...)
  name: string;                 // 노선명 ("1호선", "2호선"...)
  nameEn?: string;              // 영문명
  color: string;                // 노선 색상 (hex)
  
  // 역 정보
  stations: string[];           // 역 ID 목록 (순서대로)
  totalStations: number;        // 총 역 수
  
  // 경로 정보
  path?: string;                // SVG path 데이터
  connections: Connection[];     // 역간 연결 정보
  
  // 메타데이터
  opened?: string;              // 개통일
  operator?: string;            // 운영기관
  isCircular?: boolean;         // 순환선 여부 (2호선)
}

export interface Connection {
  fromStationId: string;
  toStationId: string;
  distance?: number;            // 역간 거리 (km)
  travelTime?: number;          // 소요시간 (분)
}

// ================================================================
// 서울시 구청 경계 관련 타입
// ================================================================

export interface District {
  id: string;                   // 구 ID (예: "mapo", "jongno")
  name: string;                 // 구명 (예: "마포구", "종로구")
  nameEn?: string;              // 영문명
  
  // 경계 정보
  path: string;                 // SVG path 데이터
  center: Coordinates;          // 중심점 좌표
  bounds: Bounds;               // 경계 박스
  
  // 메타데이터
  area?: number;                // 면적 (km²)
  population?: number;          // 인구수
  stations?: string[];          // 구내 지하철역 ID 목록
}

// ================================================================
// 지도 상호작용 관련 타입
// ================================================================

export type InteractionMode = 'view' | 'select' | 'game';
export type LayerType = 'districts' | 'lines' | 'stations' | 'labels';
export type MapTheme = 'light' | 'dark' | 'colorful' | 'minimal';

export interface MapState {
  // 보기 설정
  visibleLayers: LayerType[];
  visibleLines: number[];
  theme: MapTheme;
  
  // 상호작용 상태
  interactionMode: InteractionMode;
  selectedStation: string | null;
  hoveredStation: string | null;
  
  // 뷰포트 상태
  zoom: number;
  pan: Coordinates;
  bounds: Bounds;
}

export interface StationInteraction {
  stationId: string;
  type: 'click' | 'hover' | 'focus';
  position: Coordinates;
  timestamp: number;
}

// ================================================================
// 지도 컴포넌트 Props 타입
// ================================================================

export interface MetroMapProps {
  // 크기 및 스타일
  width?: number;
  height?: number;
  className?: string;
  theme?: MapTheme;
  
  // 초기 설정
  initialVisibleLines?: number[];
  initialSelectedStation?: string;
  initialZoom?: number;
  initialCenter?: Coordinates;
  
  // 기능 설정
  showDistricts?: boolean;
  showLabels?: boolean;
  showLegend?: boolean;
  interactive?: boolean;
  zoomable?: boolean;
  pannable?: boolean;
  
  // 이벤트 핸들러
  onStationClick?: (stationId: string, station: Station) => void;
  onStationHover?: (stationId: string | null, station: Station | null) => void;
  onGameStart?: (stationId: string) => void;
  onZoomChange?: (zoom: number) => void;
  onViewportChange?: (bounds: Bounds) => void;
}

// ================================================================
// 툴팁 및 UI 관련 타입
// ================================================================

export interface TooltipData {
  station: Station;
  position: Coordinates;
  visible: boolean;
}

export interface LegendItem {
  type: 'line' | 'station' | 'district';
  label: string;
  color: string;
  symbol?: string;
  visible: boolean;
}

// ================================================================
// 데이터 변환 관련 타입
// ================================================================

export interface SVGStationData {
  id: string;
  cx: number;                   // SVG 원본 x 좌표
  cy: number;                   // SVG 원본 y 좌표
  label?: string;               // 라벨 (역명)
}

export interface SVGPathData {
  id: string;
  d: string;                    // SVG path 데이터
  fill?: string;
  stroke?: string;
  strokeWidth?: number;
}

export interface CoordinateTransform {
  scale: number;
  translateX: number;
  translateY: number;
  rotation?: number;
}

// ================================================================
// 애니메이션 관련 타입
// ================================================================

export interface AnimationConfig {
  duration: number;             // 애니메이션 지속시간 (ms)
  easing: string;               // 이징 함수
  delay?: number;               // 지연 시간 (ms)
}

export interface StationAnimation {
  hover: AnimationConfig;
  select: AnimationConfig;
  appear: AnimationConfig;
}

// ================================================================
// 필터링 및 검색 관련 타입
// ================================================================

export interface SearchFilter {
  query: string;
  lines: number[];
  hasStory: boolean | null;
  districts: string[];
}

export interface SearchResult {
  stations: Station[];
  total: number;
  query: string;
}

// ================================================================
// 게임 연동 관련 타입
// ================================================================

export interface GameConnection {
  stationId: string;
  canStart: boolean;
  storyPreview?: string;
  requirements?: string[];
}

// ================================================================
// 컨텍스트 및 Hook 관련 타입
// ================================================================

export interface MetroMapContextValue {
  // 상태
  mapState: MapState;
  stations: Station[];
  lines: MetroLine[];
  districts: District[];
  
  // 액션
  setVisibleLines: (lines: number[]) => void;
  setTheme: (theme: MapTheme) => void;
  selectStation: (stationId: string | null) => void;
  hoverStation: (stationId: string | null) => void;
  
  // 유틸리티
  getStation: (id: string) => Station | undefined;
  getLine: (number: number) => MetroLine | undefined;
  getStationsByLine: (lineNumber: number) => Station[];
  searchStations: (filter: SearchFilter) => SearchResult;
}

// ================================================================
// 상수 및 설정 타입
// ================================================================

export interface MapConfig {
  // SVG 설정
  DEFAULT_VIEWBOX: ViewBox;
  DEFAULT_WIDTH: number;
  DEFAULT_HEIGHT: number;
  
  // 상호작용 설정
  MIN_ZOOM: number;
  MAX_ZOOM: number;
  ZOOM_STEP: number;
  
  // 렌더링 설정
  STATION_RADIUS: number;
  STATION_HOVER_RADIUS: number;
  LINE_WIDTH: number;
  LINE_HOVER_WIDTH: number;
  
  // 애니메이션 설정
  ANIMATION_DURATION: number;
  TRANSITION_EASING: string;
  
  // 색상 설정
  DEFAULT_COLORS: {
    BACKGROUND: string;
    DISTRICT_FILL: string;
    DISTRICT_STROKE: string;
    STATION_DEFAULT: string;
    STATION_HOVER: string;
    STATION_SELECTED: string;
    STATION_HAS_STORY: string;
  };
}

// ================================================================
// 유틸리티 함수 타입
// ================================================================

export type StationFilter = (station: Station) => boolean;
export type LineFilter = (line: MetroLine) => boolean;
export type DistrictFilter = (district: District) => boolean;

export type CoordinateConverter = (
  coord: Coordinates,
  from: ViewBox,
  to: ViewBox
) => Coordinates;

export type DistanceCalculator = (
  from: Coordinates,
  to: Coordinates
) => number;

// ================================================================
// 에러 관련 타입
// ================================================================

export interface MetroMapError {
  code: string;
  message: string;
  context?: {
    stationId?: string;
    lineNumber?: number;
    operation?: string;
  };
}

export type ErrorHandler = (error: MetroMapError) => void;