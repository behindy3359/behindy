import React from 'react';
import {
  StatsCard,
  CardTitle,
  CardValue,
  CardSubtext,
  StatusBadge,
} from '../../styles/adminStyles';

interface AdminStatsCardProps {
  title: string;
  value: number | string;
  subtext?: string;
  color?: string;
  status?: 'HEALTHY' | 'WARNING' | 'ERROR';
}

export const AdminStatsCard: React.FC<AdminStatsCardProps> = ({
  title,
  value,
  subtext,
  color,
  status,
}) => {
  // 숫자일 경우 천 단위 콤마 추가
  const formattedValue = typeof value === 'number'
    ? value.toLocaleString()
    : value;

  return (
    <StatsCard>
      <CardTitle>{title}</CardTitle>
      {status ? (
        <StatusBadge $status={status}>{value}</StatusBadge>
      ) : (
        <CardValue $color={color}>{formattedValue}</CardValue>
      )}
      {subtext && <CardSubtext>{subtext}</CardSubtext>}
    </StatsCard>
  );
};
