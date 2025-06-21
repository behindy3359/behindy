export interface Station {
  id: number;
  name: string;
  x: number;
  y: number;
  lines: number[];
  isTransfer: boolean;
  hasStory: boolean;
  
  // 실시간 API 연동을 위한 필드들
  realApiId?: string;   // 실제 서울시 API에서 사용하는 역 ID
  apiLineId?: string;   // 실제 API에서 사용하는 노선 ID  
  operatorCode?: string; // 운영기관 구분 (metro, line9, etc.)
}


export const METRO_STATIONS: Station[] = [
  // 1호선
  { id: 1, name: "도봉산", x: 88.365646, y: 4.9796629, lines: [1], isTransfer: false, hasStory: true, 
    realApiId: undefined,
    apiLineId: undefined,
    operatorCode: "metro" },
  { id: 2, name: "도봉", x: 88.329361, y: 8.9514217, lines: [1], isTransfer: false, hasStory: false , 
    realApiId: undefined,
    apiLineId: undefined,
    operatorCode: "metro" },
  { id: 3, name: "방학", x: 88.340981, y: 12.928492, lines: [1], isTransfer: false, hasStory: false , 
    realApiId: undefined,
    apiLineId: undefined,
    operatorCode: "metro" },
  { id: 4, name: "창동", x: 88.340973, y: 16.942114, lines: [1, 4], isTransfer: true, hasStory: false , 
    realApiId: undefined,
    apiLineId: undefined,
    operatorCode: "metro" },
  { id: 5, name: "녹천", x: 88.34832, y: 20.803902, lines: [1], isTransfer: false, hasStory: false , 
    realApiId: undefined,
    apiLineId: undefined,
    operatorCode: "metro" },
  { id: 6, name: "월계", x: 92.331429, y: 22.157511, lines: [1], isTransfer: false, hasStory: false , 
    realApiId: undefined,
    apiLineId: undefined,
    operatorCode: "metro" },
  { id: 7, name: "광운대", x: 94.990112, y: 24.763893, lines: [1], isTransfer: false, hasStory: false , 
    realApiId: undefined,
    apiLineId: undefined,
    operatorCode: "metro" },
  { id: 8, name: "석계", x: 96.30468, y: 27.43854, lines: [1], isTransfer: false, hasStory: false , 
    realApiId: undefined,
    apiLineId: undefined,
    operatorCode: "metro" },
  { id: 9, name: "신이문", x: 94.964935, y: 34.097141, lines: [1], isTransfer: false, hasStory: false , 
    realApiId: undefined,
    apiLineId: undefined,
    operatorCode: "metro" },
  { id: 10, name: "외대앞", x: 93.614639, y: 38.015297, lines: [1], isTransfer: false, hasStory: false , 
    realApiId: undefined,
    apiLineId: undefined,
    operatorCode: "metro" },
  { id: 11, name: "회기", x: 92.326546, y: 42.011425, lines: [1], isTransfer: false, hasStory: false , 
    realApiId: undefined,
    apiLineId: undefined,
    operatorCode: "metro" },
  { id: 12, name: "청량리", x: 90.99411, y: 44.666786, lines: [1], isTransfer: false, hasStory: false , 
    realApiId: undefined,
    apiLineId: undefined,
    operatorCode: "metro" },
  { id: 13, name: "제기동", x: 88.322975, y: 46.015003, lines: [1], isTransfer: false, hasStory: false , 
    realApiId: undefined,
    apiLineId: undefined,
    operatorCode: "metro" },
  { id: 14, name: "신설동", x: 84.368164, y: 47.340847, lines: [1], isTransfer: false, hasStory: false , 
    realApiId: undefined,
    apiLineId: undefined,
    operatorCode: "metro" },
  { id: 15, name: "동묘앞", x: 76.4422, y: 47.29166, lines: [1], isTransfer: false, hasStory: false , 
    realApiId: undefined,
    apiLineId: undefined,
    operatorCode: "metro" },
  { id: 16, name: "종로5가", x: 68.506073, y: 47.290703, lines: [1], isTransfer: false, hasStory: false , 
    realApiId: undefined,
    apiLineId: undefined,
    operatorCode: "metro" },
  { id: 17, name: "종로3가", x: 64.737282, y: 47.284924, lines: [1, 3], isTransfer: true, hasStory: false , 
    realApiId: undefined,
    apiLineId: undefined,
    operatorCode: "metro" },
  { id: 18, name: "종각", x: 60.577595, y: 47.299969, lines: [1], isTransfer: false, hasStory: true , 
    realApiId: undefined,
    apiLineId: undefined,
    operatorCode: "metro" },
  { id: 19, name: "시청", x: 58.663303, y: 52.421543, lines: [1, 2], isTransfer: true, hasStory: false , 
    realApiId: undefined,
    apiLineId: undefined,
    operatorCode: "metro" },
  { id: 20, name: "서울역", x: 57.910622, y: 55.252201, lines: [1, 4], isTransfer: true, hasStory: true , 
    realApiId: undefined,
    apiLineId: undefined,
    operatorCode: "metro" },
  { id: 21, name: "남영", x: 57.934879, y: 61.818268, lines: [1], isTransfer: false, hasStory: false , 
    realApiId: undefined,
    apiLineId: undefined,
    operatorCode: "metro" },
  { id: 22, name: "용산", x: 53.960758, y: 68.490891, lines: [1], isTransfer: false, hasStory: false , 
    realApiId: undefined,
    apiLineId: undefined,
    operatorCode: "metro" },
  { id: 23, name: "노량진", x: 48.680222, y: 79.102737, lines: [1], isTransfer: false, hasStory: false , 
    realApiId: undefined,
    apiLineId: undefined,
    operatorCode: "metro" },
  { id: 24, name: "대방", x: 42.13369, y: 79.138512, lines: [1], isTransfer: false, hasStory: false , 
    realApiId: undefined,
    apiLineId: undefined,
    operatorCode: "metro" },
  { id: 25, name: "신길", x: 36.767445, y: 77.73436, lines: [1], isTransfer: false, hasStory: false , 
    realApiId: undefined,
    apiLineId: undefined,
    operatorCode: "metro" },
  { id: 26, name: "영등포", x: 31.478807, y: 80.389877, lines: [1], isTransfer: false, hasStory: false , 
    realApiId: undefined,
    apiLineId: undefined,
    operatorCode: "metro" },
  { id: 27, name: "구로", x: 22.168465, y: 88.327377, lines: [1], isTransfer: false, hasStory: false , 
    realApiId: undefined,
    apiLineId: undefined,
    operatorCode: "metro" },
  { id: 28, name: "구일", x: 16.948349, y: 89.650299, lines: [1], isTransfer: false, hasStory: false , 
    realApiId: undefined,
    apiLineId: undefined,
    operatorCode: "metro" },
  { id: 29, name: "개봉", x: 11.599281, y: 88.29081, lines: [1], isTransfer: false, hasStory: false , 
    realApiId: undefined,
    apiLineId: undefined,
    operatorCode: "metro" },
  { id: 30, name: "오류동", x: 6.2718396, y: 88.29081, lines: [1], isTransfer: false, hasStory: false , 
    realApiId: undefined,
    apiLineId: undefined,
    operatorCode: "metro" },
  { id: 31, name: "온수", x: 2.3388658, y: 86.9655, lines: [1], isTransfer: false, hasStory: false , 
    realApiId: undefined,
    apiLineId: undefined,
    operatorCode: "metro" },
  { id: 32, name: "가산디지털단지", x: 27.495907, y: 97.587799, lines: [1], isTransfer: false, hasStory: false , 
    realApiId: undefined,
    apiLineId: undefined,
    operatorCode: "metro" },
  { id: 33, name: "독산", x: 31.478807, y: 106.84821, lines: [1], isTransfer: false, hasStory: false , 
    realApiId: undefined,
    apiLineId: undefined,
    operatorCode: "metro" },

  // 2호선
  { id: 34, name: "을지로입구", x: 61.938728, y: 52.627687, lines: [2], isTransfer: false, hasStory: false , 
    realApiId: undefined,
    apiLineId: undefined,
    operatorCode: "metro" },
  { id: 35, name: "을지로3가", x: 65.44739, y: 52.348022, lines: [2, 3], isTransfer: true, hasStory: false , 
    realApiId: undefined,
    apiLineId: undefined,
    operatorCode: "metro" },
  { id: 36, name: "을지로4가", x: 69.802147, y: 52.578991, lines: [2], isTransfer: false, hasStory: false , 
    realApiId: undefined,
    apiLineId: undefined,
    operatorCode: "metro" },
  { id: 37, name: "동대문역사문화공원", x: 72.515649, y: 52.579826, lines: [2, 4], isTransfer: true, hasStory: false , 
    realApiId: undefined,
    apiLineId: undefined,
    operatorCode: "metro" },
  { id: 38, name: "신당", x: 75.097097, y: 52.586436, lines: [2], isTransfer: false, hasStory: false , 
    realApiId: undefined,
    apiLineId: undefined,
    operatorCode: "metro" },
  { id: 39, name: "상왕십리", x: 80.447678, y: 53.858761, lines: [2], isTransfer: false, hasStory: false , 
    realApiId: undefined,
    apiLineId: undefined,
    operatorCode: "metro" },
  { id: 40, name: "왕십리", x: 83.050369, y: 56.536133, lines: [2], isTransfer: false, hasStory: false , 
    realApiId: undefined,
    apiLineId: undefined,
    operatorCode: "metro" },
  { id: 41, name: "한양대", x: 85.735191, y: 59.193573, lines: [2], isTransfer: false, hasStory: false , 
    realApiId: undefined,
    apiLineId: undefined,
    operatorCode: "metro" },
  { id: 42, name: "뚝섬", x: 89.708092, y: 61.839405, lines: [2], isTransfer: false, hasStory: false , 
    realApiId: undefined,
    apiLineId: undefined,
    operatorCode: "metro" },
  { id: 43, name: "성수", x: 93.626251, y: 63.100117, lines: [2], isTransfer: false, hasStory: false , 
    realApiId: undefined,
    apiLineId: undefined,
    operatorCode: "metro" },
  { id: 44, name: "건대입구", x: 100.27047, y: 63.227737, lines: [2], isTransfer: false, hasStory: false , 
    realApiId: undefined,
    apiLineId: undefined,
    operatorCode: "metro" },
  { id: 45, name: "구의", x: 104.23922, y: 64.514885, lines: [2], isTransfer: false, hasStory: false , 
    realApiId: undefined,
    apiLineId: undefined,
    operatorCode: "metro" },
  { id: 46, name: "강변", x: 106.88505, y: 65.787865, lines: [2], isTransfer: false, hasStory: false , 
    realApiId: undefined,
    apiLineId: undefined,
    operatorCode: "metro" },
  { id: 47, name: "잠실나루", x: 110.88641, y: 73.112129, lines: [2], isTransfer: false, hasStory: false , 
    realApiId: undefined,
    apiLineId: undefined,
    operatorCode: "metro" },
  { id: 48, name: "잠실", x: 110.83567, y: 75.735542, lines: [2], isTransfer: false, hasStory: false , 
    realApiId: undefined,
    apiLineId: undefined,
    operatorCode: "metro" },
  { id: 49, name: "잠실새내", x: 108.13324, y: 76.382164, lines: [2], isTransfer: false, hasStory: false , 
    realApiId: undefined,
    apiLineId: undefined,
    operatorCode: "metro" },
  { id: 50, name: "종합운동장", x: 104.30759, y: 77.705086, lines: [2], isTransfer: false, hasStory: false , 
    realApiId: undefined,
    apiLineId: undefined,
    operatorCode: "metro" },
  { id: 51, name: "삼성", x: 100.23605, y: 80.395645, lines: [2], isTransfer: false, hasStory: false , 
    realApiId: undefined,
    apiLineId: undefined,
    operatorCode: "metro" },
  { id: 52, name: "선릉", x: 97.649895, y: 83.033325, lines: [2], isTransfer: false, hasStory: false , 
    realApiId: undefined,
    apiLineId: undefined,
    operatorCode: "metro" },
  { id: 53, name: "역삼", x: 94.978012, y: 87.021553, lines: [2], isTransfer: false, hasStory: false , 
    realApiId: undefined,
    apiLineId: undefined,
    operatorCode: "metro" },
  { id: 54, name: "강남", x: 92.324127, y: 89.613205, lines: [2], isTransfer: false, hasStory: true , 
    realApiId: undefined,
    apiLineId: undefined,
    operatorCode: "metro" },
  { id: 55, name: "교대", x: 85.738136, y: 90.986717, lines: [2, 3], isTransfer: true, hasStory: false , 
    realApiId: undefined,
    apiLineId: undefined,
    operatorCode: "metro" },
  { id: 56, name: "서초", x: 77.764938, y: 92.317078, lines: [2], isTransfer: false, hasStory: false , 
    realApiId: undefined,
    apiLineId: undefined,
    operatorCode: "metro" },
  { id: 57, name: "방배", x: 69.91494, y: 93.69059, lines: [2], isTransfer: false, hasStory: false , 
    realApiId: undefined,
    apiLineId: undefined,
    operatorCode: "metro" },
  { id: 58, name: "사당", x: 62.206607, y: 94.748932, lines: [2, 4], isTransfer: true, hasStory: false , 
    realApiId: undefined,
    apiLineId: undefined,
    operatorCode: "metro" },
  { id: 59, name: "낙성대", x: 57.925346, y: 97.28167, lines: [2], isTransfer: false, hasStory: false , 
    realApiId: undefined,
    apiLineId: undefined,
    operatorCode: "metro" },
  { id: 60, name: "서울대입구", x: 52.647369, y: 98.894463, lines: [2], isTransfer: false, hasStory: false , 
    realApiId: undefined,
    apiLineId: undefined,
    operatorCode: "metro" },
  { id: 61, name: "봉천", x: 47.349464, y: 96.596855, lines: [2], isTransfer: false, hasStory: false , 
    realApiId: undefined,
    apiLineId: undefined,
    operatorCode: "metro" },
  { id: 62, name: "신림", x: 42.053638, y: 94.324539, lines: [2], isTransfer: false, hasStory: false , 
    realApiId: undefined,
    apiLineId: undefined,
    operatorCode: "metro" },
  { id: 63, name: "신대방", x: 38.013161, y: 92.266479, lines: [2], isTransfer: false, hasStory: false , 
    realApiId: undefined,
    apiLineId: undefined,
    operatorCode: "metro" },
  { id: 66, name: "신도림", x: 26.306967, y: 85.994164, lines: [1, 2], isTransfer: true, hasStory: false , 
    realApiId: undefined,
    apiLineId: undefined,
    operatorCode: "metro" },
  { id: 65, name: "대림", x: 28.142321, y: 88.434823, lines: [2], isTransfer: false, hasStory: false , 
    realApiId: undefined,
    apiLineId: undefined,
    operatorCode: "metro" },
  { id: 64, name: "구로디지털단지", x: 30.172991, y: 91.970176, lines: [2], isTransfer: false, hasStory: false , 
    realApiId: undefined,
    apiLineId: undefined,
    operatorCode: "metro" },
  { id: 67, name: "문래", x: 28.803335, y: 77.776611, lines: [2], isTransfer: false, hasStory: false , 
    realApiId: undefined,
    apiLineId: undefined,
    operatorCode: "metro" },
  { id: 68, name: "영등포구청", x: 31.449169, y: 73.846848, lines: [2], isTransfer: false, hasStory: false , 
    realApiId: undefined,
    apiLineId: undefined,
    operatorCode: "metro" },
  { id: 69, name: "당산", x: 32.760475, y: 69.776909, lines: [2], isTransfer: false, hasStory: false , 
    realApiId: undefined,
    apiLineId: undefined,
    operatorCode: "metro" },
  { id: 70, name: "합정", x: 38.102737, y: 59.244167, lines: [2], isTransfer: false, hasStory: false , 
    realApiId: undefined,
    apiLineId: undefined,
    operatorCode: "metro" },
  { id: 71, name: "홍대입구", x: 40.767628, y: 52.528397, lines: [2], isTransfer: false, hasStory: true , 
    realApiId: undefined,
    apiLineId: undefined,
    operatorCode: "metro" },
  { id: 72, name: "신촌", x: 44.791126, y: 49.933159, lines: [2], isTransfer: false, hasStory: true , 
    realApiId: undefined,
    apiLineId: undefined,
    operatorCode: "metro" },
  { id: 73, name: "이대", x: 47.331619, y: 53.984032, lines: [2], isTransfer: false, hasStory: false , 
    realApiId: undefined,
    apiLineId: undefined,
    operatorCode: "metro" },
  { id: 74, name: "아현", x: 50.002747, y: 55.30592, lines: [2], isTransfer: false, hasStory: false , 
    realApiId: undefined,
    apiLineId: undefined,
    operatorCode: "metro" },
  { id: 75, name: "용답", x: 95.050354, y: 59.294762, lines: [2], isTransfer: false, hasStory: false , 
    realApiId: undefined,
    apiLineId: undefined,
    operatorCode: "metro" },  
  { id: 76, name: "신답", x: 93.676842, y: 55.224823, lines: [2], isTransfer: false, hasStory: false , 
    realApiId: undefined,
    apiLineId: undefined,
    operatorCode: "metro" }, 
  { id: 77, name: "충정로", x: 93.676842, y: 55.224823, lines: [2], isTransfer: false, hasStory: false , 
    realApiId: undefined,
    apiLineId: undefined,
    operatorCode: "metro" },  
  { id: 78, name: "용두", x: 88.676842, y: 49.224823, lines: [2], isTransfer: false, hasStory: false , 
    realApiId: undefined,
    apiLineId: undefined,
    operatorCode: "metro" },  
  { id: 79, name: "도림천", x: 23.676842, y: 80.224823, lines: [2], isTransfer: false, hasStory: false , 
    realApiId: undefined,
    apiLineId: undefined,
    operatorCode: "metro" },  
  { id: 80, name: "양천구청", x: 18.676842, y: 74.224823, lines: [2], isTransfer: false, hasStory: false , 
    realApiId: undefined,
    apiLineId: undefined,
    operatorCode: "metro" },  
  { id: 81, name: "신정네거리", x: 14.676842, y: 70.224823, lines: [2], isTransfer: false, hasStory: false , 
    realApiId: undefined,
    apiLineId: undefined,
    operatorCode: "metro" },  
  { id: 82, name: "까치산", x: 10.676842, y: 60.224823, lines: [2], isTransfer: false, hasStory: false , 
    realApiId: undefined,
    apiLineId: undefined,
    operatorCode: "metro" },

  // 3호선
  { id: 83, name: "구파발", x: 41.900909, y: 16.751545, lines: [3], isTransfer: false, hasStory: false , 
    realApiId: undefined,
    apiLineId: undefined,
    operatorCode: "metro" },
  { id: 84, name: "연신내", x: 42.022388, y: 22.114763, lines: [3], isTransfer: false, hasStory: false , 
    realApiId: undefined,
    apiLineId: undefined,
    operatorCode: "metro" },
  { id: 85, name: "불광", x: 42.022388, y: 26.118494, lines: [3], isTransfer: false, hasStory: false , 
    realApiId: undefined,
    apiLineId: undefined,
    operatorCode: "metro" },
  { id: 86, name: "녹번", x: 42.022388, y: 31.360231, lines: [3], isTransfer: false, hasStory: false , 
    realApiId: undefined,
    apiLineId: undefined,
    operatorCode: "metro" },
  { id: 87, name: "홍제", x: 44.545155, y: 38.097885, lines: [3], isTransfer: false, hasStory: false , 
    realApiId: undefined,
    apiLineId: undefined,
    operatorCode: "metro" },
  { id: 88, name: "무악재", x: 48.706936, y: 40.622238, lines: [3], isTransfer: false, hasStory: false , 
    realApiId: undefined,
    apiLineId: undefined,
    operatorCode: "metro" },
  { id: 89, name: "독립문", x: 52.60413, y: 43.28302, lines: [3], isTransfer: false, hasStory: false , 
    realApiId: undefined,
    apiLineId: undefined,
    operatorCode: "metro" },
  { id: 90, name: "경복궁", x: 58.008694, y: 43.419762, lines: [3], isTransfer: false, hasStory: false , 
    realApiId: undefined,
    apiLineId: undefined,
    operatorCode: "metro" },
  { id: 91, name: "안국", x: 63.193825, y: 43.348209, lines: [3], isTransfer: false, hasStory: false , 
    realApiId: undefined,
    apiLineId: undefined,
    operatorCode: "metro" },
  { id: 92, name: "충무로", x: 67.161774, y: 55.271553, lines: [3, 4], isTransfer: true, hasStory: false , 
    realApiId: undefined,
    apiLineId: undefined,
    operatorCode: "metro" },
  { id: 93, name: "동대입구", x: 69.8255, y: 56.630249, lines: [3], isTransfer: false, hasStory: false , 
    realApiId: undefined,
    apiLineId: undefined,
    operatorCode: "metro" },
  { id: 94, name: "약수", x: 72.489227, y: 57.863724, lines: [3], isTransfer: false, hasStory: false , 
    realApiId: undefined,
    apiLineId: undefined,
    operatorCode: "metro" },
  { id: 95, name: "금호", x: 76.475861, y: 59.173283, lines: [3], isTransfer: false, hasStory: false , 
    realApiId: undefined,
    apiLineId: undefined,
    operatorCode: "metro" },
  { id: 96, name: "옥수", x: 79.085915, y: 63.142033, lines: [3], isTransfer: false, hasStory: false , 
    realApiId: undefined,
    apiLineId: undefined,
    operatorCode: "metro" },
  { id: 97, name: "압구정", x: 83.055458, y: 75.097412, lines: [3], isTransfer: false, hasStory: false , 
    realApiId: undefined,
    apiLineId: undefined,
    operatorCode: "metro" },
  { id: 98, name: "신사", x: 83.090439, y: 79.049072, lines: [3], isTransfer: false, hasStory: false , 
    realApiId: undefined,
    apiLineId: undefined,
    operatorCode: "metro" },
  { id: 99, name: "잠원", x: 80.444611, y: 81.730682, lines: [3], isTransfer: false, hasStory: false , 
    realApiId: undefined,
    apiLineId: undefined,
    operatorCode: "metro" },
  { id: 100, name: "고속터미널", x: 81.73494, y: 86.986572, lines: [3], isTransfer: false, hasStory: false , 
    realApiId: undefined,
    apiLineId: undefined,
    operatorCode: "metro" },
  { id: 101, name: "남부터미널", x: 89.66925, y: 96.246986, lines: [3], isTransfer: false, hasStory: false , 
    realApiId: undefined,
    apiLineId: undefined,
    operatorCode: "metro" },
  { id: 102, name: "양재", x: 93.626251, y: 96.285828, lines: [3], isTransfer: false, hasStory: false , 
    realApiId: undefined,
    apiLineId: undefined,
    operatorCode: "metro" },
  { id: 103, name: "매봉", x: 97.660507, y: 94.919769, lines: [3], isTransfer: false, hasStory: false , 
    realApiId: undefined,
    apiLineId: undefined,
    operatorCode: "metro" },
  { id: 104, name: "도곡", x: 100.28849, y: 93.495667, lines: [3], isTransfer: false, hasStory: false , 
    realApiId: undefined,
    apiLineId: undefined,
    operatorCode: "metro" },
  { id: 105, name: "대치", x: 102.88371, y: 92.223343, lines: [3], isTransfer: false, hasStory: false , 
    realApiId: undefined,
    apiLineId: undefined,
    operatorCode: "metro" },
  { id: 106, name: "학여울", x: 105.51794, y: 89.68615, lines: [3], isTransfer: false, hasStory: false , 
    realApiId: undefined,
    apiLineId: undefined,
    operatorCode: "metro" },
  { id: 107, name: "대청", x: 108.20069, y: 90.965919, lines: [3], isTransfer: false, hasStory: false , 
    realApiId: undefined,
    apiLineId: undefined,
    operatorCode: "metro" },
  { id: 108, name: "일원", x: 109.53106, y: 93.611755, lines: [3], isTransfer: false, hasStory: false , 
    realApiId: undefined,
    apiLineId: undefined,
    operatorCode: "metro" },
  { id: 109, name: "수서", x: 112.16077, y: 93.639992, lines: [3], isTransfer: false, hasStory: false , 
    realApiId: undefined,
    apiLineId: undefined,
    operatorCode: "metro" },
  { id: 110, name: "가락시장", x: 116.12745, y: 92.291786, lines: [3], isTransfer: false, hasStory: false , 
    realApiId: undefined,
    apiLineId: undefined,
    operatorCode: "metro" },
  { id: 111, name: "경찰병원", x: 118.81226, y: 89.64595, lines: [3], isTransfer: false, hasStory: false , 
    realApiId: undefined,
    apiLineId: undefined,
    operatorCode: "metro" },
  { id: 112, name: "오금", x: 121.4212, y: 87.025414, lines: [3], isTransfer: false, hasStory: false , 
    realApiId: undefined,
    apiLineId: undefined,
    operatorCode: "metro" },

  // 4호선
  { id: 113, name: "당고개", x: 104.19088, y: 12.849576, lines: [4], isTransfer: false, hasStory: false , 
    realApiId: undefined,
    apiLineId: undefined,
    operatorCode: "metro" },
  { id: 114, name: "상계", x: 98.926727, y: 15.566961, lines: [4], isTransfer: false, hasStory: false , 
    realApiId: undefined,
    apiLineId: undefined,
    operatorCode: "metro" },
  { id: 115, name: "노원", x: 93.641739, y: 16.818325, lines: [4], isTransfer: false, hasStory: false , 
    realApiId: undefined,
    apiLineId: undefined,
    operatorCode: "metro" },
  { id: 116, name: "쌍문", x: 84.431252, y: 16.889877, lines: [4], isTransfer: false, hasStory: false , 
    realApiId: undefined,
    apiLineId: undefined,
    operatorCode: "metro" },
  { id: 117, name: "수유", x: 80.341019, y: 22.181543, lines: [4], isTransfer: false, hasStory: false , 
    realApiId: undefined,
    apiLineId: undefined,
    operatorCode: "metro" },
  { id: 118, name: "미아", x: 80.462502, y: 26.114517, lines: [4], isTransfer: false, hasStory: false , 
    realApiId: undefined,
    apiLineId: undefined,
    operatorCode: "metro" },
  { id: 119, name: "미아사거리", x: 80.712936, y: 29.06739, lines: [4], isTransfer: false, hasStory: false , 
    realApiId: undefined,
    apiLineId: undefined,
    operatorCode: "metro" },
  { id: 120, name: "길음", x: 80.426727, y: 35.446491, lines: [4], isTransfer: false, hasStory: false , 
    realApiId: undefined,
    apiLineId: undefined,
    operatorCode: "metro" },
  { id: 121, name: "성신여대입구", x: 77.730957, y: 39.401085, lines: [4], isTransfer: false, hasStory: false , 
    realApiId: undefined,
    apiLineId: undefined,
    operatorCode: "metro" },
  { id: 122, name: "한성대입구", x: 73.79052, y: 40.702374, lines: [4], isTransfer: false, hasStory: false , 
    realApiId: undefined,
    apiLineId: undefined,
    operatorCode: "metro" },
  { id: 123, name: "혜화", x: 71.130524, y: 44.671127, lines: [4], isTransfer: false, hasStory: false , 
    realApiId: undefined,
    apiLineId: undefined,
    operatorCode: "metro" },
  { id: 124, name: "동대문", x: 72.499062, y: 47.282688, lines: [1, 4], isTransfer: true, hasStory: false , 
    realApiId: undefined,
    apiLineId: undefined,
    operatorCode: "metro" },
  { id: 125, name: "명동", x: 64.501793, y: 55.254459, lines: [4], isTransfer: false, hasStory: true , 
    realApiId: undefined,
    apiLineId: undefined,
    operatorCode: "metro" },
  { id: 126, name: "회현", x: 60.58297, y: 55.218685, lines: [4], isTransfer: false, hasStory: false , 
    realApiId: undefined,
    apiLineId: undefined,
    operatorCode: "metro" },
  { id: 127, name: "숙대입구", x: 59.23843, y: 60.488728, lines: [4], isTransfer: false, hasStory: false , 
    realApiId: undefined,
    apiLineId: undefined,
    operatorCode: "metro" },
  { id: 128, name: "삼각지", x: 57.972916, y: 65.873573, lines: [4], isTransfer: false, hasStory: false , 
    realApiId: undefined,
    apiLineId: undefined,
    operatorCode: "metro" },
  { id: 129, name: "신용산", x: 55.255531, y: 69.72084, lines: [4], isTransfer: false, hasStory: false , 
    realApiId: undefined,
    apiLineId: undefined,
    operatorCode: "metro" },
  { id: 130, name: "이촌", x: 61.855167, y: 73.710419, lines: [4], isTransfer: false, hasStory: false , 
    realApiId: undefined,
    apiLineId: undefined,
    operatorCode: "metro" },
  { id: 131, name: "동작", x: 61.870113, y: 82.999931, lines: [4], isTransfer: false, hasStory: false , 
    realApiId: undefined,
    apiLineId: undefined,
    operatorCode: "metro" },
  { id: 132, name: "이수", x: 61.834335, y: 89.650299, lines: [4], isTransfer: false, hasStory: false , 
    realApiId: undefined,
    apiLineId: undefined,
    operatorCode: "metro" },
  { id: 133, name: "남태령", x: 69.793465, y: 100.23363, lines: [4], isTransfer: false, hasStory: false , 
    realApiId: undefined,
    apiLineId: undefined,
    operatorCode: "metro" },
];

