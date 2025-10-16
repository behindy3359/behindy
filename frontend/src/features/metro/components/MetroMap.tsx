import React, { useMemo } from 'react';
import { getVisibleLineConnections } from '@/features/metro/data/metroLineConnections';
import { MetroControls } from './inner/MetroControls';
import { MetroSVG } from './inner/MetroSVG';
import { useMetroState } from '../hooks/useMetroState';
import {
  processRealtimeData,
  getVisibleStations,
  calculateLineStats,
} from '../utils/metroMapUtils';
import { BasicFullWidthContainer } from '@/shared/styles/commonContainers';
import type { MetroApiResponse } from '../types/metroMapTypes';

interface MetroMapProps {
  realtimeData: MetroApiResponse['data'] | null;
  isLoading: boolean;
  error: string | null;
}

export const MetroMap: React.FC<MetroMapProps> = ({ realtimeData, isLoading, error }) => {
  const {
    visibleLines,
    showDistricts,
    handleLineToggle,
  } = useMetroState();

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