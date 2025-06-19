export interface Station {
  id: string;
  name: string;
  x: number;
  y: number;
  line: number;
  lines: number[]; // 환승역의 경우 여러 노선
  isTransfer: boolean;
  hasStory: boolean;
}

// SVG에서 추출한 원본 데이터 (정제 전)
const RAW_STATION_DATA = [
  // 1호선 역들
  { id: "line1-dobongsan", name: "도봉산", x: 88.365646, y: 4.9796629, line: 1 },
  { id: "line1-dobong", name: "도봉", x: 88.329361, y: 8.9514217, line: 1 },
  { id: "line1-changdong", name: "창동", x: 88.340973, y: 16.942114, line: 1 },
  { id: "line1-banghak", name: "방학", x: 88.340981, y: 12.928492, line: 1 },
  { id: "line1-nockcheon", name: "녹천", x: 88.34832, y: 20.803902, line: 1 },
  { id: "line1-wolkye", name: "월계", x: 92.331429, y: 22.157511, line: 1 },
  { id: "line1-kwangwoon", name: "광운대", x: 94.990112, y: 24.763893, line: 1 },
  { id: "line1-seokkye", name: "석계", x: 96.30468, y: 27.43854, line: 1 },
  { id: "line1-gireum", name: "길음", x: 80.426727, y: 35.446491, line: 1 },
  { id: "line1-seongshin", name: "성신여대입구", x: 77.730957, y: 39.401085, line: 1 },
  { id: "line1-hansung", name: "한성대입구", x: 73.79052, y: 40.702374, line: 1 },
  { id: "line1-hyehwa", name: "혜화", x: 71.130524, y: 44.671127, line: 1 },
  { id: "line1-dongdaemun", name: "동대문", x: 72.499062, y: 47.282688, line: 1 },
  { id: "line1-jongro5ga", name: "종로5가", x: 68.506073, y: 47.290703, line: 1 },
  { id: "line1-jongro3ga", name: "종로3가", x: 64.737282, y: 47.284924, line: 1 },
  { id: "line1-jonggak", name: "종각", x: 60.577595, y: 47.299969, line: 1 },
  { id: "line1-cityhall", name: "시청", x: 58.663303, y: 51.421543, line: 1 },
  { id: "line1-seoul", name: "서울역", x: 57.910622, y: 55.252201, line: 1 },
  { id: "line1-namyeong", name: "남영", x: 57.934879, y: 61.818268, line: 1 },
  { id: "line1-yongsan", name: "용산", x: 53.960758, y: 68.490891, line: 1 },
  { id: "line1-noryangjin", name: "노량진", x: 48.680222, y: 79.102737, line: 1 },
  { id: "line1-daebang", name: "대방", x: 42.13369, y: 79.138512, line: 1 },
  { id: "line1-singil", name: "신길", x: 36.767445, y: 77.73436, line: 1 },
  { id: "line1-yeongdeungpo", name: "영등포", x: 31.478807, y: 80.389877, line: 1 },
  { id: "line1-guro", name: "구로", x: 22.168465, y: 88.327377, line: 1 },
  { id: "line1-gasandigital", name: "가산디지털단지", x: 27.495907, y: 97.587799, line: 1 },
  { id: "line1-dogsan", name: "독산", x: 31.478807, y: 106.84821, line: 1 },
  { id: "line1-guil", name: "구일", x: 16.948349, y: 89.650299, line: 1 },
  { id: "line1-gaebong", name: "개봉", x: 11.599281, y: 88.29081, line: 1 },

  // 2호선 역들  
  { id: "line2-euljirog3ga", name: "을지로3가", x: 54.04739, y: 53.848022, line: 2 },
  { id: "line2-idae", name: "이대", x: 47.331619, y: 53.984032, line: 2 },
  { id: "line2-sinchon", name: "신촌", x: 44.791126, y: 49.933159, line: 2 },
  { id: "line2-ahyeon", name: "아현", x: 50.002747, y: 55.30592, line: 2 },
  { id: "line2-guro-digital", name: "구로디지털단지", x: 26.172991, y: 84.430176, line: 2 },
  { id: "line2-daerim", name: "대림", x: 28.842321, y: 86.974823, line: 2 },
  { id: "line2-dangsan", name: "당산", x: 32.760475, y: 69.776909, line: 2 },
  { id: "line2-yeongdeungpo-gu", name: "영등포구청", x: 31.449169, y: 73.846848, line: 2 },
  { id: "line2-munrae", name: "문래", x: 28.803335, y: 77.776611, line: 2 },
  { id: "line2-sindaebang", name: "신대방", x: 38.013161, y: 92.266479, line: 2 },
  { id: "line2-sinlim", name: "신림", x: 42.053638, y: 92.324539, line: 2 },
  { id: "line2-bongcheon", name: "봉천", x: 47.349464, y: 93.596855, line: 2 },
  { id: "line2-sadang", name: "사당", x: 62.506607, y: 94.748932, line: 2 },
  { id: "line2-bangbae", name: "방배", x: 69.91494, y: 93.69059, line: 2 },
  { id: "line2-seocho", name: "서초", x: 77.764938, y: 92.317078, line: 2 },
  { id: "line2-kyodae", name: "교대", x: 85.738136, y: 90.986717, line: 2 },
  { id: "line2-gangnam", name: "강남", x: 92.324127, y: 89.613205, line: 2 },
  { id: "line2-yeoksam", name: "역삼", x: 94.978012, y: 87.021553, line: 2 },
  { id: "line2-seonleung", name: "선릉", x: 97.649895, y: 83.033325, line: 2 },
  { id: "line2-samsung", name: "삼성", x: 100.23605, y: 80.395645, line: 2 },
  { id: "line2-jamsil", name: "잠실", x: 110.83567, y: 73.735542, line: 2 },
  { id: "line2-sports-complex", name: "종합운동장", x: 104.30759, y: 77.705086, line: 2 },
  { id: "line2-jamsil-saenae", name: "잠실새내", x: 108.13324, y: 76.382164, line: 2 },
  { id: "line2-jamsil-naru", name: "잠실나루", x: 110.88641, y: 71.112129, line: 2 },
  { id: "line2-gangbyeon", name: "강변", x: 106.88505, y: 65.787865, line: 2 },
  { id: "line2-guui", name: "구의", x: 104.23922, y: 64.514885, line: 2 },
  { id: "line2-konkuk", name: "건대입구", x: 100.27047, y: 63.227737, line: 2 },
  { id: "line2-seongsu", name: "성수", x: 93.626251, y: 63.100117, line: 2 },
  { id: "line2-ttukseom", name: "뚝섬", x: 89.708092, y: 61.839405, line: 2 },
  { id: "line2-hanyang", name: "한양대", x: 85.735191, y: 59.193573, line: 2 },
  { id: "line2-wangsimni", name: "왕십리", x: 83.050369, y: 56.536133, line: 2 },
  { id: "line2-sangwangsimni", name: "상왕십리", x: 80.447678, y: 53.858761, line: 2 },
  { id: "line2-sindang", name: "신당", x: 75.097097, y: 52.586436, line: 2 },
  { id: "line2-euljiro4ga", name: "을지로4가", x: 69.802147, y: 52.578991, line: 2 },
  { id: "line2-euljiro-ipgu", name: "을지로입구", x: 61.938728, y: 52.627687, line: 2 },
  { id: "line2-hongdae", name: "홍대입구", x: 40.767628, y: 52.528397, line: 2 },
  { id: "line2-hapjeong", name: "합정", x: 38.102737, y: 59.244167, line: 2 },
  { id: "line2-snu", name: "서울대입구", x: 52.647369, y: 94.894463, line: 2 },
  { id: "line2-nakseongdae", name: "낙성대", x: 57.925346, y: 96.28167, line: 2 },
  { id: "line2-yongdap", name: "용답", x: 95.050354, y: 59.294762, line: 2 },

  // 3호선 역들
  { id: "line3-gupabal", name: "구파발", x: 41.900909, y: 16.751545, line: 3 },
  { id: "line3-yeonsinne", name: "연신내", x: 42.022388, y: 22.114763, line: 3 },
  { id: "line3-bulgwang", name: "불광", x: 42.022388, y: 26.118494, line: 3 },
  { id: "line3-nokbeon", name: "녹번", x: 42.022388, y: 31.360231, line: 3 },
  { id: "line3-hongje", name: "홍제", x: 44.545155, y: 38.097885, line: 3 },
  { id: "line3-muakjae", name: "무악재", x: 48.706936, y: 40.622238, line: 3 },
  { id: "line3-dongnimmun", name: "독립문", x: 52.60413, y: 43.28302, line: 3 },
  { id: "line3-gyeongbokgung", name: "경복궁", x: 58.008694, y: 43.419762, line: 3 },
  { id: "line3-anguk", name: "안국", x: 63.193825, y: 43.348209, line: 3 },
  { id: "line3-chungmuro", name: "충무로", x: 67.161774, y: 55.271553, line: 3 },
  { id: "line3-dongdaeipgu", name: "동대입구", x: 69.8255, y: 56.630249, line: 3 },
  { id: "line3-yaksu", name: "약수", x: 72.489227, y: 57.863724, line: 3 },
  { id: "line3-geumho", name: "금고", x: 76.475861, y: 59.173283, line: 3 },
  { id: "line3-oksu", name: "옥수", x: 79.085915, y: 63.142033, line: 3 },
  { id: "line3-apgujeong", name: "압구정", x: 83.055458, y: 75.097412, line: 3 },
  { id: "line3-sinsa", name: "신사", x: 83.090439, y: 79.049072, line: 3 },
  { id: "line3-jamwon", name: "잠원", x: 80.444611, y: 81.730682, line: 3 },
  { id: "line3-express-terminal", name: "고속터미널", x: 81.73494, y: 86.986572, line: 3 },
  { id: "line3-nambu-terminal", name: "남부터미널", x: 89.66925, y: 96.246986, line: 3 },
  { id: "line3-yangjae", name: "양재", x: 93.626251, y: 96.285828, line: 3 },
  { id: "line3-maebong", name: "매봉", x: 97.660507, y: 94.919769, line: 3 },
  { id: "line3-dogok", name: "도곡", x: 100.28849, y: 93.495667, line: 3 },
  { id: "line3-daechi", name: "대치", x: 102.88371, y: 92.223343, line: 3 },
  { id: "line3-hagyeoul", name: "학여울", x: 105.51794, y: 89.68615, line: 3 },
  { id: "line3-daecheong", name: "대청", x: 108.20069, y: 90.965919, line: 3 },
  { id: "line3-ilwon", name: "일원", x: 109.53106, y: 93.611755, line: 3 },
  { id: "line3-suseo", name: "수서", x: 112.16077, y: 93.639992, line: 3 },
  { id: "line3-garakmarket", name: "가락시장", x: 116.12745, y: 92.291786, line: 3 },
  { id: "line3-police-hospital", name: "경찰병원", x: 118.81226, y: 89.64595, line: 3 },
  { id: "line3-ogeum", name: "오금", x: 121.4212, y: 87.025414, line: 3 },

  // 4호선 역들
  { id: "line4-dangogae", name: "당고개", x: 98.926727, y: 15.566961, line: 4 },
  { id: "line4-sanggyei", name: "상계", x: 93.641739, y: 16.818325, line: 4 },
  { id: "line4-nowon", name: "노원", x: 84.431252, y: 16.889877, line: 4 },
  { id: "line4-changdong", name: "창동", x: 80.341019, y: 22.181543, line: 4 },
  { id: "line4-ssangmun", name: "쌍문", x: 80.462502, y: 26.114517, line: 4 },
  { id: "line4-suyu", name: "수유", x: 80.712936, y: 29.06739, line: 4 },
  { id: "line4-mia", name: "미아", x: 69.793465, y: 100.23363, line: 4 },
  { id: "line4-miasageori", name: "미아사거리", x: 61.834335, y: 89.650299, line: 4 },
  { id: "line4-myeongdong", name: "명동", x: 64.501793, y: 55.254459, line: 4 },
  { id: "line4-hoehyeon", name: "회현", x: 60.58297, y: 55.218685, line: 4 },
  { id: "line4-samsangji", name: "삼각지", x: 57.972916, y: 65.873573, line: 4 },
  { id: "line4-shinyongsan", name: "신용산", x: 55.255531, y: 69.72084, line: 4 },
  { id: "line4-ichon", name: "이촌", x: 61.855167, y: 73.710419, line: 4 },
  { id: "line4-dongjak", name: "동작", x: 61.870113, y: 82.999931, line: 4 },
  { id: "line4-isu", name: "이수", x: 59.23843, y: 60.488728, line: 4 },
  { id: "line4-chongshin", name: "총신대입구", x: 52.647369, y: 94.894463, line: 4 },
  { id: "line4-sadang", name: "사당", x: 57.925346, y: 96.28167, line: 4 },
  { id: "line4-namtaeryeong", name: "남태령", x: 95.050354, y: 59.294762, line: 4 },
  { id: "line4-bulgamsan", name: "불암산", x: 104.19088, y: 12.849576, line: 4 },
];

