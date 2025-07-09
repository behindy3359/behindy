import React from 'react';
import { Train } from 'lucide-react';
import { RealtimeMetroMap } from '@/components/metroMap/RealtimeMetroMap';
import { SectionContainer } from '@/styles/commonStyles';
import { MetroHeader, MetroMapContainer } from '../styles';

export const MetroMapSection: React.FC = () => {
  return (
    <SectionContainer>
      <MetroHeader>
        <h2>
          <Train size={24} />
          실시간 지하철 노선도
        </h2>
        <div className="live-indicator">
          LIVE
        </div>
      </MetroHeader>
      
      <MetroMapContainer>
        <RealtimeMetroMap />
      </MetroMapContainer>
    </SectionContainer>
  );
};
