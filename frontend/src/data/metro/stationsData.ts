export interface Station {
  id: number;
  name: string;
  x: number;
  y: number;
  lines: number[];
  isTransfer: boolean;
  hasStory: boolean;

  realApiId?: string;   // 서울시 API에서 사용하는 역 ID
  apiLineId?: string;   // 서울시 API에서 사용하는 노선 ID  
}


export const METRO_STATIONS: Station[] = [
  // 1호선
  { id: 1, name: "도봉산", x: 88.365646, y: 5.9796629, lines: [1], isTransfer: false, hasStory: true, 
    realApiId: "1001000117",
    apiLineId: "1001" },
  { id: 2, name: "도봉", x: 88.329361, y: 8.9514217, lines: [1], isTransfer: false, hasStory: false , 
    realApiId: "1001000118",
    apiLineId: "1001" },
  { id: 3, name: "방학", x: 88.340981, y: 12.928492, lines: [1], isTransfer: false, hasStory: false , 
    realApiId: "1001000119",
    apiLineId: "1001" },
  { id: 4, name: "창동", x: 88.340973, y: 16.942114, lines: [1, 4], isTransfer: true, hasStory: false , 
    realApiId: "1001000116",
    apiLineId: "1001" },
  { id: 5, name: "녹천", x: 88.34832, y: 20.803902, lines: [1], isTransfer: false, hasStory: false , 
    realApiId: "1001000115",
    apiLineId: "1001" },
  { id: 6, name: "월계", x: 92.331429, y: 22.157511, lines: [1], isTransfer: false, hasStory: false , 
    realApiId: "1001000114",
    apiLineId: "1001" },
  { id: 7, name: "광운대", x: 94.990112, y: 24.763893, lines: [1], isTransfer: false, hasStory: false , 
    realApiId: "1001000113",
    apiLineId: "1001" },
  { id: 8, name: "석계", x: 96.30468, y: 27.43854, lines: [1], isTransfer: false, hasStory: false , 
    realApiId: "1001000112",
    apiLineId: "1001" },
  { id: 9, name: "신이문", x: 94.964935, y: 34.097141, lines: [1], isTransfer: false, hasStory: false , 
    realApiId: "1001000111",
    apiLineId: "1001" },
  { id: 10, name: "외대앞", x: 93.614639, y: 38.015297, lines: [1], isTransfer: false, hasStory: false , 
    realApiId: "1001000110",
    apiLineId: "1001" },
  { id: 11, name: "회기", x: 92.326546, y: 42.011425, lines: [1], isTransfer: false, hasStory: false , 
    realApiId: "1001000109",
    apiLineId: "1001" },
  { id: 12, name: "청량리", x: 90.99411, y: 44.666786, lines: [1], isTransfer: false, hasStory: false , 
    realApiId: "1001000108",
    apiLineId: "1001" },
  { id: 13, name: "제기동", x: 88.322975, y: 46.015003, lines: [1], isTransfer: false, hasStory: false , 
    realApiId: "1001000125",
    apiLineId: "1001" },
  { id: 14, name: "신설동", x: 84.368164, y: 47.340847, lines: [1], isTransfer: false, hasStory: false , 
    realApiId: "1001000126",
    apiLineId: "1001" },
  { id: 15, name: "동묘앞", x: 76.4422, y: 47.29166, lines: [1], isTransfer: false, hasStory: false , 
    realApiId: "1001000127",
    apiLineId: "1001" },
  { id: 16, name: "종로5가", x: 68.506073, y: 47.290703, lines: [1], isTransfer: false, hasStory: false , 
    realApiId: "1001000129",
    apiLineId: "1001" },
  { id: 17, name: "종로3가", x: 64.737282, y: 47.284924, lines: [1, 3], isTransfer: true, hasStory: false , 
    realApiId: "1001000130",
    apiLineId: "1001" },
  { id: 18, name: "종각", x: 60.577595, y: 47.299969, lines: [1], isTransfer: false, hasStory: true , 
    realApiId: "1001000131",
    apiLineId: "1001" },
  { id: 19, name: "시청", x: 58.663303, y: 52.421543, lines: [1, 2], isTransfer: true, hasStory: false , 
    realApiId: "1001000132",
    apiLineId: "1001" },
  { id: 20, name: "서울역", x: 57.910622, y: 55.252201, lines: [1, 4], isTransfer: true, hasStory: true , 
    realApiId: "1001000133",
    apiLineId: "1001" },
  { id: 21, name: "남영", x: 57.934879, y: 61.818268, lines: [1], isTransfer: false, hasStory: false , 
    realApiId: "1001000134",
    apiLineId: "1001" },
  { id: 22, name: "용산", x: 53.960758, y: 68.490891, lines: [1], isTransfer: false, hasStory: false , 
    realApiId: "1001000135",
    apiLineId: "1001" },
  { id: 23, name: "노량진", x: 48.680222, y: 79.102737, lines: [1], isTransfer: false, hasStory: false , 
    realApiId: "1001000136",
    apiLineId: "1001" },
  { id: 24, name: "대방", x: 42.13369, y: 79.138512, lines: [1], isTransfer: false, hasStory: false , 
    realApiId: "1001000137",
    apiLineId: "1001" },
  { id: 25, name: "신길", x: 36.767445, y: 77.73436, lines: [1], isTransfer: false, hasStory: false , 
    realApiId: "1001000138",
    apiLineId: "1001" },
  { id: 26, name: "영등포", x: 31.478807, y: 80.389877, lines: [1], isTransfer: false, hasStory: false , 
    realApiId: "1001000139",
    apiLineId: "1001" },
  { id: 27, name: "구로", x: 22.168465, y: 88.327377, lines: [1], isTransfer: false, hasStory: false , 
    realApiId: "1001000141",
    apiLineId: "1001" },
  { id: 28, name: "구일", x: 16.948349, y: 89.650299, lines: [1], isTransfer: false, hasStory: false , 
    realApiId: "1001000142",
    apiLineId: "1001" },
  { id: 29, name: "개봉", x: 11.599281, y: 88.29081, lines: [1], isTransfer: false, hasStory: false , 
    realApiId: "1001000143",
    apiLineId: "1001" },
  { id: 30, name: "오류동", x: 6.2718396, y: 88.29081, lines: [1], isTransfer: false, hasStory: false , 
    realApiId: "1001000144",
    apiLineId: "1001" },
  { id: 31, name: "온수", x: 2.3388658, y: 86.9655, lines: [1], isTransfer: false, hasStory: false , 
    realApiId: "1001000145",
    apiLineId: "1001" },
  { id: 32, name: "가산디지털단지", x: 27.495907, y: 97.587799, lines: [1], isTransfer: false, hasStory: false , 
    realApiId: "1001000140",
    apiLineId: "1001" },
  { id: 33, name: "독산", x: 31.478807, y: 106.84821, lines: [1], isTransfer: false, hasStory: false , 
    realApiId: "1001000146",
    apiLineId: "1001" },

  // 2호선
  { id: 34, name: "을지로입구", x: 61.938728, y: 52.627687, lines: [2], isTransfer: false, hasStory: false , 
    realApiId: "1002000202",
    apiLineId: "1002" },
  { id: 35, name: "을지로3가", x: 65.44739, y: 52.348022, lines: [2, 3], isTransfer: true, hasStory: false , 
    realApiId: "1002000203",
    apiLineId: "1002" },
  { id: 36, name: "을지로4가", x: 69.802147, y: 52.578991, lines: [2], isTransfer: false, hasStory: false , 
    realApiId: "1002000204",
    apiLineId: "1002" },
  { id: 37, name: "동대문역사문화공원", x: 72.515649, y: 52.579826, lines: [2, 4], isTransfer: true, hasStory: false , 
    realApiId: "1002000205",
    apiLineId: "1002" },
  { id: 38, name: "신당", x: 75.097097, y: 52.586436, lines: [2], isTransfer: false, hasStory: false , 
    realApiId: "1002000206",
    apiLineId: "1002" },
  { id: 39, name: "상왕십리", x: 80.447678, y: 53.858761, lines: [2], isTransfer: false, hasStory: false , 
    realApiId: "1002000207",
    apiLineId: "1002" },
  { id: 40, name: "왕십리", x: 83.050369, y: 56.536133, lines: [2], isTransfer: false, hasStory: false , 
    realApiId: "1002000208",
    apiLineId: "1002" },
  { id: 41, name: "한양대", x: 85.735191, y: 59.193573, lines: [2], isTransfer: false, hasStory: false , 
    realApiId: "1002000209",
    apiLineId: "1002" },
  { id: 42, name: "뚝섬", x: 89.708092, y: 61.839405, lines: [2], isTransfer: false, hasStory: false , 
    realApiId: "1002000210",
    apiLineId: "1002" },
  { id: 43, name: "성수", x: 93.626251, y: 63.100117, lines: [2], isTransfer: false, hasStory: false , 
    realApiId: "1002000211",
    apiLineId: "1002" },
  { id: 44, name: "건대입구", x: 100.27047, y: 63.227737, lines: [2], isTransfer: false, hasStory: false , 
    realApiId: "1002000212",
    apiLineId: "1002" },
  { id: 45, name: "구의", x: 104.23922, y: 64.514885, lines: [2], isTransfer: false, hasStory: false , 
    realApiId: "1002000213",
    apiLineId: "1002" },
  { id: 46, name: "강변", x: 106.88505, y: 65.787865, lines: [2], isTransfer: false, hasStory: false , 
    realApiId: "1002000214",
    apiLineId: "1002" },
  { id: 47, name: "잠실나루", x: 110.88641, y: 73.112129, lines: [2], isTransfer: false, hasStory: false , 
    realApiId: "1002000215",
    apiLineId: "1002" },
  { id: 48, name: "잠실", x: 110.83567, y: 75.735542, lines: [2], isTransfer: false, hasStory: false , 
    realApiId: "1002000216",
    apiLineId: "1002" },
  { id: 49, name: "잠실새내", x: 108.13324, y: 76.382164, lines: [2], isTransfer: false, hasStory: false , 
    realApiId: "1002000217",
    apiLineId: "1002" },
  { id: 50, name: "종합운동장", x: 104.30759, y: 77.705086, lines: [2], isTransfer: false, hasStory: false , 
    realApiId: "1002000218",
    apiLineId: "1002" },
  { id: 51, name: "삼성", x: 100.23605, y: 80.395645, lines: [2], isTransfer: false, hasStory: false , 
    realApiId: "1002000219",
    apiLineId: "1002" },
  { id: 52, name: "선릉", x: 97.649895, y: 83.033325, lines: [2], isTransfer: false, hasStory: false , 
    realApiId: "1002000220",
    apiLineId: "1002" },
  { id: 53, name: "역삼", x: 94.978012, y: 87.021553, lines: [2], isTransfer: false, hasStory: false , 
    realApiId: "1002000221",
    apiLineId: "1002" },
  { id: 54, name: "강남", x: 92.324127, y: 89.613205, lines: [2], isTransfer: false, hasStory: true , 
    realApiId: "1002000222",
    apiLineId: "1002" },
  { id: 55, name: "교대", x: 85.738136, y: 90.986717, lines: [2, 3], isTransfer: true, hasStory: false , 
    realApiId: "1002000223",
    apiLineId: "1002" },
  { id: 56, name: "서초", x: 77.764938, y: 92.317078, lines: [2], isTransfer: false, hasStory: false , 
    realApiId: "1002000224",
    apiLineId: "1002" },
  { id: 57, name: "방배", x: 69.91494, y: 93.69059, lines: [2], isTransfer: false, hasStory: false , 
    realApiId: "1002000225",
    apiLineId: "1002" },
  { id: 58, name: "사당", x: 62.206607, y: 94.748932, lines: [2, 4], isTransfer: true, hasStory: false , 
    realApiId: "1002000226",
    apiLineId: "1002" },
  { id: 59, name: "낙성대", x: 57.925346, y: 97.28167, lines: [2], isTransfer: false, hasStory: false , 
    realApiId: "1002000227",
    apiLineId: "1002" },
  { id: 60, name: "서울대입구", x: 52.647369, y: 98.894463, lines: [2], isTransfer: false, hasStory: false , 
    realApiId: "1002000228",
    apiLineId: "1002" },
  { id: 61, name: "봉천", x: 47.349464, y: 96.596855, lines: [2], isTransfer: false, hasStory: false , 
    realApiId: "1002000229",
    apiLineId: "1002" },
  { id: 62, name: "신림", x: 42.053638, y: 94.324539, lines: [2], isTransfer: false, hasStory: false , 
    realApiId: "1002000230",
    apiLineId: "1002" },
  { id: 63, name: "신대방", x: 38.013161, y: 92.266479, lines: [2], isTransfer: false, hasStory: false , 
    realApiId: "1002000231",
    apiLineId: "1002" },
  { id: 64, name: "구로디지털단지", x: 30.172991, y: 91.970176, lines: [2], isTransfer: false, hasStory: false , 
    realApiId: "1002000232",
    apiLineId: "1002" },
  { id: 65, name: "대림", x: 28.142321, y: 88.434823, lines: [2], isTransfer: false, hasStory: false , 
    realApiId: "1002000233",
    apiLineId: "1002" },
  { id: 66, name: "신도림", x: 26.306967, y: 85.994164, lines: [1, 2], isTransfer: true, hasStory: false , 
    realApiId: "1002000234",
    apiLineId: "1002" },
  { id: 67, name: "문래", x: 28.803335, y: 77.776611, lines: [2], isTransfer: false, hasStory: false , 
    realApiId: "1002000235",
    apiLineId: "1002" },
  { id: 68, name: "영등포구청", x: 31.449169, y: 73.846848, lines: [2], isTransfer: false, hasStory: false , 
    realApiId: "1002000236",
    apiLineId: "1002" },
  { id: 69, name: "당산", x: 32.760475, y: 69.776909, lines: [2], isTransfer: false, hasStory: false , 
    realApiId: "1002000237",
    apiLineId: "1002" },
  { id: 70, name: "합정", x: 38.102737, y: 59.244167, lines: [2], isTransfer: false, hasStory: false , 
    realApiId: "1002000238",
    apiLineId: "1002" },
  { id: 71, name: "홍대입구", x: 40.767628, y: 52.528397, lines: [2], isTransfer: false, hasStory: true , 
    realApiId: "1002000239",
    apiLineId: "1002" },
  { id: 72, name: "신촌", x: 44.791126, y: 49.933159, lines: [2], isTransfer: false, hasStory: true , 
    realApiId: "1002000240",
    apiLineId: "1002" },
  { id: 73, name: "이대", x: 47.331619, y: 55.984032, lines: [2], isTransfer: false, hasStory: false , 
    realApiId: "1002000241",
    apiLineId: "1002" },
  { id: 74, name: "아현", x: 50.002747, y: 57.30592, lines: [2], isTransfer: false, hasStory: false , 
    realApiId: "1002000242",
    apiLineId: "1002" },
  { id: 75, name: "용답", x: 95.050354, y: 59.294762, lines: [2], isTransfer: false, hasStory: false , 
    realApiId: "1002000243",
    apiLineId: "1002" },  
  { id: 76, name: "신답", x: 93.676842, y: 55.224823, lines: [2], isTransfer: false, hasStory: false , 
    realApiId: "1002000244",
    apiLineId: "1002" }, 
  { id: 77, name: "충정로", x: 93.676842, y: 55.224823, lines: [2], isTransfer: false, hasStory: false , 
    realApiId: "1002000201",
    apiLineId: "1002" },
  { id: 78, name: "용두", x: 88.676842, y: 49.224823, lines: [2], isTransfer: false, hasStory: false , 
    realApiId: "1002000245",
    apiLineId: "1002" },  
  { id: 79, name: "도림천", x: 23.676842, y: 80.224823, lines: [2], isTransfer: false, hasStory: false , 
    realApiId: "1002000246",
    apiLineId: "1002" },  
  { id: 80, name: "양천구청", x: 18.676842, y: 74.224823, lines: [2], isTransfer: false, hasStory: false , 
    realApiId: "1002000247",
    apiLineId: "1002" },  
  { id: 81, name: "신정네거리", x: 14.676842, y: 70.224823, lines: [2], isTransfer: false, hasStory: false , 
    realApiId: "1002000248",
    apiLineId: "1002" },  
  { id: 82, name: "까치산", x: 10.676842, y: 60.224823, lines: [2], isTransfer: false, hasStory: false , 
    realApiId: "1002000249",
    apiLineId: "1002" },

  // 3호선
  { id: 83, name: "구파발", x: 41.900909, y: 19.251545, lines: [3], isTransfer: false, hasStory: false , 
    realApiId: "1003000301",
    apiLineId: "1003" },
  { id: 84, name: "연신내", x: 42.022388, y: 22.114763, lines: [3], isTransfer: false, hasStory: false , 
    realApiId: "1003000302",
    apiLineId: "1003" },
  { id: 85, name: "불광", x: 42.022388, y: 26.118494, lines: [3], isTransfer: false, hasStory: false , 
    realApiId: "1003000303",
    apiLineId: "1003" },
  { id: 86, name: "녹번", x: 42.022388, y: 31.360231, lines: [3], isTransfer: false, hasStory: false , 
    realApiId: "1003000304",
    apiLineId: "1003" },
  { id: 87, name: "홍제", x: 44.545155, y: 38.097885, lines: [3], isTransfer: false, hasStory: false , 
    realApiId: "1003000305",
    apiLineId: "1003" },
  { id: 88, name: "무악재", x: 48.706936, y: 40.622238, lines: [3], isTransfer: false, hasStory: false , 
    realApiId: "1003000306",
    apiLineId: "1003" },
  { id: 89, name: "독립문", x: 52.60413, y: 43.28302, lines: [3], isTransfer: false, hasStory: false , 
    realApiId: "1003000307",
    apiLineId: "1003" },
  { id: 90, name: "경복궁", x: 58.008694, y: 43.419762, lines: [3], isTransfer: false, hasStory: false , 
    realApiId: "1003000308",
    apiLineId: "1003" },
  { id: 91, name: "안국", x: 63.193825, y: 43.348209, lines: [3], isTransfer: false, hasStory: false , 
    realApiId: "1003000309",
    apiLineId: "1003" },
  { id: 92, name: "충무로", x: 67.161774, y: 55.271553, lines: [3, 4], isTransfer: true, hasStory: false , 
    realApiId: "1003000328",
    apiLineId: "1003" },
  { id: 93, name: "동대입구", x: 69.8255, y: 56.630249, lines: [3], isTransfer: false, hasStory: false , 
    realApiId: "1003000327",
    apiLineId: "1003" },
  { id: 94, name: "약수", x: 72.489227, y: 57.863724, lines: [3], isTransfer: false, hasStory: false , 
    realApiId: "1003000326",
    apiLineId: "1003" },
  { id: 95, name: "금고", x: 76.475861, y: 59.173283, lines: [3], isTransfer: false, hasStory: false , 
    realApiId: "1003000325",
    apiLineId: "1003" },
  { id: 96, name: "옥수", x: 79.085915, y: 63.142033, lines: [3], isTransfer: false, hasStory: false , 
    realApiId: "1003000324",
    apiLineId: "1003" },
  { id: 97, name: "압구정", x: 83.055458, y: 75.097412, lines: [3], isTransfer: false, hasStory: false , 
    realApiId: "1003000323",
    apiLineId: "1003" },
  { id: 98, name: "신사", x: 83.090439, y: 79.049072, lines: [3], isTransfer: false, hasStory: false , 
    realApiId: "1003000322",
    apiLineId: "1003" },
  { id: 99, name: "잠원", x: 79.444611, y: 81.730682, lines: [3], isTransfer: false, hasStory: false , 
    realApiId: "1003000321",
    apiLineId: "1003" },
  { id: 100, name: "고속터미널", x: 81.73494, y: 86.986572, lines: [3], isTransfer: false, hasStory: false , 
    realApiId: "1003000320",
    apiLineId: "1003" },
  { id: 101, name: "남부터미널", x: 88.66925, y: 96.246986, lines: [3], isTransfer: false, hasStory: false , 
    realApiId: "1003000343",
    apiLineId: "1003" },
  { id: 102, name: "양재", x: 92.626251, y: 96.285828, lines: [3], isTransfer: false, hasStory: false , 
    realApiId: "1003000344",
    apiLineId: "1003" },
  { id: 103, name: "매봉", x: 97.660507, y: 94.919769, lines: [3], isTransfer: false, hasStory: false , 
    realApiId: "1003000345",
    apiLineId: "1003" },
  { id: 104, name: "도곡", x: 100.28849, y: 93.495667, lines: [3], isTransfer: false, hasStory: false , 
    realApiId: "1003000346",
    apiLineId: "1003" },
  { id: 105, name: "대치", x: 102.88371, y: 92.223343, lines: [3], isTransfer: false, hasStory: false , 
    realApiId: "1003000347",
    apiLineId: "1003" },
  { id: 106, name: "학여울", x: 105.51794, y: 89.68615, lines: [3], isTransfer: false, hasStory: false , 
    realApiId: "1003000348",
    apiLineId: "1003" },
  { id: 107, name: "대청", x: 108.20069, y: 90.965919, lines: [3], isTransfer: false, hasStory: false , 
    realApiId: "1003000349",
    apiLineId: "1003" },
  { id: 108, name: "일원", x: 109.53106, y: 93.611755, lines: [3], isTransfer: false, hasStory: false , 
    realApiId: "1003000350",
    apiLineId: "1003" },
  { id: 109, name: "수서", x: 112.16077, y: 93.639992, lines: [3], isTransfer: false, hasStory: false , 
    realApiId: "1003000351",
    apiLineId: "1003" },
  { id: 110, name: "가락시장", x: 116.12745, y: 92.291786, lines: [3], isTransfer: false, hasStory: false , 
    realApiId: "1003000350",
    apiLineId: "1003" },
  { id: 111, name: "경찰병원", x: 118.81226, y: 89.64595, lines: [3], isTransfer: false, hasStory: false , 
    realApiId: "1003000351",
    apiLineId: "1003" },
  { id: 112, name: "오금", x: 121.4212, y: 87.025414, lines: [3], isTransfer: false, hasStory: false , 
    realApiId: "1003000352",
    apiLineId: "1003" },

  // 4호선
  { id: 113, name: "당고개", x: 104.19088, y: 12.849576, lines: [4], isTransfer: false, hasStory: false , 
    realApiId: "1004000401",
    apiLineId: "1004" },
  { id: 114, name: "상계", x: 98.926727, y: 15.566961, lines: [4], isTransfer: false, hasStory: false , 
    realApiId: "1004000402",
    apiLineId: "1004" },
  { id: 115, name: "노원", x: 93.641739, y: 16.818325, lines: [4], isTransfer: false, hasStory: false , 
    realApiId: "1004000411",
    apiLineId: "1004" },
  { id: 116, name: "쌍문", x: 84.431252, y: 16.889877, lines: [4], isTransfer: false, hasStory: false , 
    realApiId: "1004000413",
    apiLineId: "1004" },
  { id: 117, name: "수유", x: 80.341019, y: 22.181543, lines: [4], isTransfer: false, hasStory: false , 
    realApiId: "1004000414",
    apiLineId: "1004" },
  { id: 118, name: "미아", x: 80.462502, y: 26.114517, lines: [4], isTransfer: false, hasStory: false , 
    realApiId: "1004000415",
    apiLineId: "1004" },
  { id: 119, name: "미아사거리", x: 80.712936, y: 29.06739, lines: [4], isTransfer: false, hasStory: false , 
    realApiId: "1004000416",
    apiLineId: "1004" },
  { id: 120, name: "길음", x: 80.426727, y: 35.446491, lines: [4], isTransfer: false, hasStory: false , 
    realApiId: "1004000417",
    apiLineId: "1004" },
  { id: 121, name: "성신여대입구", x: 77.730957, y: 39.401085, lines: [4], isTransfer: false, hasStory: false , 
    realApiId: "1004000418",
    apiLineId: "1004" },
  { id: 122, name: "한성대입구", x: 73.79052, y: 40.702374, lines: [4], isTransfer: false, hasStory: false , 
    realApiId: "1004000419",
    apiLineId: "1004" },
  { id: 123, name: "혜화", x: 71.130524, y: 44.671127, lines: [4], isTransfer: false, hasStory: false , 
    realApiId: "1004000420",
    apiLineId: "1004" },
  { id: 124, name: "동대문", x: 72.499062, y: 47.282688, lines: [1, 4], isTransfer: true, hasStory: false , 
    realApiId: "1004000421",
    apiLineId: "1004" },
  { id: 125, name: "명동", x: 64.501793, y: 55.254459, lines: [4], isTransfer: false, hasStory: true , 
    realApiId: "1004000424",
    apiLineId: "1004" },
  { id: 126, name: "회현", x: 60.58297, y: 55.218685, lines: [4], isTransfer: false, hasStory: false , 
    realApiId: "1004000425",
    apiLineId: "1004" },
  { id: 127, name: "숙대입구", x: 59.23843, y: 60.488728, lines: [4], isTransfer: false, hasStory: false , 
    realApiId: "1004000427",
    apiLineId: "1004" },
  { id: 128, name: "삼각지", x: 57.972916, y: 65.873573, lines: [4], isTransfer: false, hasStory: false , 
    realApiId: "1004000428",
    apiLineId: "1004" },
  { id: 129, name: "신용산", x: 55.255531, y: 69.72084, lines: [4], isTransfer: false, hasStory: false , 
    realApiId: "1004000429",
    apiLineId: "1004" },
  { id: 130, name: "이촌", x: 61.855167, y: 73.710419, lines: [4], isTransfer: false, hasStory: false , 
    realApiId: "1004000430",
    apiLineId: "1004" },
  { id: 131, name: "동작", x: 61.870113, y: 82.999931, lines: [4], isTransfer: false, hasStory: false , 
    realApiId: "1004000431",
    apiLineId: "1004" },
  { id: 132, name: "이수", x: 61.834335, y: 89.650299, lines: [4], isTransfer: false, hasStory: false , 
    realApiId: "1004000432",
    apiLineId: "1004" },
  { id: 133, name: "남태령", x: 69.793465, y: 100.23363, lines: [4], isTransfer: false, hasStory: false , 
    realApiId: "1004000433",
    apiLineId: "1004" },
];

