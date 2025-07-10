import styled from 'styled-components';

// 컨트롤 패널
export const Controls = styled.div`
  display: flex;
  gap: 16px;
  margin-bottom: 16px;
  flex-wrap: wrap;
  align-items: center;
  padding: 16px 0;
`;

export const CheckboxItem = styled.label<{ $color?: string }>`
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 14px;
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

// 상태 표시
export const StatusIndicator = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
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

// 통계 스타일
export const TrainCountBadge = styled.span`
  fontSize: 12px;
  color: #ff6b35;
  fontWeight: 700;
  marginLeft: 4px;
  background: rgba(255, 107, 53, 0.1);
  padding: 2px 6px;
  borderRadius: 8px;
`;

export const NoTrainBadge = styled.span`
  fontSize: 11px;
  color: #9ca3af;
  fontWeight: 500;
  marginLeft: 4px;
`;

export const ArrivalStationInfo = styled.span`
  fontSize: 11px;
  color: #ff6b35;
  fontWeight: 500;
  marginLeft: 4px;
`;

export const ErrorText = styled.span`
  color: #ef4444;
`;

export const RealtimeStatus = styled.span`
  marginLeft: 8px;
  fontWeight: 600;
  color: #ff6b35;
`;