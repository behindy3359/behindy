export interface Station {
  id: string;
  name: string;
  x: number;
  y: number;
  hasStory: boolean;
}

export interface SubwayLine {
  color: string;
  name: string;
}

export interface Connection {
  from: Station;
  to: Station;
}

export interface SubwayMapProps {
  onStationSelect?: (station: Station) => void;
  onGameStart?: (stationId: string) => void;
  initialSelectedLines?: number[];
  showLabels?: boolean;
}