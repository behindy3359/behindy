import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Home, 
  Info,
  MessageSquare, 
  User, 
  LogIn, 
  UserPlus, 
  LogOut,
  ChevronLeft,
  Sun,
  Moon,
  Settings,
  Gamepad2,
  Menu
} from 'lucide-react';
import { useAuthStore } from '@/store/authStore';

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
  isDarkMode?: boolean;
  onThemeToggle?: () => void;
  currentPath?: string;
  user?: {
    id: number;
    name: string;
    email: string;
    isAuthenticated: boolean;
  } | null;
}

// 낮 모드 메뉴 (퍼블릭)
const dayNavItems = [
  { icon: Home, label: '홈', path: '/', id: 'home' },
  { icon: Info, label: '소개', path: '/about', id: 'about' },
  { icon: MessageSquare, label: '게시판', path: '/community', id: 'community' }
];

// 밤 모드 메뉴 (게임/개인 기능)
const nightNavItems = [
  { icon: Gamepad2, label: '게임', path: '/game', id: 'game' },
  { icon: Settings, label: '캐릭터', path: '/character', id: 'character' },
  { icon: User, label: '기록', path: '/records', id: 'records' }
];

const SidebarContainer = styled(motion.aside)<{ 
  $isOpen: boolean; 
  $isCollapsed: boolean;
  $isDarkMode: boolean;
}>`
  position: fixed;
  left: 0;
  top: 0;
  width: ${({ $isCollapsed }) => $isCollapsed ? '60px' : '280px'};
  height: 100vh;
  background: ${({ $isDarkMode }) => $isDarkMode ? '#1f2937' : '#ffffff'};
  border-right: 1px solid ${({ $isDarkMode }) => $isDarkMode ? '#374151' : '#e5e7eb'};
  box-shadow: ${({ $isOpen }) => $isOpen ? '2px 0 10px rgba(0, 0, 0, 0.1)' : 'none'};
  z-index: 1000;
  transition: width 0.3s ease, transform 0.3s ease; /* 🎯 width 전환 추가 */
  overflow: hidden;
  transform: ${({ $isOpen }) => $isOpen ? 'translateX(0)' : 'translateX(-100%)'};
  
  @media (min-width: 1200px) {
    transform: translateX(0);
    box-shadow: none;
    border-right: 1px solid ${({ $isDarkMode }) => $isDarkMode ? '#374151' : '#e5e7eb'};
  }
`;

const SidebarHeader = styled.div<{ $isDarkMode: boolean; $isCollapsed: boolean }>`
  display: flex;
  align-items: center;
  justify-content: ${({ $isCollapsed }) => $isCollapsed ? 'center' : 'space-between'};
  padding: ${({ $isCollapsed }) => $isCollapsed ? '16px 8px' : '16px 20px'};
  border-bottom: 1px solid ${({ $isDarkMode }) => $isDarkMode ? '#374151' : '#f3f4f6'};
  min-height: 70px;
`;

// 🎯 로고 섹션을 클릭 가능하게 수정
const LogoSection = styled.div<{ $isCollapsed: boolean }>`
  display: flex;
  align-items: center;
  gap: 12px;
  cursor: pointer; /* 🎯 클릭 가능 표시 */
  padding: 4px 8px;
  border-radius: 8px;
  transition: all 0.2s ease;
  
  &:hover {
    background: rgba(102, 126, 234, 0.1);
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
    flex-shrink: 0;
  }
  
  .brand-name {
    font-size: 20px;
    font-weight: 800;
    color: #667eea;
    opacity: ${({ $isCollapsed }) => $isCollapsed ? '0' : '1'};
    transition: opacity 0.3s ease;
    white-space: nowrap;
    overflow: hidden; /* 🎯 넘침 방지 */
  }
`;

const CollapseButton = styled(motion.button)<{ $isDarkMode: boolean; $isCollapsed: boolean }>`
  display: none;
  width: 32px;
  height: 32px;
  border: none;
  background: ${({ $isDarkMode }) => $isDarkMode ? '#374151' : '#f3f4f6'};
  border-radius: 6px;
  cursor: pointer;
  color: ${({ $isDarkMode }) => $isDarkMode ? '#d1d5db' : '#6b7280'};
  transition: all 0.2s ease;
  flex-shrink: 0; /* 🎯 버튼 크기 고정 */
  
  &:hover {
    background: ${({ $isDarkMode }) => $isDarkMode ? '#4b5563' : '#e5e7eb'};
    color: ${({ $isDarkMode }) => $isDarkMode ? '#f9fafb' : '#374151'};
  }
  
  @media (min-width: 1200px) {
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  svg {
    width: 16px;
    height: 16px;
    transform: ${({ $isCollapsed }) => $isCollapsed ? 'rotate(180deg)' : 'rotate(0deg)'};
    transition: transform 0.3s ease;
  }
`;

