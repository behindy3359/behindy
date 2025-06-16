// src/components/layout/Header/Header.tsx
"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User, 
  LogOut, 
  Settings, 
  Menu, 
  X, 
  Home, 
  Map, 
  GamepadIcon,
  MessageSquare,
  Trophy
} from 'lucide-react';
import { Button } from '../../ui';
import { useAuthStore } from '../../../store/authStore';

interface HeaderProps {
  onMenuToggle?: () => void;
  isMenuOpen?: boolean;
}

const HeaderContainer = styled.header`
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  padding: 0 20px;
  height: 70px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: sticky;
  top: 0;
  z-index: 100;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
`;

const LeftSection = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
`;

const Logo = styled(motion.div)`
  display: flex;
  align-items: center;
  gap: 12px;
  cursor: pointer;
  
  h1 {
    font-size: 24px;
    font-weight: 800;
    color: #667eea;
    margin: 0;
    letter-spacing: -0.02em;
  }
  
  .logo-icon {
    width: 32px;
    height: 32px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    font-weight: bold;
    font-size: 18px;
  }
`;

const Navigation = styled.nav`
  display: flex;
  align-items: center;
  gap: 8px;
  
  @media (max-width: 768px) {
    display: none;
  }
`;

const NavLink = styled(motion.button)<{ $isActive?: boolean }>`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  border: none;
  background: ${({ $isActive }) => $isActive ? '#f0f4ff' : 'transparent'};
  color: ${({ $isActive }) => $isActive ? '#667eea' : '#6b7280'};
  border-radius: 8px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.2s ease;
  
  &:hover {
    background: #f0f4ff;
    color: #667eea;
  }
  
  svg {
    width: 18px;
    height: 18px;
  }
`;

const RightSection = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const UserSection = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  
  @media (max-width: 640px) {
    .user-info {
      display: none;
    }
  }
`;

const UserInfo = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  
  .name {
    font-size: 14px;
    font-weight: 600;
    color: #374151;
  }
  
  .email {
    font-size: 12px;
    color: #6b7280;
  }
`;

const UserMenuButton = styled(motion.button)`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  border: 1px solid #e5e7eb;
  background: white;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    border-color: #667eea;
    box-shadow: 0 2px 8px rgba(102, 126, 234, 0.1);
  }
  
  .avatar {
    width: 32px;
    height: 32px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    font-weight: 600;
    font-size: 14px;
  }
`;

const UserDropdown = styled(motion.div)`
  position: absolute;
  top: 100%;
  right: 0;
  margin-top: 8px;
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
  min-width: 200px;
  overflow: hidden;
  z-index: 200;
`;

const DropdownItem = styled.button`
  width: 100%;
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  border: none;
  background: none;
  cursor: pointer;
  font-size: 14px;
  color: #374151;
  transition: background 0.2s ease;
  
  &:hover {
    background: #f9fafb;
  }
  
  &.danger {
    color: #ef4444;
    
    &:hover {
      background: #fef2f2;
    }
  }
  
  svg {
    width: 16px;
    height: 16px;
  }
`;

const MobileMenuButton = styled(motion.button)`
  display: none;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border: none;
  background: none;
  cursor: pointer;
  color: #6b7280;
  
  @media (max-width: 768px) {
    display: flex;
  }
  
  svg {
    width: 24px;
    height: 24px;
  }
`;

const MobileMenu = styled(motion.div)`
  position: fixed;
  top: 70px;
  left: 0;
  right: 0;
  background: white;
  border-bottom: 1px solid #e5e7eb;
  padding: 20px;
  z-index: 150;
  
  .nav-links {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }
  
  .mobile-nav-link {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 12px 16px;
    border: none;
    background: none;
    cursor: pointer;
    font-size: 16px;
    color: #374151;
    border-radius: 8px;
    transition: background 0.2s ease;
    
    &:hover,
    &.active {
      background: #f0f4ff;
      color: #667eea;
    }
    
    svg {
      width: 20px;
      height: 20px;
    }
  }
