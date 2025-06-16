import React, { useState, useCallback, useMemo } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { Info, Navigation, Eye, EyeOff } from 'lucide-react';
import { StationInfo, type Station } from '../stationinfo/StationInfo';

// 지하철 노선 정보
const SUBWAY_LINES = {
  1: { color: '#0052A4', name: '1호선' },
  2: { color: '#00A84D', name: '2호선' },
  3: { color: '#EF7C1C', name: '3호선' },
  4: { color: '#00A5DE', name: '4호선' }
};

// 지하철역 데이터
const STATIONS_DATA = {
  // 1호선 (세로 주축)
  1: [
    { id: 'dobongsan', name: '도봉산', x: 300, y: 50, hasStory: true },
    { id: 'dobong', name: '도봉', x: 300, y: 80, hasStory: false },
    { id: 'changdong', name: '창동', x: 300, y: 110, hasStory: true },
    { id: 'nockcheon', name: '녹천', x: 300, y: 140, hasStory: false },
    { id: 'wolkye', name: '월계', x: 300, y: 170, hasStory: true },
    { id: 'kwangwoon', name: '광운대', x: 300, y: 200, hasStory: false },
    { id: 'seokkye', name: '석계', x: 300, y: 230, hasStory: true },
    { id: 'gireum', name: '길음', x: 300, y: 260, hasStory: false },
    { id: 'seongshin', name: '성신여대', x: 300, y: 290, hasStory: true },
    { id: 'hansung', name: '한성대', x: 300, y: 320, hasStory: false },
    { id: 'hyehwa', name: '혜화', x: 300, y: 350, hasStory: true },
    { id: 'dongdaemun', name: '동대문', x: 300, y: 380, hasStory: false },
    { id: 'jongro5ga', name: '종로5가', x: 300, y: 410, hasStory: true },
    { id: 'jongro3ga', name: '종로3가', x: 300, y: 440, hasStory: true },
    { id: 'jonggak', name: '종각', x: 300, y: 470, hasStory: true },
    { id: 'cityhall', name: '시청', x: 300, y: 500, hasStory: false },
    { id: 'seoul', name: '서울역', x: 300, y: 530, hasStory: true },
    { id: 'namyeong', name: '남영', x: 300, y: 560, hasStory: false },
    { id: 'yongsan', name: '용산', x: 300, y: 590, hasStory: true },
    { id: 'noryangjin', name: '노량진', x: 300, y: 620, hasStory: false },
    { id: 'daebang', name: '대방', x: 300, y: 650, hasStory: true },
    { id: 'singil', name: '신길', x: 300, y: 680, hasStory: false },
    { id: 'yeongdeungpo', name: '영등포', x: 300, y: 710, hasStory: true }
  ],

  // 2호선 (원형)
  2: [
    { id: 'hongik', name: '홍대입구', x: 150, y: 440, hasStory: true },
    { id: 'hapjeong', name: '합정', x: 120, y: 460, hasStory: false },
    { id: 'dangsan', name: '당산', x: 100, y: 500, hasStory: true },
    { id: 'yeongdeungpo-gu', name: '영등포구청', x: 120, y: 540, hasStory: false },
    { id: 'sindorim', name: '신도림', x: 150, y: 580, hasStory: true },
    { id: 'guro-digital', name: '구로디지털단지', x: 180, y: 620, hasStory: false },
    { id: 'sindaebang', name: '신대방', x: 220, y: 650, hasStory: true },
    { id: 'boramae', name: '보라매', x: 260, y: 670, hasStory: false },
    { id: 'sadang', name: '사당', x: 300, y: 680, hasStory: true },
    { id: 'bangbae', name: '방배', x: 340, y: 670, hasStory: false },
    { id: 'seocho', name: '서초', x: 380, y: 650, hasStory: true },
    { id: 'kyodae', name: '교대', x: 420, y: 620, hasStory: false },
    { id: 'gangnam', name: '강남', x: 460, y: 580, hasStory: true },
    { id: 'yeoksam', name: '역삼', x: 480, y: 540, hasStory: false },
    { id: 'seonleung', name: '선릉', x: 500, y: 500, hasStory: true },
    { id: 'samsung', name: '삼성', x: 520, y: 460, hasStory: false },
    { id: 'jamsil', name: '잠실', x: 540, y: 420, hasStory: true },
    { id: 'sports-complex', name: '종합운동장', x: 520, y: 380, hasStory: false },
    { id: 'seokchon', name: '석촌', x: 500, y: 340, hasStory: true },
    { id: 'songpa', name: '송파', x: 480, y: 300, hasStory: false },
    { id: 'gangbyeon', name: '강변', x: 460, y: 260, hasStory: true },
    { id: 'konkuk', name: '건대입구', x: 440, y: 220, hasStory: false },
    { id: 'seongsu', name: '성수', x: 420, y: 180, hasStory: true },
    { id: 'handok', name: '한양대', x: 400, y: 140, hasStory: false },
    { id: 'ttukseom', name: '뚝섬', x: 380, y: 100, hasStory: true },
    { id: 'seongsu-branch', name: '용답', x: 360, y: 120, hasStory: false },
    { id: 'wangsimni', name: '왕십리', x: 340, y: 160, hasStory: true },
    { id: 'sangwangsimni', name: '상왕십리', x: 320, y: 200, hasStory: false },
    { id: 'sindang', name: '신당', x: 300, y: 240, hasStory: true },
    { id: 'dongdaemun-hist', name: '동대문역사문화공원', x: 280, y: 280, hasStory: false },
    { id: 'euljiro4ga', name: '을지로4가', x: 260, y: 320, hasStory: true },
    { id: 'euljiro3ga', name: '을지로3가', x: 240, y: 360, hasStory: false },
    { id: 'euljiro-ipgu', name: '을지로입구', x: 220, y: 400, hasStory: true },
    { id: 'myeongdong', name: '명동', x: 200, y: 420, hasStory: false }
  ],

  // 3호선 (대각선)
  3: [
    { id: 'gupabal', name: '구파발', x: 100, y: 100, hasStory: true },
    { id: 'yeonsinne', name: '연신내', x: 120, y: 130, hasStory: false },
    { id: 'bulgwang', name: '불광', x: 140, y: 160, hasStory: true },
    { id: 'nokbeon', name: '녹번', x: 160, y: 190, hasStory: false },
    { id: 'hongje', name: '홍제', x: 180, y: 220, hasStory: true },
    { id: 'muakjae', name: '무악재', x: 200, y: 250, hasStory: false },
    { id: 'dongnimmun', name: '독립문', x: 220, y: 280, hasStory: true },
    { id: 'gyeongbokgung', name: '경복궁', x: 240, y: 310, hasStory: false },
    { id: 'anguk', name: '안국', x: 260, y: 340, hasStory: true },
    { id: 'chungmuro', name: '충무로', x: 280, y: 370, hasStory: false },
    { id: 'dongdaeipmgu', name: '동대입구', x: 300, y: 400, hasStory: true },
    { id: 'yaksu', name: '약수', x: 320, y: 430, hasStory: false },
    { id: 'geumho', name: '금고', x: 340, y: 460, hasStory: true },
    { id: 'oksu', name: '옥수', x: 360, y: 490, hasStory: false },
    { id: 'apgujeong', name: '압구정', x: 380, y: 520, hasStory: true },
    { id: 'sinsa', name: '신사', x: 400, y: 550, hasStory: false },
    { id: 'jamwon', name: '잠원', x: 420, y: 580, hasStory: true },
    { id: 'express-terminal', name: '고속터미널', x: 440, y: 610, hasStory: false },
    { id: 'nambu-terminal', name: '남부터미널', x: 460, y: 640, hasStory: true },
    { id: 'yangjae', name: '양재', x: 480, y: 670, hasStory: false },
    { id: 'maebong', name: '매봉', x: 500, y: 700, hasStory: true }
  ],

  // 4호선 (세로)
  4: [
    { id: 'dangogae', name: '당고개', x: 400, y: 50, hasStory: true },
    { id: 'sanggyei', name: '상계', x: 400, y: 80, hasStory: false },
    { id: 'nowon', name: '노원', x: 400, y: 110, hasStory: true },
    { id: 'changdong-4', name: '창동', x: 400, y: 140, hasStory: false },
    { id: 'ssangmun', name: '쌍문', x: 400, y: 170, hasStory: true },
    { id: 'suyu', name: '수유', x: 400, y: 200, hasStory: false },
    { id: 'mia', name: '미아', x: 400, y: 230, hasStory: true },
    { id: 'miasageori', name: '미아사거리', x: 400, y: 260, hasStory: false },
    { id: 'gireum-4', name: '길음', x: 400, y: 290, hasStory: true },
    { id: 'seongshin-4', name: '성신여대입구', x: 400, y: 320, hasStory: false },
    { id: 'hansung-4', name: '한성대입구', x: 400, y: 350, hasStory: true },
    { id: 'hyehwa-4', name: '혜화', x: 400, y: 380, hasStory: false },
    { id: 'dongdaemun-4', name: '동대문', x: 400, y: 410, hasStory: true },
    { id: 'dongdaemun-hist-4', name: '동대문역사문화공원', x: 400, y: 440, hasStory: false },
    { id: 'chungmuro-4', name: '충무로', x: 400, y: 470, hasStory: true },
    { id: 'myeongdong-4', name: '명동', x: 400, y: 500, hasStory: false },
    { id: 'hoehyeon', name: '회현', x: 400, y: 530, hasStory: true },
    { id: 'seoul-4', name: '서울역', x: 400, y: 560, hasStory: false },
    { id: 'samsangji', name: '삼각지', x: 400, y: 590, hasStory: true },
    { id: 'ichon', name: '이촌', x: 400, y: 620, hasStory: false },
    { id: 'dongjak', name: '동작', x: 400, y: 650, hasStory: true },
    { id: 'chongshin', name: '총신대입구', x: 400, y: 680, hasStory: false },
    { id: 'sadang-4', name: '사당', x: 400, y: 710, hasStory: true }
  ]
};

