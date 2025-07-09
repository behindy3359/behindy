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
import { SidebarProps } from './types';
import { AccountSection, BottomSection, BrandLogo, HeaderSection, NavigationSection, SidebarContainer, SidebarOverlay, ToggleButton } from './styles';
import { NavItem } from './inner/NavItem';

export const Sidebar: React.FC<SidebarProps> = ({ className }) => {
  const router = useRouter();
  const pathname = usePathname();
  const { sidebar, toggleSidebar } = useUIStore();
  const { isAuthenticated, logout, user } = useAuthStore();
  const [isDarkTheme, setIsDarkTheme] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    const handleResize = () => checkMobile();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const navItems = useMemo(() => [
    { path: '/', label: '홈', icon: Home },
    { path: '/about', label: '소개', icon: Info },
    { path: '/community', label: '게시판', icon: MessageSquare },
  ], []);

  const accountItems = useMemo(() => 
    isAuthenticated() ? [
      { path: '/profile', label: user?.name || '프로필', icon: User },
      { action: 'logout', label: '로그아웃', icon: LogIn },
    ] : [
      { path: '/auth/login', label: '로그인', icon: LogIn },
      { path: '/auth/signup', label: '회원가입', icon: UserPlus },
    ], [isAuthenticated, user?.name]
  );

  const handleNavigation = useCallback((path?: string, action?: string) => {
    if (action === 'logout') {
      logout();
      router.push('/');
    } else if (path) {
      router.push(path);
    }
    
    if (isMobile && sidebar.isOpen) {
      toggleSidebar();
    }
  }, [logout, router, isMobile, sidebar.isOpen, toggleSidebar]);

  const handleThemeToggle = useCallback(() => {
    setIsDarkTheme(!isDarkTheme);
  }, [isDarkTheme]);

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