import React from 'react';

export interface SidebarProps {
  className?: string;
}

export interface NavItem {
  path: string;
  label: string;
  icon: React.ComponentType<{ className?: string; size?: number }>;
  action?: string;
}

export interface SidebarState {
  isOpen: boolean;
  isMobile: boolean;
}

export interface NavigationItem extends NavItem {
  isActive?: boolean;
  badge?: string | number;
  children?: NavigationItem[];
}