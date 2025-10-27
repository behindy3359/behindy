import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { SVG_CONFIG } from '@/features/metro/data/stationsData';
import { SEOUL_DISTRICTS, HAN_RIVER } from '@/features/metro/data/seoulDistrictData';
import { SVGContainer } from '../styles';
import { useAuthStore } from '@/shared/store/authStore';
import { useToast } from '@/shared/store/uiStore';
import type { MetroSVGProps } from '../../types/metroMapTypes';

// SVG 삼각형 화살표 경로 생성 함수
const createUpTriangle = (cx: number, cy: number, size: number): string => {
  const halfBase = size * 0.6;
  const height = size * 0.8;
  return `M ${cx},${cy - height} L ${cx + halfBase},${cy + height/2} L ${cx - halfBase},${cy + height/2} Z`;
};

const createDownTriangle = (cx: number, cy: number, size: number): string => {
  const halfBase = size * 0.6;
  const height = size * 0.8;
  return `M ${cx},${cy + height} L ${cx - halfBase},${cy - height/2} L ${cx + halfBase},${cy - height/2} Z`;
};

export const MetroSVG: React.FC<MetroSVGProps> = ({
  showDistricts,
  visibleLines,
  lineConnections,
  visibleStations,
  processedRealtimeData,
}) => {
  const { isAuthenticated } = useAuthStore();
  const router = useRouter();
  const toast = useToast();
  const [hoveredStation, setHoveredStation] = useState<string | null>(null);

  // 역 클릭 핸들러 - 로그인 시에만 게임 진입
  const handleStationClick = async (stationName: string) => {
    if (!isAuthenticated()) {
      // 비로그인: 아무 동작 안 함
      return;
    }

    // 로그인: 바로 게임 페이지로 이동
    try {
      const station = visibleStations.find(s => s.id === stationName);
      if (!station) {
        toast.error('역 정보를 찾을 수 없습니다');
        return;
      }

      const lineNumber = station.lines[0];

      const gameUrl = `/game?station=${encodeURIComponent(stationName)}&line=${lineNumber}`;
      await router.push(gameUrl);

    } catch (error) {
      console.error('Game entry failed:', error);
      toast.error('게임 진입에 실패했습니다');
    }
  };

  return (
    <SVGContainer>
      <svg 
        viewBox={SVG_CONFIG.viewBox}
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* 서울 구역 표시 */}
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

        {/* 한강 표시 */}
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

        {/* 역 아이콘들 */}
        <g id="stations">
          {visibleStations.map(station => {
            const realtimeInfo = processedRealtimeData.filter(
              data => data.stationName === station.id
            );

            // 상행/하행 열차 분리
            const upTrains = realtimeInfo.filter(t => t.direction === 'up');
            const downTrains = realtimeInfo.filter(t => t.direction === 'down');
            const hasRealtimeData = realtimeInfo.length > 0;
            const isHovered = hoveredStation === station.id;

            // 삼각형 크기
            const triangleSize = 1.8;
            const baseRadius = 0.7;

            return (
              <g key={`station-${station.id}`}>
                {/* 상행 열차 펄스 애니메이션 */}
                {upTrains.length > 0 && (
                  <circle
                    cx={station.x - 0.3}
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
                  </circle>
                )}

                {/* 하행 열차 펄스 애니메이션 */}
                {downTrains.length > 0 && (
                  <circle
                    cx={station.x + 0.3}
                    cy={station.y}
                    r="1.5"
                    fill="none"
                    stroke="#ff9500"
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
                  </circle>
                )}

                {/* 호버 시 하이라이트 */}
                {isHovered && (
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

                {/* 열차가 있을 때: 방향별 삼각형 화살표 표시 */}
                {hasRealtimeData ? (
                  <>
                    {/* 상행 열차 (위쪽 삼각형 ▲ - 노란색) */}
                    {upTrains.length > 0 && (
                      <path
                        d={createUpTriangle(station.x, station.y, triangleSize)}
                        fill="#ffff00"
                        stroke="#ffffff"
                        strokeWidth="0.3"
                        style={{
                          cursor: isAuthenticated() ? 'pointer' : 'default',
                        }}
                        onMouseEnter={() => setHoveredStation(station.id)}
                        onMouseLeave={() => setHoveredStation(null)}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleStationClick(station.id);
                        }}
                      />
                    )}

                    {/* 하행 열차 (아래쪽 삼각형 ▼ - 주황색) */}
                    {downTrains.length > 0 && (
                      <path
                        d={createDownTriangle(station.x, station.y, triangleSize)}
                        fill="#ff9500"
                        stroke="#ffffff"
                        strokeWidth="0.3"
                        style={{
                          cursor: isAuthenticated() ? 'pointer' : 'default',
                        }}
                        onMouseEnter={() => setHoveredStation(station.id)}
                        onMouseLeave={() => setHoveredStation(null)}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleStationClick(station.id);
                        }}
                      />
                    )}
                  </>
                ) : (
                  /* 열차가 없을 때: 기본 원 */
                  <circle
                    cx={station.x}
                    cy={station.y}
                    r={baseRadius}
                    fill={isHovered ? "#6366f1" : "#2d3748"}
                    stroke="#ffffff"
                    strokeWidth="0.3"
                    style={{
                      cursor: isAuthenticated() ? 'pointer' : 'default',
                    }}
                    onMouseEnter={() => setHoveredStation(station.id)}
                    onMouseLeave={() => setHoveredStation(null)}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleStationClick(station.id);
                    }}
                  />
                )}
              </g>
            );
          })}
        </g>

        {/* 호버된 역 라벨 표시 */}
        <g id="station-labels">
          {visibleStations.map(station => {
            if (hoveredStation !== station.id) return null;
            if (!visibleLines.some(line => station.lines.includes(line))) return null;
            
            const realtimeInfo = processedRealtimeData.filter(
              data => data.stationName === station.id
            );
            const hasRealtimeData = realtimeInfo.length > 0;
            
            return (
              <g key={`label-${station.id}`}>
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
                  {station.id}
                </text>
              </g>
            );
          })}
        </g>
      </svg>
    </SVGContainer>
  );
};