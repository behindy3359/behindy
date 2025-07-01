"use client";

import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import Header from '../header/Header';
import Sidebar from '../sidebar/Sidebar';
import { useAuthStore } from '../../../store/authStore';

interface AppLayoutProps {
  children: React.ReactNode;
  showSidebar?: boolean;
  sidebarCollapsible?: boolean;
  maxWidth?: string;
  backgroundColor?: string;
}

const LayoutContainer = styled.div`
  min-height: 100vh;
  background: #fafbfc;
  display: flex;
  flex-direction: column;
`;

const MainContainer = styled.div<{ 
  $hasSidebar: boolean; 
  $sidebarOpen: boolean;
  $maxWidth?: string;
  $backgroundColor?: string;
}>`
  flex: 1;
  display: flex;
  background: ${({ $backgroundColor }) => $backgroundColor || '#fafbfc'};
  
  @media (min-width: 1200px) {
    margin-left: ${({ $hasSidebar, $sidebarOpen }) => 
      $hasSidebar && $sidebarOpen ? '300px' : '0'
    };
  }
`;

const ContentArea = styled.main<{ $maxWidth?: string }>`
  flex: 1;
  min-height: calc(100vh - 70px);
  background: white;
  border-radius: ${({ $maxWidth }) => $maxWidth ? '12px 12px 0 0' : '0'};
  margin: ${({ $maxWidth }) => $maxWidth ? '20px' : '0'};
  max-width: ${({ $maxWidth }) => $maxWidth || 'none'};
  margin: ${({ $maxWidth }) => $maxWidth ? '20px auto' : '0'};
  box-shadow: ${({ $maxWidth }) => 
    $maxWidth ? '0 4px 6px -1px rgba(0, 0, 0, 0.1)' : 'none'
  };
  
  @media (max-width: 768px) {
    margin: 0;
    border-radius: 0;
    box-shadow: none;
  }
`;

const ContentWrapper = styled.div`
  padding: 0;
  min-height: 100%;
  
  &.with-padding {
    padding: 24px;
    
    @media (max-width: 768px) {
      padding: 16px;
    }
  }
`;

const LoadingOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  
  .loading-content {
    text-align: center;
    
    .spinner {
      width: 40px;
      height: 40px;
      border: 4px solid #f3f4f6;
      border-top: 4px solid #667eea;
      border-radius: 50%;
      animation: spin 1s linear infinite;
      margin: 0 auto 16px;
    }
    
    .loading-text {
      color: #6b7280;
      font-size: 16px;
    }
  }
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

const ErrorBoundary = styled.div`
  padding: 40px 24px;
  text-align: center;
  color: #ef4444;
  
  h2 {
    margin-bottom: 16px;
    color: #dc2626;
  }
  
  p {
    color: #6b7280;
    margin-bottom: 24px;
  }
  
  button {
    padding: 12px 24px;
    background: #667eea;
    color: white;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    font-weight: 500;
    
    &:hover {
      background: #5a67d8;
    }
  }
`;

// 페이지별 레이아웃 설정
const getLayoutConfig = (pathname: string) => {
  // 인증 페이지는 사이드바 없음
  if (pathname.startsWith('/auth')) {
    return {
      showSidebar: false,
      showHeader: false,
      contentPadding: false,
      maxWidth: undefined,
      backgroundColor: undefined
    };
  }
  
  // 랜딩 페이지
  if (pathname === '/') {
    return {
      showSidebar: false,
      showHeader: true,
      contentPadding: false,
      maxWidth: undefined,
      backgroundColor: '#fafbfc'
    };
  }
  
  // 게임 페이지
  if (pathname.startsWith('/game')) {
    return {
      showSidebar: true,
      showHeader: true,
      contentPadding: false,
      maxWidth: undefined,
      backgroundColor: '#f8fafc'
    };
  }
  
  // 일반 페이지 (대시보드, 프로필 등)
  return {
    showSidebar: true,
    showHeader: true,
    contentPadding: true,
    maxWidth: '1200px',
    backgroundColor: '#fafbfc'
  };
};