// 연결점 생성 함수
const generateConnections = (stations: Station[]) => {
  const connections = [];
  for (let i = 0; i < stations.length - 1; i++) {
    connections.push({
      from: stations[i],
      to: stations[i + 1]
    });
  }
  return connections;
};

// 2호선 원형 연결 처리
const generate2LineConnections = (stations: Station[]) => {
  const connections = generateConnections(stations);
  // 마지막과 첫번째 연결 (원형)
  connections.push({
    from: stations[stations.length - 1],
    to: stations[0]
  });
  return connections;
};

// Props 인터페이스
export interface SubwayMapProps {
  onStationSelect?: (station: Station) => void;
  onGameStart?: (stationId: string) => void;
  onStationDetail?: (stationId: string) => void;
  initialSelectedLines?: number[];
  showLabels?: boolean;
  className?: string;
}

// 스타일드 컴포넌트들
const MapContainer = styled.div`
  position: relative;
  background: white;
  border-radius: 16px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  min-height: 800px;
`;

const MapHeader = styled.div`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 20px;
  
  h2 {
    font-size: 24px;
    font-weight: 700;
    margin: 0 0 8px 0;
  }
  
  p {
    margin: 0;
    opacity: 0.9;
    font-size: 14px;
  }
`;

const ControlsContainer = styled.div`
  position: absolute;
  top: 96px;
  right: 20px;
  z-index: 20;
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const ControlButton = styled(motion.button)<{ $active?: boolean }>`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: none;
  background: ${({ $active }) => $active ? '#667eea' : 'white'};
  color: ${({ $active }) => $active ? 'white' : '#667eea'};
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  
  &:hover {
    background: #667eea;
    color: white;
    transform: scale(1.1);
  }
