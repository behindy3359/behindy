// src/components/layout/Sidebar/Sidebar.tsx
"use client";

import React, { useState } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Heart, 
  Brain, 
  User, 
  Clock, 
  MapPin, 
  Star,
  ChevronRight,
  ChevronDown,
  Gamepad2,
  Trophy,
  BookOpen
} from 'lucide-react';
import { useCharacterStore } from '../../../store/characterStore';
import { useGameStore } from '../../../store/gameStore';

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

const SidebarContainer = styled(motion.aside)<{ $isOpen: boolean }>`
  position: fixed;
  left: ${({ $isOpen }) => $isOpen ? '0' : '-300px'};
  top: 70px;
  width: 300px;
  height: calc(100vh - 70px);
  background: white;
  border-right: 1px solid #e5e7eb;
  box-shadow: 2px 0 10px rgba(0, 0, 0, 0.1);
  z-index: 90;
  transition: left 0.3s ease;
  overflow-y: auto;
  
  @media (min-width: 1200px) {
    position: relative;
    left: 0;
    top: 0;
    height: calc(100vh - 70px);
    box-shadow: none;
    border-right: 1px solid #e5e7eb;
  }
  
  @media (max-width: 768px) {
    width: 280px;
  }
`;

const SidebarContent = styled.div`
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

const Section = styled.div`
  .section-title {
    font-size: 14px;
    font-weight: 700;
    color: #374151;
    margin-bottom: 12px;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }
`;

const CharacterCard = styled(motion.div)`
  background: linear-gradient(135deg, #f0f4ff 0%, #e0e7ff 100%);
  border: 1px solid #c7d2fe;
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 16px;
`;

const CharacterHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
  
  .character-info {
    display: flex;
    align-items: center;
    gap: 12px;
  }
  
  .avatar {
    width: 48px;
    height: 48px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    font-weight: 700;
    font-size: 18px;
  }
  
  .details {
    h3 {
      font-size: 16px;
      font-weight: 600;
      color: #374151;
      margin: 0 0 4px 0;
    }
    
    .level {
      font-size: 12px;
      color: #6b7280;
      font-weight: 500;
    }
  }
  
  .status-indicator {
    width: 12px;
    height: 12px;
    border-radius: 50%;
    background: #10b981;
    border: 2px solid white;
  }
`;

const StatsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const StatBar = styled.div`
  .stat-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 6px;
    
    .stat-label {
      display: flex;
      align-items: center;
      gap: 6px;
      font-size: 14px;
      font-weight: 500;
      color: #374151;
      
      svg {
        width: 16px;
        height: 16px;
      }
    }
    
    .stat-value {
      font-size: 14px;
      font-weight: 600;
      color: #6b7280;
    }
  }
  
  .stat-bar {
    height: 8px;
    background: rgba(255, 255, 255, 0.8);
    border-radius: 4px;
    overflow: hidden;
  }
  
  .stat-fill {
    height: 100%;
    border-radius: 4px;
    transition: width 0.3s ease;
  }
  
  &.health .stat-fill {
    background: linear-gradient(90deg, #ef4444, #f87171);
  }
  
  &.sanity .stat-fill {
    background: linear-gradient(90deg, #3b82f6, #60a5fa);
  }
`;

const GameStatus = styled.div`
  background: #f9fafb;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  padding: 16px;
  
  .status-header {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 12px;
    
    h4 {
      font-size: 14px;
      font-weight: 600;
      color: #374151;
      margin: 0;
    }
    
    svg {
      width: 16px;
      height: 16px;
      color: #667eea;
    }
  }
  
  .current-story {
    font-size: 13px;
    color: #6b7280;
    margin-bottom: 8px;
  }
  
  .progress {
    font-size: 12px;
    color: #9ca3af;
  }
`;

const QuickActions = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  
  .action-item {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 12px 16px;
    background: white;
    border: 1px solid #e5e7eb;
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.2s ease;
    
    &:hover {
      background: #f9fafb;
      border-color: #667eea;
    }
    
    svg {
      width: 18px;
      height: 18px;
      color: #667eea;
    }
    
    .action-text {
      font-size: 14px;
      color: #374151;
      font-weight: 500;
    }
    
    .action-arrow {
      margin-left: auto;
      color: #9ca3af;
    }
  }
`;

const RecentActivity = styled.div`
  .activity-list {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }
  
  .activity-item {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 8px 0;
    border-bottom: 1px solid #f3f4f6;
    
    &:last-child {
      border-bottom: none;
    }
    
    .activity-icon {
      width: 32px;
      height: 32px;
      background: #f3f4f6;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      
      svg {
        width: 16px;
        height: 16px;
        color: #6b7280;
      }
    }
    
    .activity-content {
      flex: 1;
      
      .activity-text {
        font-size: 13px;
        color: #374151;
        margin-bottom: 2px;
      }
      
      .activity-time {
        font-size: 11px;
        color: #9ca3af;
      }
    }
  }
`;

const CollapsibleSection = styled.div<{ $isOpen: boolean }>`
  .section-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    cursor: pointer;
    padding: 8px 0;
    
    .section-title {
      margin: 0;
    }
    
    .chevron {
      margin-left: auto;
      color: #9ca3af;
      transition: transform 0.2s ease;
      transform: ${({ $isOpen }) => $isOpen ? 'rotate(90deg)' : 'rotate(0deg)'};
    }
  }
