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

    // 실제 API 데이터인 경우
    if (dataSource === "API" && isRealtime && totalTrains > 0) {
      return {
        text: 'LIVE',
        className: 'live-indicator',
        color: '#ef4444'
      };
    }

    // 목업 데이터인 경우
    if (dataSource.includes("MOCK")) {
      return {
        text: 'TEST',
        className: 'test-indicator',
        color: '#f59e0b'
      };
    }

    // 운행 종료 (데이터는 있지만 열차가 없는 경우)
    if (totalTrains === 0) {
      return {
        text: 'CLOSED',
        className: 'closed-indicator',
        color: '#6b7280'
      };
    }

    // 기타 상황
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
        <MetroMap />
      </MetroMapContainer>
    </SectionContainer>
  );
};