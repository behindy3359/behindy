"use client";

import React from 'react';
import { SidebarContainer } from './styles';
import { SidebarProps } from './types';
import { sidebarAnimationVariants, sidebarMobileAnimationVariants } from './utils';
import { useSidebarState } from './hooks/useSidebarState';
import { useSidebarNavigation } from './hooks/useSidebarNavigation';
import { useSidebarTheme } from './hooks/useSidebarTheme';
import { SidebarOverlay } from './inner/SidebarOverlay';
import { SidebarHeader } from './inner/SidebarHeader';
import { SidebarNavigation } from './inner/SidebarNavigation';
import { SidebarAccount } from './inner/SidebarAccount';
import { SidebarFooter } from './inner/SidebarFooter';

export const Sidebar: React.FC<SidebarProps> = ({ className }) => {
  const { sidebar, isMobile, toggleSidebar, handleOverlayClick } = useSidebarState();
  const { navItems, accountItems, handleNavigation, isActiveRoute } = useSidebarNavigation();

  return (
    <>
      <SidebarOverlay
        isVisible={isMobile && sidebar.isOpen}
        onClick={handleOverlayClick}
      />

      <SidebarContainer
        $isOpen={sidebar.isOpen}
        $isMobile={isMobile}
        className={className}
        initial={false}
        animate={sidebar.isOpen ? 'open' : 'closed'}
        variants={isMobile ? sidebarMobileAnimationVariants : sidebarAnimationVariants}
      >
        <SidebarHeader
          isOpen={sidebar.isOpen}
          onToggle={toggleSidebar}
          onNavigate={handleNavigation}
        />
        <SidebarNavigation
          navItems={navItems}
          isOpen={sidebar.isOpen}
          isActiveRoute={isActiveRoute}
          onNavigate={handleNavigation}
        />
        <SidebarAccount
          accountItems={accountItems}
          isOpen={sidebar.isOpen}
          onNavigate={handleNavigation}
        />
      </SidebarContainer>
    </>
  );
};

export default Sidebar;