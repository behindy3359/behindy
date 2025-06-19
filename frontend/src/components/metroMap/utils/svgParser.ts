import { normalizeCoordinate } from './coordinateUtils';

/**
 * SVG에서 추출한 원본 지하철역 데이터
 */
export interface RawStationData {
  id: string;
  cx: number;
  cy: number;
  label?: string;
}

/**
 * SVG에서 추출한 원본 구청 경계 데이터
 */
export interface RawDistrictData {
  id: string;
  path: string;
  fill?: string;
}

/**
 * 파싱된 지하철역 데이터
 */
export interface ParsedStation {
  id: string;
  name: string;
  line: number;
  originalCoords: { cx: number; cy: number };
  normalizedCoords: { x: number; y: number };
  hasStory: boolean;
  isTransfer: boolean;
  transferLines: number[];
}

/**
 * 파싱된 구청 경계 데이터
 */
export interface ParsedDistrict {
  id: string;
  name: string;
  path: string;
  fill: string;
}

/**
 * SVG 원본 지하철역 데이터 (제공된 SVG에서 추출)
 */
export const RAW_STATIONS: RawStationData[] = [
  // 1호선
  { id: 'line1-dobongsan', cx: 88.365646, cy: 4.9796629, label: '도봉산' },
  { id: 'line1-dobong', cx: 88.329361, cy: 8.9514217, label: '도봉' },
  { id: 'line1-banghak', cx: 88.340981, cy: 12.928492, label: '방학' },
  { id: 'line1-changdong', cx: 88.34832, cy: 16.942114, label: '창동' },
  { id: 'line1-nockcheon', cx: 88.34832, cy: 20.803902, label: '녹천' },
  { id: 'line1-wolkye', cx: 92.331429, cy: 22.157511, label: '월계' },
  { id: 'line1-kwangwoondae', cx: 94.990112, cy: 24.763893, label: '광운대' },
  { id: 'line1-seokkye', cx: 96.30468, cy: 27.43854, label: '석계' },
  { id: 'line1-gireum', cx: 80.426727, cy: 35.446491, label: '길음' },
  { id: 'line1-seongshin', cx: 77.730957, cy: 39.401085, label: '성신여대' },
  { id: 'line1-hansung', cx: 73.79052, cy: 40.702374, label: '한성대입구' },
  { id: 'line1-hyehwa', cx: 71.130524, cy: 44.671127, label: '혜화' },
  { id: 'line1-dongdaemun', cx: 72.499062, cy: 47.282688, label: '동대문' },
  { id: 'line1-jongro5ga', cx: 68.506073, cy: 47.290703, label: '종로5가' },
  { id: 'line1-jongro3ga', cx: 64.737282, cy: 47.284924, label: '종로3가' },
  { id: 'line1-jonggak', cx: 60.577595, cy: 47.299969, label: '종각' },
  { id: 'line1-cityhall', cx: 58.663303, cy: 51.421543, label: '시청' },
  { id: 'line1-seoul', cx: 57.910622, cy: 55.252201, label: '서울역' },
  { id: 'line1-namyeong', cx: 57.934879, cy: 61.818268, label: '남영' },
  { id: 'line1-yongsan', cx: 53.960758, cy: 68.490891, label: '용산' },
  { id: 'line1-noryangjin', cx: 48.680222, cy: 79.102737, label: '노량진' },
  { id: 'line1-daebang', cx: 42.13369, cy: 79.138512, label: '대방' },
  { id: 'line1-singil', cx: 36.767445, cy: 77.73436, label: '신길' },
  { id: 'line1-yeongdeungpo', cx: 31.478807, cy: 80.389877, label: '영등포' },
  { id: 'line1-guro', cx: 22.168465, cy: 88.327377, label: '구로' },
  { id: 'line1-gasandigital', cx: 27.495907, cy: 97.587799, label: '가산디지털단지' },
  { id: 'line1-dogsan', cx: 31.478807, cy: 106.84821, label: '독산' },
  { id: 'line1-guil', cx: 16.948349, cy: 89.650299, label: '구일' },
  { id: 'line1-gaebong', cx: 11.599281, cy: 88.29081, label: '개봉' },
  { id: 'line1-oryudong', cx: 6.2718396, cy: 88.29081, label: '오류동' },
  { id: 'line1-onsu', cx: 2.3388658, cy: 86.9655, label: '온수' },

  // 2호선 (일부)
  { id: 'line2-hongdae', cx: 40.767628, cy: 52.528397, label: '홍대입구' },
  { id: 'line2-hapjeong', cx: 38.102737, cy: 59.244167, label: '합정' },
  { id: 'line2-dangsan', cx: 32.760475, cy: 69.776909, label: '당산' },
  { id: 'line2-yeongdeungpo-gu', cx: 31.449169, cy: 73.846848, label: '영등포구청' },
  { id: 'line2-munrae', cx: 28.803335, cy: 77.776611, label: '문래' },
  { id: 'line2-sindorim', cx: 31.386967, cy: 90.994164, label: '신도림' },
  { id: 'line2-gurodigital', cx: 26.172991, cy: 84.430176, label: '구로디지털단지' },
  { id: 'line2-daelim', cx: 28.842321, cy: 86.974823, label: '대림' },
  { id: 'line2-sindaebang', cx: 38.013161, cy: 92.266479, label: '신대방' },
  { id: 'line2-boramae', cx: 42.053638, cy: 92.324539, label: '보라매' },
  { id: 'line2-sadang', cx: 62.506607, cy: 94.748932, label: '사당' },
  { id: 'line2-bangbae', cx: 69.91494, cy: 93.69059, label: '방배' },
  { id: 'line2-seocho', cx: 77.764938, cy: 92.317078, label: '서초' },
  { id: 'line2-kyodae', cx: 85.738136, cy: 90.986717, label: '교대' },
  { id: 'line2-gangnam', cx: 92.324127, cy: 89.613205, label: '강남' },
  { id: 'line2-yeoksam', cx: 94.978012, cy: 87.021553, label: '역삼' },
  { id: 'line2-seonleung', cx: 97.649895, cy: 83.033325, label: '선릉' },
  { id: 'line2-samsung', cx: 100.23605, cy: 80.395645, label: '삼성' },
  { id: 'line2-jamsil', cx: 110.83567, cy: 73.735542, label: '잠실' },
  { id: 'line2-jamsil-saenae', cx: 108.13324, cy: 76.382164, label: '잠실새내' },
  { id: 'line2-sports-complex', cx: 104.30759, cy: 77.705086, label: '종합운동장' },
  { id: 'line2-gangbyeon', cx: 106.88505, cy: 65.787865, label: '강변' },
  { id: 'line2-konkuk', cx: 100.27047, cy: 63.227737, label: '건대입구' },
  { id: 'line2-seongsu', cx: 93.626251, cy: 63.100117, label: '성수' },
  { id: 'line2-ttukseom', cx: 89.708092, cy: 61.839405, label: '뚝섬' },
  { id: 'line2-hanyang', cx: 85.735191, cy: 59.193573, label: '한양대' },
  { id: 'line2-wangsimni', cx: 83.050369, cy: 56.536133, label: '왕십리' },
  { id: 'line2-sangwangsimni', cx: 80.447678, cy: 53.858761, label: '상왕십리' },
  { id: 'line2-sindang', cx: 75.097963, cy: 52.601982, label: '신당' },
  { id: 'line2-euljirio4ga', cx: 69.802147, cy: 52.578991, label: '을지로4가' },
  { id: 'line2-euljirio3ga', cx: 65.840842, cy: 52.594036, label: '을지로3가' },
  { id: 'line2-euljirio-ipgu', cx: 61.938455, cy: 52.644642, label: '을지로입구' },

  // 3호선 (일부)
  { id: 'line3-gupabal', cx: 41.900909, cy: 16.751545, label: '구파발' },
  { id: 'line3-yeonsinne', cx: 42.022388, cy: 22.114763, label: '연신내' },
  { id: 'line3-bulgwang', cx: 42.022388, cy: 26.118494, label: '불광' },
  { id: 'line3-nokbeon', cx: 42.022388, cy: 31.360231, label: '녹번' },
  { id: 'line3-hongje', cx: 44.545155, cy: 38.097885, label: '홍제' },
  { id: 'line3-muakjae', cx: 48.706936, cy: 40.622238, label: '무악재' },
  { id: 'line3-dongnimmun', cx: 52.60413, cy: 43.28302, label: '독립문' },
  { id: 'line3-gyeongbokgung', cx: 58.008694, cy: 43.419762, label: '경복궁' },
  { id: 'line3-anguk', cx: 63.193825, cy: 43.348209, label: '안국' },
  { id: 'line3-chungmuro', cx: 67.161774, cy: 55.271553, label: '충무로' },
  { id: 'line3-dongdaeipmgu', cx: 69.8255, cy: 56.630249, label: '동대입구' },
  { id: 'line3-yaksu', cx: 72.489227, cy: 57.863724, label: '약수' },
  { id: 'line3-geumho', cx: 76.475861, cy: 59.173283, label: '금고' },
  { id: 'line3-oksu', cx: 79.085915, cy: 63.142033, label: '옥수' },
  { id: 'line3-apgujeong', cx: 83.055458, cy: 75.097412, label: '압구정' },
  { id: 'line3-sinsa', cx: 83.090439, cy: 79.049072, label: '신사' },
  { id: 'line3-jamwon', cx: 80.444611, cy: 81.730682, label: '잠원' },
  { id: 'line3-express-terminal', cx: 81.73494, cy: 86.986572, label: '고속터미널' },
  { id: 'line3-nambu-terminal', cx: 89.66925, cy: 96.246986, label: '남부터미널' },
  { id: 'line3-yangjae', cx: 93.626251, cy: 96.285828, label: '양재' },

  // 4호선 (일부)
  { id: 'line4-dangogae', cx: 98.926727, cy: 15.566961, label: '당고개' },
  { id: 'line4-sanggyei', cx: 98.926727, cy: 15.566961, label: '상계' },
  { id: 'line4-nowon', cx: 93.641739, cy: 16.818325, label: '노원' },
  { id: 'line4-changdong', cx: 88.340973, cy: 16.942114, label: '창동' },
  { id: 'line4-ssangmun', cx: 84.431252, cy: 16.889877, label: '쌍문' },
  { id: 'line4-suyu', cx: 80.341019, cy: 22.181543, label: '수유' },
  { id: 'line4-mia', cx: 80.462502, cy: 26.114517, label: '미아' },
  { id: 'line4-miasageori', cx: 80.426727, cy: 29.067390, label: '미아사거리' },
  { id: 'line4-gireum', cx: 80.426727, cy: 35.446491, label: '길음' },
  { id: 'line4-seongshin', cx: 77.730957, cy: 39.401085, label: '성신여대입구' },
  { id: 'line4-hansung', cx: 73.79052, cy: 40.702374, label: '한성대입구' },
  { id: 'line4-hyehwa', cx: 71.130524, cy: 44.671127, label: '혜화' },
  { id: 'line4-dongdaemun', cx: 72.499062, cy: 47.282688, label: '동대문' },
  { id: 'line4-chungmuro', cx: 67.161774, cy: 55.271553, label: '충무로' },
  { id: 'line4-myeongdong', cx: 64.501793, cy: 55.254459, label: '명동' },
  { id: 'line4-hoehyeon', cx: 60.58297, cy: 55.218685, label: '회현' },
  { id: 'line4-seoul', cx: 57.910622, cy: 55.252201, label: '서울역' },
  { id: 'line4-samsangji', cx: 57.972916, cy: 65.873573, label: '삼각지' },
  { id: 'line4-ichon', cx: 61.855167, cy: 73.710419, label: '이촌' },
  { id: 'line4-dongjak', cx: 61.870113, cy: 82.999931, label: '동작' },
  { id: 'line4-sadang', cx: 62.506607, cy: 94.748932, label: '사당' }
];

