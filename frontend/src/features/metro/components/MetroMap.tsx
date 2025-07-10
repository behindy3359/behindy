import React, { useMemo } from 'react';
import { getVisibleLineConnections } from '@/data/metro/metroLineConnections';
import { MapContainer } from './styles';
import { MetroControls } from './inner/MetroControls';
import { MetroSVG } from './inner/MetroSVG';
import { useMetroRealtime } from '../hooks/useMetroRealtime';
import { useMetroState } from '../hooks/useMetroState';
import {
  processRealtimeData,
  getArrivalStationIds,
  areAllArrivalStationsShown,
  getVisibleStations,
  calculateLineStats,
} from '../utils/metroMapUtils';

export const MetroMap: React.FC = () => {
  // 상태 관리 훅들
  const {
    visibleLines,
    showDistricts,
    clickedStations,
    handleLineToggle,
    handleStationClick,
    handleArrivalStationsToggle,
  } = useMetroState();

  // 실시간 데이터 훅
  const { data: realtimeData, isLoading, error } = useMetroRealtime(30000);

  // 실시간 데이터 처리
  const processedRealtimeData = useMemo(() => {
    return processRealtimeData(realtimeData);
  }, [realtimeData]);

  // 현재 도착 역들의 ID 목록
  const arrivalStationIds = useMemo(() => {
    return getArrivalStationIds(processedRealtimeData);
  }, [processedRealtimeData]);

  // 도착 역들이 모두 표시되어 있는지 확인
  const areAllArrivalStationsShownn = useMemo(() => {
    return areAllArrivalStationsShown(arrivalStationIds, clickedStations);
  }, [arrivalStationIds, clickedStations]);

  // 노선 연결 데이터
  const lineConnections = useMemo(() => {
    return getVisibleLineConnections(visibleLines);
  }, [visibleLines]);

  // 표시할 역들
  const visibleStations = useMemo(() => {
    return getVisibleStations(visibleLines);
  }, [visibleLines]);

  // 노선별 통계
  const lineStats = useMemo(() => {
    return calculateLineStats(visibleLines, processedRealtimeData);
  }, [visibleLines, processedRealtimeData]);

  // 도착 역 일괄 토글 핸들러
  const handleArrivalStationsToggleWrapper = () => {
    handleArrivalStationsToggle(arrivalStationIds, areAllArrivalStationsShownn);
  };

  return (
    <MapContainer>
      <MetroControls
        lineStats={lineStats}
        visibleLines={visibleLines}
        clickedStations={clickedStations}
        arrivalStationIds={arrivalStationIds}
        areAllArrivalStationsShown={areAllArrivalStationsShownn}
        isLoading={isLoading}
        error={error}
        processedRealtimeData={processedRealtimeData}
        onLineToggle={handleLineToggle}
        onArrivalStationsToggle={handleArrivalStationsToggleWrapper}
      />
      
      <MetroSVG
        showDistricts={showDistricts}
        visibleLines={visibleLines}
        lineConnections={lineConnections}
        visibleStations={visibleStations}
        clickedStations={clickedStations}
        processedRealtimeData={processedRealtimeData}
        onStationClick={handleStationClick}
      />
    </MapContainer>
  );
};