"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import {
  Home,
  Map,
  GamepadIcon,
  MessageSquare,
  Trophy,
  User,
  Settings,
  HelpCircle,
  ChevronRight,
  Star,
  Clock,
  TrendingUp
} from 'lucide-react';

interface NavigationProps {
  variant?: 'sidebar' | 'breadcrumb' | 'tabs' | 'footer';
  currentPath?: string;
  className?: string;
}

// 네비게이션 아이템 타입
interface NavItem {
  icon: React.ComponentType<any>;
  label: string;
  path: string;
  badge?: number;
  children?: NavItem[];
  description?: string;
}

// 메인 네비게이션 아이템들
const mainNavItems: NavItem[] = [
  {
    icon: Home,
    label: '홈',
    path: '/',
    description: '메인 대시보드'
  },
  {
    icon: Map,
    label: '지하철 노선도',
    path: '/subway-map',
    description: '실시간 지하철 정보 및 스토리 탐색'
  },
  {
    icon: GamepadIcon,
    label: '게임',
    path: '/game',
    badge: 3,
    description: '텍스트 어드벤처 게임',
    children: [
      { icon: Star, label: '새 게임 시작', path: '/game/new' },
      { icon: Clock, label: '이어하기', path: '/game/continue' },
      { icon: Trophy, label: '완료한 스토리', path: '/game/completed' }
    ]
  },
  {
    icon: MessageSquare,
    label: '커뮤니티',
    path: '/community',
    badge: 12,
    description: '다른 플레이어들과 소통',
    children: [
      { icon: MessageSquare, label: '자유게시판', path: '/community/free' },
      { icon: HelpCircle, label: '질문답변', path: '/community/qna' },
      { icon: Star, label: '스토리 후기', path: '/community/reviews' }
    ]
  }
];

// 사용자 관련 네비게이션
const userNavItems: NavItem[] = [
  {
    icon: User,
    label: '프로필',
    path: '/profile',
    description: '내 정보 관리'
  },
  {
    icon: Settings,
    label: '설정',
    path: '/settings',
    description: '환경설정'
  },
  {
    icon: HelpCircle,
    label: '도움말',
    path: '/help',
    description: '게임 가이드 및 FAQ'
  }
];

// 스타일드 컴포넌트들
const NavContainer = styled.nav<{ $variant: string }>`
  ${({ $variant }) => {
    switch ($variant) {
      case 'sidebar':
        return `
          display: flex;
          flex-direction: column;
          gap: 4px;
          padding: 16px 0;
        `;
      case 'breadcrumb':
        return `
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 12px 0;
          border-bottom: 1px solid #e5e7eb;
          margin-bottom: 24px;
        `;
      case 'tabs':
        return `
          display: flex;
          gap: 2px;
          border-bottom: 1px solid #e5e7eb;
          margin-bottom: 24px;
        `;
      case 'footer':
        return `
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 32px;
          padding: 40px 0;
        `;
      default:
        return '';
    }
  }}
`;

