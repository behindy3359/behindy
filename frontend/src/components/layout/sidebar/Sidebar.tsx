"use client";

import React from 'react';
import { useRouter, usePathname } from 'next/navigation';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Home, 
  Info, 
  Train, 
  MessageSquare, 
  User, 
  LogIn, 
  UserPlus, 
  Menu,
  X,
  Sun,
  Moon,
  Settings
} from 'lucide-react';
import { useUIStore } from '@/store/uiStore';
import { useAuthStore } from '@/store/authStore';
import { gradients } from '@/styles/theme';

// ================================================================
// Styled Components
// ================================================================

const SidebarContainer = styled(motion.aside).withConfig({
  shouldForwardProp: (prop) => !['$isOpen', '$isMobile'].includes(prop),
})<{ $isOpen: boolean; $isMobile: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  height: 100vh; /* 전체 화면 높이 */
  background: ${gradients.primary};
  color: white;
  z-index: 1000;
  display: flex;
  flex-direction: column;
  box-shadow: 2px 0 8px rgba(0, 0, 0, 0.15);
  
  /* 추가: 스크롤 처리 */
  overflow-y: auto;
  overflow-x: hidden;
  
  /* 스크롤바 스타일링 */
  &::-webkit-scrollbar {
    width: 4px;
  }
  
  &::-webkit-scrollbar-track {
    background: rgba(255, 255, 255, 0.1);
  }
  
  &::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.3);
    border-radius: 2px;
    
    &:hover {
      background: rgba(255, 255, 255, 0.5);
    }
  }
  
  /* 데스크톱: 280px ↔ 60px */
  @media (min-width: 768px) {
    width: ${({ $isOpen }) => ($isOpen ? '280px' : '60px')};
    transition: width 0.3s ease;
  }
  
  /* 모바일: 오버레이 */
  @media (max-width: 767px) {
    width: ${({ $isOpen }) => ($isOpen ? '280px' : '0px')};
    transform: translateX(${({ $isOpen }) => ($isOpen ? '0' : '-100%')});
    transition: all 0.3s ease;
  }
`;

const SidebarOverlay = styled(motion.div).withConfig({
  shouldForwardProp: (prop) => !['$visible'].includes(prop),
})<{ $visible: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 999;
  display: ${({ $visible }) => ($visible ? 'block' : 'none')};
  
  @media (min-width: 768px) {
    display: none;
  }
`;

// 헤더 섹션
const HeaderSection = styled.div.withConfig({
  shouldForwardProp: (prop) => !['$isOpen'].includes(prop),
})<{ $isOpen: boolean }>`
  padding: 20px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  display: flex;
  align-items: center;
  justify-content: ${({ $isOpen }) => ($isOpen ? 'space-between' : 'center')};
  min-height: 80px;
  flex-shrink: 0; /* 추가: 헤더 크기 고정 */
`;

const BrandLogo = styled.div.withConfig({
  shouldForwardProp: (prop) => !['$isOpen'].includes(prop),
})<{ $isOpen: boolean }>`
  display: ${({ $isOpen }) => ($isOpen ? 'flex' : 'none')};
  align-items: center;
  gap: 12px;
  
  .logo {
    width: 40px;
    height: 40px;
    background: rgba(255, 255, 255, 0.2);
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 20px;
    font-weight: 800;
  }
  
  .brand-name {
    font-size: 20px;
    font-weight: 700;
    letter-spacing: -0.5px;
  }
  
  @media (max-width: 767px) {
    display: flex;
  }
`;

const ToggleButton = styled.button`
  background: rgba(255, 255, 255, 0.1);
  border: none;
  color: white;
  width: 36px;
  height: 36px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
  flex-shrink: 0; /* 추가: 버튼 크기 고정 */
  
  &:hover {
    background: rgba(255, 255, 255, 0.2);
    transform: scale(1.05);
  }
  
  @media (max-width: 767px) {
    position: absolute;
    right: 20px;
    top: 22px;
  }
`;

