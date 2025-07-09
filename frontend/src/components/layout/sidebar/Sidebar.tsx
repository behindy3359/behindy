"use client";

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Home, 
  Info,
  MessageSquare, 
  User, 
  LogIn, 
  UserPlus, 
  Menu,
  X,
  Sun,
  Moon
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
  height: 100vh;
  background: ${gradients.primary};
  color: white;
  z-index: 1000;
  display: flex;
  flex-direction: column;
  box-shadow: 2px 0 8px rgba(0, 0, 0, 0.15);
  overflow-y: auto;
  overflow-x: hidden;
  
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
  
  @media (min-width: 768px) {
    width: ${({ $isOpen }) => ($isOpen ? '280px' : '60px')};
    transition: width 0.3s ease;
  }
  
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

const HeaderSection = styled.div.withConfig({
  shouldForwardProp: (prop) => !['$isOpen'].includes(prop),
})<{ $isOpen: boolean }>`
  padding: 20px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  display: flex;
  align-items: center;
  justify-content: ${({ $isOpen }) => ($isOpen ? 'space-between' : 'center')};
  min-height: 80px;
  flex-shrink: 0;
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
  flex-shrink: 0;
  
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

const NavigationSection = styled.nav.withConfig({
  shouldForwardProp: (prop) => !['$isOpen'].includes(prop),
})<{ $isOpen: boolean }>`
  flex: 1;
  padding: 20px 0;
  display: ${({ $isOpen }) => ($isOpen ? 'flex' : 'none')};
  flex-direction: column;
  gap: 8px;
  overflow-y: auto;
  overflow-x: hidden;
  
  @media (max-width: 767px) {
    display: flex;
  }
  
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

// 🔥 최적화된 NavItem 컴포넌트
const StyledNavItem = styled.div.withConfig({
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
`;

// 🔥 최적화된 NavItem 컴포넌트
const NavItem = React.memo<{
  path: string;
  label: string;
  icon: React.ComponentType<{ className?: string; size?: number }>;
  isActive: boolean;
  isOpen: boolean;
  onClick: (path: string, action?: string) => void;
  action?: string;
}>(function NavItem({ path, label, icon: Icon, isActive, isOpen, onClick, action }) {
  
  const handleClick = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    onClick(path, action);
  }, [path, action, onClick]);

  return (
    <StyledNavItem $isActive={isActive} $isOpen={isOpen}>
      <a href="#" onClick={handleClick}>
        <Icon className="nav-icon" size={20} />
        <span className="nav-label">{label}</span>
      </a>
    </StyledNavItem>
  );
}, (prevProps, nextProps) => {
  return (
    prevProps.isActive === nextProps.isActive &&
    prevProps.path === nextProps.path &&
    prevProps.label === nextProps.label &&
    prevProps.isOpen === nextProps.isOpen
  );
});

const AccountSection = styled.div.withConfig({
  shouldForwardProp: (prop) => !['$isOpen'].includes(prop),
})<{ $isOpen: boolean }>`
  padding: 20px 12px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  display: ${({ $isOpen }) => ($isOpen ? 'flex' : 'none')};
  flex-direction: column;
  gap: 8px;
  flex-shrink: 0;
  
  @media (max-width: 767px) {
    display: flex;
  }
`;

const BottomSection = styled.div.withConfig({
  shouldForwardProp: (prop) => !['$isOpen'].includes(prop),
})<{ $isOpen: boolean }>`
  padding: 20px 12px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  display: ${({ $isOpen }) => ($isOpen ? 'block' : 'none')};
  flex-shrink: 0;
  
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
  const [isDarkTheme, setIsDarkTheme] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // 🔥 모바일 감지 최적화
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    const handleResize = () => checkMobile();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // 🔥 네비게이션 아이템 메모이제이션
  const navItems = useMemo(() => [
    { path: '/', label: '홈', icon: Home },
    { path: '/about', label: '소개', icon: Info },
    { path: '/community', label: '게시판', icon: MessageSquare },
  ], []);

  // 🔥 계정 관련 아이템 메모이제이션
  const accountItems = useMemo(() => 
    isAuthenticated() ? [
      { path: '/profile', label: user?.name || '프로필', icon: User },
      { action: 'logout', label: '로그아웃', icon: LogIn },
    ] : [
      { path: '/auth/login', label: '로그인', icon: LogIn },
      { path: '/auth/signup', label: '회원가입', icon: UserPlus },
    ], [isAuthenticated, user?.name]
  );

  // 🔥 네비게이션 핸들러 메모이제이션
  const handleNavigation = useCallback((path?: string, action?: string) => {
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
  }, [logout, router, isMobile, sidebar.isOpen, toggleSidebar]);

  // 🔥 테마 토글 핸들러
  const handleThemeToggle = useCallback(() => {
    setIsDarkTheme(!isDarkTheme);
  }, [isDarkTheme]);

  // 🔥 오버레이 클릭 핸들러
  const handleOverlayClick = useCallback(() => {
    if (isMobile) {
      toggleSidebar();
    }
  }, [isMobile, toggleSidebar]);

  return (
    <>
      {/* 🔥 모바일 오버레이 */}
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

      {/* 🔥 사이드바 메인 */}
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
        {/* 🔥 헤더 섹션 */}
        <HeaderSection $isOpen={sidebar.isOpen}>
          <BrandLogo $isOpen={sidebar.isOpen}>
            <div className="logo">B</div>
            <div className="brand-name">Behindy</div>
          </BrandLogo>
          
          <ToggleButton onClick={toggleSidebar}>
            {sidebar.isOpen ? <X size={20} /> : <Menu size={20} />}
          </ToggleButton>
        </HeaderSection>

        {/* 🔥 최적화된 메인 네비게이션 */}
        <NavigationSection $isOpen={sidebar.isOpen}>
          {navItems.map((item) => (
            <NavItem
              key={item.path}
              path={item.path}
              label={item.label}
              icon={item.icon}
              isActive={pathname === item.path}
              isOpen={sidebar.isOpen}
              onClick={handleNavigation}
            />
          ))}
        </NavigationSection>

        {/* 🔥 최적화된 계정 섹션 */}
        <AccountSection $isOpen={sidebar.isOpen}>
          {accountItems.map((item, index) => (
            <NavItem
              key={item.path || item.action || index}
              path={item.path || ''}
              label={item.label}
              icon={item.icon}
              isActive={false}
              isOpen={sidebar.isOpen}
              onClick={handleNavigation}
              action={item.action}
            />
          ))}
        </AccountSection>

        {/* 🔥 하단 테마 토글 */}
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