// 노선별 색상 정의
export const LINE_COLORS = {
  1: '#0052A4',  // 1호선 - 블루
  2: '#00A84D',  // 2호선 - 그린  
  3: '#EF7C1C',  // 3호선 - 오렌지
  4: '#00A5DE',  // 4호선 - 라이트블루
} as const;

// ================================================================
// 비트 연산 유틸리티
// ================================================================

// 🔧 유틸리티 함수들

/**
 * 실제 API ID로 역 찾기
 */
export const getStationByApiId = (apiId: string): Station | undefined => {
  return METRO_STATIONS.find(station => station.realApiId === apiId);
};

/**
 * 프론트엔드 ID로 API ID 찾기
 */
export const getApiIdByStationId = (stationId: number): string | undefined => {
  const station = METRO_STATIONS.find(s => s.id === stationId);
  return station?.realApiId;
};

/**
 * 역명으로 API ID 찾기 (임시 매핑용)
 */
export const getApiIdByStationName = (stationName: string, lineNumber?: number): string | undefined => {
  const stations = METRO_STATIONS.filter(s => s.name === stationName);
  
  if (lineNumber) {
    const station = stations.find(s => s.lines.includes(lineNumber));
    return station?.realApiId;
  }
  
  return stations[0]?.realApiId;
};

