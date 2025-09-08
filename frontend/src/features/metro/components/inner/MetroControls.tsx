import React from 'react';
import { 
  Controls,
  CheckboxItem, 
  TrainCountBadge,
  NoTrainBadge,
} from '../styles';
import type { MetroControlsProps } from '../../types/metroMapTypes';
import {CommonGroup} from '@/shared/styles/commonStyles';

export const MetroControls: React.FC<MetroControlsProps> = ({
  lineStats,
  visibleLines,
  isLoading,
  error,
  onLineToggle,
}) => {
  return (
    <Controls>
      <CommonGroup>
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
      </CommonGroup>
    </Controls>
  );
};