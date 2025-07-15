import { motion } from "framer-motion";
import styled from "styled-components";

export const MetroHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 24px 16px 24px;
  border-bottom: 1px solid #f3f4f6;
  background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
  
  h2 {
    font-size: 20px;
    font-weight: 700;
    color: #111827;
    margin: 0;
    display: flex;
    align-items: center;
    gap: 10px;
  }
  
  /* 기본 인디케이터 스타일 */
  .live-indicator,
  .test-indicator,
  .loading-indicator,
  .error-indicator,
  .closed-indicator,
  .limited-indicator,
  .no-data-indicator {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 14px;
    font-weight: 600;
    padding: 4px 8px;
    border-radius: 12px;
    transition: all 0.3s ease;
    
    &::before {
      content: '';
      width: 8px;
      height: 8px;
      border-radius: 50%;
    }
  }
  
  /* LIVE - 실제 실시간 데이터 */
  .live-indicator {
    color: #ef4444;
    background: rgba(239, 68, 68, 0.1);
    
    &::before {
      background: #ef4444;
      animation: pulse 2s infinite;
    }
  }
  
  /* TEST - 목업/테스트 데이터 */
  .test-indicator {
    color: #f59e0b;
    background: rgba(245, 158, 11, 0.1);
    
    &::before {
      background: #f59e0b;
      animation: blink 3s infinite;
    }
  }
  
  /* LOADING - 로딩 중 */
  .loading-indicator {
    color: #6b7280;
    background: rgba(107, 114, 128, 0.1);
    
    &::before {
      background: #6b7280;
      animation: spin 1s linear infinite;
    }
  }
  
  /* ERROR - 에러 상태 */
  .error-indicator {
    color: #ef4444;
    background: rgba(239, 68, 68, 0.1);
    
    &::before {
      background: #ef4444;
      animation: none;
    }
  }
  
  /* CLOSED - 운행 종료 */
  .closed-indicator {
    color: #6b7280;
    background: rgba(107, 114, 128, 0.1);
    
    &::before {
      background: #6b7280;
      animation: none;
    }
  }
  
  /* LIMITED - 제한된 데이터 */
  .limited-indicator {
    color: #f59e0b;
    background: rgba(245, 158, 11, 0.1);
    
    &::before {
      background: #f59e0b;
      animation: slow-pulse 4s infinite;
    }
  }
  
  /* NO DATA - 데이터 없음 */
  .no-data-indicator {
    color: #6b7280;
    background: rgba(107, 114, 128, 0.1);
    
    &::before {
      background: #6b7280;
      animation: none;
    }
  }
  
  /* 애니메이션 정의 */
  @keyframes pulse {
    0%, 100% { 
      opacity: 1; 
      transform: scale(1); 
    }
    50% { 
      opacity: 0.7; 
      transform: scale(1.1); 
    }
  }
  
  @keyframes blink {
    0%, 70%, 100% { opacity: 1; }
    35% { opacity: 0.3; }
  }
  
  @keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }
  
  @keyframes slow-pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.5; }
  }
  
  @media (max-width: 768px) {
    padding: 16px 20px 12px 20px;
    
    h2 {
      font-size: 18px;
    }
    
    .live-indicator,
    .test-indicator,
    .loading-indicator,
    .error-indicator,
    .closed-indicator,
    .limited-indicator,
    .no-data-indicator {
      font-size: 12px;
      padding: 3px 6px;
      
      &::before {
        width: 6px;
        height: 6px;
      }
    }
  }
`;

export const MetroMapContainer = styled.div`
  padding: 0;
  background: none;
  
  & > div {
    padding: 0 !important;
    background: none !important;
    margin: 0 !important;
  }
  
  & > div > div {
    background: none !important;
    border-radius: 0 !important;
    padding: 20px !important;
    box-shadow: none !important;
    margin: 0 !important;
    border: none !important;
  }
`;

// 나머지 스타일들은 기존과 동일
export const CommunitySection = styled.div`
  background: white;
  border-radius: 16px;
  border: 1px solid #e5e7eb;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
`;

export const CommunityHeader = styled.div`
  padding: 24px;
  border-bottom: 1px solid #f3f4f6;
  background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
  
  .header-top {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
  }
  
  .section-title {
    font-size: 20px;
    font-weight: 700;
    color: #111827;
    margin: 0;
    display: flex;
    align-items: center;
    gap: 10px;
  }
  
  .stats-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
    gap: 20px;
  }
  
  @media (max-width: 768px) {
    .header-top {
      flex-direction: column;
      gap: 16px;
      align-items: stretch;
    }
    
    .stats-grid {
      grid-template-columns: repeat(2, 1fr);
      gap: 12px;
    }
  }
`;

export const PostGrid = styled.div`
  padding: 24px;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 20px;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 16px;
    padding: 16px;
  }
`;

export const EmptyState = styled.div`
  text-align: center;
  padding: 60px 20px;
  
  .empty-icon {
    width: 64px;
    height: 64px;
    margin: 0 auto 20px;
    color: #d1d5db;
  }
  
  .empty-title {
    font-size: 18px;
    font-weight: 600;
    color: #374151;
    margin-bottom: 8px;
  }
  
  .empty-description {
    color: #6b7280;
    font-size: 14px;
    margin-bottom: 24px;
    line-height: 1.5;
  }
`;

export const ViewAllButton = styled(motion.div)`
  margin: 0 24px 24px 24px;
  padding: 16px 24px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 12px;
  cursor: pointer;
  text-align: center;
  color: white;
  font-weight: 600;
  font-size: 15px;
  transition: all 0.2s ease;
  
  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
  }
  
  .view-all-content {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
  }
`;

export const StatItem = styled(motion.div)`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 16px;
  background: white;
  border-radius: 10px;
  border: 1px solid #e5e7eb;
  
  .stat-icon {
    width: 36px;
    height: 36px;
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
  }
  
  .stat-content {
    .stat-number {
      font-size: 18px;
      font-weight: 700;
      color: #111827;
      line-height: 1;
      margin-bottom: 2px;
    }
    
    .stat-label {
      font-size: 12px;
      color: #6b7280;
      font-weight: 500;
    }
    
    .stat-change {
      font-size: 11px;
      color: #10b981;
      font-weight: 500;
      margin-top: 2px;
    }
  }
`;