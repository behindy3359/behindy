"use client";

import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Menu, X } from 'lucide-react';
import { Sidebar } from '../sidebar/Sidebar';
import { AuthGuard } from '@/components/auth/AuthGuard';

interface AppLayoutProps {
  children: React.ReactNode;
  showSidebar?: boolean;
  maxWidth?: string;
  backgroundColor?: string;
  currentPath?: string;
  user?: {
    id: number;
    name: string;
    email: string;
    isAuthenticated: boolean;
  } | null;
}

const LayoutContainer = styled.div<{ $isDarkMode: boolean }>`
  background: ${({ $isDarkMode }) => $isDarkMode ? '#111827' : '#fafbfc'};
  transition: background-color 0.3s ease;
`;


const SidebarWrapper = styled.div<{ $isCollapsed: boolean }>`
  width: ${({ $isCollapsed }) => $isCollapsed ? '60px' : '280px'};
  flex-shrink: 0;
  transition: width 0.3s ease;
  
  @media (max-width: 1199px) {
    width: 0;
  }
`;

const MainContainer = styled.div<{ 
  $maxWidth?: string;
  $backgroundColor?: string;
  $isDarkMode: boolean;
  $sidebarWidth: number;
}>`
  display: flex;
  flex-direction: column;
  background: ${({ $backgroundColor, $isDarkMode }) => 
    $backgroundColor || ($isDarkMode ? '#111827' : '#fafbfc')
  };
  transition: all 0.3s ease;
  margin-left: ${({ $sidebarWidth }) => $sidebarWidth}px;
  
  @media (max-width: 1199px) {
    margin-left: 0;
  }
`;

const MobileHeader = styled.header<{ $isDarkMode: boolean }>`
  display: none;
  height: 60px;
  background: ${({ $isDarkMode }) => $isDarkMode ? '#1f2937' : '#ffffff'};
  border-bottom: 1px solid ${({ $isDarkMode }) => $isDarkMode ? '#374151' : '#e5e7eb'};
  padding: 0 20px;
  align-items: center;
  justify-content: space-between;
  position: sticky;
  top: 0;
  z-index: 100;
  
  @media (max-width: 1199px) {
    display: flex;
  }
`;

const MobileLogo = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  
  .logo-icon {
    width: 28px;
    height: 28px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    border-radius: 6px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    font-weight: bold;
    font-size: 16px;
  }
  
  .brand-name {
    font-size: 18px;
    font-weight: 800;
    color: #667eea;
  }
`;

const MobileMenuButton = styled.button<{ $isDarkMode: boolean }>`
  width: 40px;
  height: 40px;
  border: none;
  background: ${({ $isDarkMode }) => $isDarkMode ? '#374151' : '#f3f4f6'};
  border-radius: 8px;
  cursor: pointer;
  color: ${({ $isDarkMode }) => $isDarkMode ? '#d1d5db' : '#6b7280'};
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  
  &:hover {
    background: ${({ $isDarkMode }) => $isDarkMode ? '#4b5563' : '#e5e7eb'};
    color: ${({ $isDarkMode }) => $isDarkMode ? '#f9fafb' : '#374151'};
  }
  
  svg {
    width: 20px;
    height: 20px;
  }
`;

const ContentArea = styled.main<{ 
  $maxWidth?: string; 
  $isDarkMode: boolean;
  $hasMaxWidth: boolean;
}>`
  flex: 1;
  background: ${({ $isDarkMode, $hasMaxWidth }) => {
    if ($hasMaxWidth) {
      return $isDarkMode ? '#1f2937' : 'white';
    }
    return 'transparent';
  }};
  border-radius: ${({ $hasMaxWidth }) => $hasMaxWidth ? '12px 12px 0 0' : '0'};
  margin: ${({ $hasMaxWidth }) => $hasMaxWidth ? '20px' : '0'};
  max-width: ${({ $maxWidth }) => $maxWidth || 'none'};
  margin: ${({ $hasMaxWidth, $maxWidth }) => {
    if ($hasMaxWidth && $maxWidth) return '20px auto';
    if ($hasMaxWidth) return '20px';
    return '0';
  }};
  box-shadow: ${({ $hasMaxWidth, $isDarkMode }) => {
    if ($hasMaxWidth) {
      return $isDarkMode 
        ? '0 4px 6px -1px rgba(0, 0, 0, 0.3)' 
        : '0 4px 6px -1px rgba(0, 0, 0, 0.1)';
    }
    return 'none';
  }};
  transition: all 0.3s ease;
  
  @media (max-width: 768px) {
    margin: 0;
    border-radius: 0;
    box-shadow: none;
    background: ${({ $isDarkMode }) => $isDarkMode ? '#111827' : '#fafbfc'};
  }
