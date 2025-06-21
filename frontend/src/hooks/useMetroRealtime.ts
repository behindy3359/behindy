import { useState, useEffect, useCallback } from 'react';
import { api } from '@/config';

interface RealtimeTrainData {
  stationId: string;
  stationName: string;
  subwayLine: string;
  direction: string;
  trainCount?: number;
  lastUpdated: string;
}

interface MetroRealtimeResponse {
  success: boolean;
  data: {
    trains: RealtimeTrainData[];
    lastUpdated: string;
    totalTrains: number;
    dataSource: string;
    isRealtime: boolean;
  };
  message: string;
}

interface UseMetroRealtimeReturn {
  data: MetroRealtimeResponse['data'] | null;
  isLoading: boolean;
  error: string | null;
  lastUpdated: string | null;
  requestCount: number;
  refreshData: () => void;
}

export const useMetroRealtime = (intervalMs: number = 30000): UseMetroRealtimeReturn => {
  const [data, setData] = useState<MetroRealtimeResponse['data'] | null>(null);
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [requestCount, setRequestCount] = useState(0);

  const fetchData = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      console.log(`🚇 지하철 실시간 데이터 요청 #${requestCount + 1}`);
      
      const response = await api.get<MetroRealtimeResponse>('/metro/realtime/all');
      
      if (response.success && response.data) {
        // 데이터가 실제로 변경되었는지 확인
        const newLastUpdated = response.data.lastUpdated;
        if (newLastUpdated !== lastUpdated) {
          setData(response.data);
          setLastUpdated(newLastUpdated);
          console.log('✅ 새로운 지하철 데이터 업데이트:', {
            totalTrains: response.data.totalTrains,
            dataSource: response.data.dataSource,
            timestamp: newLastUpdated
          });
        } else {
          console.log('📡 데이터 변화 없음 (Redis 캐시)');
        }
      } else {
        setError(response.message || '데이터를 불러올 수 없습니다.');
      }
      
      setRequestCount(prev => prev + 1);
      
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : '알 수 없는 오류가 발생했습니다.';
      setError(`네트워크 오류: ${errorMessage}`);
      console.error('❌ 지하철 데이터 업데이트 실패:', err);
    } finally {
      setIsLoading(false);
    }
  }, [lastUpdated, requestCount]);

  // 수동 새로고침 함수
  const refreshData = useCallback(() => {
    console.log('🔄 수동 데이터 새로고침');
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    // 초기 로드
    fetchData();
    
    // 주기적 업데이트
    const interval = setInterval(fetchData, intervalMs);
    
    // 브라우저 탭 활성화 시 즉시 업데이트
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        console.log('👀 탭 활성화 - 즉시 업데이트');
        fetchData();
      }
    };
    
    // 온라인 상태 복구 시 즉시 업데이트
    const handleOnline = () => {
      console.log('🌐 네트워크 연결 복구 - 즉시 업데이트');
      fetchData();
    };
    
    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('online', handleOnline);
    
    return () => {
      clearInterval(interval);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('online', handleOnline);
    };
  }, [fetchData, intervalMs]);

  return {
    data,
    isLoading,
    error,
    lastUpdated,
    requestCount,
    refreshData
  };
};