const NavItem = styled(motion.div)<{ 
  $variant: string; 
  $isActive?: boolean;
  $hasChildren?: boolean;
}>`
  ${({ $variant, $isActive, $hasChildren }) => {
    const baseStyles = `
      position: relative;
      transition: all 0.2s ease;
    `;
    
    switch ($variant) {
      case 'sidebar':
        return `
          ${baseStyles}
          .nav-link {
            display: flex;
            align-items: center;
            gap: 12px;
            padding: 12px 16px;
            border-radius: 8px;
            text-decoration: none;
            color: ${$isActive ? '#667eea' : '#6b7280'};
            background: ${$isActive ? '#f0f4ff' : 'transparent'};
            cursor: pointer;
            font-weight: ${$isActive ? '600' : '500'};
            
            &:hover {
              background: #f9fafb;
              color: #667eea;
            }
            
            .nav-icon {
              width: 20px;
              height: 20px;
            }
            
            .nav-text {
              flex: 1;
              font-size: 14px;
            }
            
            .nav-badge {
              background: #ef4444;
              color: white;
              border-radius: 10px;
              padding: 2px 6px;
              font-size: 11px;
              font-weight: 600;
              min-width: 18px;
              text-align: center;
            }
            
            .nav-arrow {
              width: 16px;
              height: 16px;
              color: #9ca3af;
              transform: ${$hasChildren ? 'rotate(0deg)' : 'rotate(90deg)'};
              transition: transform 0.2s ease;
            }
          }
        `;
      case 'breadcrumb':
        return `
          ${baseStyles}
          .breadcrumb-item {
            display: flex;
            align-items: center;
            gap: 4px;
            font-size: 14px;
            color: ${$isActive ? '#374151' : '#9ca3af'};
            font-weight: ${$isActive ? '600' : '400'};
            
            .breadcrumb-icon {
              width: 16px;
              height: 16px;
            }
          }
          
          &:not(:last-child)::after {
            content: '';
            width: 4px;
            height: 4px;
            background: #d1d5db;
            border-radius: 50%;
            margin: 0 8px;
          }
        `;
      case 'tabs':
        return `
          ${baseStyles}
          .tab-link {
            padding: 12px 24px;
            border-bottom: 2px solid transparent;
            color: ${$isActive ? '#667eea' : '#6b7280'};
            font-weight: ${$isActive ? '600' : '500'};
            cursor: pointer;
            transition: all 0.2s ease;
            border-bottom-color: ${$isActive ? '#667eea' : 'transparent'};
            
            &:hover {
              color: #667eea;
            }
          }
        `;
      case 'footer':
        return `
          ${baseStyles}
          .footer-section {
            h3 {
              font-size: 16px;
              font-weight: 600;
              color: #374151;
              margin-bottom: 16px;
            }
            
            .footer-links {
              display: flex;
              flex-direction: column;
              gap: 8px;
            }
            
            .footer-link {
              display: flex;
              align-items: center;
              gap: 8px;
              color: #6b7280;
              text-decoration: none;
              font-size: 14px;
              
              &:hover {
                color: #667eea;
              }
              
              .footer-icon {
                width: 16px;
                height: 16px;
              }
            }
          }
        `;
      default:
        return baseStyles;
    }
  }}
`;

const SubNav = styled(motion.div)`
  margin-left: 32px;
  margin-top: 4px;
  display: flex;
  flex-direction: column;
  gap: 2px;
  
  .subnav-item {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 8px 12px;
    border-radius: 6px;
    color: #9ca3af;
    font-size: 13px;
    cursor: pointer;
    transition: all 0.2s ease;
    
    &:hover,
    &.active {
      background: #f3f4f6;
      color: #667eea;
    }
    
    .subnav-icon {
      width: 16px;
      height: 16px;
    }
  }
`;

