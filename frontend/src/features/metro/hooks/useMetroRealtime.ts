import { useState, useEffect } from 'react';
import { apiErrorHandler } from '@/shared/utils/common/api';
import { generateMockMetroData, shouldUseMockData } from '../utils/mockMetroData';
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
        // API 데이터가 있지만 열차가 없거나 문제가 있는 경우 Mock 데이터 사용
        if (shouldUseMockData(result.data, null)) {
          console.info('Metro API returned no trains, using mock data fallback');
          const mockData = generateMockMetroData([1, 2, 3, 4]);
          setData(mockData);
        } else {
          setData(result.data);
        }
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

      console.error('Metro realtime data fetch error, using mock data fallback:', {
        code: errorInfo.code,
        message: errorInfo.message,
        details: errorInfo.details
      });

      // 에러 발생 시 Mock 데이터 사용
      const mockData = generateMockMetroData([1, 2, 3, 4]);
      setData(mockData);
      setError(null); // Mock 데이터 사용 시 에러 제거

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