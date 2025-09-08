import React from 'react';
import { Sidebar } from '../sidebar/Sidebar';
import { useUIStore } from '@/shared/store/uiStore';
import { useAutoTheme } from '@/shared/hooks/useAutoTheme'; // 🔥 추가
import { AppLayoutProps } from './types';
import { ContentArea, LayoutContainer, MainContent, MobileToggleButton } from './styled';

export const AppLayout: React.FC<AppLayoutProps> = ({ 
  children, 
  className,
  layoutType = 'sidebar'
}) => {
  const { sidebar, toggleSidebar } = useUIStore();
  const [isMobile, setIsMobile] = React.useState(false);
  
  // 🎨 자동 테마 적용
  const { isGameMode } = useAutoTheme();

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
          background: 'var(--bg-primary)', // 🔥 CSS 변수 사용
          borderBottom: '1px solid var(--border-light)', // 🔥 CSS 변수 사용
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

      <MainContent 
        $sidebarOpen={sidebar.isOpen} 
        $isMobile={isMobile}
        $layoutType={layoutType}
        $isGameMode={isGameMode}
      >
        <ContentArea>
          {children}
        </ContentArea>
      </MainContent>
    </LayoutContainer>
  );
};

export default AppLayout