export interface RealtimeStationData {
  frontendStationId: number;
  stationName: string;
  lineNumber: number;
  direction: 'up' | 'down' | 'unknown';
  trainCount: number;
  lastUpdated: Date;
}

export const LineBitUtils = {
  linesToBits: (lines: number[]): number => {
    return lines.reduce((bits, line) => bits | (1 << (line - 1)), 0);
  },

  bitsToLines: (bits: number): number[] => {
    const lines: number[] = [];
    for (let i = 0; i < 32; i++) {
      if (bits & (1 << i)) {
        lines.push(i + 1);
      }
    }
    return lines;
  },

  hasLine: (bits: number, line: number): boolean => {
    return (bits & (1 << (line - 1))) !== 0;
  },

  matchesFilter: (stationBits: number, filterLines: number[]): boolean => {
    if (filterLines.length === 0) return true;
    
    const filterBits = LineBitUtils.linesToBits(filterLines);
    return (stationBits & filterBits) !== 0;
  }
};

// ================================================================
// 데이터 조회 함수들
// ================================================================

// 특정 노선의 모든 역 반환
export const getStationsByLine = (lineNumber: number): Station[] => {
  return METRO_STATIONS.filter(station => 
    station.lines.includes(lineNumber)
  );
};

// 역명으로 검색
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

export const getStationById = (id: number): Station | undefined => {
  return METRO_STATIONS.find(station => station.id === id);
};


// SVG 설정
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

const stationsData = {
  METRO_STATIONS,
  LineBitUtils,
  getStationsByLine,
  searchStations,
  getStationById,
  SVG_CONFIG,
};

export default stationsData;