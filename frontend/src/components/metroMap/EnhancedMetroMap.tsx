"use client";

import React, { useState, useMemo, useCallback } from 'react';
import styled, { keyframes } from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  METRO_STATIONS, 
  LINE_COLORS, 
  LineBitUtils,
  getStationsByLine,
  getTransferStations,
  searchStations,
  METRO_STATS,
  SVG_CONFIG,
  type Station
} from '../../data/metro/stationsData';
import { SEOUL_DISTRICTS, HAN_RIVER } from '../../data/metro/seoulDistrictData';
import { 
  generateLineConnections, 
  getVisibleLineConnections,
  areStationsConnected,
  type LineConnection 
} from '../../data/metro/metroLineConnections';

// ================================================================
// 애니메이션 키프레임
// ================================================================

const pulseAnimation = keyframes`
  0% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.7; transform: scale(1.1); }
  100% { opacity: 1; transform: scale(1); }
`;

const drawLine = keyframes`
  from { stroke-dashoffset: 1000; }
  to { stroke-dashoffset: 0; }
`;

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(-10px); }
  to { opacity: 1; transform: translateY(0); }
`;

// ================================================================
// 스타일드 컴포넌트
// ================================================================

const Container = styled.div`
  padding: 20px;
  background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
  min-height: 100vh;
`;

const Header = styled(motion.div)`
  text-align: center;
  margin-bottom: 30px;
`;

const Title = styled.h1`
  font-size: 2.5rem;
  font-weight: 800;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 10px;
`;

const Subtitle = styled.p`
  font-size: 1.1rem;
  color: #6b7280;
  margin: 0;
`;

const StatsGrid = styled(motion.div)`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
  margin-bottom: 30px;
`;

const StatCard = styled(motion.div)`
  background: white;
  padding: 20px;
  border-radius: 16px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(10px);
  text-align: center;
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 3px;
    background: linear-gradient(90deg, #667eea, #764ba2);
  }
  
  .stat-number {
    font-size: 2rem;
    font-weight: 800;
    color: #667eea;
    margin-bottom: 8px;
  }
  
  .stat-label {
    font-size: 14px;
    color: #6b7280;
    font-weight: 500;
  }
`;

const MapWrapper = styled(motion.div)`
  background: white;
  border-radius: 20px;
  padding: 30px;
  box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(10px);
  margin-bottom: 20px;
`;

const Controls = styled.div`
  display: flex;
  gap: 20px;
  margin-bottom: 25px;
  flex-wrap: wrap;
  align-items: flex-start;
`;

const ControlGroup = styled(motion.div)`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const ControlLabel = styled.label`
  font-size: 14px;
  font-weight: 700;
  color: #374151;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const CheckboxGroup = styled.div`
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
`;

const CheckboxItem = styled.label<{ $color?: string; $checked?: boolean }>`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  cursor: pointer;
  padding: 8px 12px;
  border-radius: 12px;
  transition: all 0.3s ease;
  border: 2px solid ${({ $checked, $color }) => $checked ? $color || '#667eea' : '#e5e7eb'};
  background: ${({ $checked, $color }) => $checked ? `${$color || '#667eea'}10` : 'white'};
  
  &:hover {
    background: ${({ $color }) => `${$color || '#667eea'}20`};
    transform: translateY(-1px);
  }
  
  input[type="checkbox"] {
    margin: 0;
    opacity: 0;
    position: absolute;
  }
  
  .color-dot {
    width: 14px;
    height: 14px;
    border-radius: 50%;
    background: ${({ $color }) => $color || '#667eea'};
    border: 2px solid white;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    transition: transform 0.2s ease;
  }
  
  ${({ $checked }) => $checked && `
    .color-dot {
      transform: scale(1.2);
    }
  `}
`;

const SearchBox = styled.input`
  padding: 12px 16px;
  border: 2px solid #e5e7eb;
  border-radius: 12px;
  font-size: 14px;
  width: 250px;
  transition: all 0.3s ease;
  background: white;
  
  &:focus {
    outline: none;
    border-color: #667eea;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
    transform: translateY(-1px);
  }
  
  &::placeholder {
    color: #9ca3af;
  }