// 환승역 정보 (중복 제거 및 노선 통합)
const TRANSFER_STATIONS = [
  { stationName: "신도림", lines: [1, 2], primaryId: "line12-sindorim" },
  { stationName: "시청", lines: [1, 2], primaryId: "line12-cityhall" },
  { stationName: "서울역", lines: [1, 4], primaryId: "line14-seoul" },
  { stationName: "종로3가", lines: [1, 3], primaryId: "line13-jongro3ga" },
  { stationName: "을지로3가", lines: [2, 3], primaryId: "line23-euljirog3ga" },
  { stationName: "충무로", lines: [3, 4], primaryId: "line34-chungmuro" },
  { stationName: "동대문역사문화공원", lines: [2, 4], primaryId: "line24-dongdaemun-hist" },
  { stationName: "사당", lines: [2, 4], primaryId: "line24-sadang" },
  { stationName: "교대", lines: [2, 3], primaryId: "line23-kyodae" },
];

// 환승역 처리를 포함한 최종 정제 함수
function processStations(): Station[] {
  const stations: Station[] = [];
  const processedStations = new Set<string>();

  // 1. 일반 역들 처리
  RAW_STATION_DATA.forEach(rawStation => {
    const normalizedName = rawStation.name.toLowerCase().replace(/[^가-힣a-z]/g, '');
    
    // 환승역인지 확인
    const transferInfo = TRANSFER_STATIONS.find(t => 
      t.stationName === rawStation.name || 
      t.primaryId.includes(rawStation.name.toLowerCase())
    );

    if (transferInfo && !processedStations.has(transferInfo.stationName)) {
      // 환승역 처리
      const transferStation: Station = {
        id: transferInfo.primaryId,
        name: transferInfo.stationName,
        x: rawStation.x,
        y: rawStation.y,
        line: transferInfo.lines[0], // 주 노선
        lines: transferInfo.lines,
        isTransfer: true,
        hasStory: Math.random() > 0.6 // 40% 확률로 스토리 있음
      };
      stations.push(transferStation);
      processedStations.add(transferInfo.stationName);
    } else if (!transferInfo && !processedStations.has(normalizedName)) {
      // 일반 역 처리
      const station: Station = {
        id: rawStation.id,
        name: rawStation.name,
        x: rawStation.x,
        y: rawStation.y,
        line: rawStation.line,
        lines: [rawStation.line],
        isTransfer: false,
        hasStory: Math.random() > 0.7 // 30% 확률로 스토리 있음
      };
      stations.push(station);
      processedStations.add(normalizedName);
    }
  });

  return stations;
}

