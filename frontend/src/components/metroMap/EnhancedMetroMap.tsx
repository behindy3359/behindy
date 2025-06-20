// frontend/src/components/metroMap/SimpleMetroMap.tsx
"use client";

import React, { useState, useMemo } from 'react';
import styled from 'styled-components';
import { 
  METRO_STATIONS, 
  LINE_COLORS, 
  LineBitUtils,
  getStationsByLine,
  searchStations,
  METRO_STATS,
  SVG_CONFIG,
  type Station
} from '../../data/metro/stationsData';
import { SEOUL_DISTRICTS, HAN_RIVER } from '../../data/metro/seoulDistrictData';
import { 
  getVisibleLineConnections
} from '../../data/metro/metroLineConnections';


const Container = styled.div`
  padding: 20px;
  background: #f8fafc;
`;

const Title = styled.h2`
  font-size: 1.5rem;
  font-weight: 600;
  color: #111827;
  margin-bottom: 20px;
  text-align: center;
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 12px;
  margin-bottom: 20px;
`;

const StatCard = styled.div`
  background: white;
  padding: 12px;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  text-align: center;
  
  .stat-number {
    font-size: 1.25rem;
    font-weight: 600;
    color: #667eea;
    margin-bottom: 4px;
  }
  
  .stat-label {
    font-size: 0.75rem;
    color: #6b7280;
  }
`;

const MapWrapper = styled.div`
  background: white;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  margin-bottom: 20px;
`;

const Controls = styled.div`
  display: flex;
  gap: 16px;
  margin-bottom: 16px;
  flex-wrap: wrap;
`;

const ControlGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const ControlLabel = styled.label`
  font-size: 0.875rem;
  font-weight: 600;
  color: #374151;
`;

const CheckboxGroup = styled.div`
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
`;

const CheckboxItem = styled.label<{ $color?: string }>`
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 0.875rem;
  cursor: pointer;
  padding: 4px 8px;
  border-radius: 6px;
  border: 1px solid #e5e7eb;
  background: white;
  
  &:hover {
    background: #f9fafb;
  }
  
  input[type="checkbox"] {
    margin: 0;
  }
  
  .color-dot {
    width: 10px;
    height: 10px;
    border-radius: 50%;
    background: ${({ $color }) => $color || '#666'};
    border: 1px solid #e5e7eb;
  }
`;

const SearchBox = styled.input`
  padding: 8px 12px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 0.875rem;
  width: 200px;
  
  &:focus {
    outline: none;
    border-color: #667eea;
  }
`;

const SVGContainer = styled.div`
  width: 100%;
  overflow-x: auto;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  background: #fafbfc;
  
  svg {
    width: 100%;
    height: auto;
    min-width: 800px;
    display: block;
  }
`;

const InfoPanel = styled.div`
  background: #f9fafb;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 16px;
  margin-top: 16px;
`;

const InfoTitle = styled.h3`
  margin: 0 0 12px 0;
  font-size: 1rem;
  font-weight: 600;
  color: #111827;
`;

const InfoGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 8px;
`;

const InfoItem = styled.div`
  font-size: 0.875rem;
  color: #6b7280;
  
  strong {
    color: #374151;
    font-weight: 600;
  }
`;

const SearchResults = styled.div`
  margin-top: 8px;
  max-height: 150px;
  overflow-y: auto;
  border: 1px solid #e5e7eb;
  border-radius: 4px;
  background: white;
  
  .search-item {
    padding: 8px;
    border-bottom: 1px solid #f3f4f6;
    cursor: pointer;
    font-size: 0.875rem;
    
    &:hover {
      background: #f9fafb;
    }
    
    &:last-child {
      border-bottom: none;
    }
    
    .station-name {
      font-weight: 600;
      color: #374151;
    }
    
    .station-lines {
      font-size: 0.75rem;
      color: #6b7280;
      margin-top: 2px;
    }
  }