`;

const navItems = [
  { icon: Home, label: '홈', path: '/' },
  { icon: Map, label: '지하철 노선도', path: '/subway-map' },
  { icon: GamepadIcon, label: '게임', path: '/game' },
  { icon: MessageSquare, label: '커뮤니티', path: '/community' }
];

export const Header: React.FC<HeaderProps> = ({
  onMenuToggle,
  isMenuOpen = false
}) => {
  const router = useRouter();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [currentPath, setCurrentPath] = useState('/');
  const { user, isAuthenticated, logout } = useAuthStore();

  const handleNavigation = (path: string) => {
    setCurrentPath(path);
    router.push(path);
    setShowMobileMenu(false);
  };

  const handleLogout = async () => {
    await logout();
    setShowUserMenu(false);
    router.push('/auth/login');
  };

  const getUserInitial = (name?: string) => {
    return name ? name.charAt(0).toUpperCase() : 'U';
  };

  return (
    <>
      <HeaderContainer>
        <LeftSection>
          <Logo
            onClick={() => handleNavigation('/')}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <div className="logo-icon">B</div>
            <h1>Behindy</h1>
          </Logo>

          <Navigation>
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                $isActive={currentPath === item.path}
                onClick={() => handleNavigation(item.path)}
                whileHover={{ y: -1 }}
                whileTap={{ y: 0 }}
              >
                <item.icon />
                {item.label}
              </NavLink>
            ))}
          </Navigation>
        </LeftSection>

        <RightSection>
          {isAuthenticated() && user ? (
            <UserSection>
              <UserInfo className="user-info">
                <div className="name">{user.name}</div>
                <div className="email">{user.email}</div>
              </UserInfo>
              
              <div style={{ position: 'relative' }}>
                <UserMenuButton
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="avatar">
                    {getUserInitial(user.name)}
                  </div>
                </UserMenuButton>

                <AnimatePresence>
                  {showUserMenu && (
                    <UserDropdown
                      initial={{ opacity: 0, y: -10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -10, scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                    >
                      <DropdownItem onClick={() => {
                        setShowUserMenu(false);
                        router.push('/profile');
                      }}>
                        <User />
                        프로필
                      </DropdownItem>
                      <DropdownItem onClick={() => {
                        setShowUserMenu(false);
                        router.push('/settings');
                      }}>
                        <Settings />
                        설정
                      </DropdownItem>
                      <DropdownItem 
                        className="danger"
                        onClick={handleLogout}
                      >
                        <LogOut />
                        로그아웃
                      </DropdownItem>
                    </UserDropdown>
                  )}
                </AnimatePresence>
              </div>
            </UserSection>
          ) : (
            <div style={{ display: 'flex', gap: '8px' }}>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => router.push('/auth/login')}
              >
                로그인
              </Button>
              <Button 
                variant="primary" 
                size="sm"
                onClick={() => router.push('/auth/signup')}
              >
                회원가입
              </Button>
            </div>
          )}

          <MobileMenuButton
            onClick={() => {
              setShowMobileMenu(!showMobileMenu);
              if (onMenuToggle) {
                onMenuToggle();
              }
            }}
            whileTap={{ scale: 0.95 }}
          >
            {showMobileMenu ? <X /> : <Menu />}
          </MobileMenuButton>
        </RightSection>
      </HeaderContainer>

      {/* 모바일 메뉴 */}
      <AnimatePresence>
        {showMobileMenu && (
          <MobileMenu
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="nav-links">
              {navItems.map((item) => (
                <button
                  key={item.path}
                  className={`mobile-nav-link ${currentPath === item.path ? 'active' : ''}`}
                  onClick={() => handleNavigation(item.path)}
                >
                  <item.icon />
                  {item.label}
                </button>
              ))}
            </div>
          </MobileMenu>
        )}
      </AnimatePresence>

      {/* 모바일 메뉴 오버레이 */}
      {showMobileMenu && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.3)',
            zIndex: 140
          }}
          onClick={() => setShowMobileMenu(false)}
        />
      )}

      {/* 사용자 메뉴 오버레이 */}
      {showUserMenu && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 190
          }}
          onClick={() => setShowUserMenu(false)}
        />
      )}
    </>
  );
};

export default Header;