`;

const LineToggleContainer = styled.div`
  position: absolute;
  top: 96px;
  left: 20px;
  z-index: 20;
  background: white;
  border-radius: 8px;
  padding: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
`;

const ToggleTitle = styled.div`
  font-size: 12px;
  font-weight: 600;
  margin-bottom: 8px;
  color: #374151;
`;

const LineToggle = styled.label`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 4px;
  cursor: pointer;
  padding: 4px;
  border-radius: 4px;
  transition: background 0.2s ease;
  
  &:hover {
    background: #f9fafb;
  }
  
  &:last-child {
    margin-bottom: 0;
  }
`;

const LineColorDot = styled.div<{ $color: string }>`
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: ${({ $color }) => $color};
  border: 1px solid #e5e7eb;
`;

const LineToggleText = styled.span`
  font-size: 12px;
  color: #374151;
`;

const LegendContainer = styled.div`
  position: absolute;
  top: 320px;
  left: 20px;
  background: white;
  border-radius: 8px;
  padding: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  font-size: 12px;
`;

const LegendItem = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 6px;
  
  &:last-child {
    margin-bottom: 0;
  }
`;

const LegendDot = styled.div<{ $color: string; $border?: string }>`
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: ${({ $color }) => $color};
  border: 2px solid ${({ $border }) => $border || '#667eea'};
`;

const SVGContainer = styled.div`
  width: 100%;
  height: 750px;
  overflow: auto;
  
  svg {
    width: 100%;
    height: 100%;
    min-width: 640px;
    min-height: 760px;
    cursor: grab;
    
    &:active {
      cursor: grabbing;
    }
  }
`;

