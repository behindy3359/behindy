"use client";

import React from 'react';
import { SidebarContainer } from './styles';
import { SidebarProps } from './types';
import { sidebarAnimationVariants } from './utils';
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
  const { isDarkTheme, handleThemeToggle } = useSidebarTheme();

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
        animate={
          isMobile 
            ? sidebar.isOpen ? 'open' : 'closed'
            : sidebar.isOpen ? 'open' : 'closed'
        }
        variants={isMobile ? sidebarAnimationVariants.mobile : sidebarAnimationVariants}
      >
        <SidebarHeader
          isOpen={sidebar.isOpen}
          onToggle={toggleSidebar}
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
        <SidebarFooter
          isOpen={sidebar.isOpen}
          isDarkTheme={isDarkTheme}
          onThemeToggle={handleThemeToggle}
        />
      </SidebarContainer>
    </>
  );
};

export default Sidebar;