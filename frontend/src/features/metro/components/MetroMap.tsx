import React, { useMemo } from 'react';
import { getVisibleLineConnections } from '@/features/metro/data/metroLineConnections';
import { MetroControls } from './inner/MetroControls';
import { MetroSVG } from './inner/MetroSVG';
import { useMetroRealtime } from '../hooks/useMetroRealtime';
import { useMetroState } from '../hooks/useMetroState';
import {
  processRealtimeData,
  getVisibleStations,
  calculateLineStats,
} from '../utils/metroMapUtils';
import { BasicFullWidthContainer } from '@/shared/styles/commonContainers';

export const MetroMap: React.FC = () => {
  const {
    visibleLines,
    showDistricts,
    handleLineToggle,
  } = useMetroState();

  const { data: realtimeData, isLoading, error } = useMetroRealtime(30000);

  const processedRealtimeData = useMemo(() => {
    return processRealtimeData(realtimeData);
  }, [realtimeData]);

  const lineConnections = useMemo(() => {
    return getVisibleLineConnections(visibleLines);
  }, [visibleLines]);

  const visibleStations = useMemo(() => {
    return getVisibleStations(visibleLines);
  }, [visibleLines]);

  const lineStats = useMemo(() => {
    return calculateLineStats(visibleLines, processedRealtimeData);
  }, [visibleLines, processedRealtimeData]);

  return (
    <BasicFullWidthContainer>
      <MetroControls
        lineStats={lineStats}
        visibleLines={visibleLines}
        isLoading={isLoading}
        error={error}
        processedRealtimeData={processedRealtimeData}
        onLineToggle={handleLineToggle}
      />
      
      <MetroSVG
        showDistricts={showDistricts}
        visibleLines={visibleLines}
        lineConnections={lineConnections}
        visibleStations={visibleStations}
        processedRealtimeData={processedRealtimeData}
      />
    </BasicFullWidthContainer>
  );
};