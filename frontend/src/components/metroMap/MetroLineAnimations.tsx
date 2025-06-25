import React, { useEffect, useMemo } from 'react';
import { LINE_COLORS } from '@/data/metro/stationsData';
import { RealtimeStationData } from '@/data/metro/stationsData';

interface MetroLineAnimationsProps {
  realtimeData: RealtimeStationData[];
  visibleLines: number[];
  lineConnections: any[];
}

// 애니메이션 강도 계산
const calculateAnimationIntensity = (trainCount: number) => {
  if (trainCount === 0) return 'paused';
  if (trainCount <= 2) return '4s linear infinite';
  if (trainCount <= 5) return '2s linear infinite';
  return '1s linear infinite'; // 매우 활발
};

// 노선별 실시간 데이터 그룹화
const groupTrainsByLine = (realtimeData: RealtimeStationData[]) => {
  const grouped: Record<number, { up: number; down: number }> = {};
  
  realtimeData.forEach(train => {
    const line = train.lineNumber;
    if (!grouped[line]) {
      grouped[line] = { up: 0, down: 0 };
    }
    
    if (train.direction === 'up') {
      grouped[line].up += train.trainCount;
    } else if (train.direction === 'down') {
      grouped[line].down += train.trainCount;
    }
  });
  
  return grouped;
};

export const MetroLineAnimations: React.FC<MetroLineAnimationsProps> = ({
  realtimeData,
  visibleLines,
  lineConnections
}) => {
  const trainCounts = useMemo(() => groupTrainsByLine(realtimeData), [realtimeData]);

  // SVG 그라데이션 정의
  const renderGradientDefinitions = () => (
    <defs>
      {visibleLines.map(lineNumber => {
        const baseColor = LINE_COLORS[lineNumber as keyof typeof LINE_COLORS];
        const lightColor = adjustColorBrightness(baseColor, 60);
        
        return (
          <React.Fragment key={lineNumber}>
            {/* 상행선 그라데이션 */}
            <linearGradient
              id={`upwardGradient${lineNumber}`}
              x1="0%" y1="0%" x2="100%" y2="0%"
            >
              <stop offset="0%" stopColor="transparent" />
              <stop offset="25%" stopColor={lightColor} stopOpacity="0.3" />
              <stop offset="50%" stopColor={lightColor} stopOpacity="0.8" />
              <stop offset="75%" stopColor={lightColor} stopOpacity="0.3" />
              <stop offset="100%" stopColor="transparent" />
            </linearGradient>
            
            {/* 하행선 그라데이션 */}
            <linearGradient
              id={`downwardGradient${lineNumber}`}
              x1="100%" y1="0%" x2="0%" y2="0%"
            >
              <stop offset="0%" stopColor="transparent" />
              <stop offset="25%" stopColor={lightColor} stopOpacity="0.3" />
              <stop offset="50%" stopColor={lightColor} stopOpacity="0.8" />
              <stop offset="75%" stopColor={lightColor} stopOpacity="0.3" />
              <stop offset="100%" stopColor="transparent" />
            </linearGradient>
          </React.Fragment>
        );
      })}
    </defs>
  );

  // 애니메이션 적용된 노선 렌더링
  const renderAnimatedLines = () => {
    return lineConnections.map(connection => {
      const lineNumber = connection.lineNumber;
      const trainData = trainCounts[lineNumber] || { up: 0, down: 0 };
      
      return (
        <g key={`animated-line-${lineNumber}`} className="metro-line-animated-group">
          {connection.segments.map((segment: any, index: number) => (
            <React.Fragment key={`segment-${lineNumber}-${index}`}>
              {/* 기본 노선 (배경) */}
              <path
                d={segment.path}
                stroke={segment.color}
                strokeWidth="3"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                opacity="0.6"
              />
              
              {/* 상행선 애니메이션 */}
              <path
                d={segment.path}
                stroke={`url(#upwardGradient${lineNumber})`}
                strokeWidth="2"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                transform="translate(0, -1)"
                className={`line-upward line-${lineNumber}-upward`}
                style={{
                  animation: calculateAnimationIntensity(trainData.up),
                  filter: trainData.up > 0 ? 'brightness(1.2)' : 'brightness(0.7)'
                }}
              />
              
              {/* 하행선 애니메이션 */}
              <path
                d={segment.path}
                stroke={`url(#downwardGradient${lineNumber})`}
                strokeWidth="2"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                transform="translate(0, 1)"
                className={`line-downward line-${lineNumber}-downward`}
                style={{
                  animation: calculateAnimationIntensity(trainData.down),
                  animationDelay: '1.5s', // 상행선과 엇갈림
                  filter: trainData.down > 0 ? 'brightness(1.2)' : 'brightness(0.7)'
                }}
              />
            </React.Fragment>
          ))}
        </g>
      );
    });
  };

  // 실시간 데이터 변경 시 로깅
  useEffect(() => {
    if (Object.keys(trainCounts).length > 0) {
      console.log('🚇 노선별 열차 수 업데이트:', trainCounts);
      
      // 각 노선별 애니메이션 상태 로깅
      Object.entries(trainCounts).forEach(([line, counts]) => {
        console.log(`${line}호선: 상행 ${counts.up}대, 하행 ${counts.down}대`);
      });
    }
  }, [trainCounts]);

  return (
    <g id="metro-lines-animated">
      {renderGradientDefinitions()}
      {renderAnimatedLines()}
      
      {/* CSS 애니메이션 정의 */}
      <style jsx>{`
        @keyframes flowUpward {
          0% { 
            stroke-dasharray: 20 20;
            stroke-dashoffset: -40; 
          }
          100% { 
            stroke-dasharray: 20 20;
            stroke-dashoffset: 0; 
          }
        }
        
        @keyframes flowDownward {
          0% { 
            stroke-dasharray: 20 20;
            stroke-dashoffset: 0; 
          }
          100% { 
            stroke-dasharray: 20 20;
            stroke-dashoffset: -40; 
          }
        }
        
        .line-upward {
          animation-name: flowUpward;
          animation-timing-function: linear;
          animation-iteration-count: infinite;
        }
        
        .line-downward {
          animation-name: flowDownward;
          animation-timing-function: linear;
          animation-iteration-count: infinite;
        }
        
        .metro-line-animated-group:hover .line-upward,
        .metro-line-animated-group:hover .line-downward {
          animation-duration: 0.5s !important;
          filter: brightness(1.5) !important;
        }
        
        /* 야간 모드 지원 */
        @media (prefers-color-scheme: dark) {
          .line-upward,
          .line-downward {
            filter: brightness(0.8);
          }
        }
      `}</style>
    </g>
  );
};

// 색상 밝기 조절 유틸리티
const adjustColorBrightness = (hexColor: string, percent: number): string => {
  const num = parseInt(hexColor.replace('#', ''), 16);
  const amt = Math.round(2.55 * percent);
  const R = (num >> 16) + amt;
  const G = (num >> 8 & 0x00FF) + amt;
  const B = (num & 0x0000FF) + amt;
  
  return '#' + (0x1000000 + (R < 255 ? R < 1 ? 0 : R : 255) * 0x10000 +
    (G < 255 ? G < 1 ? 0 : G : 255) * 0x100 +
    (B < 255 ? B < 1 ? 0 : B : 255))
    .toString(16).slice(1);
};