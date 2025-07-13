import { useState, useCallback } from 'react';
import { 
  toggleStationInSet, 
  toggleArrivalStations, 
  toggleLineInArray 
} from '../utils/metroMapUtils';
import type { UseMetroStateReturn } from '../types/metroMapTypes';

export const useMetroState = (): UseMetroStateReturn => {
  const [visibleLines, setVisibleLines] = useState<number[]>([1, 2, 3, 4]);
  const [showDistricts, setShowDistricts] = useState(true);
  const [clickedStations, setClickedStations] = useState<Set<string>>(new Set());

  const handleLineToggle = useCallback((line: number) => {
    setVisibleLines(prev => toggleLineInArray(line, prev));
  }, []);

  const handleStationClick = useCallback((stationName: string) => {
    setClickedStations(prev => toggleStationInSet(stationName, prev));
  }, []);

  const handleArrivalStationsToggle = useCallback((
    arrivalStationNames: string[],
    areAllShown: boolean
  ) => {
    setClickedStations(prev => 
      toggleArrivalStations(arrivalStationNames, prev, areAllShown)
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