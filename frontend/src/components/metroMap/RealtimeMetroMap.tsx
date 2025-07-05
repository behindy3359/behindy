import React, { useState, useMemo, useEffect } from 'react';
import styled from 'styled-components';
import { 
  METRO_STATIONS, 
  LINE_COLORS, 
  LineBitUtils,
  getStationsByLine,
  SVG_CONFIG,
  type Station,
  type RealtimeStationData
} from '@/data/metro/stationsData';
import { SEOUL_DISTRICTS, HAN_RIVER } from '@/data/metro/seoulDistrictData';
import { 
  getVisibleLineConnections,
  type LineConnection 
} from '@/data/metro/metroLineConnections';

// ================================================================
// 간소화된 스타일드 컴포넌트들
// ================================================================

// 메인 컨테이너
const MapContainer = styled.div`
  width: 100%;
  /* 기존의 복잡한 padding, background, shadow 등 제거 */
`;

// 컨트롤 패널
const Controls = styled.div`
  display: flex;
  gap: 16px;
  margin-bottom: 16px;
  flex-wrap: wrap;
  align-items: center;
  padding: 16px 0;
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
  padding: 6px 10px;
  border-radius: 6px;
  transition: all 0.2s ease;
  border: 1px solid #e5e7eb;
  background: white;
  
  &:hover {
    background: #f8fafc;
    border-color: #cbd5e1;
  }
  
  input[type="checkbox"] {
    margin: 0;
  }
  
  .color-dot {
    width: 12px;
    height: 12px;
    border-radius: 50%;
    background: ${({ $color }) => $color || '#666'};
    border: 1px solid rgba(255,255,255,0.8);
  }
`;

// SVG 컨테이너 - 레이어 제거
const SVGContainer = styled.div`
  width: 100%;
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

// 상태 표시 - 간단한 인디케이터
const StatusIndicator = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 12px;
  color: #6b7280;
  margin-left: auto;
  
  .status-dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: #10b981;
    animation: pulse 2s infinite;
  }
  
  @keyframes pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.5; }
  }
`;

// ================================================================
// 백엔드 API 타입
// ================================================================

interface MetroApiResponse {
  success: boolean;
  message: string;
  data: {
    positions: Array<{
      trainId: string;
      lineNumber: number;
      stationId: string;
      stationName: string;
      direction: 'up' | 'down';
      lastUpdated: string;
      dataSource: string;
      isRealtime: boolean;
      fresh: boolean;
    }>;
    totalTrains: number;
    lineStatistics: Record<string, number>;
    lastUpdated: string;
    dataSource: string;
    systemStatus: string;
    isRealtime: boolean;
  };
}

// ================================================================
// 실시간 데이터 훅 (간소화)
// ================================================================

const useMetroRealtime = (intervalMs: number = 30000) => {
  const [data, setData] = useState<MetroApiResponse['data'] | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await fetch('/api/metro/positions');
      const result: MetroApiResponse = await response.json();
      
      if (result.success && result.data) {
        setData(result.data);
      } else {
        setError(result.message || '데이터를 불러올 수 없습니다.');
      }
      
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : '네트워크 오류';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, intervalMs);
    
    return () => clearInterval(interval);
  }, [intervalMs]);

  return { data, isLoading, error, refreshData: fetchData };
};

// ================================================================
// 메인 컴포넌트 (대폭 간소화)
// ================================================================

