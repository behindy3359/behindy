import React, { useState, useCallback, useMemo } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';

// 타입 import
import type { 
  MetroMapProps, 
  MapViewport, 
  StationInteractionState, 
  LineFilterState,
  LayerVisibility,
  Station 
} from '../types';

// 데이터 import
import { STATIONS, SUBWAY_LINES, ENRICHED_DISTRICTS } from '../data';

/**
 * 스타일드 컴포넌트들
 */
const MapContainer = styled(motion.div)<{ 
  width?: number; 
  height?: number;
}>`
  position: relative;
  width: ${({ width }) => width ? `${width}px` : '100%'};
  height: ${({ height }) => height ? `${height}px` : '600px'};
  background: #fafbfc;
  border-radius: 16px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  user-select: none;
`;

const SVGContainer = styled.svg`
  width: 100%;
  height: 100%;
  cursor: grab;
  
  &:active {
    cursor: grabbing;
  }
`;

const LoadingOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.9);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10;
  
  .spinner {
    width: 40px;
    height: 40px;
    border: 4px solid #f3f4f6;
    border-top: 4px solid #667eea;
    border-radius: 50%;
    animation: spin 1s linear infinite;
  }
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

const InfoPanel = styled(motion.div)`
  position: absolute;
  top: 20px;
  left: 20px;
  background: white;
  border-radius: 12px;
  padding: 16px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  z-index: 5;
  max-width: 300px;
  
  h3 {
    margin: 0 0 8px 0;
    font-size: 16px;
    font-weight: 600;
    color: #374151;
  }
  
  p {
    margin: 0;
    font-size: 14px;
    color: #6b7280;
    line-height: 1.4;
  }
`;

const StatsPanel = styled.div`
  position: absolute;
  bottom: 20px;
  right: 20px;
  background: white;
  border-radius: 8px;
  padding: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  font-size: 12px;
  color: #6b7280;
  
  .stat-item {
    margin-bottom: 4px;
    
    &:last-child {
      margin-bottom: 0;
    }
    
    .label {
      font-weight: 600;
      color: #374151;
    }
  }
`;

/**
 * 기본값들
 */
const DEFAULT_VIEWPORT: MapViewport = {
  zoom: 1,
  panX: 0,
  panY: 0,
  centerX: 66.14583, // SVG 중심점
  centerY: 59.53125
};

const DEFAULT_LINE_FILTER: LineFilterState = {
  visibleLines: [1, 2, 3, 4],
  highlightedLine: null,
  dimmedLines: []
};

const DEFAULT_LAYER_VISIBILITY: LayerVisibility = {
  districts: true,
  stations: true,
  lines: true,
  labels: false,
  river: true
};

/**
 * MetroMap 메인 컴포넌트
 */
