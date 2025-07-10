import React from 'react';
import { SVG_CONFIG } from '@/shared/data/metro/stationsData';
import { SEOUL_DISTRICTS, HAN_RIVER } from '@/shared/data/metro/seoulDistrictData';
import { SVGContainer } from '../styles';
import type { MetroSVGProps } from '../../types/metroMapTypes';

export const MetroSVG: React.FC<MetroSVGProps> = ({
  showDistricts,
  visibleLines,
  lineConnections,
  visibleStations,
  clickedStations,
  processedRealtimeData,
  onStationClick,
}) => {
  return (
    <SVGContainer>
      <svg 
        viewBox={SVG_CONFIG.viewBox}
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* 구 경계 */}
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

        {/* 지하철역들 */}
        <g id="stations">
          {visibleStations.map(station => {
            const realtimeInfo = processedRealtimeData.filter(
              data => data.frontendStationId === station.id
            );
            const hasRealtimeData = realtimeInfo.length > 0;
            const isClicked = clickedStations.has(station.id);
            
            return (
              <g key={`station-${station.id}`}>
                {/* 열차 도착시 애니메이션 */}
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
                
                {isClicked && !hasRealtimeData && (
                  <circle
                    cx={station.x}
                    cy={station.y}
                    r="1.2"
                    fill="none"
                    stroke="#6366f1"
                    strokeWidth="0.5"
                    opacity="0.8"
                  />
                )}
                
                <circle
                  cx={station.x}
                  cy={station.y}
                  r="0.7"
                  fill={hasRealtimeData ? "#ffff00" : (isClicked ? "#6366f1" : "#2d3748")}
                  stroke="#ffffff"
                  strokeWidth="0.3"
                  style={{ 
                    cursor: 'pointer',
                    transition: 'fill 0.2s ease'
                  }}
                  onClick={() => onStationClick(station.id)}
                />
              </g>
            );
          })}
        </g>

        {/* 역명 라벨 */}
        <g id="station-labels">
          {visibleStations.map(station => {
            if (!clickedStations.has(station.id)) return null;
            if (!visibleLines.some(line => station.lines.includes(line))) return null;
            
            const realtimeInfo = processedRealtimeData.filter(
              data => data.frontendStationId === station.id
            );
            const hasRealtimeData = realtimeInfo.length > 0;
            
            return (
              <g key={`label-${station.id}`}>
                {/* 역명 라벨 */}
                <text
                  x={station.x}
                  y={station.y - 4}
                  fontSize="2.5"
                  fill={hasRealtimeData ? "#000000" : "#6366f1"}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  style={{ 
                    fontWeight: hasRealtimeData ? '700' : '600',
                    stroke: 'white',
                    strokeWidth: '1.0',
                    paintOrder: 'stroke fill',
                    fontFamily: 'system-ui, sans-serif',
                    pointerEvents: 'none'
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
  );
};