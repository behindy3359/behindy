"use client";

import React, { useState, useMemo } from 'react';
import styled from 'styled-components';
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
  type LineConnection 
} from '../../data/metro/metroLineConnections';

// ================================================================
// 스타일드 컴포넌트
// ================================================================

const Container = styled.div`
  padding: 20px;
  background: #f8fafc;
  min-height: 100vh;
`;

const Title = styled.h1`
  font-size: 24px;
  font-weight: 700;
  color: #111827;
  margin-bottom: 20px;
  text-align: center;
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
  margin-bottom: 20px;
`;

const StatCard = styled.div`
  background: white;
  padding: 16px;
  border-radius: 12px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  text-align: center;
  
  .stat-number {
    font-size: 24px;
    font-weight: 700;
    color: #667eea;
    margin-bottom: 4px;
  }
  
  .stat-label {
    font-size: 14px;
    color: #6b7280;
  }
`;

const MapWrapper = styled.div`
  background: white;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
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
  font-size: 14px;
  font-weight: 600;
  color: #374151;
`;

const CheckboxGroup = styled.div`
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
`;

const CheckboxItem = styled.label<{ $color?: string }>`
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 14px;
  cursor: pointer;
  padding: 4px 8px;
  border-radius: 4px;
  transition: background 0.2s ease;
  
  &:hover {
    background: #f3f4f6;
  }
  
  input[type="checkbox"] {
    margin: 0;
  }
  
  .color-dot {
    width: 12px;
    height: 12px;
    border-radius: 50%;
    background: ${({ $color }) => $color || '#666'};
    border: 1px solid #e5e7eb;
  }
`;

const SearchBox = styled.input`
  padding: 8px 12px;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  font-size: 14px;
  width: 200px;
  
  &:focus {
    outline: none;
    border-color: #667eea;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
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
  font-size: 16px;
  font-weight: 600;
  color: #111827;
`;

const InfoGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 12px;
`;

const InfoItem = styled.div`
  font-size: 14px;
  color: #6b7280;
  
  strong {
    color: #374151;
    font-weight: 600;
  }
`;

const SearchResults = styled.div`
  margin-top: 12px;
  max-height: 200px;
  overflow-y: auto;
  
  .search-item {
    padding: 8px;
    border-bottom: 1px solid #e5e7eb;
    cursor: pointer;
    transition: background 0.2s ease;
    
    &:hover {
      background: #f3f4f6;
    }
    
    .station-name {
      font-weight: 600;
      color: #374151;
    }
    
    .station-lines {
      font-size: 12px;
      color: #6b7280;
      margin-top: 2px;
    }
  }
`;

// ================================================================
// 메인 컴포넌트
// ================================================================

export const MetroMapWithLines: React.FC = () => {
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
      // 노선 필터링
      const matchesLine = LineBitUtils.matchesFilter(
        LineBitUtils.linesToBits(station.lines), 
        visibleLines
      );
      
      // 환승역만 보기 필터링
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
      {/* 통계 카드 */}
      <StatsGrid>
        {/* <StatCard>
          <div className="stat-number">{METRO_STATS.totalStations}</div>
          <div className="stat-label">총 지하철역</div>
        </StatCard>
        <StatCard>
          <div className="stat-number">{METRO_STATS.transferStations}</div>
          <div className="stat-label">환승역</div>
        </StatCard>
        <StatCard>
          <div className="stat-number">{visibleStations.length}</div>
          <div className="stat-label">현재 표시</div>
        </StatCard>
        <StatCard>
          <div className="stat-number">{lineConnections.length}</div>
          <div className="stat-label">표시 노선</div>
        </StatCard> */}
      </StatsGrid>
      
      <MapWrapper>
        {/* 컨트롤 패널 */}
        <Controls>
          <ControlGroup>
            <CheckboxGroup>
              {lineStats.map(({ line, color, totalStations }) => (
                <CheckboxItem key={line} $color={color}>
                  <input
                    type="checkbox"
                    checked={visibleLines.includes(line)}
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
                노선 연결
              </CheckboxItem>
              <CheckboxItem>
                <input
                  type="checkbox"
                  checked={showDistricts}
                  onChange={(e) => setShowDistricts(e.target.checked)}
                />
                구
              </CheckboxItem>
              <CheckboxItem>
                <input
                  type="checkbox"
                  checked={showHanRiver}
                  onChange={(e) => setShowHanRiver(e.target.checked)}
                />
                한강
              </CheckboxItem>
              <CheckboxItem>
                <input
                  type="checkbox"
                  checked={showLabels}
                  onChange={(e) => setShowLabels(e.target.checked)}
                />
                역명 표시
              </CheckboxItem>
              <CheckboxItem>
                <input
                  type="checkbox"
                  checked={showTransferOnly}
                  onChange={(e) => setShowTransferOnly(e.target.checked)}
                />
                환승역만
              </CheckboxItem>
            </CheckboxGroup>
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
              <g id="districts" opacity="0.6">
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

            <g id="stations">
              {visibleStations.map(station => (
                <g key={station.id}>
                  {/* 역 원 (배경) */}
                  <circle
                    cx={station.x}
                    cy={station.y}
                    r={selectedStation === station.id ? 0.8 : station.isTransfer ? 0.8 : 0.5}
                    fill="white"
                    stroke={getStationColor(station)}
                    strokeWidth={selectedStation === station.id ? "1.2" : "0.8"}
                    style={{ cursor: 'pointer' }}
                    onClick={() => handleStationClick(station.id)}
                  />
                  
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
                    {station.isTransfer && ' 🔄 환승역'}
                  </InfoTitle>
                  <InfoGrid>
                    <InfoItem><strong>ID:</strong> {station.id}</InfoItem>
                    <InfoItem><strong>노선:</strong> {station.lines.join(', ')}호선</InfoItem>
                    <InfoItem><strong>좌표:</strong> ({station.x.toFixed(2)}, {station.y.toFixed(2)})</InfoItem>
                    <InfoItem><strong>환승역:</strong> {station.isTransfer ? '예' : '아니오'}</InfoItem>
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

export default MetroMapWithLines;