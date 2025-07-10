import React from 'react';
import { AccountSection } from '../styles';
import { NavItem } from './NavItem';
import type { NavItem as NavItemType } from '../types';

interface SidebarAccountProps {
  accountItems: NavItemType[];
  isOpen: boolean;
  onNavigate: (path?: string, action?: string) => void;
}

export const SidebarAccount: React.FC<SidebarAccountProps> = ({
  accountItems,
  isOpen,
  onNavigate,
}) => {
  return (
    <AccountSection $isOpen={isOpen}>
      {accountItems.map((item, index) => (
        <NavItem
          key={item.path || index}
          path={item.path}
          label={item.label}
          icon={item.icon}
          isActive={false}
          isOpen={isOpen}
          onClick={onNavigate}
          action={item.action}
        />
      ))}
    </AccountSection>
  );
};