const SidebarContent = styled.div<{ $isCollapsed: boolean }>`
  display: flex;
  flex-direction: column;
  height: calc(100vh - 70px);
  padding: ${({ $isCollapsed }) => $isCollapsed ? '16px 8px' : '16px 20px'};
  overflow-y: auto;
  overflow-x: hidden; /* 🎯 가로 스크롤 방지 */
  
  /* 커스텀 스크롤바 */
  &::-webkit-scrollbar {
    width: 4px;
  }
  
  &::-webkit-scrollbar-track {
    background: transparent;
  }
  
  &::-webkit-scrollbar-thumb {
    background: #d1d5db;
    border-radius: 2px;
    
    &:hover {
      background: #9ca3af;
    }
  }
`;

const NavSection = styled.div`
  margin-bottom: 32px;
`;

const SectionTitle = styled.h3<{ $isDarkMode: boolean; $isCollapsed: boolean }>`
  font-size: 12px;
  font-weight: 700;
  color: ${({ $isDarkMode }) => $isDarkMode ? '#9ca3af' : '#6b7280'};
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin: 0 0 12px 0;
  opacity: ${({ $isCollapsed }) => $isCollapsed ? '0' : '1'};
  transition: opacity 0.3s ease;
  padding-left: 4px;
  white-space: nowrap; /* 🎯 텍스트 줄바꿈 방지 */
  overflow: hidden;
`;

const NavItem = styled(motion.div)<{ 
  $isActive: boolean; 
  $isDarkMode: boolean;
  $isCollapsed: boolean;
}>`
  .nav-link {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: ${({ $isCollapsed }) => $isCollapsed ? '12px 8px' : '12px 16px'};
    border-radius: 8px;
    text-decoration: none;
    color: ${({ $isActive, $isDarkMode }) => {
      if ($isActive) return '#667eea';
      return $isDarkMode ? '#d1d5db' : '#6b7280';
    }};
    background: ${({ $isActive, $isDarkMode }) => {
      if ($isActive) return $isDarkMode ? 'rgba(102, 126, 234, 0.2)' : '#f0f4ff';
      return 'transparent';
    }};
    cursor: pointer;
    font-weight: ${({ $isActive }) => $isActive ? '600' : '500'};
    font-size: 14px;
    transition: all 0.2s ease;
    position: relative;
    justify-content: ${({ $isCollapsed }) => $isCollapsed ? 'center' : 'flex-start'};
    
    &:hover {
      background: ${({ $isDarkMode }) => $isDarkMode ? '#374151' : '#f9fafb'};
      color: ${({ $isDarkMode }) => $isDarkMode ? '#f9fafb' : '#667eea'};
    }
    
    .nav-icon {
      width: 20px;
      height: 20px;
      flex-shrink: 0;
    }
    
    .nav-text {
      opacity: ${({ $isCollapsed }) => $isCollapsed ? '0' : '1'};
      transition: opacity 0.3s ease;
      white-space: nowrap;
      overflow: hidden;
      min-width: ${({ $isCollapsed }) => $isCollapsed ? '0' : 'auto'};
    }
  }
`;

const AccountSection = styled.div<{ $isCollapsed: boolean }>`
  margin-top: auto;
  margin-bottom: 7vh;
  padding-top: 16px;
  border-top: 1px solid #f3f4f6;
`;

const UserInfo = styled.div<{ $isDarkMode: boolean; $isCollapsed: boolean }>`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: ${({ $isCollapsed }) => $isCollapsed ? '8px' : '12px 16px'};
  margin-bottom: 12px;
  background: ${({ $isDarkMode }) => $isDarkMode ? '#374151' : '#f8fafc'};
  border-radius: 8px;
  justify-content: ${({ $isCollapsed }) => $isCollapsed ? 'center' : 'flex-start'};
  overflow: hidden; /* 🎯 넘침 방지 */
  
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
    flex-shrink: 0;
  }
  
  .user-details {
    opacity: ${({ $isCollapsed }) => $isCollapsed ? '0' : '1'};
    transition: opacity 0.3s ease;
    overflow: hidden;
    min-width: 0; /* 🎯 flexbox 넘침 방지 */
    
    .name {
      font-size: 14px;
      font-weight: 600;
      color: ${({ $isDarkMode }) => $isDarkMode ? '#f9fafb' : '#374151'};
      margin-bottom: 2px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    
    .email {
      font-size: 12px;
      color: ${({ $isDarkMode }) => $isDarkMode ? '#9ca3af' : '#6b7280'};
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }
`;