// 노선별 색상 정의
export const LINE_COLORS = {
  1: '#0052A4',  // 1호선 - 블루
  2: '#00A84D',  // 2호선 - 그린  
  3: '#EF7C1C',  // 3호선 - 오렌지
  4: '#00A5DE',  // 4호선 - 라이트블루
} as const;

// 비트 연산 유틸리티 함수들
export const LineBitUtils = {
  // 노선 배열을 비트로 변환: [1, 4] → 9 (1001)
  linesToBits: (lines: number[]): number => {
    return lines.reduce((bits, line) => bits | (1 << (line - 1)), 0);
  },

  // 비트를 노선 배열로 변환: 9 (1001) → [1, 4]
  bitsToLines: (bits: number): number[] => {
    const lines: number[] = [];
    for (let i = 0; i < 8; i++) { // 최대 8호선까지
      if (bits & (1 << i)) {
        lines.push(i + 1);
      }
    }
    return lines;
  },

  // 특정 노선 포함 여부: hasLine(9, 1) → true
  hasLine: (bits: number, lineNumber: number): boolean => {
    return (bits & (1 << (lineNumber - 1))) !== 0;
  },

  // 다중 노선 필터링: matchesFilter(9, [1, 2]) → true (1호선 포함)
  matchesFilter: (stationBits: number, filterLines: number[]): boolean => {
    if (filterLines.length === 0) return true;
    const filterBits = LineBitUtils.linesToBits(filterLines);
    return (stationBits & filterBits) !== 0;
  }
};