// 메인 Navigation 컴포넌트
export const Navigation: React.FC<NavigationProps> = ({
  variant = 'sidebar',
  currentPath = '/',
  className
}) => {
  const router = useRouter();
  const [expandedItems, setExpandedItems] = useState<string[]>([]);

  const handleItemClick = (item: NavItem) => {
    if (item.children) {
      // 자식이 있는 경우 확장/축소 토글
      setExpandedItems(prev => 
        prev.includes(item.path)
          ? prev.filter(path => path !== item.path)
          : [...prev, item.path]
      );
    } else {
      // 자식이 없는 경우 네비게이션
      router.push(item.path);
    }
  };

  const isActive = (path: string) => currentPath === path;
  const isExpanded = (path: string) => expandedItems.includes(path);

  // Breadcrumb 렌더링
  if (variant === 'breadcrumb') {
    const pathSegments = currentPath.split('/').filter(Boolean);
    const breadcrumbs = [
      { icon: Home, label: '홈', path: '/' },
      ...pathSegments.map((segment, index) => {
        const path = '/' + pathSegments.slice(0, index + 1).join('/');
        const item = [...mainNavItems, ...userNavItems].find(item => 
          item.path === path || item.children?.some(child => child.path === path)
        );
        return {
          icon: item?.icon || Home,
          label: item?.label || segment,
          path
        };
      })
    ];

    return (
      <NavContainer $variant={variant} className={className}>
        {breadcrumbs.map((crumb, index) => (
          <NavItem
            key={crumb.path}
            $variant={variant}
            $isActive={index === breadcrumbs.length - 1}
            onClick={() => router.push(crumb.path)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <div className="breadcrumb-item">
              <crumb.icon className="breadcrumb-icon" />
              {crumb.label}
            </div>
          </NavItem>
        ))}
      </NavContainer>
    );
  }

  // Footer 네비게이션 렌더링
  if (variant === 'footer') {
    return (
      <NavContainer $variant={variant} className={className}>
        <NavItem $variant={variant}>
          <div className="footer-section">
            <h3>메인 메뉴</h3>
            <div className="footer-links">
              {mainNavItems.map(item => (
                <a
                  key={item.path}
                  href={item.path}
                  className="footer-link"
                >
                  <item.icon className="footer-icon" />
                  {item.label}
                </a>
              ))}
            </div>
          </div>
        </NavItem>
        
        <NavItem $variant={variant}>
          <div className="footer-section">
            <h3>계정</h3>
            <div className="footer-links">
              {userNavItems.map(item => (
                <a
                  key={item.path}
                  href={item.path}
                  className="footer-link"
                >
                  <item.icon className="footer-icon" />
                  {item.label}
                </a>
              ))}
            </div>
          </div>
        </NavItem>
        
        <NavItem $variant={variant}>
          <div className="footer-section">
            <h3>정보</h3>
            <div className="footer-links">
              <a href="/about" className="footer-link">
                <HelpCircle className="footer-icon" />
                서비스 소개
              </a>
              <a href="/terms" className="footer-link">
                <Settings className="footer-icon" />
                이용약관
              </a>
              <a href="/privacy" className="footer-link">
                <User className="footer-icon" />
                개인정보처리방침
              </a>
            </div>
          </div>
        </NavItem>
      </NavContainer>
    );
  }

  // 기본 (sidebar/tabs) 렌더링
  const renderNavItems = (items: NavItem[]) => {
    return items.map(item => (
      <div key={item.path}>
        <NavItem
          $variant={variant}
          $isActive={isActive(item.path)}
          $hasChildren={Boolean(item.children)}
          onClick={() => handleItemClick(item)}
          whileHover={{ x: variant === 'sidebar' ? 2 : 0 }}
          whileTap={{ scale: 0.98 }}
        >
          <div className={variant === 'tabs' ? 'tab-link' : 'nav-link'}>
            <item.icon className="nav-icon" />
            <span className="nav-text">{item.label}</span>
            {item.badge && item.badge > 0 && (
              <span className="nav-badge">{item.badge}</span>
            )}
            {item.children && variant === 'sidebar' && (
              <ChevronRight 
                className="nav-arrow"
                style={{
                  transform: isExpanded(item.path) ? 'rotate(90deg)' : 'rotate(0deg)'
                }}
              />
            )}
          </div>
        </NavItem>
        
        {/* 하위 메뉴 */}
        {item.children && variant === 'sidebar' && isExpanded(item.path) && (
          <SubNav
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            {item.children.map(child => (
              <div
                key={child.path}
                className={`subnav-item ${isActive(child.path) ? 'active' : ''}`}
                onClick={() => router.push(child.path)}
              >
                <child.icon className="subnav-icon" />
                {child.label}
              </div>
            ))}
          </SubNav>
        )}
      </div>
    ));
  };

  return (
    <NavContainer $variant={variant} className={className}>
      {renderNavItems(mainNavItems)}
      {variant === 'sidebar' && (
        <>
          <div style={{ margin: '16px 0', height: '1px', background: '#e5e7eb' }} />
          {renderNavItems(userNavItems)}
        </>
      )}
    </NavContainer>
  );
};

export default Navigation;