`;

const SVGContainer = styled(motion.div)`
  width: 100%;
  overflow: hidden;
  border: 2px solid #f1f5f9;
  border-radius: 16px;
  background: linear-gradient(135deg, #fafbfc 0%, #f8fafc 100%);
  position: relative;
  
  svg {
    width: 100%;
    height: auto;
    min-width: 800px;
    display: block;
    transition: transform 0.3s ease;
  }
  
  &:hover svg {
    transform: scale(1.02);
  }
`;

const InfoPanel = styled(motion.div)`
  background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
  border: 2px solid #e5e7eb;
  border-radius: 16px;
  padding: 20px;
  margin-top: 20px;
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: linear-gradient(90deg, #667eea, #764ba2);
  }
`;

const InfoTitle = styled.h3`
  margin: 0 0 16px 0;
  font-size: 18px;
  font-weight: 700;
  color: #111827;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const InfoGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
`;

const InfoItem = styled.div`
  font-size: 14px;
  color: #6b7280;
  padding: 12px;
  background: white;
  border-radius: 8px;
  border: 1px solid #e5e7eb;
  
  strong {
    color: #374151;
    font-weight: 600;
    display: block;
    margin-bottom: 4px;
  }
`;

const SearchResults = styled(motion.div)`
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  max-height: 300px;
  overflow-y: auto;
  background: white;
  border: 2px solid #e5e7eb;
  border-top: none;
  border-radius: 0 0 12px 12px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  z-index: 10;
  
  .search-item {
    padding: 12px 16px;
    border-bottom: 1px solid #f3f4f6;
    cursor: pointer;
    transition: all 0.2s ease;
    
    &:hover {
      background: #f8fafc;
      transform: translateX(4px);
    }
    
    &:last-child {
      border-bottom: none;
    }
    
    .station-name {
      font-weight: 600;
      color: #374151;
      margin-bottom: 4px;
    }
    
    .station-lines {
      font-size: 12px;
      color: #6b7280;
      display: flex;
      align-items: center;
      gap: 4px;
    }
  }
`;

const SearchContainer = styled.div`
  position: relative;
`;

// ================================================================
// 메인 컴포넌트
// ================================================================

export const EnhancedMetroMap: React.FC = () => {
  const [visibleLines, setVisibleLines] = useState<number[]>([1, 2, 3, 4]);
  const [showDistricts, setShowDistricts] = useState(true);
  const [showHanRiver, setShowHanRiver] = useState(true);
  const [showLabels, setShowLabels] = useState(false);
  const [showLines, setShowLines] = useState(true);
  const [showTransferOnly, setShowTransferOnly] = useState(false);
  const [selectedStation, setSelectedStation] = useState<number | null>(null);
  const [hoveredStation, setHoveredStation] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearchResults, setShowSearchResults] = useState(false);

  // 표시할 노선 연결 계산
  const lineConnections = useMemo(() => {
    return showLines ? getVisibleLineConnections(visibleLines) : [];
  }, [visibleLines, showLines]);

  // 표시할 역들 필터링
  const visibleStations = useMemo(() => {
    return METRO_STATIONS.filter(station => {
      const matchesLine = LineBitUtils.matchesFilter(
        LineBitUtils.linesToBits(station.lines), 
        visibleLines
      );
      const matchesTransfer = !showTransferOnly || station.isTransfer;
      return matchesLine && matchesTransfer;
    });
  }, [visibleLines, showTransferOnly]);

  // 검색 결과
  const searchResults = useMemo(() => {
    return searchQuery.length > 1 ? searchStations(searchQuery) : [];
  }, [searchQuery]);

  // 노선별 통계
  const lineStats = useMemo(() => {
    return Object.entries(LINE_COLORS).map(([lineNum, color]) => {
      const line = parseInt(lineNum);
      const stations = getStationsByLine(line);
      
      return {
        line,
        color,
        totalStations: stations.length,
        visible: visibleLines.includes(line)
      };
    });
  }, [visibleLines]);

  const handleLineToggle = useCallback((line: number) => {
    setVisibleLines(prev => 
      prev.includes(line) 
        ? prev.filter(l => l !== line)
        : [...prev, line]
    );
  }, []);

  const handleStationClick = useCallback((stationId: number) => {
    setSelectedStation(selectedStation === stationId ? null : stationId);
  }, [selectedStation]);

  const handleStationHover = useCallback((stationId: number | null) => {
    setHoveredStation(stationId);
  }, []);

  const handleSearchItemClick = useCallback((stationId: number) => {
    setSelectedStation(stationId);
    setSearchQuery('');
    setShowSearchResults(false);
  }, []);

  const handleSearchFocus = useCallback(() => {
    setShowSearchResults(true);
  }, []);

  const handleSearchBlur = useCallback(() => {
    // 약간의 지연을 두어 클릭 이벤트가 처리되도록 함
    setTimeout(() => setShowSearchResults(false), 200);
  }, []);

  // 주 노선 색상 가져오기 함수
  const getStationColor = useCallback((station: Station) => {
    const primaryLine = station.lines[0];
    return LINE_COLORS[primaryLine as keyof typeof LINE_COLORS];
  }, []);

  // 역 크기 계산
  const getStationRadius = useCallback((station: Station) => {
    if (selectedStation === station.id) return 3;
    if (hoveredStation === station.id) return 2.5;
    if (station.isTransfer) return 2;
    return 1.5;
  }, [selectedStation, hoveredStation]);

  return (
    <Container>
      {/* 헤더 */}
      <Header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <Title>서울 지하철 노선도</Title>
        <Subtitle>실시간 인터랙티브 지하철 네트워크</Subtitle>
      </Header>

      {/* 통계 카드 */}
      <StatsGrid
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        {[
          { number: METRO_STATS.totalStations, label: '총 지하철역' },
          { number: METRO_STATS.transferStations, label: '환승역' },
          { number: visibleStations.length, label: '현재 표시' },
          { number: lineConnections.length, label: '표시 노선' },
        ].map((stat, index) => (
          <StatCard
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 * index }}
            whileHover={{ y: -5, scale: 1.02 }}
          >
            <motion.div 
              className="stat-number"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5, delay: 0.3 + 0.1 * index, type: "spring" }}
            >
              {stat.number}
            </motion.div>
            <div className="stat-label">{stat.label}</div>
          </StatCard>
        ))}
      </StatsGrid>
      
      <MapWrapper
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
      >
        {/* 컨트롤 패널 */}
        <Controls>
          <ControlGroup
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            <ControlLabel>표시할 노선</ControlLabel>
            <CheckboxGroup>
              {lineStats.map(({ line, color, totalStations, visible }) => (
                <CheckboxItem 
                  key={line} 
                  $color={color}
                  $checked={visible}
                >
                  <input
                    type="checkbox"
                    checked={visible}
                    onChange={() => handleLineToggle(line)}
                  />
                  <div className="color-dot" />
                  {line}호선 ({totalStations}개)
                </CheckboxItem>
              ))}
            </CheckboxGroup>
          </ControlGroup>

          <ControlGroup
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            <ControlLabel>표시 옵션</ControlLabel>
            <CheckboxGroup>
              {[
                { key: 'lines', label: '노선 연결', checked: showLines, onChange: setShowLines },
                { key: 'districts', label: '구청 경계', checked: showDistricts, onChange: setShowDistricts },
                { key: 'river', label: '한강', checked: showHanRiver, onChange: setShowHanRiver },
                { key: 'labels', label: '역명 표시', checked: showLabels, onChange: setShowLabels },
                { key: 'transfer', label: '환승역만', checked: showTransferOnly, onChange: setShowTransferOnly },
              ].map(option => (
                <CheckboxItem 
                  key={option.key}
                  $checked={option.checked}
                >
                  <input
                    type="checkbox"
                    checked={option.checked}
                    onChange={(e) => option.onChange(e.target.checked)}
                  />
                  <div className="color-dot" />
                  {option.label}
                </CheckboxItem>
              ))}
            </CheckboxGroup>
          </ControlGroup>

          <ControlGroup
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.7 }}
          >
            <ControlLabel>역 검색</ControlLabel>
            <SearchContainer>
              <SearchBox
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={handleSearchFocus}
                onBlur={handleSearchBlur}
                placeholder="역명을 입력하세요..."
              />
              
              <AnimatePresence>
                {showSearchResults && searchResults.length > 0 && (
                  <SearchResults
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                  >
                    {searchResults.slice(0, 10).map(station => (
                      <motion.div 
                        key={station.id}
                        className="search-item"
                        onClick={() => handleSearchItemClick(station.id)}
                        whileHover={{ backgroundColor: '#f0f4ff' }}
                        transition={{ duration: 0.2 }}
                      >
                        <div className="station-name">
                          {station.name}
                          {station.isTransfer && ' 🔄'}
                          {station.hasStory && ' 📖'}
                        </div>
                        <div className="station-lines">
                          {station.lines.map(line => (
                            <span 
                              key={line}
                              style={{ 
                                color: LINE_COLORS[line as keyof typeof LINE_COLORS],
                                fontWeight: 'bold'
                              }}
                            >
                              {line}호선
                            </span>
                          )).reduce((prev, curr, index) => index === 0 ? [curr] : [...prev, ', ', curr], [] as React.ReactNode[])}
                        </div>
                      </motion.div>
                    ))}
                  </SearchResults>
                )}
              </AnimatePresence>
            </SearchContainer>
          </ControlGroup>
        </Controls>

        {/* SVG 지도 */}
        <SVGContainer
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          <svg 
            viewBox={SVG_CONFIG.viewBox}
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* 구청 경계 */}
            {showDistricts && (
              <g id="districts" opacity="0.4">
                {SEOUL_DISTRICTS.map(district => (
                  <path
                    key={district.id}
                    d={district.path}
                    fill={district.fill}
                    stroke="#cbd5e1"
                    strokeWidth="0.5"
                  />
                ))}
              </g>
            )}

            {/* 한강 */}
            {showHanRiver && (
              <path
                d={HAN_RIVER.path}
                fill={HAN_RIVER.fill}
                opacity={HAN_RIVER.opacity}
                stroke="#64748b"
                strokeWidth="0.5"
              />
            )}

            {/* 지하철 노선 */}
            {showLines && (
              <g id="metro-lines">
                {lineConnections.map(connection => (
                  <g key={`line-${connection.lineNumber}`}>
                    {connection.segments.map((segment, index) => (
                      <path
                        key={`segment-${connection.lineNumber}-${index}`}
                        d={segment.path}
                        stroke={segment.color}
                        strokeWidth="3"
                        fill="none"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        opacity="0.9"
                        style={{
                          filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.1))',
                          strokeDasharray: '1000',
                          strokeDashoffset: '1000',
                          animation: `${drawLine} 2s ease-out forwards`,
                          animationDelay: `${index * 0.1}s`
                        }}
                      />
                    ))}
                  </g>
                ))}
              </g>
            )}

            {/* 지하철역 */}
            <g id="stations">
              {visibleStations.map((station, index) => (
                <g key={station.id}>
                  {/* 역 원 (배경) */}
                  <circle
                    cx={station.x}
                    cy={station.y}
                    r={getStationRadius(station)}
                    fill="white"
                    stroke={getStationColor(station)}
                    strokeWidth={selectedStation === station.id ? "2" : "1.5"}
                    style={{ 
                      cursor: 'pointer',
                      filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))',
                      animation: selectedStation === station.id ? `${pulseAnimation} 2s infinite` : undefined
                    }}
                    onClick={() => handleStationClick(station.id)}
                    onMouseEnter={() => handleStationHover(station.id)}
                    onMouseLeave={() => handleStationHover(null)}
                  />
                  
                  {/* 스토리 있는 역 표시 */}
                  {station.hasStory && (
                    <circle
                      cx={station.x}
                      cy={station.y}
                      r={getStationRadius(station) * 0.6}
                      fill="#fbbf24"
                      style={{ 
                        cursor: 'pointer',
                        animation: `${pulseAnimation} 3s infinite`
                      }}
                      onClick={() => handleStationClick(station.id)}
                      onMouseEnter={() => handleStationHover(station.id)}
                      onMouseLeave={() => handleStationHover(null)}
                    />
                  )}
                  
                  {/* 환승역 표시 */}
                  {station.isTransfer && (
                    <circle
                      cx={station.x}
                      cy={station.y}
                      r={0.8}
                      fill={getStationColor(station)}
                    />
                  )}
                  
                  {/* 역명 라벨 */}
                  {(showLabels || selectedStation === station.id || hoveredStation === station.id) && (
                    <text
                      x={station.x}
                      y={station.y - (getStationRadius(station) + 2)}
                      fontSize="2.5"
                      fill="#1f2937"
                      textAnchor="middle"
                      style={{ 
                        pointerEvents: 'none', 
                        fontWeight: 'bold',
                        stroke: 'white',
                        strokeWidth: '0.8',
                        paintOrder: 'stroke',
                        animation: `${fadeIn} 0.3s ease-out`
                      }}
                    >
                      {station.name}
                    </text>
                  )}
                </g>
              ))}
            </g>
          </svg>
        </SVGContainer>

        {/* 선택된 역 정보 */}
        <AnimatePresence>
          {selectedStation && (
            <InfoPanel
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.3 }}
            >
              {(() => {
                const station = METRO_STATIONS.find(s => s.id === selectedStation);
                return station ? (
                  <div>
                    <InfoTitle>
                      🚇 {station.name}
                      {station.isTransfer && ' 🔄'}
                      {station.hasStory && ' 📖'}
                    </InfoTitle>
                    <InfoGrid>
                      <InfoItem>
                        <strong>역 번호</strong>
                        {station.id}
                      </InfoItem>
                      <InfoItem>
                        <strong>소속 노선</strong>
                        {station.lines.join(', ')}호선
                      </InfoItem>
                      <InfoItem>
                        <strong>좌표</strong>
                        ({station.x.toFixed(1)}, {station.y.toFixed(1)})
                      </InfoItem>
                      <InfoItem>
                        <strong>환승역</strong>
                        {station.isTransfer ? '예' : '아니오'}
                      </InfoItem>
                      <InfoItem>
                        <strong>스토리</strong>
                        {station.hasStory ? '이용 가능' : '준비 중'}
                      </InfoItem>
                      <InfoItem>
                        <strong>주변 연결</strong>
                        {visibleStations.filter(s => 
                          s.id !== station.id && areStationsConnected(station.id, s.id)
                        ).length}개 역
                      </InfoItem>
                    </InfoGrid>
                  </div>
                ) : null;
              })()}
            </InfoPanel>
          )}
        </AnimatePresence>
      </MapWrapper>
    </Container>
  );
};

export default EnhancedMetroMap;