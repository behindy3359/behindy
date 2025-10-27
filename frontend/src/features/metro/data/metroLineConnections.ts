import { getLineColor } from '@/shared/utils/common/constants';
import { METRO_STATIONS } from './stationsData';

export interface LineSegment {
  lineNumber: number;
  fromStationName: string;
  toStationName: string;
  path: string;
  color: string;
}

export interface LineConnection {
  lineNumber: number;
  segments: LineSegment[];
  fullPath: string;
  color: string;
}

// 두 점 사이의 SVG 직선 경로
const createStraightPath = (x1: number, y1: number, x2: number, y2: number): string => {
  return `M ${x1} ${y1} L ${x2} ${y2}`;
};


// 노선별 역 연결 순서 정의
const LINE_STATION_ORDERS = {
  1: [
    "도봉산", "도봉", "방학", "창동", "녹천", "월계", "광운대", "석계", "신이문", "외대앞", "회기", "청량리", "제기동", "신설동", "동묘앞", "동대문", "종로5가", "종로3가", "종각", "시청", "서울역", "남영", "용산", "노량진", "대방", "신길", "영등포", "신도림", "구로", "구일", "개봉", "오류동", "온수"
  ],
  2: [
    "시청", "을지로입구", "을지로3가", "을지로4가", "동대문역사문화공원", "신당", "상왕십리", "왕십리", "한양대", "뚝섬", "성수", "건대입구", "구의", "강변", "잠실나루", "잠실", "잠실새내", "종합운동장", "삼성", "선릉", "역삼", "강남", "교대", "서초", "방배", "사당", "낙성대", "서울대입구", "봉천", "신림", "신대방", "구로디지털단지", "대림", "신도림", "문래", "영등포구청", "당산", "합정", "홍대입구", "신촌", "이대", "아현", "충정로"
  ],
  3: [
    "구파발", "연신내", "불광", "녹번", "홍제", "무악재", "독립문", "경복궁", "안국", "종로3가", "을지로3가", "충무로", "동대입구", "약수", "금호", "옥수", "압구정","신사", "잠원", "고속터미널", "교대", "남부터미널", "양재", "매봉", "도곡", "대치", "학여울", "대청", "일원", "수서", "가락시장", "경찰병원", "오금"
  ],
  4: [
    "불암산", "상계", "노원", "창동", "쌍문", "수유", "미아", "미아사거리", "길음", "성신여대입구", "한성대입구", "혜화", "동대문", "동대문역사문화공원", "충무로", "명동", "회현", "서울역", "숙대입구","삼각지", "신용산", "이촌", "동작", "이수", "사당", "남태령"
  ]
};

const SPECIAL_CONNECTIONS = {
  1:[
    {from: "구로", to: "가산디지털단지", type: 'branch' },
    {from: "가산디지털단지", to: "독산", type: 'branch' }
  ],
  2: [
    { from: "성수", to: "용답", type: 'branch' }, 
    { from: "용답", to: "신답", type: 'branch' }, 
    { from: "신답", to: "용두", type: 'branch' }, 
    { from: "용두", to: "신설동", type: 'branch' },
    { from: "신도림", to: "도림천", type: 'branch' },
    { from: "도림천", to: "양천구청", type: 'branch' },
    { from: "양천구청", to: "신정네거리", type: 'branch' },
    { from: "신정네거리", to: "까치산", type: 'branch' },
    { from: "시청", to: "충정로", type: 'branch' },
  ]
};

// 역명으로 Station 객체 찾기
const getStationByName = (stationName: string) => {
  return METRO_STATIONS.find(s => s.id === stationName);
};

// 노선별 연결 경로 생성
export const generateLineConnections = (): LineConnection[] => {
  const connections: LineConnection[] = [];

  Object.entries(LINE_STATION_ORDERS).forEach(([lineNumStr, stationNames]) => {
    const lineNumber = parseInt(lineNumStr);
    const color = getLineColor(lineNumber);
    const segments: LineSegment[] = [];
    const pathParts: string[] = [];

    // 기본 순차 연결
    for (let i = 0; i < stationNames.length - 1; i++) {
      const fromStationName = stationNames[i];
      const toStationName = stationNames[i + 1];
      
      const fromStation = getStationByName(fromStationName);
      const toStation = getStationByName(toStationName);

      if (fromStation && toStation) {
        const path = createStraightPath(fromStation.x, fromStation.y, toStation.x, toStation.y);

        segments.push({
          lineNumber,
          fromStationName,
          toStationName,
          path,
          color
        });

        pathParts.push(path);
      }
    }

    // 분기선 등
    const specialConnections = SPECIAL_CONNECTIONS[lineNumber as keyof typeof SPECIAL_CONNECTIONS];
    if (specialConnections) {
      specialConnections.forEach(conn => {
        const fromStation = getStationByName(conn.from);
        const toStation = getStationByName(conn.to);

        if (fromStation && toStation) {
          const path = createStraightPath(fromStation.x, fromStation.y, toStation.x, toStation.y);

          segments.push({
            lineNumber,
            fromStationName: conn.from,
            toStationName: conn.to,
            path,
            color
          });

          pathParts.push(path);
        }
      });
    }

    connections.push({
      lineNumber,
      segments,
      fullPath: pathParts.join(' '),
      color
    });
  });

  return connections;
};

// 보이는 노선들의 연결만 가져오기
export const getVisibleLineConnections = (visibleLines: number[]): LineConnection[] => {
  const allConnections = generateLineConnections();
  return allConnections.filter(conn => visibleLines.includes(conn.lineNumber));
};

const metroLineConnections = {
  generateLineConnections,
  getVisibleLineConnections
};

export default metroLineConnections;