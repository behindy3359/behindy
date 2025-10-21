import React from 'react';
import { Train } from 'lucide-react';
import { MetroMap } from '@/features/metro/components/MetroMap';
import { useMetroRealtime } from '@/features/metro/hooks/useMetroRealtime';
import { SectionContainer } from '@/shared/styles/commonContainers';
import { MetroHeader, MetroMapContainer } from '../styles';

export const MetroMapSection: React.FC = () => {
  const { data: realtimeData, isLoading, error } = useMetroRealtime(30000);

  // 실시간 상태 판단 함수
  const getStatusInfo = () => {
    if (isLoading) {
      return {
        text: 'LOADING',
        className: 'loading-indicator',
        color: '#6b7280'
      };
    }

    if (error) {
      return {
        text: 'ERROR',
        className: 'error-indicator',
        color: '#ef4444'
      };
    }

    if (!realtimeData) {
      return {
        text: 'NO DATA',
        className: 'no-data-indicator',
        color: '#6b7280'
      };
    }

    const { dataSource, isRealtime, totalTrains } = realtimeData;

    // Mock 데이터인 경우 (API 제한 또는 운행 종료 시 Fallback)
    if (dataSource.includes("MOCK")) {
      return {
        text: 'TEST',
        className: 'test-indicator',
        color: '#f59e0b'
      };
    }

    // 실제 API 데이터인 경우
    if (dataSource === "API" && isRealtime && totalTrains > 0) {
      return {
        text: 'LIVE',
        className: 'live-indicator',
        color: '#ef4444'
      };
    }

    // 기타 상황 (API 데이터지만 실시간이 아니거나 제한적인 경우)
    return {
      text: 'LIMITED',
      className: 'limited-indicator',
      color: '#f59e0b'
    };
  };

  const statusInfo = getStatusInfo();

  return (
    <SectionContainer>
      <MetroHeader>
        <h2>
          <Train size={24} />
          실시간 지하철 노선도
        </h2>
        <div className={statusInfo.className} style={{ color: statusInfo.color }}>
          {statusInfo.text}
        </div>
      </MetroHeader>
      
      <MetroMapContainer>
        <MetroMap
          realtimeData={realtimeData}
          isLoading={isLoading}
          error={error}
        />
      </MetroMapContainer>
    </SectionContainer>
  );
};