/**
 * 실시간 데이터를 프론트엔드 형식으로 변환
 */
export interface RealtimeStationData {
  frontendStationId: number;
  stationName: string;
  lineNumber: number;
  direction: 'up' | 'down' | 'unknown';
  trainCount: number;
  lastUpdated: Date;
}

export const transformApiDataToFrontend = (apiTrains: any[]): RealtimeStationData[] => {
  return apiTrains
    .map(trainData => {
      // 1차: API ID로 찾기
      let station = getStationByApiId(trainData.stationId);
      
      // 2차: 역명으로 찾기 (fallback)
      if (!station) {
        const lineNumber = parseInt(trainData.subwayLine);
        station = METRO_STATIONS.find(s => 
          s.name === trainData.stationName && 
          s.lines.includes(lineNumber)
        );
        
        if (station) {
          console.warn(`API ID 매핑 실패, 역명으로 매칭: ${trainData.stationName} (API ID: ${trainData.stationId})`);
        }
      }
      
      if (!station) {
        console.warn(`매핑되지 않은 역: ${trainData.stationName} (API ID: ${trainData.stationId})`);
        return null;
      }
      
      // 방향 정규화
      let direction: 'up' | 'down' | 'unknown' = 'unknown';
      if (trainData.direction) {
        const dir = trainData.direction.toLowerCase();
        if (dir.includes('상행') || dir.includes('up')) direction = 'up';
        else if (dir.includes('하행') || dir.includes('down')) direction = 'down';
      }
      
      return {
        frontendStationId: station.id,
        stationName: station.name,
        lineNumber: station.lines[0], // 첫 번째 노선 사용
        direction,
        trainCount: trainData.trainCount || 1,
        lastUpdated: new Date()
      };
    })
    .filter((data): data is RealtimeStationData => data !== null);
};

