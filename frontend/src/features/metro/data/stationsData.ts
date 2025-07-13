export interface Station {
  id: string;             
  x: number;              
  y: number;              
  lines: number[];        
  realApiIds: string[];
}

export const METRO_STATIONS: Station[] = [
  // 1호선
  { id: "도봉산", x: 88.365646, y: 5.9796629, lines: [1],
    realApiIds: ["1001000113"]},
  { id: "도봉", x: 88.329361, y: 8.9514217, lines: [1],  
    realApiIds: ["1001000114"] },
  { id: "방학", x: 88.340981, y: 12.928492, lines: [1],  
    realApiIds: ["1001000115"] },
  { id: "창동", x: 88.340973, y: 16.942114, lines: [1, 4],  
    realApiIds: ["1001000116", "1004000412"] },
  { id: "녹천", x: 88.34832, y: 20.803902, lines: [1],  
    realApiIds: ["1001000117"] },
  { id: "월계", x: 92.331429, y: 22.157511, lines: [1],  
    realApiIds: ["1001000118"] },
  { id: "광운대", x: 94.990112, y: 24.763893, lines: [1],  
    realApiIds: ["1001000119"] },
  { id: "석계", x: 96.30468, y: 27.43854, lines: [1],  
    realApiIds: ["1001000120"] },
  { id: "신이문", x: 94.964935, y: 34.097141, lines: [1],  
    realApiIds: ["1001000121"] },
  { id: "외대앞", x: 93.614639, y: 38.015297, lines: [1],  
    realApiIds: ["1001000122"] },
  { id: "회기", x: 92.326546, y: 42.011425, lines: [1],  
    realApiIds: ["1001000123"] },
  { id: "청량리", x: 90.99411, y: 44.666786, lines: [1],  
    realApiIds: ["1001000124"] },
  { id: "제기동", x: 88.322975, y: 46.015003, lines: [1],  
    realApiIds: ["1001000125"] },
  { id: "신설동", x: 84.368164, y: 47.340847, lines: [1, 2],  
    realApiIds: ["1001000126", "1002002114"] },
  { id: "동묘앞", x: 76.4422, y: 47.29166, lines: [1],  
    realApiIds: ["1001000127"] },
  { id: "종로5가", x: 68.506073, y: 47.290703, lines: [1],  
    realApiIds: ["1001000129"] },
  { id: "종로3가", x: 64.737282, y: 47.284924, lines: [1, 3],  
    realApiIds: ["1001000130", "1003000329"] },
  { id: "종각", x: 60.577595, y: 47.299969, lines: [1],  
    realApiIds: ["1001000131"] },
  { id: "시청", x: 58.663303, y: 52.421543, lines: [1, 2],  
    realApiIds: ["1001000132", "1002000201"] },
  { id: "서울역", x: 57.910622, y: 55.252201, lines: [1, 4],  
    realApiIds: ["1001000133", "1004000426"] },
  { id: "남영", x: 57.934879, y: 61.818268, lines: [1],  
    realApiIds: ["1001000134"] },
  { id: "용산", x: 53.960758, y: 68.490891, lines: [1],  
    realApiIds: ["1001000135"] },
  { id: "노량진", x: 48.680222, y: 79.102737, lines: [1],  
    realApiIds: ["1001000136"] },
  { id: "대방", x: 42.13369, y: 79.138512, lines: [1],  
    realApiIds: ["1001000137"] },
  { id: "신길", x: 36.767445, y: 77.73436, lines: [1],  
    realApiIds: ["1001000138"] },
  { id: "영등포", x: 31.478807, y: 80.389877, lines: [1],  
    realApiIds: ["1001000139"] },
  { id: "구로", x: 22.168465, y: 88.327377, lines: [1],  
    realApiIds: ["1001000141"] },
  { id: "구일", x: 16.948349, y: 89.650299, lines: [1],  
    realApiIds: ["1001000142"] },
  { id: "개봉", x: 11.599281, y: 88.29081, lines: [1],  
    realApiIds: ["1001000143"] },
  { id: "오류동", x: 6.2718396, y: 88.29081, lines: [1],  
    realApiIds: ["1001000144"] },
  { id: "온수", x: 2.3388658, y: 86.9655, lines: [1],  
    realApiIds: ["1001000145"] },
  { id: "가산디지털단지", x: 27.495907, y: 97.587799, lines: [1],  
    realApiIds: ["1001080142"] },
  { id: "독산", x: 31.478807, y: 106.84821, lines: [1],  
    realApiIds: ["1001080143"] },

  // 2호선
  { id: "을지로입구", x: 61.938728, y: 52.627687, lines: [2],  
    realApiIds: ["1002000202"] },
  { id: "을지로3가", x: 65.44739, y: 52.348022, lines: [2, 3],  
    realApiIds: ["1002000203", "1003000330"] },
  { id: "을지로4가", x: 69.802147, y: 52.578991, lines: [2],  
    realApiIds: ["1002000204"] },
  { id: "동대문역사문화공원", x: 72.515649, y: 52.579826, lines: [2, 4],  
    realApiIds: ["1002000205", "1004000422"] },
  { id: "신당", x: 75.097097, y: 52.586436, lines: [2],  
    realApiIds: ["1002000206"] },
  { id: "상왕십리", x: 80.447678, y: 53.858761, lines: [2],  
    realApiIds: ["1002000207"] },
  { id: "왕십리", x: 83.050369, y: 56.536133, lines: [2],  
    realApiIds: ["1002000208"] },
  { id: "한양대", x: 85.735191, y: 59.193573, lines: [2],  
    realApiIds: ["1002000209"] },
  { id: "뚝섬", x: 89.708092, y: 61.839405, lines: [2],  
    realApiIds: ["1002000210"] },
  { id: "성수", x: 93.626251, y: 63.100117, lines: [2],  
    realApiIds: ["1002000211"] },
  { id: "건대입구", x: 100.27047, y: 63.227737, lines: [2],  
    realApiIds: ["1002000212"] },
  { id: "구의", x: 104.23922, y: 64.514885, lines: [2],  
    realApiIds: ["1002000213"] },
  { id: "강변", x: 106.88505, y: 65.787865, lines: [2],  
    realApiIds: ["1002000214"] },
  { id: "잠실나루", x: 110.88641, y: 73.112129, lines: [2],  
    realApiIds: ["1002000215"] },
  { id: "잠실", x: 110.83567, y: 75.735542, lines: [2],  
    realApiIds: ["1002000216"] },
  { id: "잠실새내", x: 108.13324, y: 76.382164, lines: [2],  
    realApiIds: ["1002000217"] },
  { id: "종합운동장", x: 104.30759, y: 77.705086, lines: [2],  
    realApiIds: ["1002000218"] },
  { id: "삼성", x: 100.23605, y: 80.395645, lines: [2],  
    realApiIds: ["1002000219"] },
  { id: "선릉", x: 97.649895, y: 83.033325, lines: [2],  
    realApiIds: ["1002000220"] },
  { id: "역삼", x: 94.978012, y: 87.021553, lines: [2],  
    realApiIds: ["1002000221"] },
  { id: "강남", x: 92.324127, y: 89.613205, lines: [2],  
    realApiIds: ["1002000222"] },
  { id: "교대", x: 85.738136, y: 90.986717, lines: [2, 3],  
    realApiIds: ["1002000223", "1003000340"] },
  { id: "서초", x: 77.764938, y: 92.317078, lines: [2],  
    realApiIds: ["1002000224"] },
  { id: "방배", x: 69.91494, y: 93.69059, lines: [2],  
    realApiIds: ["1002000225"] },
  { id: "사당", x: 62.206607, y: 94.748932, lines: [2, 4],  
    realApiIds: ["1002000226", "1004000433"] },
  { id: "낙성대", x: 57.925346, y: 97.28167, lines: [2],  
    realApiIds: ["1002000227"] },
  { id: "서울대입구", x: 52.647369, y: 98.894463, lines: [2],  
    realApiIds: ["1002000228"] },
  { id: "봉천", x: 47.349464, y: 96.596855, lines: [2],  
    realApiIds: ["1002000229"] },
  { id: "신림", x: 42.053638, y: 94.324539, lines: [2],  
    realApiIds: ["1002000230"] },
  { id: "신대방", x: 38.013161, y: 92.266479, lines: [2],  
    realApiIds: ["1002000231"] },
  { id: "구로디지털단지", x: 30.172991, y: 91.970176, lines: [2],  
    realApiIds: ["1002000232"] },
  { id: "대림", x: 28.142321, y: 88.434823, lines: [2],  
    realApiIds: ["1002000233"] },
  { id: "신도림", x: 26.306967, y: 85.994164, lines: [1, 2],  
    realApiIds: ["1001000140","1002000234"] },
  { id: "문래", x: 28.803335, y: 77.776611, lines: [2],  
    realApiIds: ["1002000235"] },
  { id: "영등포구청", x: 31.449169, y: 73.846848, lines: [2],  
    realApiIds: ["1002000236"] },
  { id: "당산", x: 32.760475, y: 69.776909, lines: [2],  
    realApiIds: ["1002000237"] },
  { id: "합정", x: 38.102737, y: 59.244167, lines: [2],  
    realApiIds: ["1002000238"] },
  { id: "홍대입구", x: 40.767628, y: 52.528397, lines: [2],  
    realApiIds: ["1002000239"] },
  { id: "신촌", x: 44.791126, y: 49.933159, lines: [2],  
    realApiIds: ["1002000240"] },
  { id: "이대", x: 47.331619, y: 55.984032, lines: [2],  
    realApiIds: ["1002000241"] },
  { id: "아현", x: 50.002747, y: 57.30592, lines: [2],  
    realApiIds: ["1002000242"] }, 
  { id: "충정로", x: 55.002747, y: 54.30592, lines: [2],  
    realApiIds: ["1002000243"] },
  { id: "용답", x: 95.050354, y: 59.294762, lines: [2],  
    realApiIds: ["1002002111"] },  
  { id: "신답", x: 93.676842, y: 55.224823, lines: [2],  
    realApiIds: ["1002002112"] },
  { id: "용두", x: 88.676842, y: 49.224823, lines: [2],  
    realApiIds: ["1002002113"] },  
  { id: "도림천", x: 23.676842, y: 80.224823, lines: [2],  
    realApiIds: ["1002002341"] },  
  { id: "양천구청", x: 18.676842, y: 74.224823, lines: [2],  
    realApiIds: ["1002002342"] },  
  { id: "신정네거리", x: 14.676842, y: 70.224823, lines: [2],  
    realApiIds: ["1002002343"] },  
  { id: "까치산", x: 10.676842, y: 60.224823, lines: [2],  
    realApiIds: ["1002002344"] },

  // 3호선
  { id: "구파발", x: 41.900909, y: 19.251545, lines: [3],  
    realApiIds: ["1003000320"] },
  { id: "연신내", x: 42.022388, y: 22.114763, lines: [3],  
    realApiIds: ["1003000321"] },
  { id: "불광", x: 42.022388, y: 26.118494, lines: [3],  
    realApiIds: ["1003000322"] },
  { id: "녹번", x: 42.022388, y: 31.360231, lines: [3],  
    realApiIds: ["1003000323"] },
  { id: "홍제", x: 44.545155, y: 38.097885, lines: [3],  
    realApiIds: ["1003000324"] },
  { id: "무악재", x: 48.706936, y: 40.622238, lines: [3],  
    realApiIds: ["1003000325"] },
  { id: "독립문", x: 52.60413, y: 43.28302, lines: [3],  
    realApiIds: ["1003000326"] },
  { id: "경복궁", x: 58.008694, y: 43.419762, lines: [3],  
    realApiIds: ["1003000327"] },
  { id: "안국", x: 63.193825, y: 43.348209, lines: [3],  
    realApiIds: ["1003000328"] },
  { id: "충무로", x: 67.161774, y: 55.271553, lines: [3, 4],  
    realApiIds: ["1003000331", "1004000423"] },
  { id: "동대입구", x: 69.8255, y: 56.630249, lines: [3],  
    realApiIds: ["1003000332"] },
  { id: "약수", x: 72.489227, y: 57.863724, lines: [3],  
    realApiIds: ["1003000333"] },
  { id: "금호", x: 76.475861, y: 59.173283, lines: [3],  
    realApiIds: ["1003000334"] },
  { id: "옥수", x: 79.085915, y: 63.142033, lines: [3],  
    realApiIds: ["1003000335"] },
  { id: "압구정", x: 83.055458, y: 75.097412, lines: [3],  
    realApiIds: ["1003000336"] },
  { id: "신사", x: 83.090439, y: 79.049072, lines: [3],  
    realApiIds: ["1003000337"] },
  { id: "잠원", x: 79.444611, y: 81.730682, lines: [3],  
    realApiIds: ["1003000338"] },
  { id: "고속터미널", x: 81.73494, y: 86.986572, lines: [3],  
    realApiIds: ["1003000339"] },
  { id: "남부터미널", x: 88.66925, y: 96.246986, lines: [3],  
    realApiIds: ["1003000341"] },
  { id: "양재", x: 92.626251, y: 96.285828, lines: [3],  
    realApiIds: ["1003000342"] },
  { id: "매봉", x: 97.660507, y: 94.919769, lines: [3],  
    realApiIds: ["1003000343"] },
  { id: "도곡", x: 100.28849, y: 93.495667, lines: [3],  
    realApiIds: ["1003000344"] },
  { id: "대치", x: 102.88371, y: 92.223343, lines: [3],  
    realApiIds: ["1003000345"] },
  { id: "학여울", x: 105.51794, y: 89.68615, lines: [3],  
    realApiIds: ["1003000346"] },
  { id: "대청", x: 108.20069, y: 90.965919, lines: [3],  
    realApiIds: ["1003000347"] },
  { id: "일원", x: 109.53106, y: 93.611755, lines: [3],  
    realApiIds: ["1003000348"] },
  { id: "수서", x: 112.16077, y: 93.639992, lines: [3],  
    realApiIds: ["1003000349"] },
  { id: "가락시장", x: 116.12745, y: 92.291786, lines: [3],  
    realApiIds: ["1003000350"] },
  { id: "경찰병원", x: 118.81226, y: 89.64595, lines: [3],  
    realApiIds: ["1003000351"] },
  { id: "오금", x: 121.4212, y: 87.025414, lines: [3],  
    realApiIds: ["1003000352"] },

  // 4호선
  { id: "불암산", x: 104.19088, y: 12.849576, lines: [4],  
    realApiIds: ["1004000409"] },
  { id: "상계", x: 98.926727, y: 15.566961, lines: [4],  
    realApiIds: ["1004000410"] },
  { id: "노원", x: 93.641739, y: 16.818325, lines: [4],  
    realApiIds: ["1004000411"] },
  { id: "쌍문", x: 84.431252, y: 16.889877, lines: [4],  
    realApiIds: ["1004000413"] },
  { id: "수유", x: 80.341019, y: 22.181543, lines: [4],  
    realApiIds: ["1004000414"] },
  { id: "미아", x: 80.462502, y: 26.114517, lines: [4],  
    realApiIds: ["1004000415"] },
  { id: "미아사거리", x: 80.712936, y: 29.06739, lines: [4],  
    realApiIds: ["1004000416"] },
  { id: "길음", x: 80.426727, y: 35.446491, lines: [4],  
    realApiIds: ["1004000417"] },
  { id: "성신여대입구", x: 77.730957, y: 39.401085, lines: [4],  
    realApiIds: ["1004000418"] },
  { id: "한성대입구", x: 73.79052, y: 40.702374, lines: [4],  
    realApiIds: ["1004000419"] },
  { id: "혜화", x: 71.130524, y: 44.671127, lines: [4],  
    realApiIds: ["1004000420"] },
  { id: "동대문", x: 72.499062, y: 47.282688, lines: [1, 4],  
    realApiIds: ["1001000128" ,"1004000421"] },
  { id: "명동", x: 64.501793, y: 55.254459, lines: [4],  
    realApiIds: ["1004000424"] },
  { id: "회현", x: 60.58297, y: 55.218685, lines: [4],  
    realApiIds: ["1004000425"] },
  { id: "숙대입구", x: 59.23843, y: 60.488728, lines: [4],  
    realApiIds: ["1004000427"] },
  { id: "삼각지", x: 57.972916, y: 65.873573, lines: [4],  
    realApiIds: ["1004000428"] },
  { id: "신용산", x: 55.255531, y: 69.72084, lines: [4],  
    realApiIds: ["1004000429"] },
  { id: "이촌", x: 61.855167, y: 73.710419, lines: [4],  
    realApiIds: ["1004000430"] },
  { id: "동작", x: 61.870113, y: 82.999931, lines: [4],  
    realApiIds: ["1004000431"] },
  { id: "이수", x: 61.834335, y: 89.650299, lines: [4],  
    realApiIds: ["1004000432"] },
  { id: "남태령", x: 69.793465, y: 100.23363, lines: [4],  
    realApiIds: ["1004000434"] },
];

