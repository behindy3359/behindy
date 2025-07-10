import { useState, useCallback } from 'react';
import { 
  toggleStationInSet, 
  toggleArrivalStations, 
  toggleLineInArray 
} from '../utils/metroMapUtils';
import type { UseMetroStateReturn } from '../types/metroMapTypes';

// 상태 관리 훅
export const useMetroState = (): UseMetroStateReturn => {
  const [visibleLines, setVisibleLines] = useState<number[]>([1, 2, 3, 4]);
  const [showDistricts, setShowDistricts] = useState(true);
  const [clickedStations, setClickedStations] = useState<Set<number>>(new Set());

  const handleLineToggle = useCallback((line: number) => {
    setVisibleLines(prev => toggleLineInArray(line, prev));
  }, []);

  const handleStationClick = useCallback((stationId: number) => {
    setClickedStations(prev => toggleStationInSet(stationId, prev));
  }, []);

  const handleArrivalStationsToggle = useCallback((
    arrivalStationIds: number[], 
    areAllShown: boolean
  ) => {
    setClickedStations(prev => 
      toggleArrivalStations(arrivalStationIds, prev, areAllShown)
    );
  }, []);

  return {
    visibleLines,
    showDistricts,
    clickedStations,
    setVisibleLines,
    setShowDistricts,
    setClickedStations,
    handleLineToggle,
    handleStationClick,
    handleArrivalStationsToggle,
  };
};