const ThemeToggleButton = styled(motion.button)<{ 
  $isDarkMode: boolean; 
  $isCollapsed: boolean 
}>`
  display: flex;
  align-items: center;
  gap: 12px;
  width: 100%;
  padding: ${({ $isCollapsed }) => $isCollapsed ? '12px 8px' : '12px 16px'};
  border: none;
  background: transparent;
  color: ${({ $isDarkMode }) => $isDarkMode ? '#d1d5db' : '#6b7280'};
  border-radius: 8px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.2s ease;
  justify-content: ${({ $isCollapsed }) => $isCollapsed ? 'center' : 'flex-start'};
  overflow: hidden; /* 🎯 넘침 방지 */
  
  &:hover {
    background: ${({ $isDarkMode }) => $isDarkMode ? '#374151' : '#f9fafb'};
    color: ${({ $isDarkMode }) => $isDarkMode ? '#f9fafb' : '#667eea'};
  }
  
  .theme-icon {
    width: 20px;
    height: 20px;
    flex-shrink: 0;
  }
  
  .theme-text {
    opacity: ${({ $isCollapsed }) => $isCollapsed ? '0' : '1'};
    transition: opacity 0.3s ease;
    white-space: nowrap;
    overflow: hidden;
    min-width: 0;
  }
`;

// 접힌 상태에서 보여질 메뉴 버튼
const CollapsedMenuButton = styled(motion.button)<{ $isDarkMode: boolean }>`
  width: 44px;
  height: 44px;
  border: none;
  background: ${({ $isDarkMode }) => $isDarkMode ? '#374151' : '#f3f4f6'};
  border-radius: 8px;
  cursor: pointer;
  color: ${({ $isDarkMode }) => $isDarkMode ? '#d1d5db' : '#6b7280'};
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 8px auto;
  
  &:hover {
    background: ${({ $isDarkMode }) => $isDarkMode ? '#4b5563' : '#e5e7eb'};
    color: ${({ $isDarkMode }) => $isDarkMode ? '#f9fafb' : '#374151'};
    transform: scale(1.05);
  }
  
  svg {
    width: 20px;
    height: 20px;
  }
`;

// 접힌 상태 콘텐츠 - 햄버거 버튼만
const CollapsedContent = styled.div`
  display: flex;
  flex-direction: column;
  padding: 20px 8px;
  height: 100vh;
  align-items: center;
  justify-content: flex-start;
`;

// 모바일 오버레이
const MobileOverlay = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 999;
  
  @media (min-width: 1200px) {
    display: none;
  }
