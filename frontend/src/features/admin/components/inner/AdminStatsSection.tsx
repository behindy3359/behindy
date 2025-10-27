import React from 'react';
import {
  AdminSection,
  SectionTitle,
  StatsGrid,
} from '../../styles/adminStyles';

interface AdminStatsSectionProps {
  title: string;
  children: React.ReactNode;
}

export const AdminStatsSection: React.FC<AdminStatsSectionProps> = ({
  title,
  children,
}) => {
  return (
    <AdminSection>
      <SectionTitle>{title}</SectionTitle>
      <StatsGrid>{children}</StatsGrid>
    </AdminSection>
  );
};