// 최종 정제된 지하철역 데이터
export const METRO_STATIONS: Station[] = processStations();

// 통계 정보
export const METRO_STATS = {
  totalStations: METRO_STATIONS.length,
  transferStations: METRO_STATIONS.filter(s => s.isTransfer).length,
  stationsWithStory: METRO_STATIONS.filter(s => s.hasStory).length,
  stationsByLine: METRO_STATIONS.reduce((acc, station) => {
    station.lines.forEach(line => {
      acc[line] = (acc[line] || 0) + 1;
    });
    return acc;
  }, {} as Record<number, number>)
};

// 노선별 역 목록 조회 함수
export const getStationsByLine = (lineNumber: number): Station[] => {
  return METRO_STATIONS.filter(station => station.lines.includes(lineNumber));
};

// 환승역 조회 함수
export const getTransferStations = (): Station[] => {
  return METRO_STATIONS.filter(station => station.isTransfer);
};

// 역 검색 함수
export const searchStations = (query: string): Station[] => {
  const normalizedQuery = query.toLowerCase().replace(/[^가-힣a-z]/g, '');
  return METRO_STATIONS.filter(station => 
    station.name.toLowerCase().includes(normalizedQuery) ||
    station.id.toLowerCase().includes(normalizedQuery)
  );
};

// SVG ViewBox 정보
export const SVG_CONFIG = {
  viewBox: "0 0 132.29166 119.0625",
  width: 500,
  height: 450,
  // 좌표 변환 함수
  normalizeCoordinate: (x: number, y: number) => ({
    x: x / 132.29166,
    y: y / 119.0625
  }),
  // 화면 좌표로 변환
  toScreenCoordinate: (x: number, y: number, screenWidth: number, screenHeight: number) => ({
    x: (x / 132.29166) * screenWidth,
    y: (y / 119.0625) * screenHeight
  })
};

export default {
  METRO_STATIONS,
  LINE_COLORS,
  LineBitUtils,
  METRO_STATS,
  getStationsByLine,
  getTransferStations,
  searchStations,
  SVG_CONFIG
};