// API ID로 역 정보 조회
export const getStationByApiId = (apiId: string): Station | undefined => {
  return METRO_STATIONS.find(station => 
    station.realApiIds.includes(apiId)
  );
};

// 역명으로 직접 조회
export const getStationById = (stationName: string): Station | undefined => {
  return METRO_STATIONS.find(station => station.id === stationName);
};

// 특정 노선의 모든 역 반환
export const getStationsByLine = (lineNumber: number): Station[] => {
  return METRO_STATIONS.filter(station => 
    station.lines.includes(lineNumber)
  );
};

// 역명 검색
export const searchStations = (query: string): Station[] => {
  if (!query || query.length < 1) return [];
  
  const normalizedQuery = query.toLowerCase().trim();
  
  return METRO_STATIONS.filter(station =>
    station.id.toLowerCase().includes(normalizedQuery)
  ).sort((a, b) => {
    const aExact = a.id.toLowerCase() === normalizedQuery;
    const bExact = b.id.toLowerCase() === normalizedQuery;
    
    if (aExact && !bExact) return -1;
    if (!aExact && bExact) return 1;
    
    const aStarts = a.id.toLowerCase().startsWith(normalizedQuery);
    const bStarts = b.id.toLowerCase().startsWith(normalizedQuery);
    
    if (aStarts && !bStarts) return -1;
    if (!aStarts && bStarts) return 1;
    
    return a.id.localeCompare(b.id);
  });
};

