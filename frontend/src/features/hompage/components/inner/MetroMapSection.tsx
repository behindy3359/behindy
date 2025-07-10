import React from 'react';
import { Train } from 'lucide-react';
import { MetroMap } from '@/features/metro/components/MetroMap';
import { SectionContainer } from '@/shared/styles/commonStyles';
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
        <MetroMap />
      </MetroMapContainer>
    </SectionContainer>
  );
};
