import React from 'react';
import styled from 'styled-components';
import { MapPin, Users, Clock, Navigation, Train } from 'lucide-react';

// 지하철 노선 정보
const SUBWAY_LINES = {
  1: { color: '#0052A4', name: '1호선' },
  2: { color: '#00A84D', name: '2호선' },
  3: { color: '#EF7C1C', name: '3호선' },
  4: { color: '#00A5DE', name: '4호선' }
};

export interface Station {
  id: string;
  name: string;
  x: number;
  y: number;
  hasStory: boolean;
  line?: number;
  lines?: number[]; // 환승역을 위한 여러 노선
}

interface StationInfoProps {
  station: Station | null;
  onGameStart?: (stationId: string) => void;
  onStationDetail?: (stationId: string) => void;
  onClose?: () => void;
  className?: string;
}

const InfoContainer = styled.div`
  background: white;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
  border-left: 4px solid #667eea;
  position: relative;
`;

const InfoContent = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
`;

const StationIcon = styled.div`
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 700;
  flex-shrink: 0;
`;

const StationDetails = styled.div`
  flex: 1;
  min-width: 0;
`;

const StationName = styled.h3`
  font-size: 18px;
  font-weight: 700;
  color: #333;
  margin: 0 0 8px 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const LineContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
`;

const LineBadge = styled.div<{ $color: string }>`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 4px 8px;
  border-radius: 12px;
  background: ${({ $color }) => $color};
  color: white;
  font-size: 12px;
  font-weight: 600;
`;

const TransferBadge = styled.span`
  font-size: 12px;
  color: #667eea;
  font-weight: 600;
  background: #f0f4ff;
  padding: 2px 8px;
  border-radius: 999px;
`;

const StoryStatus = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  color: #666;
  
  svg {
    flex-shrink: 0;
  }
`;

const AdditionalInfo = styled.div`
  margin-top: 8px;
  font-size: 12px;
  color: #999;
  
  > div {
    display: flex;
    align-items: center;
    gap: 16px;
  }
`;

const ActionButtons = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  flex-shrink: 0;
`;

const GameStartButton = styled.button<{ $hasStory: boolean }>`
  padding: 8px 16px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  border: none;
  cursor: ${({ $hasStory }) => $hasStory ? 'pointer' : 'not-allowed'};
  min-width: 80px;
  transition: all 0.2s ease;
  
  ${({ $hasStory }) => $hasStory ? `
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    
    &:hover {
      transform: scale(1.05);
      box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
    }
    
    &:focus {
      outline: none;
      box-shadow: 0 0 0 2px #667eea;
    }
  ` : `
    background: #f3f4f6;
    color: #9ca3af;
  `}
`;

const DetailButton = styled.button`
  padding: 8px 16px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  background: #f8f9fa;
  color: #667eea;
  border: 1px solid #e9ecef;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 4px;
  justify-content: center;
  
  &:hover {
    background: #e9ecef;
    transform: scale(1.05);
  }
  
  &:focus {
    outline: none;
    box-shadow: 0 0 0 2px #667eea;
  }
`;

const CloseButton = styled.button`
  position: absolute;
  top: 12px;
  right: 12px;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: #f3f4f6;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #6b7280;
  transition: all 0.2s ease;
  
  &:hover {
    background: #e5e7eb;
    color: #374151;
  }
`;

export const StationInfo: React.FC<StationInfoProps> = ({
  station,
  onGameStart,
  onStationDetail,
  onClose,
  className = ''
}) => {
  if (!station) return null;

  // 역이 속한 모든 노선 찾기
  const stationLines = station.lines || (station.line ? [station.line] : []);
  
  const handleGameStart = () => {
    if (station.hasStory && onGameStart) {
      onGameStart(station.id);
    }
  };

  const handleStationDetail = () => {
    if (onStationDetail) {
      onStationDetail(station.id);
    }
  };

  return (
    <InfoContainer className={className}>
      <InfoContent>
        {/* 역 아이콘 */}
        <StationIcon>
          <MapPin size={24} />
        </StationIcon>
        
        {/* 역 정보 */}
        <StationDetails>
          <StationName>{station.name}</StationName>
          
          {/* 노선 배지들 */}
          <LineContainer>
            {stationLines.map((lineNum) => {
              const lineInfo = SUBWAY_LINES[lineNum as keyof typeof SUBWAY_LINES];
              if (!lineInfo) return null;
              
              return (
                <LineBadge key={lineNum} $color={lineInfo.color}>
                  <Train size={12} />
                  {lineInfo.name}
                </LineBadge>
              );
            })}
            
            {/* 환승역 표시 */}
            {stationLines.length > 1 && (
              <TransferBadge>환승역</TransferBadge>
            )}
          </LineContainer>
          
          {/* 스토리 상태 */}
          <StoryStatus>
            {station.hasStory ? (
              <>
                <Users size={16} style={{ color: '#FFD93D' }} />
                <span>이 역에서 모험을 시작할 수 있습니다</span>
              </>
            ) : (
              <>
                <Clock size={16} style={{ color: '#9ca3af' }} />
                <span>스토리 준비 중입니다</span>
              </>
            )}
          </StoryStatus>
          
          {/* 추가 정보 */}
          <AdditionalInfo>
            <div>
              <span>역 ID: {station.id}</span>
              <span>좌표: ({Math.round(station.x)}, {Math.round(station.y)})</span>
            </div>
          </AdditionalInfo>
        </StationDetails>
        
        {/* 액션 버튼들 */}
        <ActionButtons>
          <GameStartButton
            onClick={handleGameStart}
            $hasStory={station.hasStory}
            disabled={!station.hasStory}
            title={station.hasStory ? '게임을 시작합니다' : '아직 스토리가 준비되지 않았습니다'}
          >
            {station.hasStory ? '게임 시작' : '준비 중'}
          </GameStartButton>
          
          <DetailButton 
            onClick={handleStationDetail}
            title="역 상세 정보를 확인합니다"
          >
            <Navigation size={14} />
            역 정보
          </DetailButton>
        </ActionButtons>
      </InfoContent>
      
      {/* 닫기 버튼 */}
      {onClose && (
        <CloseButton
          onClick={onClose}
          title="정보 패널 닫기"
        >
          ×
        </CloseButton>
      )}
    </InfoContainer>
  );
};

export default StationInfo;