export const getVisibleStations = (visibleLines: number[]): Station[] => {
  if (visibleLines.length === 0) return [];
  
  return METRO_STATIONS.filter(station => 
    station.lines.some(line => visibleLines.includes(line))
  );
};

export interface ProcessedTrainData {
  stationName: string;        
  apiId: string;              
  lineNumber: number;
  direction: 'up' | 'down';
  trainCount: number;
  lastUpdated: Date;
}

export const SVG_CONFIG = {
  viewBox: "0 0 132.29166 119.0625",
  width: 132.29166,
  height: 119.0625,
  
  normalizeCoordinate: (x: number, y: number) => ({
    x: x / 132.29166,
    y: y / 119.0625
  }),
  
  denormalizeCoordinate: (normalizedX: number, normalizedY: number) => ({
    x: normalizedX * 132.29166,
    y: normalizedY * 119.0625
  })
};

export const METRO_STATS = {
  TOTAL_STATIONS: METRO_STATIONS.length,
  LINES: [1, 2, 3, 4] as const,
  TRANSFER_STATIONS: METRO_STATIONS.filter(s => s.lines.length > 1).length,
  
  getStationCountByLine: (line: number) => 
    METRO_STATIONS.filter(s => s.lines.includes(line)).length,
    
  getLineStationNames: (line: number) =>
    METRO_STATIONS
      .filter(s => s.lines.includes(line))
      .map(s => s.id),
      
  getTotalApiIds: (): number => {
    return METRO_STATIONS.reduce((total, station) => 
      total + station.realApiIds.length, 0
    );
  }
};

export default {
  METRO_STATIONS,
  getStationById,
  getStationByApiId,
  getStationsByLine,
  searchStations,
  getVisibleStations,
  SVG_CONFIG,
  METRO_STATS,
};