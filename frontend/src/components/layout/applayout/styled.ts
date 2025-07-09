import styled from "styled-components";

export const LayoutContainer = styled.div`
  display: flex;
  min-height: 100vh;
  background: #fafbfc;
  
  /* 추가: 전체 레이아웃이 스크롤되지 않도록 고정 */
  position: relative;
  overflow: hidden;
`;

export const MainContent = styled.main.withConfig({
  shouldForwardProp: (prop) => !['$sidebarOpen', '$isMobile', '$layoutType'].includes(prop),
})<{ 
  $sidebarOpen: boolean; 
  $isMobile: boolean; 
  $layoutType: 'header' | 'sidebar';
}>`
  flex: 1;
  display: flex;
  flex-direction: column;
  
  /* 추가: 메인 콘텐츠 자체 스크롤 처리 */
  height: 100vh;
  overflow-y: auto;
  overflow-x: hidden;
  
  /* 스크롤바 스타일링 */
  &::-webkit-scrollbar {
    width: 8px;
  }
  
  &::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-radius: 4px;
  }
  
  &::-webkit-scrollbar-thumb {
    background: #c1c1c1;
    border-radius: 4px;
    
    &:hover {
      background: #a8a8a8;
    }
  }
  
  /* 사이드바 레이아웃인 경우 */
  ${({ $layoutType, $sidebarOpen }) => 
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

export const ContentArea = styled.div`
  flex: 1;
  padding: 0;
  position: relative;
  
  /* 추가: 콘텐츠 영역 최소 높이 보장 */
  min-height: calc(100vh - 0px); /* 헤더가 있다면 헤더 높이만큼 빼기 */
`;

// 모바일 토글 버튼 (사이드바 레이아웃에서만 표시)
export const MobileToggleButton = styled.button.withConfig({
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