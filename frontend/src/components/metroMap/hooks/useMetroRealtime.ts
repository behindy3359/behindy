import { useState, useEffect } from 'react';
import type { MetroApiResponse, UseMetroRealtimeReturn } from '../types';

// 실시간 데이터 훅
export const useMetroRealtime = (intervalMs: number = 30000): UseMetroRealtimeReturn => {
  const [data, setData] = useState<MetroApiResponse['data'] | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await fetch('/api/metro/positions');
      const result: MetroApiResponse = await response.json();
      
      if (result.success && result.data) {
        setData(result.data);
      } else {
        setError(result.message || '데이터를 불러올 수 없습니다.');
      }
      
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : '네트워크 오류';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, intervalMs);
    
    return () => clearInterval(interval);
  }, [intervalMs]);

  return { data, isLoading, error, refreshData: fetchData };
};