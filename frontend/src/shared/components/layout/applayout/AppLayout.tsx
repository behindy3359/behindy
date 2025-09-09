
import React from 'react';
import { Sidebar } from '../sidebar/Sidebar';
import { useUIStore } from '@/shared/store/uiStore';
import { useAutoTheme } from '@/shared/hooks/useAutoTheme';
import { AppLayoutProps } from './types';
import { ContentArea, LayoutContainer, MainContent, MobileToggleButton } from './styled';

export const AppLayout: React.FC<AppLayoutProps> = ({ 
  children, 
  className,
  layoutType = 'sidebar'
}) => {
  const { sidebar, toggleSidebar } = useUIStore();
  const [isMobile, setIsMobile] = React.useState(false);
  
  // 🎨 자동 테마 적용 - 강제로 호출
  const { isGameMode } = useAutoTheme();

  // 🔥 추가 안전장치: 컴포넌트 마운트 시에도 테마 확인
  React.useEffect(() => {
    const pathname = window.location.pathname;
    const shouldBeGameMode = pathname.startsWith('/game') || pathname.startsWith('/character');
    
    console.log('🔍 [AppLayout] 마운트 시 테마 확인:', {
      pathname,
      shouldBeGameMode,
      currentTheme: document.documentElement.getAttribute('data-theme')
    });
    
    if (shouldBeGameMode) {
      document.documentElement.setAttribute('data-theme', 'dark');
      document.body.setAttribute('data-theme', 'dark');
    } else {
      document.documentElement.setAttribute('data-theme', 'light');
      document.body.setAttribute('data-theme', 'light');
    }
  }, []);

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