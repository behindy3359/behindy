// src/components/metroMap/utils/coordinateUtils.ts

/**
 * SVG 레이어별 Transform 값
 * 원본 SVG의 <g> 요소 transform 속성에서 추출
 */
export const LAYER_TRANSFORMS = {
  districts: { x: 0.21465595, y: -2.3612153 },
  stations: { x: 0.28620792, y: -1.0017277 }
} as const;

/**
 * SVG ViewBox 정보
 */
export const SVG_VIEWBOX = {
  x: 0,
  y: 0,
  width: 132.29166,
  height: 119.0625
} as const;

/**
 * 레이어 타입 정의
 */
export type LayerType = 'districts' | 'stations';

/**
 * 좌표 인터페이스
 */
export interface Coordinate {
  x: number;
  y: number;
}

/**
 * 원본 SVG 좌표를 정규화된 좌표로 변환
 * 모든 transform을 적용하여 실제 화면 좌표로 변환
 * 
 * @param x - 원본 x 좌표
 * @param y - 원본 y 좌표  
 * @param layer - 레이어 타입
 * @returns 정규화된 좌표
 */
export const normalizeCoordinate = (
  x: number, 
  y: number, 
  layer: LayerType
): Coordinate => {
  const transform = LAYER_TRANSFORMS[layer];
  
  return {
    x: x + transform.x,
    y: y + transform.y
  };
};

/**
 * 지하철역 좌표를 구청 레이어 기준으로 정렬
 * 두 레이어를 같은 좌표계에서 사용할 때 활용
 * 
 * @param stationX - 지하철역 원본 x 좌표
 * @param stationY - 지하철역 원본 y 좌표
 * @returns 구청 레이어 기준으로 정렬된 좌표
 */
export const alignStationToDistrict = (
  stationX: number, 
  stationY: number
): Coordinate => {
  const offsetX = LAYER_TRANSFORMS.districts.x - LAYER_TRANSFORMS.stations.x;
  const offsetY = LAYER_TRANSFORMS.districts.y - LAYER_TRANSFORMS.stations.y;
  
  return {
    x: stationX + offsetX,
    y: stationY + offsetY
  };
};

/**
 * 구청 좌표를 지하철역 레이어 기준으로 정렬
 * 
 * @param districtX - 구청 원본 x 좌표
 * @param districtY - 구청 원본 y 좌표
 * @returns 지하철역 레이어 기준으로 정렬된 좌표
 */
export const alignDistrictToStation = (
  districtX: number, 
  districtY: number
): Coordinate => {
  const offsetX = LAYER_TRANSFORMS.stations.x - LAYER_TRANSFORMS.districts.x;
  const offsetY = LAYER_TRANSFORMS.stations.y - LAYER_TRANSFORMS.districts.y;
  
  return {
    x: districtX + offsetX,
    y: districtY + offsetY
  };
};

/**
 * 좌표계 통일 방식 선택
 */
export enum CoordinateSystem {
  NORMALIZED = 'normalized',     // 모든 transform 적용 (추천)
  DISTRICT_BASE = 'district',    // 구청 레이어 기준
  STATION_BASE = 'station'       // 지하철역 레이어 기준
}

/**
 * 선택된 좌표계로 좌표 변환
 * 
 * @param x - 원본 x 좌표
 * @param y - 원본 y 좌표
 * @param sourceLayer - 원본 레이어
 * @param targetSystem - 목표 좌표계
 * @returns 변환된 좌표
 */
export const convertCoordinate = (
  x: number,
  y: number,
  sourceLayer: LayerType,
  targetSystem: CoordinateSystem
): Coordinate => {
  switch (targetSystem) {
    case CoordinateSystem.NORMALIZED:
      return normalizeCoordinate(x, y, sourceLayer);
      
    case CoordinateSystem.DISTRICT_BASE:
      if (sourceLayer === 'districts') {
        return { x, y };
      }
      return alignStationToDistrict(x, y);
      
    case CoordinateSystem.STATION_BASE:
      if (sourceLayer === 'stations') {
        return { x, y };
      }
      return alignDistrictToStation(x, y);
      
    default:
      return { x, y };
  }
};

/**
 * 좌표 변환 테스트 헬퍼
 */
export const testCoordinateConversion = () => {
  // 테스트 데이터: 도봉산역
  const testStation = { cx: 88.365646, cy: 4.9796629 };
  
  console.log('=== 좌표 변환 테스트 ===');
  console.log('원본 지하철역:', testStation);
  
  // 1. 정규화된 좌표
  const normalized = normalizeCoordinate(testStation.cx, testStation.cy, 'stations');
  console.log('정규화된 좌표:', normalized);
  
  // 2. 구청 레이어 기준
  const alignedToDistrict = alignStationToDistrict(testStation.cx, testStation.cy);
  console.log('구청 기준 좌표:', alignedToDistrict);
  
  // 3. 변환 함수 테스트
  const converted = convertCoordinate(
    testStation.cx, 
    testStation.cy, 
    'stations', 
    CoordinateSystem.NORMALIZED
  );
  console.log('변환 함수 결과:', converted);
  
  return {
    original: testStation,
    normalized,
    alignedToDistrict,
    converted
  };
};

/**
 * SVG 좌표를 화면 좌표로 변환 (화면 크기 고려)
 * 
 * @param svgX - SVG x 좌표
 * @param svgY - SVG y 좌표
 * @param containerWidth - 컨테이너 너비
 * @param containerHeight - 컨테이너 높이
 * @returns 화면 좌표
 */
export const svgToScreenCoordinate = (
  svgX: number,
  svgY: number,
  containerWidth: number,
  containerHeight: number
): Coordinate => {
  const scaleX = containerWidth / SVG_VIEWBOX.width;
  const scaleY = containerHeight / SVG_VIEWBOX.height;
  
  return {
    x: svgX * scaleX,
    y: svgY * scaleY
  };
};

/**
 * 화면 좌표를 SVG 좌표로 변환
 * 
 * @param screenX - 화면 x 좌표
 * @param screenY - 화면 y 좌표
 * @param containerWidth - 컨테이너 너비
 * @param containerHeight - 컨테이너 높이
 * @returns SVG 좌표
 */
export const screenToSvgCoordinate = (
  screenX: number,
  screenY: number,
  containerWidth: number,
  containerHeight: number
): Coordinate => {
  const scaleX = SVG_VIEWBOX.width / containerWidth;
  const scaleY = SVG_VIEWBOX.height / containerHeight;
  
  return {
    x: screenX * scaleX,
    y: screenY * scaleY
  };
};