`;

const ContentWrapper = styled.div<{ $withPadding: boolean }>`
  padding: ${({ $withPadding }) => $withPadding ? '24px' : '0'};
  
  @media (max-width: 768px) {
    padding: ${({ $withPadding }) => $withPadding ? '16px' : '0'};
  }
`;

// 페이지별 레이아웃 설정
const getLayoutConfig = (pathname: string) => {
  if (pathname.startsWith('/auth')) {
    return {
      showSidebar: false,
      contentPadding: false,
      maxWidth: '500px',
      backgroundColor: undefined
    };
  }
  
  if (pathname === '/') {
    return {
      showSidebar: false,
      contentPadding: false,
      maxWidth: undefined,
      backgroundColor: undefined
    };
  }
  
  if (pathname.startsWith('/metro-map') || pathname.startsWith('/game')) {
    return {
      showSidebar: true,
      contentPadding: false,
      maxWidth: undefined,
      backgroundColor: undefined
    };
  }
  
  return {
    showSidebar: true,
    contentPadding: true,
    maxWidth: '1200px',
    backgroundColor: undefined
  };
};

export const AppLayout: React.FC<AppLayoutProps> = ({
  children,
  showSidebar: propShowSidebar,
  maxWidth: propMaxWidth,
  backgroundColor: propBackgroundColor,
  currentPath = '/',
  user = null
}) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1200) {
        setSidebarOpen(true);
      } else {
        setSidebarOpen(false);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (window.innerWidth < 1200) {
      setSidebarOpen(false);
    }
  }, [currentPath]);

  const layoutConfig = getLayoutConfig(currentPath);
  
  const showSidebar = propShowSidebar ?? layoutConfig.showSidebar;
  const contentPadding = layoutConfig.contentPadding;
  const maxWidth = propMaxWidth ?? layoutConfig.maxWidth;
  const backgroundColor = propBackgroundColor ?? layoutConfig.backgroundColor;
  const hasMaxWidth = Boolean(maxWidth);

  const handleSidebarToggle = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleSidebarClose = () => {
    setSidebarOpen(false);
  };

  const handleSidebarCollapseToggle = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  const handleThemeToggle = () => {
    setIsDarkMode(!isDarkMode);
  };

  return (
    <LayoutContainer $isDarkMode={isDarkMode}>
      {showSidebar && (
        <SidebarWrapper $isCollapsed={sidebarCollapsed}>
          <Sidebar
            isOpen={sidebarOpen}
            onClose={handleSidebarClose}
            isCollapsed={sidebarCollapsed}
            onToggleCollapse={handleSidebarCollapseToggle}
            isDarkMode={isDarkMode}
            onThemeToggle={handleThemeToggle}
            currentPath={currentPath}
            user={user}
          />
        </SidebarWrapper>
      )}

      <MainContainer
        $maxWidth={maxWidth}
        $backgroundColor={backgroundColor}
        $isDarkMode={isDarkMode}
        $sidebarWidth={showSidebar ? (sidebarCollapsed ? 60 : 280) : 0}
      >
        {/* 모바일 헤더 */}
        <MobileHeader $isDarkMode={isDarkMode}>
          <MobileLogo>
            <div className="logo-icon">B</div>
            <div className="brand-name">Behindy</div>
          </MobileLogo>
          
          {showSidebar && (
            <MobileMenuButton 
              $isDarkMode={isDarkMode}
              onClick={handleSidebarToggle}
            >
              {sidebarOpen ? <X /> : <Menu />}
            </MobileMenuButton>
          )}
        </MobileHeader>
        
        {/* 메인 콘텐츠 */}
        <ContentArea 
          $maxWidth={maxWidth}
          $isDarkMode={isDarkMode}
          $hasMaxWidth={hasMaxWidth}
        >
          <ContentWrapper $withPadding={contentPadding}>
            {children}
          </ContentWrapper>
        </ContentArea>
      </MainContainer>
    </LayoutContainer>
  );
};

// 게임 전용 레이아웃
export const GameLayout: React.FC<{ children: React.ReactNode }> = ({ 
  children 
}) => {
  return (
    <AppLayout
      showSidebar={true}
      backgroundColor="#0f172a"
      maxWidth={undefined}
    >
      {children}
    </AppLayout>
  );
};

export default function RootLayout({ 
  children 
}: { 
  children: React.ReactNode 
}) {
  return (
    <html lang="ko">
      <body>
        <AuthGuard>
          {children}
        </AuthGuard>
      </body>
    </html>
  );
}

// PublicLayout - 인증 체크 없음 (홈, 커뮤니티 목록 등)
export const PublicLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div>
      <Sidebar />
      <main>{children}</main>
    </div>
  );
};

// DashboardLayout - 인증 체크 있음 (글쓰기, 프로필 등)
export const DashboardLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <AuthGuard>
      <div>
        <Sidebar />
        <main>{children}</main>
      </div>
    </AuthGuard>
  );
};