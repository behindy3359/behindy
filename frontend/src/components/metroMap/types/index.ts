// src/components/metroMap/types/index.ts

// 메인 지하철 노선도 타입들
export type {
  MetroMapProps,
  MapTheme,
  InteractionMode,
  LayerVisibility,
  MapViewport,
  StationInteractionState,
  LineFilterState,
  MapRenderOptions,
  TooltipData,
  LineStyle,
  StationStyle,
  DistrictStyle,
  StationEventHandler,
  LineEventHandler,
  DistrictEventHandler,
  ViewportChangeHandler,
  MetroMapContextData,
  AnimationConfig,
  PerformanceConfig
} from './metro';

// 좌표 관련 타입들
export type {
  Point2D,
  SVGCoordinate,
  ScreenCoordinate,
  GeoCoordinate,
  BoundingBox,
  TransformMatrix,
  ViewBox,
  CoordinateTransform,
  DistanceResult,
  CoordinateConverter,
  DistanceCalculator,
  BoundingBoxCalculator
} from './coordinates';

// 데이터 타입들도 재export (편의성)
export type {
  Station,
  LineConnection,
  SubwayLine,
  District
} from '../data';