export const MetroMap: React.FC<MetroMapProps> = ({
  width,
  height,
  onStationClick,
  onStationHover,
  onGameStart,
  onStationDetail,
  initialVisibleLines = [1, 2, 3, 4],
  showDistricts = true,
  showLabels = false,
  interactive = true,
  theme = 'light',
  className
}) => {
  // 상태 관리
  const [viewport, setViewport] = useState<MapViewport>(DEFAULT_VIEWPORT);
  const [isLoading, setIsLoading] = useState(false);
  
  const [stationInteraction, setStationInteraction] = useState<StationInteractionState>({
    selectedStation: null,
    hoveredStation: null,
    focusedStation: null,
    highlightedStations: []
  });
  
  const [lineFilter, setLineFilter] = useState<LineFilterState>({
    ...DEFAULT_LINE_FILTER,
    visibleLines: initialVisibleLines
  });
  
  const [layerVisibility, setLayerVisibility] = useState<LayerVisibility>({
    ...DEFAULT_LAYER_VISIBILITY,
    districts: showDistricts,
    labels: showLabels
  });

  // 이벤트 핸들러들
  const handleStationClick = useCallback((station: Station, event: React.MouseEvent) => {
    if (!interactive) return;
    
    setStationInteraction(prev => ({
      ...prev,
      selectedStation: station
    }));
    
    onStationClick?.(station);
  }, [interactive, onStationClick]);

  const handleStationHover = useCallback((station: Station | null) => {
    if (!interactive) return;
    
    setStationInteraction(prev => ({
      ...prev,
      hoveredStation: station
    }));
    
    onStationHover?.(station);
  }, [interactive, onStationHover]);

  const handleLineToggle = useCallback((lineNumber: number) => {
    setLineFilter(prev => ({
      ...prev,
      visibleLines: prev.visibleLines.includes(lineNumber)
        ? prev.visibleLines.filter(l => l !== lineNumber)
        : [...prev.visibleLines, lineNumber]
    }));
  }, []);

  // 필터링된 데이터
  const filteredStations = useMemo(() => {
    return STATIONS.filter(station => 
      lineFilter.visibleLines.includes(station.line)
    );
  }, [lineFilter.visibleLines]);

  const filteredLines = useMemo(() => {
    return SUBWAY_LINES.filter(line => 
      lineFilter.visibleLines.includes(line.number)
    );
  }, [lineFilter.visibleLines]);

  // 통계 정보
  const stats = useMemo(() => ({
    totalStations: STATIONS.length,
    visibleStations: filteredStations.length,
    totalLines: SUBWAY_LINES.length,
    visibleLines: filteredLines.length,
    totalDistricts: ENRICHED_DISTRICTS.length
  }), [filteredStations.length, filteredLines.length]);

  return (
    <MapContainer
      width={width}
      height={height}
      className={className}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      {/* 로딩 오버레이 */}
      {isLoading && (
        <LoadingOverlay>
          <div className="spinner" />
        </LoadingOverlay>
      )}

      {/* 메인 SVG */}
      <SVGContainer
        viewBox="0 0 132.29166 119.0625"
        preserveAspectRatio="xMidYMid meet"
      >
        {/* 배경 */}
        <rect 
          width="100%" 
          height="100%" 
          fill={theme === 'dark' ? '#1f2937' : '#fafbfc'} 
        />
        
        {/* 구청 경계 */}
        {layerVisibility.districts && ENRICHED_DISTRICTS.map(district => (
          <path
            key={district.id}
            d={district.path}
            fill={district.fill}
            opacity={0.6}
            stroke="#ffffff"
            strokeWidth="0.5"
          />
        ))}
        
        {/* 지하철 노선 (임시 구현) */}
        {layerVisibility.lines && filteredLines.map(line => (
          <g key={`line-${line.number}`}>
            {line.connections.map((connection, index) => {
              const fromStation = STATIONS.find(s => s.id === connection.from);
              const toStation = STATIONS.find(s => s.id === connection.to);
              
              if (!fromStation || !toStation) return null;
              
              return (
                <line
                  key={`${line.number}-${index}`}
                  x1={fromStation.normalizedCoords.x}
                  y1={fromStation.normalizedCoords.y}
                  x2={toStation.normalizedCoords.x}
                  y2={toStation.normalizedCoords.y}
                  stroke={line.color}
                  strokeWidth="2"
                  opacity="0.8"
                />
              );
            })}
          </g>
        ))}
        
        {/* 지하철역 */}
        {layerVisibility.stations && filteredStations.map(station => {
          const isSelected = stationInteraction.selectedStation?.id === station.id;
          const isHovered = stationInteraction.hoveredStation?.id === station.id;
          const line = SUBWAY_LINES.find(l => l.number === station.line);
          
          return (
            <g key={station.id}>
              <circle
                cx={station.normalizedCoords.x}
                cy={station.normalizedCoords.y}
                r={isSelected || isHovered ? 4 : 3}
                fill={station.hasStory ? '#FFD93D' : '#ffffff'}
                stroke={line?.color || '#666666'}
                strokeWidth={isSelected || isHovered ? 3 : 2}
                style={{ cursor: interactive ? 'pointer' : 'default' }}
                onClick={(e) => handleStationClick(station, e)}
                onMouseEnter={() => handleStationHover(station)}
                onMouseLeave={() => handleStationHover(null)}
              />
              
              {/* 역명 라벨 */}
              {(layerVisibility.labels || isSelected || isHovered) && (
                <text
                  x={station.normalizedCoords.x}
                  y={station.normalizedCoords.y - 8}
                  textAnchor="middle"
                  fontSize="8"
                  fill="#374151"
                  fontWeight="600"
                  style={{ pointerEvents: 'none' }}
                >
                  {station.name}
                </text>
              )}
            </g>
          );
        })}
      </SVGContainer>

      {/* 정보 패널 */}
      <InfoPanel
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <h3>서울 지하철 노선도</h3>
        <p>
          지하철역을 클릭하여 상세 정보를 확인하거나 
          {onGameStart && ' 게임을 시작할 수 있습니다.'}
        </p>
      </InfoPanel>

      {/* 통계 패널 */}
      <StatsPanel>
        <div className="stat-item">
          <span className="label">표시 중:</span> {stats.visibleStations}/{stats.totalStations} 역
        </div>
        <div className="stat-item">
          <span className="label">노선:</span> {stats.visibleLines}/{stats.totalLines} 개
        </div>
        <div className="stat-item">
          <span className="label">구청:</span> {stats.totalDistricts} 개
        </div>
      </StatsPanel>
    </MapContainer>
  );
};

export default MetroMap;