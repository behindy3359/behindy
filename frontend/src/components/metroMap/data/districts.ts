// src/components/metroMap/data/districts.ts

import { parseDistricts, RAW_DISTRICTS } from '../utils/svgParser';

/**
 * 서울시 구청 인터페이스
 */
export interface District {
  id: string;
  name: string;
  path: string;
  fill: string;
  population?: number;
  area?: number; // km²
  region?: 'north' | 'south' | 'east' | 'west' | 'central'; // 권역
}

/**
 * 파싱된 서울시 구청 데이터
 */
export const DISTRICTS: District[] = parseDistricts(RAW_DISTRICTS).map(district => ({
  ...district,
  region: getDistrictRegion(district.id)
}));

/**
 * 구청별 권역 분류
 */
function getDistrictRegion(districtId: string): District['region'] {
  const regionMap: Record<string, District['region']> = {
    // 강북권 (북쪽)
    dobong: 'north',
    nowon: 'north',
    gangbuk: 'north',
    seongbuk: 'north',
    
    // 동북권
    dongdaemun: 'east',
    jungnang: 'east',
    
    // 동남권
    gwangjin: 'east',
    seongdong: 'east',
    gangdong: 'east',
    songpa: 'east',
    
    // 강남권 (남쪽)
    gangnam: 'south',
    seocho: 'south',
    
    // 서남권
    dongjak: 'south',
    gwanak: 'south',
    geumcheon: 'south',
    
    // 서북권
    yeongdeungpo: 'west',
    guro: 'west',
    gangseo: 'west',
    yangcheon: 'west',
    
    // 도심권 (중앙)
    jongno: 'central',
    junggu: 'central',
    yongsan: 'central',
    
    // 서대문/마포권
    seodaemun: 'central',
    mapo: 'central',
    eunpyeong: 'central',
  };
  
  return regionMap[districtId] || 'central';
}

/**
 * 권역별 구청 그룹핑
 */
export const DISTRICTS_BY_REGION: Record<string, District[]> = DISTRICTS.reduce((acc, district) => {
  const region = district.region || 'central';
  if (!acc[region]) {
    acc[region] = [];
  }
  acc[region].push(district);
  return acc;
}, {} as Record<string, District[]>);

/**
 * 구청 ID로 구청 찾기
 */
export const getDistrictById = (districtId: string): District | undefined => {
  return DISTRICTS.find(district => district.id === districtId);
};

/**
 * 구청 이름으로 구청 찾기
 */
export const getDistrictByName = (districtName: string): District | undefined => {
  return DISTRICTS.find(district => district.name === districtName);
};

/**
 * 특정 권역의 구청들 가져오기
 */
export const getDistrictsByRegion = (region: District['region']): District[] => {
  if (!region) return [];
  return DISTRICTS_BY_REGION[region] || [];
};

/**
 * 한강 경계 path (SVG에서 추출)
 */
export const HAN_RIVER_PATH = 'm 11.017094,43.545425 16.584057,21.57463 19.655178,11.243657 16.430501,6.415287 16.304228,-8.814036 15.865775,-1.013544 4.376347,2.76401 17.73573,-7.293918 1.91945,-21.804963 -2.91757,-1.074894 -3.17424,21.336579 -11.47266,4.577145 -13.199059,-1.983061 -9.09852,-0.62527 L 64.390713,79.922257 48.646532,73.40743 30.079259,63.30944 13.032114,42.461975';

/**
 * 구청별 상세 정보 (참고용 - 실제 데이터는 별도 API에서 가져올 수 있음)
 */
