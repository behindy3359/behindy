import React from 'react';
import { NavigationSection } from '../styles';
import { NavItem } from './NavItem';
import type { NavItem as NavItemType } from '../types';

interface SidebarNavigationProps {
  navItems: NavItemType[];
  isOpen: boolean;
  isActiveRoute: (path: string) => boolean;
  onNavigate: (path?: string, action?: string) => void;
}

export const SidebarNavigation: React.FC<SidebarNavigationProps> = ({
  navItems,
  isOpen,
  isActiveRoute,
  onNavigate,
}) => {
  return (
    <NavigationSection $isOpen={isOpen}>
      {navItems.map((item) => (
        <NavItem
          key={item.path}
          path={item.path}
          label={item.label}
          icon={item.icon}
          isActive={isActiveRoute(item.path)}
          isOpen={isOpen}
          onClick={onNavigate}
        />
      ))}
    </NavigationSection>
  );
};
