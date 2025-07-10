"use client";

import React from 'react';
import { Sidebar } from '../sidebar/Sidebar';
import { useUIStore } from '@/shared/store/uiStore';
import { AppLayoutProps } from './types';
import { ContentArea, LayoutContainer, MainContent, MobileToggleButton } from './styled';

export const AppLayout: React.FC<AppLayoutProps> = ({ 
  children, 
  className,
  layoutType = 'sidebar'
}) => {
  const { sidebar, toggleSidebar } = useUIStore();
  const [isMobile, setIsMobile] = React.useState(false);

  React.useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return (
    <LayoutContainer className={className}>
      {layoutType === 'sidebar' && <Sidebar />}
      
      {layoutType === 'header' && (
        <header style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          height: '60px',
          background: 'white',
          borderBottom: '1px solid #e5e7eb',
          zIndex: 1000,
          display: 'flex',
          alignItems: 'center',
          padding: '0 24px'
        }}>
          <h1>Header Layout</h1>
        </header>
      )}
      
      {layoutType === 'sidebar' && (
        <MobileToggleButton
          $visible={isMobile && !sidebar.isOpen}
          onClick={toggleSidebar}
          aria-label="메뉴 열기"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path 
              d="M3 12h18M3 6h18M3 18h18" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            />
          </svg>
        </MobileToggleButton>
      )}

      {/* 메인 컨텐츠 */}
      <MainContent 
        $sidebarOpen={sidebar.isOpen} 
        $isMobile={isMobile}
        $layoutType={layoutType}
      >
        <ContentArea>
          {children}
        </ContentArea>
      </MainContent>
    </LayoutContainer>
  );
};

// 편의성을 위한 래퍼 컴포넌트들
export const PublicLayout: React.FC<Omit<AppLayoutProps, 'layoutType'>> = (props) => (
  <AppLayout {...props} layoutType="sidebar" />
);

export const DashboardLayout: React.FC<Omit<AppLayoutProps, 'layoutType'>> = (props) => (
  <AppLayout {...props} layoutType="sidebar" />
);

export default AppLayout;