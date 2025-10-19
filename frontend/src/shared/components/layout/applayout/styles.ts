import styled from "styled-components";

// AppLayout 스타일
export const LayoutContainer = styled.div`
  display: flex;
  min-height: 100vh;
  background: var(--bg-tertiary);
  position: relative;
  overflow: hidden;
`;

export const MainContent = styled.main.withConfig({
  shouldForwardProp: (prop) => !['$sidebarOpen', '$isMobile', '$layoutType', '$isGameMode'].includes(prop),
})<{ 
  $sidebarOpen: boolean; 
  $isMobile: boolean; 
  $layoutType: 'header' | 'sidebar';
  $isGameMode?: boolean;
}>`
  flex: 1;
  display: flex;
  flex-direction: column;
  height: 100vh;
  overflow-y: auto;
  overflow-x: hidden;
  
  /* 게임 모드 배경 */
  background: ${({ $isGameMode }) => 
    $isGameMode 
      ? 'var(--bg-primary)' 
      : 'var(--bg-tertiary)'
  };
  
  /* 스크롤바 스타일링 */
  &::-webkit-scrollbar {
    width: 8px;
  }
  
  &::-webkit-scrollbar-track {
    background: var(--bg-secondary);
  }
  
  &::-webkit-scrollbar-thumb {
    background: var(--border-medium);
    border-radius: 4px;
    
    &:hover {
      background: var(--border-dark);
    }
  }
  
  ${({ $layoutType, $sidebarOpen }) => 
    $layoutType === 'sidebar' && `
      @media (min-width: 768px) {
        margin-left: ${$sidebarOpen ? '280px' : '60px'};
        transition: margin-left 0.3s ease;
      }
      
      @media (max-width: 767px) {
        margin-left: 0;
      }
    `
  }
  
  ${({ $layoutType }) => 
    $layoutType === 'header' && `
      margin-left: 0;
      padding-top: 60px;
    `
  }
`;

export const ContentArea = styled.div`
  flex: 1;
  padding: 0;
  position: relative;
  min-height: calc(100vh - 0px);
`;

