// src/components/metroMap/types/metro.ts

import type { Station, LineConnection, SubwayLine, District } from '../data';

/**
 * 지하철 노선도 컴포넌트의 메인 Props
 */
export interface MetroMapProps {
  width?: number;
  height?: number;
  onStationClick?: (station: Station) => void;
  onStationHover?: (station: Station | null) => void;
  onGameStart?: (stationId: string) => void;
  onStationDetail?: (stationId: string) => void;
  initialVisibleLines?: number[];
  showDistricts?: boolean;
  showLabels?: boolean;
  interactive?: boolean;
  theme?: MapTheme;
  className?: string;
}

/**
 * 지도 테마
 */
export type MapTheme = 'light' | 'dark' | 'colorful' | 'minimal';

/**
 * 상호작용 모드
 */
export type InteractionMode = 'view' | 'select' | 'game' | 'edit';

/**
 * 레이어 표시 설정
 */
export interface LayerVisibility {
  districts: boolean;
  stations: boolean;
  lines: boolean;
  labels: boolean;
  river: boolean;
}

/**
 * 지도 뷰포트 상태
 */
export interface MapViewport {
  zoom: number;
  panX: number;
  panY: number;
  centerX: number;
  centerY: number;
}

/**
 * 지하철역 상호작용 상태
 */
export interface StationInteractionState {
  selectedStation: Station | null;
  hoveredStation: Station | null;
  focusedStation: Station | null;
  highlightedStations: string[];
}

/**
 * 노선 필터 상태
 */
export interface LineFilterState {
  visibleLines: number[];
  highlightedLine: number | null;
  dimmedLines: number[];
}

/**
 * 지도 렌더링 옵션
 */
export interface MapRenderOptions {
  stationRadius: number;
  lineWidth: number;
  hoverRadius: number;
  animationDuration: number;
  showTransferLines: boolean;
  showStoryIndicators: boolean;
  enableTooltips: boolean;
  enableAnimations: boolean;
}

/**
 * 툴팁 표시 정보
 */
export interface TooltipData {
  station: Station;
  position: { x: number; y: number };
  visible: boolean;
  content?: {
    title: string;
    subtitle?: string;
    lines: string[];
    transferInfo?: string;
    storyInfo?: string;
    additionalInfo?: string[];
  };
}

/**
 * 지하철 노선 스타일 정보
 */
export interface LineStyle {
  color: string;
  width: number;
  opacity: number;
  strokeDasharray?: string;
  animationDelay?: number;
}

/**
 * 지하철역 스타일 정보
 */
export interface StationStyle {
  fill: string;
  stroke: string;
  strokeWidth: number;
  radius: number;
  opacity: number;
  scale?: number;
  glowEffect?: boolean;
}

/**
 * 구청 스타일 정보
 */
export interface DistrictStyle {
  fill: string;
  stroke?: string;
  strokeWidth?: number;
  opacity: number;
  pattern?: string;
}

/**
 * 이벤트 핸들러 타입들
 */
export type StationEventHandler = (station: Station, event: React.MouseEvent) => void;
export type LineEventHandler = (line: SubwayLine, event: React.MouseEvent) => void;
export type DistrictEventHandler = (district: District, event: React.MouseEvent) => void;
export type ViewportChangeHandler = (viewport: MapViewport) => void;

/**
 * 지하철 노선도 컨텍스트 데이터
 */
export interface MetroMapContextData {
  // 상태
  viewport: MapViewport;
  interaction: StationInteractionState;
  lineFilter: LineFilterState;
  layerVisibility: LayerVisibility;
  
  // 설정
  theme: MapTheme;
  renderOptions: MapRenderOptions;
  
  // 이벤트 핸들러
  onStationClick: StationEventHandler;
  onStationHover: (station: Station | null) => void;
  onLineToggle: (lineNumber: number) => void;
  onViewportChange: ViewportChangeHandler;
  
  // 유틸리티 함수
  getStationStyle: (station: Station) => StationStyle;
  getLineStyle: (line: SubwayLine) => LineStyle;
  getDistrictStyle: (district: District) => DistrictStyle;
}

/**
 * 애니메이션 설정
 */
export interface AnimationConfig {
  enabled: boolean;
  duration: number;
  easing: 'ease' | 'ease-in' | 'ease-out' | 'ease-in-out' | 'linear';
  delay?: number;
  stagger?: number;
}

/**
 * 성능 최적화 설정
 */
export interface PerformanceConfig {
  enableVirtualization: boolean;
  maxVisibleStations: number;
  debounceDelay: number;
  throttleDelay: number;
  lazyLoadThreshold: number;
}