/**
 * SVG 원본 구청 경계 데이터
 */
export const RAW_DISTRICTS: RawDistrictData[] = [
  {
    id: 'mapo',
    path: 'M 21.38213,50.685784 48.408,71.415857 55.778692,60.052705 23.224803,41.01175',
    fill: '#b7ddf6'
  },
  {
    id: 'yongsan',
    path: 'M 58.389145,59.43848 49.790003,71.722962 64.224277,78.325877 77.430099,67.884065',
    fill: '#b7ddf6'
  },
  {
    id: 'seongdong',
    path: 'M 74.051864,63.430937 93.092823,68.344731 98.774395,56.520915 81.542297,50.164136',
    fill: '#b7ddf6'
  },
  {
    id: 'junggu',
    path: 'M 56.085803,56.674469 71.748525,63.73805 78.812104,51.760676 58.082033,51.914232',
    fill: '#b7ddf6'
  },
  {
    id: 'seodaemun',
    path: 'M 35.662844,46.0791 54.396687,57.442249 57.007141,51.300007 48.561556,34.255283',
    fill: '#b7ddf6'
  },
  {
    id: 'jongno',
    path: 'M 50.557784,33.333946 58.389145,50.532226 80.13535,49.581511 64.377833,39.015521 60.538931,21.203016',
    fill: '#b7ddf6'
  },
  {
    id: 'eunpyeong',
    path: 'M 33.513059,44.082871 59.310482,20.435234 48.715112,9.2256415 30.288383,31.644829',
    fill: '#b7ddf6'
  },
  {
    id: 'seongbuk',
    path: 'm 62.194229,20.956881 3.868283,17.227661 15.29463,9.764394 12.196348,-15.996995 -14.127161,3.224678',
    fill: '#b7ddf6'
  },
  {
    id: 'gwangjin',
    path: 'm 112.98699,49.457333 -0.71828,15.557337 -10.07976,5.474395 -6.792793,-1.530108 6.602923,-17.198281',
    fill: '#b7ddf6'
  },
  {
    id: 'dongdaemun',
    path: 'm 94.628376,33.180389 -11.60706,15.84344 16.240909,6.451573 -0.48783,-12.467422',
    fill: '#b7ddf6'
  },
  {
    id: 'jungnang',
    path: 'm 100.90146,50.744542 -0.46067,-7.79976 -3.969738,-10.071504 17.058048,-3.775705 -0.0898,18.582505',
    fill: '#b7ddf6'
  },
  {
    id: 'dongjak',
    path: 'M 62.84227,83.54678 62.688714,96.291936 39.501748,88.614133 48.254444,78.325877',
    fill: '#b7ddf6'
  },
  {
    id: 'yeongdeungpo',
    path: 'M 46.104659,77.711649 33.205948,92.299476 25.7133,76.939435 28.599265,66.50206',
    fill: '#b7ddf6'
  },
  {
    id: 'guro',
    path: 'M 24.606808,78.325877 32.034042,93.008501 1.4198403,95.524155 2.0340646,81.24344',
    fill: '#b7ddf6'
  },
  {
    id: 'yangcheon',
    path: 'M 2.4947328,78.940097 24.299695,76.176096 26.449481,65.427167 2.3411768,69.573182',
    fill: '#b7ddf6'
  },
  {
    id: 'gangseo',
    path: 'M 2.3411766,67.730508 25.374586,63.277383 11.400985,46.846881 0.34494772,46.693325',
    fill: '#b7ddf6'
  },
  {
    id: 'gwanak',
    path: 'm 33.908311,93.744678 4.21143,-4.209212 24.108307,8.292032 4.29957,5.988682 -16.584057,10.59538',
    fill: '#b7ddf6'
  },
  {
    id: 'geumcheon',
    path: 'm 32.438166,93.988593 9.05981,15.509167 -8.138472,5.06735 -10.288257,-18.887394',
    fill: '#b7ddf6'
  },
  {
    id: 'seocho',
    path: 'm 76.508762,77.097429 -11.209593,6.449351 3.378234,19.04096 25.029639,14.74139 8.752698,-10.28827',
    fill: '#b7ddf6'
  },
  {
    id: 'gangnam',
    path: 'm 79.272771,76.329648 15.969833,-2.610457 21.497856,26.104535 -12.89871,5.374464',
    fill: '#b7ddf6'
  },
  {
    id: 'songpa',
    path: 'm 100.77063,76.790315 15.66271,-7.063579 14.7414,15.355606 -12.13094,13.666498',
    fill: '#b7ddf6'
  },
  {
    id: 'gangdong',
    path: 'm 119.0438,68.651844 1.68912,-15.355608 11.2096,-6.449355 -0.15356,36.239232',
    fill: '#b7ddf6'
  },
  {
    id: 'gangbuk',
    path: 'M 80.347664,32.566165 63.302939,19.360343 63.456496,5.233183 71.441413,5.3867392 86.979957,31.331061',
    fill: '#b7ddf6'
  },
  {
    id: 'dobong',
    path: 'M 74.358977,6.0009631 90.021699,5.3867392 89.554378,30.920279',
    fill: '#b7ddf6'
  },
  {
    id: 'nowon',
    path: 'M 91.609366,30.445761 109.83044,27.498814 104.30242,4.3118466 92.325042,4.7725152',
    fill: '#b7ddf6'
  }
];