export const DISTRICT_INFO: Record<string, Partial<District>> = {
  jongno: {
    population: 140000,
    area: 23.91,
    region: 'central'
  },
  junggu: {
    population: 125000,
    area: 9.96,
    region: 'central'
  },
  yongsan: {
    population: 228000,
    area: 21.87,
    region: 'central'
  },
  seongdong: {
    population: 295000,
    area: 16.86,
    region: 'east'
  },
  gwangjin: {
    population: 357000,
    area: 17.06,
    region: 'east'
  },
  dongdaemun: {
    population: 348000,
    area: 14.21,
    region: 'east'
  },
  jungnang: {
    population: 398000,
    area: 18.50,
    region: 'east'
  },
  seongbuk: {
    population: 424000,
    area: 24.58,
    region: 'north'
  },
  gangbuk: {
    population: 309000,
    area: 23.60,
    region: 'north'
  },
  dobong: {
    population: 331000,
    area: 20.67,
    region: 'north'
  },
  nowon: {
    population: 544000,
    area: 35.44,
    region: 'north'
  },
  eunpyeong: {
    population: 477000,
    area: 29.71,
    region: 'central'
  },
  seodaemun: {
    population: 313000,
    area: 17.61,
    region: 'central'
  },
  mapo: {
    population: 373000,
    area: 23.87,
    region: 'central'
  },
  yangcheon: {
    population: 457000,
    area: 17.40,
    region: 'west'
  },
  gangseo: {
    population: 607000,
    area: 41.44,
    region: 'west'
  },
  guro: {
    population: 428000,
    area: 20.12,
    region: 'west'
  },
  geumcheon: {
    population: 236000,
    area: 13.02,
    region: 'south'
  },
  yeongdeungpo: {
    population: 394000,
    area: 24.57,
    region: 'west'
  },
  dongjak: {
    population: 404000,
    area: 16.35,
    region: 'south'
  },
  gwanak: {
    population: 513000,
    area: 29.57,
    region: 'south'
  },
  seocho: {
    population: 442000,
    area: 47.00,
    region: 'south'
  },
  gangnam: {
    population: 551000,
    area: 39.50,
    region: 'south'
  },
  songpa: {
    population: 680000,
    area: 33.88,
    region: 'east'
  },
  gangdong: {
    population: 440000,
    area: 24.59,
    region: 'east'
  }
};

/**
 * 구청 데이터에 상세 정보 병합
 */
export const ENRICHED_DISTRICTS: District[] = DISTRICTS.map(district => ({
  ...district,
  ...DISTRICT_INFO[district.id]
}));

/**
 * 권역별 통계
 */
export const REGION_STATISTICS = {
  north: {
    districts: getDistrictsByRegion('north').length,
    totalPopulation: getDistrictsByRegion('north').reduce((sum, d) => sum + (d.population || 0), 0),
    totalArea: getDistrictsByRegion('north').reduce((sum, d) => sum + (d.area || 0), 0)
  },
  south: {
    districts: getDistrictsByRegion('south').length,
    totalPopulation: getDistrictsByRegion('south').reduce((sum, d) => sum + (d.population || 0), 0),
    totalArea: getDistrictsByRegion('south').reduce((sum, d) => sum + (d.area || 0), 0)
  },
  east: {
    districts: getDistrictsByRegion('east').length,
    totalPopulation: getDistrictsByRegion('east').reduce((sum, d) => sum + (d.population || 0), 0),
    totalArea: getDistrictsByRegion('east').reduce((sum, d) => sum + (d.area || 0), 0)
  },
  west: {
    districts: getDistrictsByRegion('west').length,
    totalPopulation: getDistrictsByRegion('west').reduce((sum, d) => sum + (d.population || 0), 0),
    totalArea: getDistrictsByRegion('west').reduce((sum, d) => sum + (d.area || 0), 0)
  },
  central: {
    districts: getDistrictsByRegion('central').length,
    totalPopulation: getDistrictsByRegion('central').reduce((sum, d) => sum + (d.population || 0), 0),
    totalArea: getDistrictsByRegion('central').reduce((sum, d) => sum + (d.area || 0), 0)
  }
};

/**
 * 구청 통계 정보
 */
export const DISTRICT_STATISTICS = {
  total: DISTRICTS.length,
  byRegion: Object.entries(DISTRICTS_BY_REGION).reduce((acc, [region, districts]) => {
    acc[region] = districts.length;
    return acc;
  }, {} as Record<string, number>),
  totalPopulation: ENRICHED_DISTRICTS.reduce((sum, d) => sum + (d.population || 0), 0),
  totalArea: ENRICHED_DISTRICTS.reduce((sum, d) => sum + (d.area || 0), 0),
  largestByArea: ENRICHED_DISTRICTS.reduce((largest, current) => 
    (current.area || 0) > (largest.area || 0) ? current : largest
  ),
  smallestByArea: ENRICHED_DISTRICTS.reduce((smallest, current) => 
    (current.area || Infinity) < (smallest.area || Infinity) ? current : smallest
  ),
  largestByPopulation: ENRICHED_DISTRICTS.reduce((largest, current) => 
    (current.population || 0) > (largest.population || 0) ? current : largest
  ),
  smallestByPopulation: ENRICHED_DISTRICTS.reduce((smallest, current) => 
    (current.population || Infinity) < (smallest.population || Infinity) ? current : smallest
  )
};