export const AppLayout: React.FC<AppLayoutProps> = ({
  children,
  showSidebar: propShowSidebar,
  sidebarCollapsible = true,
  maxWidth: propMaxWidth,
  backgroundColor: propBackgroundColor
}) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { isAuthenticated, checkAuthStatus } = useAuthStore();
  
  // 현재 경로 (실제로는 useRouter 사용)
  const [currentPath, setCurrentPath] = useState('/');
  
  useEffect(() => {
    // 페이지 로드 시 인증 상태 확인
    const initAuth = async () => {
      try {
        await checkAuthStatus();
      } catch (err) {
        console.error('Auth check failed:', err);
      } finally {
        setIsLoading(false);
      }
    };
    
    initAuth();
  }, [checkAuthStatus]);

  useEffect(() => {
    // 경로가 변경될 때 사이드바 자동 닫기 (모바일)
    if (window.innerWidth < 1200) {
      setSidebarOpen(false);
    }
  }, [currentPath]);

  const layoutConfig = getLayoutConfig(currentPath);
  
  // Props로 전달된 값이 있으면 우선 사용
  const showSidebar = propShowSidebar ?? layoutConfig.showSidebar;
  const showHeader = layoutConfig.showHeader;
  const contentPadding = layoutConfig.contentPadding;
  const maxWidth = propMaxWidth ?? layoutConfig.maxWidth;
  const backgroundColor = propBackgroundColor ?? layoutConfig.backgroundColor;

  const handleSidebarToggle = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleSidebarClose = () => {
    setSidebarOpen(false);
  };

  const handleRetry = () => {
    setError(null);
    setIsLoading(true);
    window.location.reload();
  };

  if (isLoading) {
    return (
      <LoadingOverlay>
        <div className="loading-content">
          <div className="spinner" />
          <div className="loading-text">로딩 중...</div>
        </div>
      </LoadingOverlay>
    );
  }

  if (error) {
    return (
      <LayoutContainer>
        <ErrorBoundary>
          <h2>오류가 발생했습니다</h2>
          <p>{error}</p>
          <button onClick={handleRetry}>다시 시도</button>
        </ErrorBoundary>
      </LayoutContainer>
    );
  }

  return (
    <LayoutContainer>
      {/* 헤더 */}
      {showHeader && (
        <Header 
          onMenuToggle={handleSidebarToggle}
          isMenuOpen={sidebarOpen}
        />
      )}
      
      <MainContainer
        $hasSidebar={showSidebar && isAuthenticated()}
        $sidebarOpen={sidebarOpen}
        $maxWidth={maxWidth}
        $backgroundColor={backgroundColor}
      >
        {/* 사이드바 */}
        {showSidebar && isAuthenticated() && (
          <Sidebar 
            isOpen={sidebarOpen}
            onClose={handleSidebarClose}
          />
        )}
        
        {/* 메인 콘텐츠 */}
        <ContentArea $maxWidth={maxWidth}>
          <ContentWrapper className={contentPadding ? 'with-padding' : ''}>
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

// 인증 페이지 전용 레이아웃 (AuthLayout와 다름)
export const PublicLayout: React.FC<{ children: React.ReactNode }> = ({ 
  children 
}) => {
  return (
    <AppLayout
      showSidebar={false}
      backgroundColor="#ffffff"
      maxWidth="1200px"
    >
      {children}
    </AppLayout>
  );
};

// 대시보드 전용 레이아웃
export const DashboardLayout: React.FC<{ children: React.ReactNode }> = ({ 
  children 
}) => {
  return (
    <AppLayout
      showSidebar={true}
      backgroundColor="#fafbfc"
      maxWidth="1400px"
    >
      {children}
    </AppLayout>
  );
};

export default AppLayout;