`;

export const Sidebar: React.FC<SidebarProps> = ({
  isOpen = true,
  onClose,
  isCollapsed = false,
  onToggleCollapse,
  isDarkMode = false,
  onThemeToggle,
  currentPath = '/',
  user: propUser = null
}) => {
  const router = useRouter();
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  
  // AuthStore에서 실제 사용자 정보 가져오기
  const { user: storeUser, isAuthenticated, logout } = useAuthStore();
  
  // PropUser가 있으면 그것을 사용하고, 없으면 store의 user 사용
  const currentUser = propUser || storeUser;
  const isLoggedIn = currentUser?.isAuthenticated || isAuthenticated();

  const handleNavigation = (path: string) => {
    router.push(path);
    // 모바일에서는 네비게이션 후 사이드바 닫기
    if (window.innerWidth < 1200 && onClose) {
      onClose();
    }
  };

  // 🎯 로고 클릭 핸들러 추가
  const handleLogoClick = () => {
    router.push('/');
    if (window.innerWidth < 1200 && onClose) {
      onClose();
    }
  };

  const handleAuthAction = async (action: 'login' | 'signup' | 'logout') => {
    if (action === 'logout') {
      try {
        await logout();
        router.push('/');
      } catch (error) {
        console.error('로그아웃 실패:', error);
      }
    } else {
      router.push(`/auth/${action}`);
    }
    
    if (window.innerWidth < 1200 && onClose) {
      onClose();
    }
  };

  const getUserInitial = (name?: string) => {
    return name ? name.charAt(0).toUpperCase() : 'U';
  };

  // 현재 표시할 네비게이션 아이템들 결정
  const visibleNavItems = [...dayNavItems];
  if (isDarkMode) {
    visibleNavItems.push(...nightNavItems);
  }

  return (
    <>
      {/* 모바일 오버레이 */}
      <AnimatePresence>
        {isOpen && (
          <MobileOverlay
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
        )}
      </AnimatePresence>

      {/* 사이드바 */}
      <SidebarContainer
        $isOpen={isOpen}
        $isCollapsed={isCollapsed}
        $isDarkMode={isDarkMode}
        initial={false}
        animate={{ 
          x: isOpen ? 0 : -300
          // 🎯 width는 CSS transition으로 처리하므로 제거
        }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
      >
        {/* 헤더 - 항상 표시 */}
        <SidebarHeader $isDarkMode={isDarkMode} $isCollapsed={isCollapsed}>
          {/* 🎯 로고 섹션에 클릭 이벤트 추가 */}
          <LogoSection $isCollapsed={isCollapsed} onClick={handleLogoClick}>
            <div className="logo-icon">B</div>
            {!isCollapsed && <div className="brand-name">Behindy</div>}
          </LogoSection>
          
          {/* 접기/펼치기 버튼 - 접힌 상태에서도 표시 */}
          <CollapseButton
            $isDarkMode={isDarkMode}
            $isCollapsed={isCollapsed}
            onClick={onToggleCollapse}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            title={isCollapsed ? "메뉴 펼치기" : "메뉴 접기"}
          >
            <ChevronLeft />
          </CollapseButton>
        </SidebarHeader>

        {/* 콘텐츠 - 접힌 상태에서는 숨김 */}
        {!isCollapsed && (
          <SidebarContent $isCollapsed={isCollapsed}>
            {/* 메인 네비게이션 */}
            <NavSection>
              <SectionTitle $isDarkMode={isDarkMode} $isCollapsed={isCollapsed}>
                메인 메뉴
              </SectionTitle>
              
              {visibleNavItems.map((item) => (
                <NavItem
                  key={item.id}
                  $isActive={currentPath === item.path}
                  $isDarkMode={isDarkMode}
                  $isCollapsed={isCollapsed}
                  onHoverStart={() => setHoveredItem(item.id)}
                  onHoverEnd={() => setHoveredItem(null)}
                  whileHover={{ x: 2 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div 
                    className="nav-link"
                    onClick={() => handleNavigation(item.path)}
                  >
                    <item.icon className="nav-icon" />
                    <span className="nav-text">{item.label}</span>
                  </div>
                </NavItem>
              ))}
            </NavSection>

            {/* 계정 섹션 */}
            <AccountSection $isCollapsed={isCollapsed}>
              {isLoggedIn && currentUser ? (
                <>
                  {/* 사용자 정보 */}
                  <UserInfo $isDarkMode={isDarkMode} $isCollapsed={isCollapsed}>
                    <div className="avatar">
                      {getUserInitial(currentUser.name)}
                    </div>
                    <div className="user-details">
                      <div className="name">{currentUser.name}</div>
                      <div className="email">{currentUser.email}</div>
                    </div>
                  </UserInfo>

                  {/* 프로필 버튼 */}
                  <NavItem
                    $isActive={currentPath === '/profile'}
                    $isDarkMode={isDarkMode}
                    $isCollapsed={isCollapsed}
                    whileHover={{ x: 2 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div 
                      className="nav-link"
                      onClick={() => handleNavigation('/profile')}
                    >
                      <User className="nav-icon" />
                      <span className="nav-text">프로필</span>
                    </div>
                  </NavItem>

                  {/* 로그아웃 버튼 */}
                  <NavItem
                    $isActive={false}
                    $isDarkMode={isDarkMode}
                    $isCollapsed={isCollapsed}
                    whileHover={{ x: 2 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div 
                      className="nav-link"
                      onClick={() => handleAuthAction('logout')}
                    >
                      <LogOut className="nav-icon" />
                      <span className="nav-text">로그아웃</span>
                    </div>
                  </NavItem>
                </>
              ) : (
                <>
                  {/* 로그인 버튼 */}
                  <NavItem
                    $isActive={false}
                    $isDarkMode={isDarkMode}
                    $isCollapsed={isCollapsed}
                    whileHover={{ x: 2 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div 
                      className="nav-link"
                      onClick={() => handleAuthAction('login')}
                    >
                      <LogIn className="nav-icon" />
                      <span className="nav-text">로그인</span>
                    </div>
                  </NavItem>

                  {/* 회원가입 버튼 */}
                  <NavItem
                    $isActive={false}
                    $isDarkMode={isDarkMode}
                    $isCollapsed={isCollapsed}
                    whileHover={{ x: 2 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div 
                      className="nav-link"
                      onClick={() => handleAuthAction('signup')}
                    >
                      <UserPlus className="nav-icon" />
                      <span className="nav-text">회원가입</span>
                    </div>
                  </NavItem>
                </>
              )}

              {/* 테마 토글 */}
              <ThemeToggleButton
                $isDarkMode={isDarkMode}
                $isCollapsed={isCollapsed}
                onClick={onThemeToggle}
                whileHover={{ x: 2 }}
                whileTap={{ scale: 0.98 }}
              >
                {isDarkMode ? (
                  <Sun className="theme-icon" />
                ) : (
                  <Moon className="theme-icon" />
                )}
                <span className="theme-text">
                  {isDarkMode ? '낮 모드' : '밤 모드'}
                </span>
              </ThemeToggleButton>
            </AccountSection>
          </SidebarContent>
        )}
      </SidebarContainer>
    </>
  );
};

export default Sidebar;