const StationCircle = styled(motion.circle)<{
  $lineColor: string;
  $hasStory: boolean;
  $isActive: boolean;
}>`
  fill: ${({ $isActive, $hasStory }) => 
    $isActive ? '#FF6B6B' : 
    $hasStory ? '#FFD93D' : '#E5E7EB'
  };
  stroke: ${({ $lineColor }) => $lineColor};
  stroke-width: 3;
  cursor: pointer;
  transition: all 0.2s ease;
  filter: ${({ $isActive }) => 
    $isActive ? 'drop-shadow(0 0 12px rgba(255, 107, 107, 0.8))' : 'none'
  };
`;

const StationLabel = styled(motion.text)<{ $isVisible: boolean }>`
  font-size: 11px;
  font-weight: 600;
  fill: #374151;
  text-anchor: middle;
  pointer-events: none;
  opacity: ${({ $isVisible }) => $isVisible ? 1 : 0};
  transition: opacity 0.2s ease;
`;

const InfoPanelContainer = styled(motion.div)`
  position: absolute;
  bottom: 20px;
  left: 20px;
  right: 20px;
  z-index: 30;
`;

export const SubwayMap: React.FC<SubwayMapProps> = ({
  onStationSelect,
  onGameStart,
  onStationDetail,
  initialSelectedLines = [1, 2, 3, 4],
  showLabels: propShowLabels = false,
  className = ''
}) => {
  const [selectedStation, setSelectedStation] = useState<Station | null>(null);
  const [showLabels, setShowLabels] = useState(propShowLabels);
  const [hoveredStation, setHoveredStation] = useState<Station | null>(null);
  const [visibleLines, setVisibleLines] = useState<number[]>(initialSelectedLines);

  const handleStationClick = useCallback((station: Station) => {
    setSelectedStation(station);
    onStationSelect?.(station);
  }, [onStationSelect]);

  const handleStationHover = useCallback((station: Station) => {
    setHoveredStation(station);
  }, []);

  const handleStationLeave = useCallback(() => {
    setHoveredStation(null);
  }, []);

  const toggleLabels = () => setShowLabels(!showLabels);

  const toggleLine = (lineNumber: number) => {
    setVisibleLines(prev => 
      prev.includes(lineNumber) 
        ? prev.filter(l => l !== lineNumber)
        : [...prev, lineNumber]
    );
  };

  const displayedStation = selectedStation || hoveredStation;

  // 환승역 처리: 같은 이름의 역들을 찾아서 노선 정보 병합
  const processedStations = useMemo(() => {
    const stationMap = new Map<string, Station>();
    
    Object.entries(STATIONS_DATA).forEach(([lineNumber, stations]) => {
      if (!visibleLines.includes(parseInt(lineNumber))) return;
      
      stations.forEach(station => {
        const key = station.name;
        const existingStation = stationMap.get(key);
        
        if (existingStation) {
          // 환승역: 노선 정보 병합
          existingStation.lines = [...(existingStation.lines || []), parseInt(lineNumber)];
        } else {
          // 새 역: 노선 정보 추가
          stationMap.set(key, {
            ...station,
            line: parseInt(lineNumber),
            lines: [parseInt(lineNumber)]
          });
        }
      });
    });
    
    return Array.from(stationMap.values());
  }, [visibleLines]);

  // 모든 연결선 생성
  const allConnections = useMemo(() => {
    const connections: Record<string, Array<{ from: Station; to: Station }>> = {};
    
    Object.entries(STATIONS_DATA).forEach(([lineNumber, stations]) => {
      if (!visibleLines.includes(parseInt(lineNumber))) return;
      
      if (lineNumber === '2') {
        connections[lineNumber] = generate2LineConnections(stations);
      } else {
        connections[lineNumber] = generateConnections(stations);
      }
    });
    
    return connections;
  }, [visibleLines]);

  return (
    <MapContainer className={className}>
      {/* 헤더 */}
      <MapHeader>
        <h2>서울 지하철 노선도</h2>
        <p>역을 클릭하여 스토리를 탐험해보세요</p>
      </MapHeader>

      {/* 컨트롤 영역 */}
      <ControlsContainer>
        <ControlButton
          $active={showLabels}
          onClick={toggleLabels}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          title={showLabels ? '역명 숨기기' : '역명 표시'}
        >
          {showLabels ? <EyeOff size={20} /> : <Eye size={20} />}
        </ControlButton>
        
        <ControlButton
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          title="지도 도구"
        >
          <Navigation size={20} />
        </ControlButton>
      </ControlsContainer>

      {/* 노선 토글 */}
      <LineToggleContainer>
        <ToggleTitle>노선 선택</ToggleTitle>
        {Object.entries(SUBWAY_LINES).map(([lineNum, lineInfo]) => (
          <LineToggle key={lineNum}>
            <input
              type="checkbox"
              checked={visibleLines.includes(parseInt(lineNum))}
              onChange={() => toggleLine(parseInt(lineNum))}
            />
            <LineColorDot $color={lineInfo.color} />
            <LineToggleText>{lineInfo.name}</LineToggleText>
          </LineToggle>
        ))}
      </LineToggleContainer>

      {/* 범례 */}
      <LegendContainer>
        <ToggleTitle>범례</ToggleTitle>
        <LegendItem>
          <LegendDot $color="#FFD93D" $border="#667eea" />
          <span>스토리 있음</span>
        </LegendItem>
        <LegendItem>
          <LegendDot $color="#E5E7EB" $border="#667eea" />
          <span>일반역</span>
        </LegendItem>
        <LegendItem>
          <LegendDot $color="#FF6B6B" $border="#667eea" />
          <span>선택된 역</span>
        </LegendItem>
      </LegendContainer>

      {/* SVG 노선도 */}
      <SVGContainer>
        <svg 
          viewBox="0 0 640 760" 
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* 배경 구획 (옅게) */}
          <g opacity="0.05">
            <rect width="640" height="760" fill="#f0f8ff" />
            <text x="320" y="380" textAnchor="middle" fontSize="24" fill="#ddd" fontWeight="bold">
              서울시
            </text>
          </g>

          {/* 노선별 연결선 */}
          {Object.entries(allConnections).map(([lineNumber, connections]) => {
            const lineColor = SUBWAY_LINES[parseInt(lineNumber) as keyof typeof SUBWAY_LINES]?.color;
            if (!lineColor) return null;
            
            return (
              <g key={`line-${lineNumber}`}>
                {connections.map((connection, index) => (
                  <line
                    key={`${lineNumber}-connection-${index}`}
                    x1={connection.from.x}
                    y1={connection.from.y}
                    x2={connection.to.x}
                    y2={connection.to.y}
                    stroke={lineColor}
                    strokeWidth="4"
                    opacity="0.8"
                  />
                ))}
              </g>
            );
          })}

          {/* 지하철역들 */}
          {processedStations.map((station) => {
            const isSelected = selectedStation?.id === station.id;
            const isHovered = hoveredStation?.id === station.id;
            const isActive = isSelected || isHovered;
            
            // 주 노선 색상 (첫 번째 노선)
            const primaryLineColor = station.lines && station.lines.length > 0 
              ? SUBWAY_LINES[station.lines[0] as keyof typeof SUBWAY_LINES]?.color || '#666'
              : '#666';
            
            return (
              <g key={station.id}>
                {/* 역 아이콘 */}
                <StationCircle
                  cx={station.x}
                  cy={station.y}
                  r={isActive ? 8 : 6}
                  $lineColor={primaryLineColor}
                  $hasStory={station.hasStory}
                  $isActive={isActive}
                  onClick={() => handleStationClick(station)}
                  onMouseEnter={() => handleStationHover(station)}
                  onMouseLeave={handleStationLeave}
                  whileHover={{ scale: 1.2 }}
                  whileTap={{ scale: 0.9 }}
                  transition={{ duration: 0.2 }}
                />
                
                {/* 환승역 표시 (여러 노선이 있는 경우) */}
                {station.lines && station.lines.length > 1 && (
                  <circle
                    cx={station.x}
                    cy={station.y}
                    r={isActive ? 10 : 8}
                    fill="none"
                    stroke="#333"
                    strokeWidth="1"
                    opacity="0.6"
                    style={{ pointerEvents: 'none' }}
                  />
                )}
                
                {/* 역명 라벨 */}
                <StationLabel
                  x={station.x}
                  y={station.y - 12}
                  $isVisible={showLabels || isActive}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: (showLabels || isActive) ? 1 : 0 }}
                  transition={{ duration: 0.2 }}
                >
                  {station.name}
                </StationLabel>
              </g>
            );
          })}
        </svg>
      </SVGContainer>

      {/* 역 정보 패널 */}
      <AnimatePresence>
        {displayedStation && (
          <InfoPanelContainer
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <StationInfo
              station={displayedStation}
              onGameStart={onGameStart}
              onStationDetail={onStationDetail}
            />
          </InfoPanelContainer>
        )}
      </AnimatePresence>
    </MapContainer>
  );
};

export default SubwayMap;