// 🚀 데이터 업데이트 유틸리티

/**
 * 실제 API 데이터로 역 정보 업데이트
 * (개발 단계에서 한 번 실행하여 realApiId 필드 채우기)
 */
export const updateStationDataWithApiIds = (apiStationList: any[]) => {
  const updatedStations = METRO_STATIONS.map(station => {
    // API 데이터에서 매칭되는 역 찾기
    const apiMatch = apiStationList.find(api => {
      const apiLineNumber = parseInt(api.subwayLine || api.lineNumber);
      return api.stationName === station.name && 
             station.lines.includes(apiLineNumber);
    });
    
    if (apiMatch) {
      return {
        ...station,
        realApiId: apiMatch.stationId,
        apiLineId: apiMatch.subwayLine || apiMatch.lineNumber,
      };
    }
    
    return station;
  });
  
  // 콘솔에 업데이트된 데이터 출력 (복사해서 파일에 붙여넣기용)
  console.log('=== 업데이트된 역 데이터 ===');
  console.log(JSON.stringify(updatedStations, null, 2));
  
  return updatedStations;
};

export const LineBitUtils = {
  /**
   * 노선 배열을 비트로 변환
   * 예: [1, 4] -> 9 (1001 in binary)
   */
  linesToBits: (lines: number[]): number => {
    return lines.reduce((bits, line) => bits | (1 << (line - 1)), 0);
  },

  /**
   * 비트를 노선 배열로 변환
   * 예: 9 -> [1, 4]
   */
  bitsToLines: (bits: number): number[] => {
    const lines: number[] = [];
    for (let i = 0; i < 32; i++) {
      if (bits & (1 << i)) {
        lines.push(i + 1);
      }
    }
    return lines;
  },

  /**
   * 특정 노선이 비트에 포함되어 있는지 확인
   */
  hasLine: (bits: number, line: number): boolean => {
    return (bits & (1 << (line - 1))) !== 0;
  },

  /**
   * 필터 조건과 매치되는지 확인
   */
  matchesFilter: (stationBits: number, filterLines: number[]): boolean => {
    if (filterLines.length === 0) return true;
    
    const filterBits = LineBitUtils.linesToBits(filterLines);
    return (stationBits & filterBits) !== 0;
  }
};

