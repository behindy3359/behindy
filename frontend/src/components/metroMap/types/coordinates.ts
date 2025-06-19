// src/components/metroMap/types/coordinates.ts

/**
 * 2D 좌표 기본 인터페이스
 */
export interface Point2D {
  x: number;
  y: number;
}

/**
 * SVG 좌표 (원본)
 */
export interface SVGCoordinate extends Point2D {
  cx?: number; // SVG circle 전용
  cy?: number; // SVG circle 전용
}

/**
 * 정규화된 화면 좌표
 */
export interface ScreenCoordinate extends Point2D {
  scale?: number;
}

/**
 * 지리적 좌표 (위도/경도)
 */
export interface GeoCoordinate {
  lat: number;
  lng: number;
}

/**
 * 바운딩 박스
 */
export interface BoundingBox {
  minX: number;
  minY: number;
  maxX: number;
  maxY: number;
  width: number;
  height: number;
}

/**
 * 변환 매트릭스
 */
export interface TransformMatrix {
  a: number; // scale X
  b: number; // skew Y
  c: number; // skew X
  d: number; // scale Y
  e: number; // translate X
  f: number; // translate Y
}

/**
 * SVG 뷰박스
 */
export interface ViewBox {
  x: number;
  y: number;
  width: number;
  height: number;
}

/**
 * 좌표 변환 설정
 */
export interface CoordinateTransform {
  translate: Point2D;
  scale: Point2D;
  rotate: number;
  origin: Point2D;
}

/**
 * 거리 계산 결과
 */
export interface DistanceResult {
  distance: number;
  deltaX: number;
  deltaY: number;
  angle: number; // radians
  angleDegrees: number;
}

/**
 * 좌표 변환 유틸리티 함수 타입들
 */
export type CoordinateConverter = (point: Point2D) => Point2D;
export type DistanceCalculator = (from: Point2D, to: Point2D) => DistanceResult;
export type BoundingBoxCalculator = (points: Point2D[]) => BoundingBox;