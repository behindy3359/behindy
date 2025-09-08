import { useState, useCallback } from 'react';
import { toggleLineInArray } from '../utils/metroMapUtils';
import type { UseMetroStateReturn } from '../types/metroMapTypes';

export const useMetroState = (): UseMetroStateReturn => {
  const [visibleLines, setVisibleLines] = useState<number[]>([1, 2, 3, 4]);
  const [showDistricts, setShowDistricts] = useState(true);

  const handleLineToggle = useCallback((line: number) => {
    setVisibleLines(prev => toggleLineInArray(line, prev));
  }, []);

  return {
    visibleLines,
    showDistricts,
    setVisibleLines,
    setShowDistricts,
    handleLineToggle,
  };
};