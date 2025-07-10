import { useState, useEffect } from 'react';
import { apiErrorHandler } from '@/shared/utils/common/api';
import type { MetroApiResponse, UseMetroRealtimeReturn } from '../types/metroMapTypes';

export const useMetroRealtime = (intervalMs: number = 30000): UseMetroRealtimeReturn => {
  const [data, setData] = useState<MetroApiResponse['data'] | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await fetch('/api/metro/positions');
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const result: MetroApiResponse = await response.json();
      
      if (result.success && result.data) {
        setData(result.data);
      } else {
        const apiError = {
          response: {
            status: response.status,
            data: { message: result.message || '데이터를 불러올 수 없습니다.' }
          }
        };
        throw apiError;
      }
      
    } catch (err: unknown) {
      const errorInfo = apiErrorHandler.parseError(err);
      setError(errorInfo.message);
      
      console.error('Metro realtime data fetch error:', {
        code: errorInfo.code,
        message: errorInfo.message,
        details: errorInfo.details
      });
      
      if (errorInfo.code === 'NETWORK_ERROR') {
        console.log('Network error detected. Consider implementing retry logic.');
      }
      
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