/**
 * ID에서 노선 번호 추출
 */
export const extractLineNumber = (stationId: string): number => {
  const match = stationId.match(/line(\d+)/);
  return match ? parseInt(match[1], 10) : 0;
};

/**
 * ID에서 역 이름 추출
 */
export const extractStationName = (stationId: string, label?: string): string => {
  if (label) return label;
  
  // ID에서 역명 추출 (line1-dobongsan -> dobongsan)
  const parts = stationId.split('-');
  return parts.length > 1 ? parts.slice(1).join('-') : stationId;
};

/**
 * 구청 ID를 한글 이름으로 변환
 */
export const getDistrictKoreanName = (districtId: string): string => {
  const districtNames: Record<string, string> = {
    mapo: '마포구',
    yongsan: '용산구',
    seongdong: '성동구',
    junggu: '중구',
    seodaemun: '서대문구',
    jongno: '종로구',
    eunpyeong: '은평구',
    seongbuk: '성북구',
    gwangjin: '광진구',
    dongdaemun: '동대문구',
    jungnang: '중랑구',
    dongjak: '동작구',
    yeongdeungpo: '영등포구',
    guro: '구로구',
    yangcheon: '양천구',
    gangseo: '강서구',
    gwanak: '관악구',
    geumcheon: '금천구',
    seocho: '서초구',
    gangnam: '강남구',
    songpa: '송파구',
    gangdong: '강동구',
    gangbuk: '강북구',
    dobong: '도봉구',
    nowon: '노원구'
  };
  
  return districtNames[districtId] || districtId;
};

