import React, { useMemo } from 'react';
import { getVisibleLineConnections } from '@/features/metro/data/metroLineConnections';
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
import { BasicFullWidthContainer } from '@/shared/styles/commonContainers';

export const MetroMap: React.FC = () => {
  const {
    visibleLines,
    showDistricts,
    clickedStations,
    handleLineToggle,
    handleStationClick,
    handleArrivalStationsToggle,
  } = useMetroState();

  const { data: realtimeData, isLoading, error } = useMetroRealtime(30000);

  const processedRealtimeData = useMemo(() => {
    return processRealtimeData(realtimeData);
  }, [realtimeData]);

  const arrivalStationNames = useMemo(() => {
    return getArrivalStationIds(processedRealtimeData);
  }, [processedRealtimeData]);

  const areAllArrivalStationsShownn = useMemo(() => {
    return areAllArrivalStationsShown(arrivalStationNames, clickedStations);
  }, [arrivalStationNames, clickedStations]);

  const lineConnections = useMemo(() => {
    return getVisibleLineConnections(visibleLines);
  }, [visibleLines]);

  const visibleStations = useMemo(() => {
    return getVisibleStations(visibleLines);
  }, [visibleLines]);

  const lineStats = useMemo(() => {
    return calculateLineStats(visibleLines, processedRealtimeData);
  }, [visibleLines, processedRealtimeData]);

  const handleArrivalStationsToggleWrapper = () => {
    handleArrivalStationsToggle(arrivalStationNames, areAllArrivalStationsShownn);
  };

  return (
    <BasicFullWidthContainer>
      <MetroControls
        lineStats={lineStats}
        visibleLines={visibleLines}
        clickedStations={clickedStations}
        arrivalStationIds={arrivalStationNames}
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
    </BasicFullWidthContainer>
  );
};