// ================================================================
// 데이터 조회 함수들
// ================================================================

/**
 * 특정 노선의 모든 역 반환
 */
export const getStationsByLine = (lineNumber: number): Station[] => {
  return METRO_STATIONS.filter(station => 
    station.lines.includes(lineNumber)
  );
};

/**
 * 모든 환승역 반환
 */
export const getTransferStations = (): Station[] => {
  return METRO_STATIONS.filter(station => station.isTransfer);
};

/**
 * 스토리가 있는 역들 반환
 */
export const getStoryStations = (): Station[] => {
  return METRO_STATIONS.filter(station => station.hasStory);
};

/**
 * 역명으로 검색
 */
export const searchStations = (query: string): Station[] => {
  if (!query || query.length < 1) return [];
  
  const normalizedQuery = query.toLowerCase().trim();
  
  return METRO_STATIONS.filter(station =>
    station.name.toLowerCase().includes(normalizedQuery)
  ).sort((a, b) => {
    // 정확히 일치하는 것을 먼저 보여줌
    const aExact = a.name.toLowerCase() === normalizedQuery;
    const bExact = b.name.toLowerCase() === normalizedQuery;
    
    if (aExact && !bExact) return -1;
    if (!aExact && bExact) return 1;
    
    // 시작하는 것을 다음으로 우선순위
    const aStarts = a.name.toLowerCase().startsWith(normalizedQuery);
    const bStarts = b.name.toLowerCase().startsWith(normalizedQuery);
    
    if (aStarts && !bStarts) return -1;
    if (!aStarts && bStarts) return 1;
    
    // 나머지는 알파벳 순
    return a.name.localeCompare(b.name);
  });
};