`;

// ================================================================
// 메인 컴포넌트
// ================================================================

export const SimpleMetroMap: React.FC = () => {
  const [visibleLines, setVisibleLines] = useState<number[]>([1, 2, 3, 4]);
  const [showDistricts, setShowDistricts] = useState(true);
  const [showHanRiver, setShowHanRiver] = useState(true);
  const [showLabels, setShowLabels] = useState(false);
  const [showLines, setShowLines] = useState(true);
  const [showTransferOnly, setShowTransferOnly] = useState(false);
  const [selectedStation, setSelectedStation] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

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

  const handleLineToggle = (line: number) => {
    setVisibleLines(prev => 
      prev.includes(line) 
        ? prev.filter(l => l !== line)
        : [...prev, line]
    );
  };

  const handleStationClick = (stationId: number) => {
    setSelectedStation(selectedStation === stationId ? null : stationId);
  };

  const handleSearchItemClick = (stationId: number) => {
    setSelectedStation(stationId);
    setSearchQuery('');
  };

  // 주 노선 색상 가져오기 함수
  const getStationColor = (station: Station) => {
    const primaryLine = station.lines[0];
    return LINE_COLORS[primaryLine as keyof typeof LINE_COLORS];
  };

  return (
    <Container>
      <Title>서울 지하철 노선도</Title>

      {/* 통계 카드 */}
      <StatsGrid>
        <StatCard>
          <div className="stat-number">{METRO_STATS.totalStations}</div>
          <div className="stat-label">총 역</div>
        </StatCard>
        <StatCard>
          <div className="stat-number">{METRO_STATS.transferStations}</div>
          <div className="stat-label">환승역</div>
        </StatCard>
        <StatCard>
          <div className="stat-number">{visibleStations.length}</div>
          <div className="stat-label">표시 중</div>
        </StatCard>
        <StatCard>
          <div className="stat-number">{lineConnections.length}</div>
          <div className="stat-label">노선</div>
        </StatCard>
      </StatsGrid>
      
      <MapWrapper>
        {/* 컨트롤 패널 */}
        <Controls>
          <ControlGroup>
            <CheckboxGroup>
              {lineStats.map(({ line, color, totalStations, visible }) => (
                <CheckboxItem key={line} $color={color}>
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

          <ControlGroup>
            <CheckboxGroup>
              <CheckboxItem>
                <input
                  type="checkbox"
                  checked={showLines}
                  onChange={(e) => setShowLines(e.target.checked)}
                />
                <div className="color-dot" />
                노선 연결
              </CheckboxItem>
              <CheckboxItem>
                <input
                  type="checkbox"
                  checked={showDistricts}
                  onChange={(e) => setShowDistricts(e.target.checked)}
                />
                <div className="color-dot" />
                구
              </CheckboxItem>
              <CheckboxItem>
                <input
                  type="checkbox"
                  checked={showHanRiver}
                  onChange={(e) => setShowHanRiver(e.target.checked)}
                />
                <div className="color-dot" />
                한강
              </CheckboxItem>
              <CheckboxItem>
                <input
                  type="checkbox"
                  checked={showLabels}
                  onChange={(e) => setShowLabels(e.target.checked)}
                />
                <div className="color-dot" />
                역명
              </CheckboxItem>
              <CheckboxItem>
                <input
                  type="checkbox"
                  checked={showTransferOnly}
                  onChange={(e) => setShowTransferOnly(e.target.checked)}
                />
                <div className="color-dot" />
                환승역만
              </CheckboxItem>
            </CheckboxGroup>
          </ControlGroup>

          <ControlGroup>
            <ControlLabel>역 검색</ControlLabel>
            <SearchBox
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="역명 검색..."
            />
            {searchResults.length > 0 && (
              <SearchResults>
                {searchResults.slice(0, 5).map(station => (
                  <div 
                    key={station.id}
                    className="search-item"
                    onClick={() => handleSearchItemClick(station.id)}
                  >
                    <div className="station-name">
                      {station.name}
                      {station.isTransfer && ' 🔄'}
                      {station.hasStory && ' 📖'}
                    </div>
                    <div className="station-lines">
                      {station.lines.join(', ')}호선
                    </div>
                  </div>
                ))}
              </SearchResults>
            )}
          </ControlGroup>
        </Controls>

        {/* SVG 지도 */}
        <SVGContainer>
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
                    stroke="#e2e8f0"
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
                        strokeWidth="2"
                        fill="none"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        opacity="0.8"
                      />
                    ))}
                  </g>
                ))}
              </g>
            )}

            {/* 지하철역 */}
            <g id="stations">
              {visibleStations.map(station => (
                <g key={station.id}>
                  {/* 역 원 */}
                  <circle
                    cx={station.x}
                    cy={station.y}
                    r={selectedStation === station.id ? 2.5 : station.isTransfer ? 1.8 : 1.3}
                    fill="white"
                    stroke={getStationColor(station)}
                    strokeWidth={selectedStation === station.id ? "1.5" : "1"}
                    style={{ cursor: 'pointer' }}
                    onClick={() => handleStationClick(station.id)}
                  />
                  
                  {/* 스토리 있는 역 표시 */}
                  {station.hasStory && (
                    <circle
                      cx={station.x}
                      cy={station.y}
                      r={selectedStation === station.id ? 1.8 : station.isTransfer ? 1.2 : 0.8}
                      fill="#fbbf24"
                      style={{ cursor: 'pointer' }}
                      onClick={() => handleStationClick(station.id)}
                    />
                  )}
                  
                  {/* 환승역 표시 */}
                  {station.isTransfer && (
                    <circle
                      cx={station.x}
                      cy={station.y}
                      r={0.6}
                      fill={getStationColor(station)}
                    />
                  )}
                  
                  {/* 역명 라벨 */}
                  {(showLabels || selectedStation === station.id) && (
                    <text
                      x={station.x}
                      y={station.y - 3}
                      fontSize="2.5"
                      fill="#374151"
                      textAnchor="middle"
                      style={{ 
                        pointerEvents: 'none', 
                        fontWeight: 'bold',
                        stroke: 'white',
                        strokeWidth: '0.5',
                        paintOrder: 'stroke'
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
        {selectedStation && (
          <InfoPanel>
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
                    <InfoItem><strong>ID:</strong> {station.id}</InfoItem>
                    <InfoItem><strong>노선:</strong> {station.lines.join(', ')}호선</InfoItem>
                    <InfoItem><strong>환승:</strong> {station.isTransfer ? '예' : '아니오'}</InfoItem>
                  </InfoGrid>
                </div>
              ) : null;
            })()}
          </InfoPanel>
        )}
      </MapWrapper>
    </Container>
  );
};

export default SimpleMetroMap;