/**
 * 원본 지하철역 데이터를 파싱된 형태로 변환
 */
export const parseStations = (rawStations: RawStationData[]): ParsedStation[] => {
  // 환승역 감지를 위한 역명별 그룹핑
  const stationsByName = new Map<string, RawStationData[]>();
  
  rawStations.forEach(station => {
    const name = station.label || extractStationName(station.id);
    if (!stationsByName.has(name)) {
      stationsByName.set(name, []);
    }
    stationsByName.get(name)!.push(station);
  });

  return rawStations.map(station => {
    const name = station.label || extractStationName(station.id);
    const line = extractLineNumber(station.id);
    const normalizedCoords = normalizeCoordinate(station.cx, station.cy, 'stations');
    
    // 환승역 정보
    const sameNameStations = stationsByName.get(name) || [station];
    const isTransfer = sameNameStations.length > 1;
    const transferLines = sameNameStations.map(s => extractLineNumber(s.id));
    
    // 스토리 존재 여부 (임시로 일부 역에만 설정)
    const hasStory = ['도봉산', '홍대입구', '강남', '잠실', '사당'].includes(name);
    
    return {
      id: station.id,
      name,
      line,
      originalCoords: { cx: station.cx, cy: station.cy },
      normalizedCoords,
      hasStory,
      isTransfer,
      transferLines: isTransfer ? transferLines : [line]
    };
  });
};

/**
 * 원본 구청 데이터를 파싱된 형태로 변환
 */
export const parseDistricts = (rawDistricts: RawDistrictData[]): ParsedDistrict[] => {
  return rawDistricts.map(district => ({
    id: district.id,
    name: getDistrictKoreanName(district.id),
    path: district.path,
    fill: district.fill || '#b7ddf6'
  }));
};

/**
 * 모든 데이터 파싱 (메인 함수)
 */
export const parseAllSvgData = () => {
  const stations = parseStations(RAW_STATIONS);
  const districts = parseDistricts(RAW_DISTRICTS);
  
  console.log(`✅ 파싱 완료: 지하철역 ${stations.length}개, 구청 ${districts.length}개`);
  
  return {
    stations,
    districts,
    summary: {
      totalStations: stations.length,
      totalDistricts: districts.length,
      stationsByLine: stations.reduce((acc, station) => {
        acc[station.line] = (acc[station.line] || 0) + 1;
        return acc;
      }, {} as Record<number, number>),
      transferStations: stations.filter(s => s.isTransfer).length,
      storyStations: stations.filter(s => s.hasStory).length
    }
  };
};