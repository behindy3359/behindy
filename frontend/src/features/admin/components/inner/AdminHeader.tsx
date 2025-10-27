import React from 'react';
import { AdminHeader as Header, AdminTitle, AdminSubtitle } from '../../styles/adminStyles';

interface AdminHeaderProps {
  title: string;
  subtitle: string;
}

export const AdminHeader: React.FC<AdminHeaderProps> = ({ title, subtitle }) => {
  return (
    <Header>
      <AdminTitle>{title}</AdminTitle>
      <AdminSubtitle>{subtitle}</AdminSubtitle>
    </Header>
  );
};
