import { useState, useEffect } from 'react';
import { api } from '@/config/axiosConfig';
import { VisitedStation } from '../types/gameTypes';

export const useVisitedStations = () => {
  const [visitedStations, setVisitedStations] = useState<VisitedStation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchVisitedStations = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const response = await api.get<VisitedStation[]>('/characters/visited-stations');
        setVisitedStations(response || []);
      } catch (err: any) {
        console.error('방문한 역 조회 실패:', err);
        setError(err.response?.data?.message || '방문한 역을 불러올 수 없습니다');
        setVisitedStations([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchVisitedStations();
  }, []);

  return {
    visitedStations,
    isLoading,
    error,
  };
};