// 메인 네비게이션
const NavigationSection = styled.nav.withConfig({
  shouldForwardProp: (prop) => !['$isOpen'].includes(prop),
})<{ $isOpen: boolean }>`
  flex: 1; /* 추가: 남은 공간 모두 차지 */
  padding: 20px 0;
  display: ${({ $isOpen }) => ($isOpen ? 'flex' : 'none')};
  flex-direction: column;
  gap: 8px;
  overflow-y: auto; /* 추가: 내비게이션 영역 스크롤 */
  overflow-x: hidden;
  
  @media (max-width: 767px) {
    display: flex;
  }
  
  /* 내비게이션 영역만의 스크롤바 */
  &::-webkit-scrollbar {
    width: 4px;
  }
  
  &::-webkit-scrollbar-track {
    background: transparent;
  }
  
  &::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.2);
    border-radius: 2px;
  }
`;

const NavItem = React.memo(styled.div.withConfig({
  shouldForwardProp: (prop) => !['$isActive', '$isOpen'].includes(prop),
})<{ $isActive: boolean; $isOpen: boolean }>`
  margin: 0 12px;
  
  a {
    display: flex;
    align-items: center;
    gap: 16px;
    padding: 12px 16px;
    color: white;
    text-decoration: none;
    border-radius: 12px;
    transition: all 0.2s ease;
    position: relative;
    overflow: hidden;
    
    /* Active 상태 */
    ${({ $isActive }) =>
      $isActive &&
      `
      background: rgba(255, 255, 255, 0.15);
      
      &::before {
        content: '';
        position: absolute;
        left: 0;
        top: 50%;
        transform: translateY(-50%);
        width: 4px;
        height: 24px;
        background: white;
        border-radius: 0 2px 2px 0;
      }
    `}
    
    &:hover {
      background: rgba(255, 255, 255, 0.1);
      transform: translateX(4px);
    }
    
    .nav-icon {
      width: 20px;
      height: 20px;
      flex-shrink: 0;
    }
    
    .nav-label {
      font-size: 14px;
      font-weight: 500;
      opacity: ${({ $isOpen }) => ($isOpen ? 1 : 0)};
      transition: opacity 0.2s ease;
      white-space: nowrap;
      
      @media (max-width: 767px) {
        opacity: 1;
      }
    }
  }
`,(prevProps, nextProps) => {
  return (
    prevProps.$isActive === nextProps.$isActive &&
    prevProps.$isOpen === nextProps.$isOpen
  );
});

// 계정 섹션
const AccountSection = styled.div.withConfig({
  shouldForwardProp: (prop) => !['$isOpen'].includes(prop),
})<{ $isOpen: boolean }>`
  padding: 20px 12px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  display: ${({ $isOpen }) => ($isOpen ? 'flex' : 'none')};
  flex-direction: column;
  gap: 8px;
  flex-shrink: 0; /* 추가: 계정 섹션 크기 고정 */
  
  @media (max-width: 767px) {
    display: flex;
  }
`;

// 하단 테마 토글 섹션
const BottomSection = styled.div.withConfig({
  shouldForwardProp: (prop) => !['$isOpen'].includes(prop),
})<{ $isOpen: boolean }>`
  padding: 20px 12px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  display: ${({ $isOpen }) => ($isOpen ? 'block' : 'none')};
  flex-shrink: 0; /* 추가: 하단 섹션 크기 고정 */
  
  @media (max-width: 767px) {
    display: block;
  }
  
  .theme-toggle {
    display: flex;
    align-items: center;
    gap: 16px;
    padding: 12px 16px;
    background: rgba(255, 255, 255, 0.1);
    border: none;
    color: white;
    border-radius: 12px;
    cursor: pointer;
    transition: all 0.2s ease;
    width: 100%;
    justify-content: flex-start;
    
    &:hover {
      background: rgba(255, 255, 255, 0.15);
    }
    
    .theme-icon {
      width: 20px;
      height: 20px;
      flex-shrink: 0;
    }
    
    .theme-label {
      font-size: 14px;
      font-weight: 500;
    }
  }
`;

// ================================================================
// Component
// ================================================================

interface SidebarProps {
  className?: string;
}

