import React from 'react';
import { MapPin, Award } from 'lucide-react';
import { VisitedStation, VisitBadge } from '@/features/game/types/gameTypes';
import {
  Card,
  CardHeader,
  CardTitle,
} from '../../styles/gameStyles';
import styled from 'styled-components';
import { motion } from 'framer-motion';

interface VisitedStationBadgesProps {
  visitedStations: VisitedStation[];
  isLoading: boolean;
}

// 뱃지 색상 매핑
const badgeColors: Record<VisitBadge, { bg: string; border: string; text: string; icon: string }> = {
  BRONZE: {
    bg: '#fef3c7',
    border: '#f59e0b',
    text: '#92400e',
    icon: '🥉'
  },
  SILVER: {
    bg: '#e5e7eb',
    border: '#9ca3af',
    text: '#374151',
    icon: '🥈'
  },
  GOLD: {
    bg: '#fef3c7',
    border: '#f59e0b',
    text: '#92400e',
    icon: '🥇'
  },
  PLATINUM: {
    bg: '#e0e7ff',
    border: '#818cf8',
    text: '#3730a3',
    icon: '💎'
  }
};

// 호선 색상 매핑
const lineColors: Record<number, string> = {
  1: '#0052A4',
  2: '#00A84D',
  3: '#EF7C1C',
  4: '#00A5DE',
  5: '#996CAC',
  6: '#CD7C2F',
  7: '#747F00',
  8: '#E6186C',
  9: '#BDB092',
};

export const VisitedStationBadges: React.FC<VisitedStationBadgesProps> = ({
  visitedStations,
  isLoading,
}) => {
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>
            <MapPin size={20} />
            여행한 역
          </CardTitle>
        </CardHeader>
        <LoadingContainer>
          <LoadingText>불러오는 중...</LoadingText>
        </LoadingContainer>
      </Card>
    );
  }

  if (visitedStations.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>
            <MapPin size={20} />
            여행한 역
          </CardTitle>
        </CardHeader>
        <EmptyContainer>
          <EmptyIcon>🗺️</EmptyIcon>
          <EmptyText>아직 방문한 역이 없습니다</EmptyText>
          <EmptySubtext>스토리를 완료하면 뱃지를 획득할 수 있어요!</EmptySubtext>
        </EmptyContainer>
      </Card>
    );
  }

  return (
    <Card
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <CardHeader>
        <CardTitle>
          <MapPin size={20} />
          여행한 역 ({visitedStations.length}개)
        </CardTitle>
      </CardHeader>

      <BadgeGrid>
        {visitedStations.map((station, index) => {
          const badgeStyle = badgeColors[station.visitBadge];
          const lineColor = lineColors[station.stationLine] || '#6b7280';

          return (
            <BadgeItem
              key={`${station.stationName}-${station.stationLine}`}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              whileHover={{ scale: 1.05 }}
              $bgColor={badgeStyle.bg}
              $borderColor={badgeStyle.border}
            >
              <BadgeIcon>{badgeStyle.icon}</BadgeIcon>

              <BadgeContent>
                <StationInfo>
                  <LineBadge $lineColor={lineColor}>
                    {station.stationLine}호선
                  </LineBadge>
                  <StationName>{station.stationName}</StationName>
                </StationInfo>

                <BadgeStats>
                  <StatItem>
                    <StatLabel>방문</StatLabel>
                    <StatValue $color={badgeStyle.text}>
                      {station.visitCount}회
                    </StatValue>
                  </StatItem>
                  <StatDivider />
                  <StatItem>
                    <StatLabel>클리어율</StatLabel>
                    <StatValue $color={badgeStyle.text}>
                      {station.clearRate.toFixed(1)}%
                    </StatValue>
                  </StatItem>
                </BadgeStats>
              </BadgeContent>
            </BadgeItem>
          );
        })}
      </BadgeGrid>

      <BadgeSummary>
        <SummaryItem>
          <Award size={16} />
          <SummaryText>
            총 {visitedStations.reduce((sum, s) => sum + s.visitCount, 0)}회 클리어
          </SummaryText>
        </SummaryItem>
      </BadgeSummary>
    </Card>
  );
};

// Styled Components
const BadgeGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 0.75rem;
  padding: 1rem;
`;

const BadgeItem = styled(motion.div)<{ $bgColor: string; $borderColor: string }>`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem;
  background: ${props => props.$bgColor};
  border: 2px solid ${props => props.$borderColor};
  border-radius: 0.75rem;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }
`;

const BadgeIcon = styled.div`
  font-size: 2rem;
  line-height: 1;
  flex-shrink: 0;
`;

const BadgeContent = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  min-width: 0;
`;

const StationInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const LineBadge = styled.span<{ $lineColor: string }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.125rem 0.5rem;
  background: ${props => props.$lineColor};
  color: white;
  font-size: 0.75rem;
  font-weight: 600;
  border-radius: 0.375rem;
  white-space: nowrap;
`;

const StationName = styled.span`
  font-weight: 600;
  font-size: 0.875rem;
  color: ${({ theme }) => theme.colors.text.primary};
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const BadgeStats = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const StatItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.25rem;
`;

const StatLabel = styled.span`
  font-size: 0.75rem;
  color: ${({ theme }) => theme.colors.text.secondary};
`;

const StatValue = styled.span<{ $color: string }>`
  font-size: 0.875rem;
  font-weight: 700;
  color: ${props => props.$color};
`;

const StatDivider = styled.div`
  width: 1px;
  height: 1rem;
  background: ${({ theme }) => theme.colors.border.medium};
`;

const BadgeSummary = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  padding: 1rem;
  border-top: 1px solid ${({ theme }) => theme.colors.border.light};
  background: ${({ theme }) => theme.colors.background.secondary};
`;

const SummaryItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: ${({ theme }) => theme.colors.text.secondary};
`;

const SummaryText = styled.span`
  font-size: 0.875rem;
  font-weight: 600;
`;

const LoadingContainer = styled.div`
  padding: 2rem;
  text-align: center;
`;

const LoadingText = styled.p`
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: 0.875rem;
`;

const EmptyContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem 1.5rem;
  text-align: center;
`;

const EmptyIcon = styled.div`
  font-size: 3rem;
  margin-bottom: 1rem;
  opacity: 0.5;
`;

const EmptyText = styled.p`
  font-size: 1rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text.primary};
  margin-bottom: 0.5rem;
`;

const EmptySubtext = styled.p`
  font-size: 0.875rem;
  color: ${({ theme }) => theme.colors.text.secondary};
  margin: 0;
`;