/**
 * ID로 역 찾기
 */
export const getStationById = (id: number): Station | undefined => {
  return METRO_STATIONS.find(station => station.id === id);
};

/**
 * 두 역 사이의 거리 계산 (유클리드 거리)
 */
export const getDistanceBetweenStations = (station1: Station, station2: Station): number => {
  const dx = station1.x - station2.x;
  const dy = station1.y - station2.y;
  return Math.sqrt(dx * dx + dy * dy);
};

// ================================================================
// 통계 데이터
// ================================================================

export const METRO_STATS = {
  totalStations: METRO_STATIONS.length,
  transferStations: getTransferStations().length,
  stationsWithStory: getStoryStations().length,
  stationsByLine: {
    1: getStationsByLine(1).length,
    2: getStationsByLine(2).length,
    3: getStationsByLine(3).length,
    4: getStationsByLine(4).length,
  }
};

// ================================================================
// SVG 설정
// ================================================================

export const SVG_CONFIG = {
  viewBox: "0 0 132.29166 119.0625",
  width: 132.29166,
  height: 119.0625,
  
  /**
   * SVG 좌표를 정규화된 좌표 (0-1)로 변환
   */
  normalizeCoordinate: (x: number, y: number) => ({
    x: x / 132.29166,
    y: y / 119.0625
  }),
  
  /**
   * 정규화된 좌표를 SVG 좌표로 변환
   */
  denormalizeCoordinate: (normalizedX: number, normalizedY: number) => ({
    x: normalizedX * 132.29166,
    y: normalizedY * 119.0625
  })
};


// ================================================================
// 기본 export
// ================================================================

export default {
  METRO_STATIONS,
  LINE_COLORS,
  LineBitUtils,
  getStationsByLine,
  getTransferStations,
  getStoryStations,
  searchStations,
  getStationById,
  getDistanceBetweenStations,
  METRO_STATS,
  SVG_CONFIG,
};