`;

export const Sidebar: React.FC<SidebarProps> = ({
  isOpen = true,
  onClose
}) => {
  const [showRecentActivity, setShowRecentActivity] = useState(true);
  const { currentCharacter } = useCharacterStore();
  const { currentStory, currentPage, character, isPlaying } = useGameStore();

  // 캐릭터 정보 (characterStore 또는 gameStore에서 가져오기)
  const displayCharacter = currentCharacter || character || {
    charName: "모험가123",
    charHealth: 85,
    charSanity: 92,
    isAlive: true
  };

  // 게임 상태 정보
  const gameInfo = currentStory && currentPage ? {
    storyTitle: currentStory.storyTitle,
    currentPage: currentPage.pageNumber || 1,
    totalPages: currentPage.totalPages || 15,
    lastPlayed: "진행 중"
  } : {
    storyTitle: "게임을 시작해보세요",
    currentPage: 0,
    totalPages: 0,
    lastPlayed: "없음"
  };

  const recentActivities = [
    { icon: Gamepad2, text: "새로운 스토리를 시작했습니다", time: "5분 전" },
    { icon: Trophy, text: "업적 '첫 걸음'을 달성했습니다", time: "1시간 전" },
    { icon: BookOpen, text: "스토리 '2호선 미스터리'를 완료했습니다", time: "2시간 전" },
    { icon: Star, text: "레벨 5에 도달했습니다", time: "1일 전" }
  ];

  return (
    <>
      <SidebarContainer 
        $isOpen={isOpen}
        initial={false}
        animate={{ x: isOpen ? 0 : -300 }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
      >
        <SidebarContent>
          {/* 캐릭터 정보 */}
          <Section>
            <div className="section-title">캐릭터</div>
            <CharacterCard
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.2 }}
            >
              <CharacterHeader>
                <div className="character-info">
                  <div className="avatar">
                    {displayCharacter.charName?.charAt(0) || 'U'}
                  </div>
                  <div className="details">
                    <h3>{displayCharacter.charName || '캐릭터 없음'}</h3>
                  </div>
                </div>
                <div className="status-indicator" />
              </CharacterHeader>

              <StatsContainer>
                <StatBar className="health">
                  <div className="stat-header">
                    <div className="stat-label">
                      <Heart />
                      체력
                    </div>
                    <div className="stat-value">{displayCharacter.charHealth || 0}/100</div>
                  </div>
                  <div className="stat-bar">
                    <div 
                      className="stat-fill" 
                      style={{ width: `${displayCharacter.charHealth || 0}%` }} 
                    />
                  </div>
                </StatBar>

                <StatBar className="sanity">
                  <div className="stat-header">
                    <div className="stat-label">
                      <Brain />
                      정신력
                    </div>
                    <div className="stat-value">{displayCharacter.charSanity || 0}/100</div>
                  </div>
                  <div className="stat-bar">
                    <div 
                      className="stat-fill" 
                      style={{ width: `${displayCharacter.charSanity || 0}%` }} 
                    />
                  </div>
                </StatBar>
              </StatsContainer>
            </CharacterCard>
          </Section>

          {/* 게임 상태 */}
          <Section>
            <div className="section-title">진행 중인 게임</div>
            <GameStatus>
              <div className="status-header">
                <MapPin />
                <h4>현재 위치</h4>
              </div>
              <div className="current-story">{gameInfo.storyTitle}</div>
              <div className="progress">
                {gameInfo.totalPages > 0 ? (
                  <>
                    진행률: {gameInfo.currentPage}/{gameInfo.totalPages} 
                    ({Math.round((gameInfo.currentPage / gameInfo.totalPages) * 100)}%)
                  </>
                ) : (
                  '게임을 시작해보세요'
                )}
              </div>
            </GameStatus>
          </Section>

          {/* 빠른 액션 */}
          <Section>
            <div className="section-title">빠른 액션</div>
            <QuickActions>
              <div className="action-item">
                <Gamepad2 />
                <span className="action-text">
                  {isPlaying ? '게임 계속하기' : '새 게임 시작'}
                </span>
                <ChevronRight className="action-arrow" />
              </div>
              <div className="action-item">
                <User />
                <span className="action-text">캐릭터 관리</span>
                <ChevronRight className="action-arrow" />
              </div>
              <div className="action-item">
                <Trophy />
                <span className="action-text">업적 확인</span>
                <ChevronRight className="action-arrow" />
              </div>
            </QuickActions>
          </Section>

          {/* 최근 활동 */}
          <Section>
            <CollapsibleSection $isOpen={showRecentActivity}>
              <div 
                className="section-header"
                onClick={() => setShowRecentActivity(!showRecentActivity)}
              >
                <div className="section-title">최근 활동</div>
                <ChevronRight className="chevron" />
              </div>
              
              <AnimatePresence>
                {showRecentActivity && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <RecentActivity>
                      <div className="activity-list">
                        {recentActivities.map((activity, index) => (
                          <div key={index} className="activity-item">
                            <div className="activity-icon">
                              <activity.icon />
                            </div>
                            <div className="activity-content">
                              <div className="activity-text">{activity.text}</div>
                              <div className="activity-time">{activity.time}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </RecentActivity>
                  </motion.div>
                )}
              </AnimatePresence>
            </CollapsibleSection>
          </Section>
        </SidebarContent>
      </SidebarContainer>

      {/* 모바일 오버레이 */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            style={{
              position: 'fixed',
              top: 70,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'rgba(0, 0, 0, 0.3)',
              zIndex: 80,
              display: 'none'
            }}
            className="mobile-overlay"
            onClick={onClose}
          />
        )}
      </AnimatePresence>
      
      <style jsx>{`
        @media (max-width: 1199px) {
          .mobile-overlay {
            display: block !important;
          }
        }
      `}</style>
    </>
  );
};

export default Sidebar;