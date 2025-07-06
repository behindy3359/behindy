"use client";

import React from 'react';
import styled from 'styled-components';
import { Sidebar } from '../sidebar/Sidebar';
import { useUIStore } from '@/store/uiStore';

// ================================================================
// Styled Components
// ================================================================

const LayoutContainer = styled.div`
  display: flex;
  min-height: 100vh;
  background: #fafbfc;
`;

const MainContent = styled.main.withConfig({
  shouldForwardProp: (prop) => !['$sidebarOpen', '$isMobile', '$layoutType'].includes(prop),
})<{ 
  $sidebarOpen: boolean; 
  $isMobile: boolean; 
  $layoutType: 'header' | 'sidebar';
}>`
  flex: 1;
  display: flex;
  flex-direction: column;
  
  /* 사이드바 레이아웃인 경우 */
  ${({ $layoutType, $sidebarOpen, $isMobile }) => 
    $layoutType === 'sidebar' && `
      /* 데스크톱: 사이드바 너비만큼 마진 */
      @media (min-width: 768px) {
        margin-left: ${$sidebarOpen ? '280px' : '60px'};
        transition: margin-left 0.3s ease;
      }
      
      /* 모바일: 마진 없음 (오버레이 방식) */
      @media (max-width: 767px) {
        margin-left: 0;
      }
    `
  }
  
  /* 헤더 레이아웃인 경우 */
  ${({ $layoutType }) => 
    $layoutType === 'header' && `
      margin-left: 0;
      padding-top: 60px; /* 헤더 높이만큼 */
    `
  }
`;

const ContentArea = styled.div`
  flex: 1;
  padding: 0;
  position: relative;
  overflow-x: hidden;
`;

// 모바일 토글 버튼 (사이드바 레이아웃에서만 표시)
const MobileToggleButton = styled.button.withConfig({
  shouldForwardProp: (prop) => !['$visible'].includes(prop),
})<{ $visible: boolean }>`
  position: fixed;
  top: 20px;
  left: 20px;
  z-index: 1001;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
  color: white;
  width: 44px;
  height: 44px;
  border-radius: 12px;
  display: ${({ $visible }) => ($visible ? 'flex' : 'none')};
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
  transition: all 0.2s ease;
  
  &:hover {
    transform: scale(1.05);
    box-shadow: 0 6px 16px rgba(102, 126, 234, 0.4);
  }
  
  &:active {
    transform: scale(0.95);
  }
  
  @media (min-width: 768px) {
    display: none;
  }
`;

// ================================================================
// Component
// ================================================================

interface AppLayoutProps {
  children: React.ReactNode;
  className?: string;
  layoutType?: 'header' | 'sidebar';  // 👈 레이아웃 타입 선택
}

export const AppLayout: React.FC<AppLayoutProps> = ({ 
  children, 
  className,
  layoutType = 'sidebar'  // 👈 기본값은 sidebar
}) => {
  const { sidebar, toggleSidebar } = useUIStore();
  const [isMobile, setIsMobile] = React.useState(false);

  // 모바일 감지
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
      {/* 사이드바 (사이드바 레이아웃에서만 렌더링) */}
      {layoutType === 'sidebar' && <Sidebar />}
      
      {/* 헤더 (헤더 레이아웃에서만 렌더링) */}
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
          {/* 기존 헤더 내용을 여기에 */}
          <h1>Header Layout</h1>
        </header>
      )}
      
      {/* 모바일 토글 버튼 (사이드바 레이아웃에서만) */}
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

export const HeaderLayout: React.FC<Omit<AppLayoutProps, 'layoutType'>> = (props) => (
  <AppLayout {...props} layoutType="header" />
);

export default AppLayout;