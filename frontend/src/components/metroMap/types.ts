import { type Station } from '@/data/metro/stationsData';

// 백엔드 API 타입
export interface MetroApiResponse {
  success: boolean;
  message: string;
  data: {
    positions: Array<{
      trainId: string;
      lineNumber: number;
      stationId: string;
      stationName: string;
      direction: 'up' | 'down';
      lastUpdated: string;
      dataSource: string;
      isRealtime: boolean;
      fresh: boolean;
    }>;
    totalTrains: number;
    lineStatistics: Record<string, number>;
    lastUpdated: string;
    dataSource: string;
    systemStatus: string;
    isRealtime: boolean;
  };
}

// 처리된 실시간 데이터 타입
export interface ProcessedTrainData {
  frontendStationId: number;
  stationName: string;
  lineNumber: number;
  direction: 'up' | 'down';
  trainCount: number;
  lastUpdated: Date;
  trainId: string;
}

// 노선 통계 타입
export interface LineStats {
  line: number;
  color: string;
  totalStations: number;
  trainCount: number;
  visible: boolean;
}

// 노선 연결 타입
export interface LineConnection {
  lineNumber: number;
  segments: Array<{
    path: string;
    color: string;
  }>;
}

// 실시간 데이터 훅 반환 타입
export interface UseMetroRealtimeReturn {
  data: MetroApiResponse['data'] | null;
  isLoading: boolean;
  error: string | null;
  refreshData: () => void;
}

// 상태 관리 훅 반환 타입
export interface UseMetroStateReturn {
  visibleLines: number[];
  showDistricts: boolean;
  clickedStations: Set<number>;
  setVisibleLines: React.Dispatch<React.SetStateAction<number[]>>;
  setShowDistricts: React.Dispatch<React.SetStateAction<boolean>>;
  setClickedStations: React.Dispatch<React.SetStateAction<Set<number>>>;
  handleLineToggle: (line: number) => void;
  handleStationClick: (stationId: number) => void;
  handleArrivalStationsToggle: (arrivalStationIds: number[], areAllShown: boolean) => void;
}

// 컴포넌트 Props 타입들
export interface MetroControlsProps {
  lineStats: LineStats[];
  visibleLines: number[];
  clickedStations: Set<number>;
  arrivalStationIds: number[];
  areAllArrivalStationsShown: boolean;
  isLoading: boolean;
  error: string | null;
  processedRealtimeData: ProcessedTrainData[];
  onLineToggle: (line: number) => void;
  onArrivalStationsToggle: () => void;
}

export interface MetroSVGProps {
  showDistricts: boolean;
  visibleLines: number[];
  lineConnections: LineConnection[];
  visibleStations: Station[];
  clickedStations: Set<number>;
  processedRealtimeData: ProcessedTrainData[];
  onStationClick: (stationId: number) => void;
}

export interface MetroStationsProps {
  visibleStations: Station[];
  clickedStations: Set<number>;
  processedRealtimeData: ProcessedTrainData[];
  visibleLines: number[];
  onStationClick: (stationId: number) => void;
}

export interface MetroLinesProps {
  lineConnections: LineConnection[];
}

export interface MetroDistrictsProps {
  showDistricts: boolean;
}