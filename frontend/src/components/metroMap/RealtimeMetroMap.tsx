import React, { useState, useMemo, useEffect } from 'react';
import styled from 'styled-components';
import { 
  METRO_STATIONS, 
  LINE_COLORS, 
  LineBitUtils,
  getStationsByLine,
  searchStations,
  METRO_STATS,
  SVG_CONFIG,
  transformApiDataToFrontend,
  type Station,
  type RealtimeStationData
} from '../../data/metro/stationsData';
import { SEOUL_DISTRICTS, HAN_RIVER } from '../../data/metro/seoulDistrictData';
import { 
  generateLineConnections, 
  getVisibleLineConnections,
  type LineConnection 
} from '../../data/metro/metroLineConnections';

// 스타일드 컴포넌트들
const Container = styled.div`
  padding: 20px;
  background: #f8fafc;
  min-height: 100vh;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  
  h1 {
    font-size: 24px;
    font-weight: 700;
    color: #111827;
    margin: 0;
  }
`;

const StatusIndicator = styled.div<{ $isLoading: boolean; $hasError: boolean }>`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  
  ${({ $hasError, $isLoading }) => {
    if ($hasError) return 'background: #fef2f2; color: #dc2626; border: 1px solid #fecaca;';
    if ($isLoading) return 'background: #fffbeb; color: #d97706; border: 1px solid #fed7aa;';
    return 'background: #f0fdf4; color: #16a34a; border: 1px solid #bbf7d0;';
  }}
  
  .indicator {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: currentColor;
    
    ${({ $isLoading }) => $isLoading && `
      animation: pulse 1.5s ease-in-out infinite;
    `}
  }
  
  @keyframes pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.5; }
  }
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 12px;
  margin-bottom: 16px;
`;

const StatCard = styled.div`
  background: white;
  padding: 12px;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  text-align: center;
  
  .stat-number {
    font-size: 18px;
    font-weight: 700;
    color: #667eea;
    margin-bottom: 4px;
  }
  
  .stat-label {
    font-size: 12px;
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
  align-items: center;
`;

const ControlGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
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

const RefreshButton = styled.button`
  padding: 8px 16px;
  background: #667eea;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  cursor: pointer;
  transition: background 0.2s ease;
  
  &:hover {
    background: #5a67d8;
  }
  
  &:disabled {
    background: #9ca3af;
    cursor: not-allowed;
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
  
  .info-title {
    font-size: 16px;
    font-weight: 600;
    color: #111827;
    margin-bottom: 12px;
  }
  
  .last-updated {
    font-size: 14px;
    color: #6b7280;
    margin-bottom: 8px;
  }
  
  .request-count {
    font-size: 12px;
    color: #9ca3af;
  }
`;

// 백엔드 API 응답 타입
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

// 실시간 데이터 훅
const useMetroRealtime = (intervalMs: number = 30000) => {
  const [data, setData] = useState<MetroApiResponse['data'] | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [requestCount, setRequestCount] = useState(0);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await fetch('/api/metro/positions');
      const result: MetroApiResponse = await response.json();
      
      if (result.success && result.data) {
        setData(result.data);
        console.log(result.data);
      } else {
        setError(result.message || '데이터를 불러올 수 없습니다.');
      }
      
      setRequestCount(prev => prev + 1);
      
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : '알 수 없는 오류가 발생했습니다.';
      setError(`네트워크 오류: ${errorMessage}`);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, intervalMs);
    
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        console.log('👀 탭 활성화 - 즉시 업데이트');
        fetchData();
      }
    };
    
    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    return () => {
      clearInterval(interval);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [intervalMs]);

  return {
    data,
    isLoading,
    error,
    refreshData: fetchData,
    requestCount
  };
};