/**
 * 색상 테마별 구청 색상 설정
 */
export const DISTRICT_COLOR_THEMES = {
  default: '#b7ddf6', // 기본 하늘색
  population: {
    high: '#ff6b6b',    // 인구 많음 - 빨강
    medium: '#ffa726',  // 인구 보통 - 주황
    low: '#66bb6a'      // 인구 적음 - 초록
  },
  region: {
    north: '#81c784',   // 북쪽 - 연두
    south: '#ffb74d',   // 남쪽 - 주황
    east: '#64b5f6',    // 동쪽 - 파랑
    west: '#f06292',    // 서쪽 - 분홍
    central: '#ba68c8'  // 중앙 - 보라
  }
};

/**
 * 인구 밀도 기준으로 구청 색상 결정
 */
export const getDistrictColorByPopulation = (district: District): string => {
  const density = (district.population || 0) / (district.area || 1);
  
  if (density > 20000) return DISTRICT_COLOR_THEMES.population.high;
  if (density > 15000) return DISTRICT_COLOR_THEMES.population.medium;
  return DISTRICT_COLOR_THEMES.population.low;
};

/**
 * 권역별 구청 색상 결정
 */
export const getDistrictColorByRegion = (district: District): string => {
  return DISTRICT_COLOR_THEMES.region[district.region || 'central'];
};

/**
 * 좌표로 구청 찾기 (Point-in-Polygon 알고리즘 필요 - 간단 구현)
 */
export const findDistrictByCoordinate = (x: number, y: number): District | null => {
  // TODO: 실제로는 Point-in-Polygon 알고리즘 구현 필요
  // 현재는 근사치로 가장 가까운 구청 중심점 기준으로 판단
  
  // 각 구청의 대략적인 중심 좌표 (SVG path에서 계산된 근사치)
  const districtCenters: Record<string, { x: number; y: number }> = {
    jongno: { x: 60, y: 35 },
    junggu: { x: 65, y: 55 },
    yongsan: { x: 60, y: 65 },
    mapo: { x: 40, y: 55 },
    gangnam: { x: 95, y: 85 },
    // ... 다른 구청들도 추가 가능
  };
  
  let nearestDistrict: District | null = null;
  let minDistance = Infinity;
  
  DISTRICTS.forEach(district => {
    const center = districtCenters[district.id];
    if (center) {
      const dx = center.x - x;
      const dy = center.y - y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      
      if (distance < minDistance) {
        minDistance = distance;
        nearestDistrict = district;
      }
    }
  });
  
  return nearestDistrict;
};

/**
 * 개발용 디버깅 함수
 */
export const debugDistrictData = () => {
  console.group('🏢 서울시 구청 데이터 분석');
  console.log('총 구청 수:', DISTRICT_STATISTICS.total);
  console.log('권역별 구청 수:', DISTRICT_STATISTICS.byRegion);
  console.log('총 인구:', DISTRICT_STATISTICS.totalPopulation.toLocaleString());
  console.log('총 면적:', DISTRICT_STATISTICS.totalArea.toFixed(2), 'km²');
  
  console.log('최대 면적:', `${DISTRICT_STATISTICS.largestByArea.name} (${DISTRICT_STATISTICS.largestByArea.area}km²)`);
  console.log('최소 면적:', `${DISTRICT_STATISTICS.smallestByArea.name} (${DISTRICT_STATISTICS.smallestByArea.area}km²)`);
  console.log('최대 인구:', `${DISTRICT_STATISTICS.largestByPopulation.name} (${DISTRICT_STATISTICS.largestByPopulation.population?.toLocaleString()}명)`);
  console.log('최소 인구:', `${DISTRICT_STATISTICS.smallestByPopulation.name} (${DISTRICT_STATISTICS.smallestByPopulation.population?.toLocaleString()}명)`);
  
  console.group('권역별 통계');
  Object.entries(REGION_STATISTICS).forEach(([region, stats]) => {
    console.log(`${region}: ${stats.districts}개구, 인구 ${stats.totalPopulation.toLocaleString()}명, 면적 ${stats.totalArea.toFixed(2)}km²`);
  });
  console.groupEnd();
  
  console.groupEnd();
};

// 개발 환경에서 자동 실행
if (typeof process !== 'undefined' && process.env?.NODE_ENV === 'development') {
  debugDistrictData();
}