import styled from "styled-components";

export const LayoutContainer = styled.div`
  display: flex;
  min-height: 100vh;
  background: var(--bg-tertiary); // 🔥 CSS 변수 사용
  position: relative;
  overflow: hidden;
`;

export const MainContent = styled.main.withConfig({
  shouldForwardProp: (prop) => !['$sidebarOpen', '$isMobile', '$layoutType', '$isGameMode'].includes(prop),
})<{ 
  $sidebarOpen: boolean; 
  $isMobile: boolean; 
  $layoutType: 'header' | 'sidebar';
  $isGameMode?: boolean; // 🔥 추가
}>`
  flex: 1;
  display: flex;
  flex-direction: column;
  height: 100vh;
  overflow-y: auto;
  overflow-x: hidden;
  
  /* 🎮 게임 모드 배경 */
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
  
  /* 나머지 스타일은 기존과 동일... */
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

export const MobileToggleButton = styled.button.withConfig({
  shouldForwardProp: (prop) => !['$visible'].includes(prop),
})<{ $visible: boolean }>`
  position: fixed;
  top: 20px;
  left: 20px;
  z-index: 1001;
  background: linear-gradient(135deg, var(--primary-500) 0%, var(--secondary-500) 100%); // 🔥 CSS 변수 사용
  border: none;
  color: var(--text-inverse); // 🔥 CSS 변수 사용
  width: 44px;
  height: 44px;
  border-radius: 12px;
  display: ${({ $visible }) => ($visible ? 'flex' : 'none')};
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: var(--shadow-button); // 🔥 CSS 변수 사용
  transition: all 0.2s ease;
  
  &:hover {
    transform: scale(1.05);
    box-shadow: var(--shadow-lg); // 🔥 CSS 변수 사용
  }
  
  &:active {
    transform: scale(0.95);
  }
  
  @media (min-width: 768px) {
    display: none;
  }
`;