import React from 'react';
import { 
  Controls, 
  CheckboxGroup, 
  CheckboxItem, 
  StatusIndicator,
  TrainCountBadge,
  NoTrainBadge,
  ArrivalStationInfo,
  ErrorText,
  RealtimeStatus
} from '../styles';
import type { MetroControlsProps } from '../../types/metroMapTypes';

export const MetroControls: React.FC<MetroControlsProps> = ({
  lineStats,
  visibleLines,
  arrivalStationIds,
  areAllArrivalStationsShown,
  isLoading,
  error,
  processedRealtimeData,
  onLineToggle,
  onArrivalStationsToggle,
}) => {
  return (
    <Controls>
      <CheckboxGroup>
        {lineStats.map(({ line, color, trainCount }) => (
          <CheckboxItem key={line} $color={color}>
            <input
              type="checkbox"
              checked={visibleLines.includes(line)}
              onChange={() => onLineToggle(line)}
            />
            <div className="color-dot" />
            {line}호선
            {trainCount > 0 ? (
              <TrainCountBadge>
                🚇 {trainCount}대
              </TrainCountBadge>
            ) : (
              <NoTrainBadge>
                운행정보 없음
              </NoTrainBadge>
            )}
          </CheckboxItem>
        ))}
        
        <CheckboxItem>
          <input
            type="checkbox"
            checked={areAllArrivalStationsShown}
            onChange={onArrivalStationsToggle}
          />
          <span style={{ fontSize: '14px', fontWeight: '500' }}>
            🚇 도착 역 표시
          </span>
          {arrivalStationIds.length > 0 && (
            <ArrivalStationInfo>
              ({arrivalStationIds.length}개 역)
            </ArrivalStationInfo>
          )}
        </CheckboxItem>
      </CheckboxGroup>

      <StatusIndicator>
        {isLoading && <div className="status-dot" />}
        {error ? (
          <ErrorText>❌ 연결 오류</ErrorText>
        ) : (
          <span>
            🔴 실시간 업데이트 
            {processedRealtimeData.length > 0 && (
              <RealtimeStatus>
                (총 {processedRealtimeData.length}대 운행중)
              </RealtimeStatus>
            )}
          </span>
        )}
      </StatusIndicator>
    </Controls>
  );
};