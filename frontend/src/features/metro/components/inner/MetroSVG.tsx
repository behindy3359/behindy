// frontend/src/features/metro/components/inner/MetroSVG.tsx

import React from 'react';
import { useRouter } from 'next/navigation';
import { SVG_CONFIG } from '@/features/metro/data/stationsData';
import { SEOUL_DISTRICTS, HAN_RIVER } from '@/features/metro/data/seoulDistrictData';
import { SVGContainer } from '../styles';
import { useAuthStore } from '@/shared/store/authStore';
import { useToast } from '@/shared/store/uiStore';
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
  const { isAuthenticated } = useAuthStore();
  const router = useRouter();
  const toast = useToast();

  // 🎯 단순화된 역 클릭 핸들러 - 버튼에서만 분기 처리
  const handleStationClick = async (stationName: string) => {
    console.log(`🚉 역 클릭: ${stationName}, 로그인 상태: ${isAuthenticated()}`);
    
    if (!isAuthenticated()) {
      // 🔓 비로그인: 역 이름 표시만
      console.log('🔓 비로그인 상태 - 역 이름 표시');
      onStationClick(stationName);
      return;
    }

    // 🔐 로그인: 바로 게임 페이지로 이동
    try {
      const station = visibleStations.find(s => s.id === stationName);
      if (!station) {
        toast.error('역 정보를 찾을 수 없습니다');
        return;
      }

      const lineNumber = station.lines[0];
      console.log(`🎮 게임 진입: ${stationName}역 ${lineNumber}호선`);
      
      const gameUrl = `/game?station=${encodeURIComponent(stationName)}&line=${lineNumber}`;
      await router.push(gameUrl);
      
    } catch (error) {
      console.error('❌ 게임 진입 실패:', error);
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

        {/* 🎯 간소화된 역 아이콘들 */}
        <g id="stations">
          {visibleStations.map(station => {
            const realtimeInfo = processedRealtimeData.filter(
              data => data.stationName === station.id
            );
            const hasRealtimeData = realtimeInfo.length > 0;
            const isClicked = clickedStations.has(station.id);
            
            return (
              <g key={`station-${station.id}`}>
                {/* 실시간 열차 도착 정보 표시 (기존 유지) */}
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
                  </circle>
                )}
                
                {/* 클릭된 역 표시 (비로그인 상태에서만) */}
                {isClicked && !hasRealtimeData && !isAuthenticated() && (
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
                
                {/* 🎯 단순화된 역 메인 아이콘 - 로그인 상태 관계없이 동일 */}
                <circle
                  cx={station.x}
                  cy={station.y}
                  r="0.7"
                  fill={
                    hasRealtimeData 
                      ? "#ffff00" 
                      : isClicked && !isAuthenticated()
                        ? "#6366f1" 
                        : "#2d3748"
                  }
                  stroke="#ffffff"
                  strokeWidth="0.3"
                  style={{ 
                    cursor: 'pointer',
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleStationClick(station.id);
                  }}
                />
              </g>
            );
          })}
        </g>

        {/* 역 이름 라벨 (비로그인 상태에서 클릭된 역만) */}
        <g id="station-labels">
          {visibleStations.map(station => {
            // 비로그인 상태에서 클릭된 역만 라벨 표시
            if (isAuthenticated() || !clickedStations.has(station.id)) return null;
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