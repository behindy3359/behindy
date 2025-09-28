import styled from 'styled-components';
import { 
  FlexContainer,
  Badge,
  CommonStatusIndicator
} from '@/shared/styles/components';

// 컨트롤 패널 - FlexContainer 재사용
export const Controls = styled(FlexContainer).attrs({
  $direction: 'row' as const,
  $gap: 4 as const,
  $wrap: true,
  $align: 'center' as const,
})`
  margin-bottom: 16px;
  padding: 16px 0;
`;

// CheckboxItem - Badge 기반으로 단순화
export const CheckboxItem = styled.label<{ $color?: string }>`
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: ${({ theme }) => theme.typography.fontSize.xs};
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
  
  @media (max-width: 800px) {
    display: none;
  }
`;

// SVG 컨테이너
export const SVGContainer = styled.div`
  width: 100%;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  background: #fafbfc;
  overflow: hidden;
  
  svg {
    width: 100%;
    height: auto;
    max-width: 100%;
    display: block;
    
    /* 반응형 크기 조정 */
    @media (max-width: 1200px) {
      min-height: 500px;
    }
    
    @media (max-width: 768px) {
      min-height: 400px;
    }
    
    @media (max-width: 480px) {
      min-height: 300px;
    }
  }
`;

// 상태 표시 - CommonStatusIndicator 재사용
export const StatusIndicator = styled(CommonStatusIndicator).attrs({
  $status: 'live' as const,
  $size: 'sm' as const,
})`
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

// 통계 스타일들 - Badge 기반으로 단순화
export const TrainCountBadge = styled(Badge).attrs({
  $variant: 'warning' as const,
  $size: 'sm' as const,
})`
  font-size: 12px;
  color: #ff6b35 !important;
  background: rgba(255, 107, 53, 0.1) !important;
  border-color: rgba(255, 107, 53, 0.2) !important;
  margin-left: 4px;
`;

export const NoTrainBadge = styled(Badge).attrs({
  $variant: 'default' as const,
  $size: 'sm' as const,
})`
  font-size: 11px;
  color: #9ca3af !important;
  margin-left: 4px;
`;

export const ArrivalStationInfo = styled(Badge).attrs({
  $variant: 'warning' as const,
  $size: 'sm' as const,
})`
  font-size: 11px;
  color: #ff6b35 !important;
  margin-left: 4px;
`;

// 에러 텍스트
export const ErrorText = styled.span`
  color: #ef4444;
`;

// 실시간 상태
export const RealtimeStatus = styled.span`
  margin-left: 8px;
  font-weight: 600;
  color: #ff6b35;
`;