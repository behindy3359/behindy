// 📄 src/components/SubwayMapTest.tsx
// 지하철 데이터가 제대로 표시되는지 확인하는 테스트 컴포넌트

"use client";

import React, { useState } from 'react';
import styled from 'styled-components';
import { METRO_STATIONS, LINE_COLORS } from '../../data/metro/stationsData';
import { SEOUL_DISTRICTS, HAN_RIVER } from '../../data/metro/seoulDistrictData';

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

const MapWrapper = styled.div`
  background: white;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  margin-bottom: 20px;
`;

const SVGContainer = styled.div`
  width: 100%;
  overflow-x: auto;
  
  svg {
    width: 100%;
    height: auto;
    min-width: 800px;
    border: 1px solid #e5e7eb;
    border-radius: 8px;
  }
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

// ================================================================
// 메인 컴포넌트
// ================================================================

export const SubwayMapTest: React.FC = () => {
  const [visibleLines, setVisibleLines] = useState<number[]>([1, 2, 3, 4]);
  const [showDistricts, setShowDistricts] = useState(true);
  const [showHanRiver, setShowHanRiver] = useState(true);
  const [showLabels, setShowLabels] = useState(false);
  const [selectedStation, setSelectedStation] = useState<string | null>(null);

  // 표시할 역들 필터링
  const visibleStations = METRO_STATIONS.filter(station => 
    visibleLines.includes(station.line)
  );

  // 노선별 통계
  const lineStats = Object.keys(LINE_COLORS).map(lineNum => {
    const line = parseInt(lineNum);
    const stations = METRO_STATIONS.filter(s => s.line === line);
    
    return {
      line,
      color: LINE_COLORS[line as keyof typeof LINE_COLORS],
      totalStations: stations.length,
    };
  });

  const handleLineToggle = (line: number) => {
    setVisibleLines(prev => 
      prev.includes(line) 
        ? prev.filter(l => l !== line)
        : [...prev, line]
    );
  };

  const handleStationClick = (stationId: string) => {
    setSelectedStation(selectedStation === stationId ? null : stationId);
  };

  return (
    <Container>
      <Title>🚇 지하철 노선도 데이터 테스트</Title>
      
      <MapWrapper>
        {/* 컨트롤 패널 */}
        <Controls>
          <ControlGroup>
            <ControlLabel>표시할 노선</ControlLabel>
            <CheckboxGroup>
              {lineStats.map(({ line, color }) => (
                <CheckboxItem key={line} $color={color}>
                  <input
                    type="checkbox"
                    checked={visibleLines.includes(line)}
                    onChange={() => handleLineToggle(line)}
                  />
                  <div className="color-dot" />
                  {line}호선
                </CheckboxItem>
              ))}
            </CheckboxGroup>
          </ControlGroup>

          <ControlGroup>
            <ControlLabel>레이어 옵션</ControlLabel>
            <CheckboxGroup>
              <CheckboxItem>
                <input
                  type="checkbox"
                  checked={showDistricts}
                  onChange={(e) => setShowDistricts(e.target.checked)}
                />
                구청 경계
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
            </CheckboxGroup>
          </ControlGroup>
        </Controls>

        {/* SVG 지도 */}
        <SVGContainer>
          <svg 
            viewBox="0 0 132.29166 119.0625" 
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

            {/* 지하철역 */}
            <g id="stations">
              {visibleStations.map(station => (
                <g key={station.id}>
                  <circle
                    cx={station.x}
                    cy={station.y}
                    r={selectedStation === station.id ? 1.5 : 1}
                    stroke={LINE_COLORS[station.line as keyof typeof LINE_COLORS]}
                    strokeWidth="0.5"
                    style={{ cursor: 'pointer' }}
                    onClick={() => handleStationClick(station.id)}
                  />
                  
                  {/* 역명 라벨 */}
                  {(showLabels || selectedStation === station.id) && (
                    <text
                      x={station.x}
                      y={station.y - 2}
                      fontSize="2.5"
                      fill="#374151"
                      textAnchor="middle"
                      style={{ pointerEvents: 'none' }}
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
                  <InfoTitle>선택된 역: {station.name}</InfoTitle>
                  <InfoGrid>
                    <InfoItem><strong>ID:</strong> {station.id}</InfoItem>
                    <InfoItem><strong>노선:</strong> {station.line}호선</InfoItem>
                    <InfoItem><strong>좌표:</strong> ({station.x.toFixed(2)}, {station.y.toFixed(2)})</InfoItem>
                  </InfoGrid>
                </div>
              ) : null;
            })()}
          </InfoPanel>
        )}
      </MapWrapper>

      {/* 통계 정보 */}
      <InfoPanel>
        <InfoTitle>📊 데이터 통계</InfoTitle>
        <InfoGrid>
          <InfoItem><strong>총 지하철역:</strong> {METRO_STATIONS.length}개</InfoItem>
          <InfoItem><strong>서울시 구청:</strong> {SEOUL_DISTRICTS.length}개</InfoItem>
          <InfoItem><strong>현재 표시 중:</strong> {visibleStations.length}개 역</InfoItem>
        </InfoGrid>

        <div style={{ marginTop: '16px' }}>
          <strong>노선별 통계:</strong>
          <InfoGrid style={{ marginTop: '8px' }}>
            {lineStats.map(({ line, color, totalStations }) => (
              <InfoItem key={line}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <div 
                    style={{ 
                      width: '12px', 
                      height: '12px', 
                      borderRadius: '50%', 
                      background: color 
                    }} 
                  />
                </div>
              </InfoItem>
            ))}
          </InfoGrid>
        </div>
      </InfoPanel>
    </Container>
  );
};

export default SubwayMapTest;