export const RealtimeMetroMap: React.FC = () => {
  const [visibleLines, setVisibleLines] = useState<number[]>([1, 2, 3, 4]);
  const [showDistricts, setShowDistricts] = useState(true);
  const [selectedStation, setSelectedStation] = useState<number | null>(null);

  // 실시간 데이터 훅
  const { data: realtimeData, isLoading, error } = useMetroRealtime(30000);

  // 실시간 데이터 처리
  const processedRealtimeData = useMemo(() => {
    if (!realtimeData?.positions) return [];
    
    return realtimeData.positions.map(train => {
      // API ID로 매핑
      let frontendStation = METRO_STATIONS.find(station => 
        station.realApiId === train.stationId
      );
      
      // 역명으로 fallback 매핑
      if (!frontendStation) {
        frontendStation = METRO_STATIONS.find(station => 
          station.name === train.stationName && 
          station.lines.includes(train.lineNumber)
        );
      }
      
      if (!frontendStation) return null;
      
      return {
        frontendStationId: frontendStation.id,
        stationName: train.stationName,
        lineNumber: train.lineNumber,
        direction: train.direction,
        trainCount: 1,
        lastUpdated: new Date(train.lastUpdated),
        trainId: train.trainId
      };
    }).filter(train => train !== null);
  }, [realtimeData]);

  // 노선 연결 데이터
  const lineConnections = useMemo(() => {
    return getVisibleLineConnections(visibleLines);
  }, [visibleLines]);

  // 표시할 역들
  const visibleStations = useMemo(() => {
    return METRO_STATIONS.filter(station => {
      return LineBitUtils.matchesFilter(
        LineBitUtils.linesToBits(station.lines), 
        visibleLines
      );
    });
  }, [visibleLines]);

  // 노선별 통계
  const lineStats = useMemo(() => {
    return Object.entries(LINE_COLORS).map(([lineNum, color]) => {
      const line = parseInt(lineNum);
      const stations = getStationsByLine(line);
      const trainCount = processedRealtimeData
        .filter(train => train.lineNumber === line)
        .length;
      
      return {
        line,
        color,
        totalStations: stations.length,
        trainCount,
        visible: visibleLines.includes(line)
      };
    });
  }, [visibleLines, processedRealtimeData]);

  // 이벤트 핸들러들
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

  const getStationColor = (station: Station) => {
    const primaryLine = station.lines[0];
    return LINE_COLORS[primaryLine as keyof typeof LINE_COLORS];
  };

  return (
    <MapContainer>
      {/* 간소화된 컨트롤 패널 */}
      <Controls>
        <CheckboxGroup>
          {lineStats.map(({ line, color, trainCount }) => (
            <CheckboxItem key={line} $color={color}>
              <input
                type="checkbox"
                checked={visibleLines.includes(line)}
                onChange={() => handleLineToggle(line)}
              />
              <div className="color-dot" />
              {line}호선
              {trainCount > 0 ? (
                <span style={{ 
                  fontSize: '12px', 
                  color: '#ff6b35', 
                  fontWeight: '700',
                  marginLeft: '4px',
                  background: 'rgba(255, 107, 53, 0.1)',
                  padding: '2px 6px',
                  borderRadius: '8px'
                }}>
                  🚇 {trainCount}대
                </span>
              ) : (
                <span style={{ 
                  fontSize: '11px', 
                  color: '#9ca3af', 
                  fontWeight: '500',
                  marginLeft: '4px'
                }}>
                  운행정보 없음
                </span>
              )}
            </CheckboxItem>
          ))}
        </CheckboxGroup>

        <StatusIndicator>
          {isLoading && <div className="status-dot" />}
          {error ? (
            <span style={{ color: '#ef4444' }}>❌ 연결 오류</span>
          ) : (
            <span>
              🔴 실시간 업데이트 
              {processedRealtimeData.length > 0 && (
                <span style={{ 
                  marginLeft: '8px',
                  fontWeight: '600',
                  color: '#ff6b35'
                }}>
                  (총 {processedRealtimeData.length}대 운행중)
                </span>
              )}
            </span>
          )}
        </StatusIndicator>
      </Controls>

      {/* 간소화된 SVG 지도 */}
      <SVGContainer>
        <svg 
          viewBox={SVG_CONFIG.viewBox}
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* 구청 경계 (선택적) */}
          {showDistricts && (
            <g id="districts" opacity="0.4">
              {SEOUL_DISTRICTS.map(district => (
                <path
                  key={district.id}
                  d={district.path}
                  fill={district.fill}
                  stroke="#e2e8f0"
                  strokeWidth="0.3"
                />
              ))}
            </g>
          )}

          {/* 한강 */}
          <path
            d={HAN_RIVER.path}
            fill={HAN_RIVER.fill}
            opacity={HAN_RIVER.opacity}
          />

          {/* 지하철 노선 */}
          <g id="metro-lines">
            {lineConnections.map(connection => (
              <g key={`line-${connection.lineNumber}`}>
                {connection.segments.map((segment, index) => (
                  <path
                    key={`segment-${connection.lineNumber}-${index}`}
                    d={segment.path}
                    stroke={segment.color}
                    strokeWidth="2.5"
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    opacity="0.9"
                  />
                ))}
              </g>
            ))}
          </g>

          {/* 지하철역들 - 모든 역을 동일한 검은색 원으로 통일 */}
          <g id="stations">
            {visibleStations.map(station => {
              const realtimeInfo = processedRealtimeData.filter(
                data => data.frontendStationId === station.id
              );
              const hasRealtimeData = realtimeInfo.length > 0;
              
              return (
                <g key={`station-${station.id}`}>
                  {/* 열차 도착시에만 애니메이션 (외곽 링) */}
                  {hasRealtimeData && (
                    <circle
                      cx={station.x}
                      cy={station.y}
                      r="1.5"
                      fill="none"
                      stroke="#ffff00"
                      strokeWidth="0.8"
                      opacity="0.9"
                    >
                      <animate
                        attributeName="r"
                        values="1.0;2.8;1.0"
                        dur="2.5s"
                        repeatCount="indefinite"
                      />
                      <animate
                        attributeName="opacity"
                        values="0.9;0.1;0.9"
                        dur="2.5s"
                        repeatCount="indefinite"
                      />
                      <animate
                        attributeName="stroke-width"
                        values="0.8;0.3;0.8"
                        dur="2.5s"
                        repeatCount="indefinite"
                      />
                    </circle>
                  )}
                  
                  {/* 모든 역을 동일한 크기의 검은색 원으로 표시 */}
                  <circle
                    cx={station.x}
                    cy={station.y}
                    r="0.7"
                    fill={hasRealtimeData ? "#ffff00" : "#2d3748"}
                    stroke="#ffffff"
                    strokeWidth="0.3"
                    style={{ cursor: 'pointer' }}
                    onClick={() => handleStationClick(station.id)}
                  />
                </g>
              );
            })}
          </g>

          {/* 현재 열차 위치만 역명 표시 */}
          <g id="train-position-labels">
            {processedRealtimeData.map(trainData => {
              const station = METRO_STATIONS.find(s => s.id === trainData.frontendStationId);
              if (!station || !visibleLines.includes(trainData.lineNumber)) return null;
              
              return (
                <g key={`train-${trainData.trainId}`}>
                  {/* 역명 라벨 */}
                  <text
                    x={station.x}
                    y={station.y - 4}
                    fontSize="2.5"
                    fill="#000000"
                    textAnchor="middle"
                    dominantBaseline="middle"
                    style={{ 
                      fontWeight: '700',
                      stroke: 'white',
                      strokeWidth: '1.0',
                      paintOrder: 'stroke fill',
                      fontFamily: 'system-ui, sans-serif'
                    }}
                  >
                    {station.name}
                  </text>
                </g>
              );
            })}
          </g>
        </svg>
      </SVGContainer>
    </MapContainer>
  );
};