// 메인 컴포넌트
export const RealtimeMetroMap: React.FC = () => {
  const [visibleLines, setVisibleLines] = useState<number[]>([1, 2, 3, 4]);
  const [showDistricts, setShowDistricts] = useState(true);
  const [showHanRiver, setShowHanRiver] = useState(true);
  const [showLabels, setShowLabels] = useState(false);
  const [showLines, setShowLines] = useState(true);
  const [selectedStation, setSelectedStation] = useState<number | null>(null);

  // 실시간 데이터 훅
  const { 
    data: realtimeData, 
    isLoading, 
    error, 
    refreshData,
    requestCount
  } = useMetroRealtime(30000); // 30초 간격

  const processedRealtimeData = useMemo(() => {
    if (!realtimeData?.positions) return [];
    
    // 백엔드 데이터를 프론트엔드 형식으로 변환
    const converted = realtimeData.positions.map(train => {
      // 1차: API ID로 매핑 시도
      let frontendStation = METRO_STATIONS.find(station => 
        station.realApiId === train.stationId
      );
      
      // 2차: 역명 + 노선으로 매핑 시도 (fallback)
      if (!frontendStation) {
        frontendStation = METRO_STATIONS.find(station => 
          station.name === train.stationName && 
          station.lines.includes(train.lineNumber)
        );
      }
      
      if (!frontendStation) {
        return null;
      }
      
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
    
    console.log(`✅ 매핑 완료: ${converted.length}/${realtimeData.positions.length} 열차`);
    return converted;
  }, [realtimeData]);

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
      return matchesLine;
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
        visible: visibleLines.includes(line),
        trainCount
      };
    });
  }, [visibleLines, processedRealtimeData]);

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

  // 주 노선 색상 가져오기 함수
  const getStationColor = (station: Station) => {
    const primaryLine = station.lines[0];
    return LINE_COLORS[primaryLine as keyof typeof LINE_COLORS];
  };

  return (
    <Container>
      {/* 헤더 */}
      <Header>
        {/* <StatusIndicator $isLoading={isLoading} $hasError={!!error}>
          <div className="indicator" />
          {error ? '연결 실패' : isLoading ? '업데이트 중' : '실시간 연결'}
        </StatusIndicator> */}
      </Header>

      {/* 통계 카드 */}
      {/* <StatsGrid>
        <StatCard>
          <div className="stat-number">{METRO_STATS.totalStations}</div>
          <div className="stat-label">총 지하철역</div>
        </StatCard>
        <StatCard>
          <div className="stat-number">{realtimeData?.totalTrains || 0}</div>
          <div className="stat-label">운행 중인 열차</div>
        </StatCard>
        <StatCard>
          <div className="stat-number">{visibleStations.length}</div>
          <div className="stat-label">현재 표시 역</div>
        </StatCard>
        <StatCard>
          <div className="stat-number">{processedRealtimeData.length}</div>
          <div className="stat-label">실시간 데이터</div>
        </StatCard>
      </StatsGrid> */}
      
      <MapWrapper>
        {/* 컨트롤 패널 */}
        <Controls>
          <ControlGroup>
            <CheckboxGroup>
              {lineStats.map(({ line, color, totalStations, trainCount }) => (
                <CheckboxItem key={line} $color={color}>
                  <input
                    type="checkbox"
                    checked={visibleLines.includes(line)}
                    onChange={() => handleLineToggle(line)}
                  />
                  <div className="color-dot" />
                  {line}호선 {/*({totalStations}개역, {trainCount}대)*/}
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
                노선 표시
              </CheckboxItem>
              <CheckboxItem>
                <input
                  type="checkbox"
                  checked={showDistricts}
                  onChange={(e) => setShowDistricts(e.target.checked)}
                />
                구 경계
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
            viewBox={SVG_CONFIG.viewBox}
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* 구청 경계 (가장 아래 레이어) */}
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

            {/* 한강 (두 번째 레이어) */}
            {showHanRiver && (
              <path
                d={HAN_RIVER.path}
                fill={HAN_RIVER.fill}
                opacity={HAN_RIVER.opacity}
              />
            )}

            {/* 노선 (세 번째 레이어) */}
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
            <g id="station-circles">
              {[1, 2, 3, 4].map(lineNumber => (
                <g key={`line-${lineNumber}-stations`} id={`line-${lineNumber}-circles`}>
                  {visibleStations
                    .filter(station => station.lines.includes(lineNumber))
                    .map(station => {
                      const realtimeInfo = processedRealtimeData.filter(
                        data => data.frontendStationId === station.id
                      );
                      const hasRealtimeData = realtimeInfo.length > 0;
                      
                      return (
                        <g key={`${station.id}-line-${lineNumber}`}>
                          {/* 실시간 데이터가 있는 역의 외곽 링 애니메이션 */}
                          {hasRealtimeData && (
                            <circle
                              cx={station.x}
                              cy={station.y}
                              r="1.5"
                              fill="none"
                              stroke="#ff9900"
                              strokeWidth="0.3"
                              opacity="0.8"
                            >
                              <animate
                                attributeName="r"
                                values="0.8;2.0;0.8"
                                dur="3s"
                                repeatCount="indefinite"
                              />
                              <animate
                                attributeName="opacity"
                                values="0.8;0.2;0.8"
                                dur="3s"
                                repeatCount="indefinite"
                              />
                            </circle>
                          )}
                          
                          {/* 역 원 (배경) */}
                          <circle
                            cx={station.x}
                            cy={station.y}
                            r={selectedStation === station.id ? 1.2 : station.isTransfer ? 0.8 : 0.6}
                            fill="white"
                            stroke={getStationColor(station)}
                            strokeWidth={selectedStation === station.id ? "1.2" : "0.8"}
                            style={{ cursor: 'pointer' }}
                            onClick={() => handleStationClick(station.id)}
                          />
                          
                          {/* 실시간 데이터가 있는 역의 중심 점 */}
                          {hasRealtimeData && (
                            <circle
                              cx={station.x}
                              cy={station.y}
                              r="0.4"
                              fill="#10b981"
                            >
                              <animate
                                attributeName="fill"
                                values="#10b981;#34d399;#10b981"
                                dur="2s"
                                repeatCount="indefinite"
                              />
                            </circle>
                          )}
                          
                          {/* 환승역 표시 */}
                          {station.isTransfer && (
                            <circle
                              cx={station.x}
                              cy={station.y}
                              r={0.5}
                              fill={getStationColor(station)}
                              opacity="0.7"
                            />
                          )}
                        </g>
                      );
                    })}
                </g>
              ))}
            </g>

            {/* 역명 라벨들 (가장 위 레이어) - 별도 그룹으로 분리 */}
            {(showLabels || selectedStation) && (
              <g id="station-labels" style={{ pointerEvents: 'none' }}>
                {visibleStations.map(station => {
                  // 선택된 역이거나 showLabels가 true일 때만 표시
                  const shouldShowLabel = showLabels || selectedStation === station.id;
                  
                  if (!shouldShowLabel) return null;
                  
                  return (
                    <text
                      key={`label-${station.id}`}
                      x={station.x}
                      y={station.y - 3.5} // 더 위로 올림
                      fontSize="2.2"
                      fill="#374151"
                      textAnchor="middle"
                      dominantBaseline="middle"
                      style={{ 
                        pointerEvents: 'none', 
                        fontWeight: '700', // 더 굵게
                        stroke: 'white',
                        strokeWidth: '0.8', // 더 두꺼운 외곽선
                        paintOrder: 'stroke fill',
                        fontFamily: 'system-ui, -apple-system, sans-serif',
                        // 텍스트 그림자 효과 추가
                        filter: 'drop-shadow(0 0 2px rgba(255,255,255,0.8))'
                      }}
                    >
                      {station.name}
                    </text>
                  );
                })}
              </g>
            )}
          </svg>
        </SVGContainer>

        {/* 선택된 역 정보 */}
        {/* {selectedStation && (
          <InfoPanel style={{ marginTop: '12px' }}>
            {(() => {
              const station = METRO_STATIONS.find(s => s.id === selectedStation);
              const realtimeInfo = processedRealtimeData.filter(
                data => data.frontendStationId === selectedStation
              );
              
              return station ? (
                <div>
                  <div className="info-title">
                    🚇 {station.name}
                    {station.isTransfer && ' 🔄 환승역'}
                    {station.hasStory && ' 📚 스토리'}
                  </div>
                  <div style={{ fontSize: '14px', color: '#6b7280' }}>
                    <div>노선: {station.lines.join(', ')}호선</div>
                    <div>위치: ({station.x.toFixed(2)}, {station.y.toFixed(2)})</div>
                    {realtimeInfo.length > 0 && (
                      <div style={{ marginTop: '8px' }}>
                        <strong>실시간 정보:</strong>
                        {realtimeInfo.map((info, index) => (
                          <div key={index} style={{ marginLeft: '16px' }}>
                            • {info.direction === 'up' ? '상행' : info.direction === 'down' ? '하행' : '방향미상'}: 
                            {info.lastUpdated.toLocaleTimeString()} 업데이트
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ) : null;
            })()}
          </InfoPanel>
        )} */}

        {/* 시스템 정보 */}
        {/* <InfoPanel>
          <div className="info-title">시스템 정보</div>
          <div className="last-updated">
            마지막 업데이트: {realtimeData?.lastUpdated ? 
              new Date(realtimeData.lastUpdated).toLocaleString() : '없음'}
          </div>
          <div style={{ fontSize: '12px', color: '#9ca3af' }}>
            <div>데이터 소스: {realtimeData?.dataSource || '알 수 없음'}</div>
            <div>시스템 상태: {realtimeData?.systemStatus || '알 수 없음'}</div>
            <div>요청 횟수: {requestCount}회</div>
            <div>실시간: {realtimeData?.isRealtime ? '예' : '아니오'}</div>
          </div>
        </InfoPanel> */}
      </MapWrapper>
    </Container>
  );
};