export const Sidebar: React.FC<SidebarProps> = ({ className }) => {
  const router = useRouter();
  const pathname = usePathname();
  const { sidebar, toggleSidebar } = useUIStore();
  const { isAuthenticated, logout, user } = useAuthStore();
  const [isDarkTheme, setIsDarkTheme] = React.useState(false);
  const [isMobile, setIsMobile] = React.useState(false);

  // 모바일 감지
  React.useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // 네비게이션 아이템 정의
  const navItems = [
    { path: '/', label: '홈', icon: Home },
    { path: '/about', label: '소개', icon: Info },
    { path: '/community', label: '게시판', icon: MessageSquare },
  ];

  // 계정 관련 아이템
  const accountItems = isAuthenticated() ? [
    { path: '/profile', label: user?.name || '프로필', icon: User },
    { action: 'logout', label: '로그아웃', icon: LogIn },
  ] : [
    { path: '/auth/login', label: '로그인', icon: LogIn },
    { path: '/auth/signup', label: '회원가입', icon: UserPlus },
  ];

  const handleNavigation = (path?: string, action?: string) => {
    if (action === 'logout') {
      logout();
      router.push('/');
    } else if (path) {
      router.push(path);
    }
    
    // 모바일에서는 네비게이션 후 사이드바 닫기
    if (isMobile && sidebar.isOpen) {
      toggleSidebar();
    }
  };

  const handleThemeToggle = () => {
    setIsDarkTheme(!isDarkTheme);
    // 여기서 실제 테마 변경 로직 구현
  };

  const handleOverlayClick = () => {
    if (isMobile) {
      toggleSidebar();
    }
  };

  return (
    <>
      {/* 모바일 오버레이 */}
      <AnimatePresence>
        {isMobile && sidebar.isOpen && (
          <SidebarOverlay
            $visible={sidebar.isOpen}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleOverlayClick}
          />
        )}
      </AnimatePresence>

      {/* 사이드바 메인 */}
      <SidebarContainer
        $isOpen={sidebar.isOpen}
        $isMobile={isMobile}
        className={className}
        initial={false}
        animate={{
          width: isMobile ? (sidebar.isOpen ? 280 : 0) : (sidebar.isOpen ? 280 : 60)
        }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
      >
        {/* 헤더 섹션 - 햄버거 버튼만 */}
        <HeaderSection $isOpen={sidebar.isOpen}>
          <BrandLogo $isOpen={sidebar.isOpen}>
            <div className="logo">B</div>
            <div className="brand-name">Behindy</div>
          </BrandLogo>
          
          <ToggleButton onClick={toggleSidebar}>
            {sidebar.isOpen ? <X size={20} /> : <Menu size={20} />}
          </ToggleButton>
        </HeaderSection>

        {/* 메인 네비게이션 */}
        <NavigationSection $isOpen={sidebar.isOpen}>
          {navItems.map((item) => (
            <NavItem
              key={item.path}
              $isActive={pathname === item.path}
              $isOpen={sidebar.isOpen}
            >
              <a href="#" onClick={(e) => {
                e.preventDefault();
                handleNavigation(item.path);
              }}>
                <item.icon className="nav-icon" />
                <span className="nav-label">{item.label}</span>
              </a>
            </NavItem>
          ))}
        </NavigationSection>

        {/* 계정 섹션 */}
        <AccountSection $isOpen={sidebar.isOpen}>
          {accountItems.map((item, index) => (
            <NavItem
              key={item.path || item.action || index}
              $isActive={false}
              $isOpen={sidebar.isOpen}
            >
              <a href="#" onClick={(e) => {
                e.preventDefault();
                handleNavigation(item.path, item.action);
              }}>
                <item.icon className="nav-icon" />
                <span className="nav-label">{item.label}</span>
              </a>
            </NavItem>
          ))}
        </AccountSection>

        {/* 하단 테마 토글 */}
        <BottomSection $isOpen={sidebar.isOpen}>
          <button className="theme-toggle" onClick={handleThemeToggle}>
            {isDarkTheme ? (
              <Sun className="theme-icon" />
            ) : (
              <Moon className="theme-icon" />
            )}
            <span className="theme-label">
              {isDarkTheme ? '라이트 모드' : '다크 모드'} | 공사중
            </span>
          </button>
        </BottomSection>
      </SidebarContainer>
    </>
  );
};

export default Sidebar;