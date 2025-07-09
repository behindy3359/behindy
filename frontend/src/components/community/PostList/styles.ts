import { motion } from "framer-motion";
import styled from "styled-components";

export const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 32px;
  gap: 20px;
  
  @media (max-width: 768px) {
    flex-direction: column;
    gap: 16px;
    align-items: stretch;
  }
`;

export const HeaderLeft = styled.div`
  flex: 1;
`;

export const Title = styled.h1`
  font-size: 28px;
  font-weight: 700;
  color: #111827;
  margin: 0 0 16px 0;
  display: flex;
  align-items: center;
  gap: 12px;
  
  @media (max-width: 768px) {
    font-size: 24px;
    text-align: center;
    justify-content: center;
  }
`;

export const Subtitle = styled.p`
  color: #6b7280;
  font-size: 16px;
  margin: 0;
  line-height: 1.5;
`;

export const HeaderRight = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  align-items: flex-end;
  
  @media (max-width: 768px) {
    align-items: stretch;
  }
`;

export const ActionBar = styled.div`
  display: flex;
  gap: 12px;
  align-items: center;
  
  @media (max-width: 768px) {
    flex-direction: column;
    width: 100%;
  }
`;

export const SearchContainer = styled.div`
  display: flex;
  gap: 8px;
  align-items: center;
  min-width: 300px;
  
  @media (max-width: 768px) {
    min-width: 100%;
    flex-direction: column;
  }
`;

export const StatsBar = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
  margin-bottom: 32px;
`;

export const StatCard = styled(motion.div)`
  background: white;
  padding: 24px;
  border-radius: 12px;
  border: 1px solid #e5e7eb;
  display: flex;
  align-items: center;
  gap: 16px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  
  .stat-icon {
    width: 48px;
    height: 48px;
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #f0f4ff;
    color: #667eea;
  }
  
  .stat-content {
    flex: 1;
    
    .stat-number {
      font-size: 24px;
      font-weight: 700;
      color: #111827;
      margin-bottom: 4px;
    }
    
    .stat-label {
      font-size: 14px;
      color: #6b7280;
      font-weight: 500;
    }
    
    .stat-change {
      font-size: 12px;
      color: #10b981;
      font-weight: 500;
      margin-top: 4px;
    }
  }
`;

export const FilterBar = styled.div`
  background: white;
  border-radius: 12px;
  border: 1px solid #e5e7eb;
  padding: 20px 24px;
  margin-bottom: 24px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  
  @media (max-width: 768px) {
    flex-direction: column;
    gap: 16px;
    align-items: stretch;
  }
`;

export const FilterLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  
  .filter-title {
    font-weight: 600;
    color: #374151;
    display: flex;
    align-items: center;
    gap: 8px;
  }
  
  .post-count {
    color: #6b7280;
    font-size: 14px;
  }
`;

export const FilterRight = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

export const ViewToggle = styled.div`
  display: flex;
  background: #f3f4f6;
  border-radius: 8px;
  padding: 4px;
`;

export const ViewButton = styled.button<{ $active: boolean }>`
  padding: 8px 12px;
  border: none;
  background: ${({ $active }) => $active ? 'white' : 'transparent'};
  color: ${({ $active }) => $active ? '#374151' : '#6b7280'};
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  display: flex;
  align-items: center;
  gap: 6px;
  transition: all 0.2s ease;
  box-shadow: ${({ $active }) => $active ? '0 1px 3px rgba(0, 0, 0, 0.1)' : 'none'};
  
  &:hover {
    color: #374151;
  }
`;

export const SortSelect = styled.select`
  padding: 8px 12px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  background: white;
  color: #374151;
  font-size: 14px;
  cursor: pointer;
  
  &:focus {
    outline: none;
    border-color: #667eea;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
  }
`;

export const PostsContainer = styled.div`
  background: white;
  border-radius: 12px;
  border: 1px solid #e5e7eb;
  overflow: hidden;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
`;

export const PostGrid = styled.div<{ $viewMode: 'grid' | 'list' }>`
  padding: 24px;
  
  ${({ $viewMode }) => $viewMode === 'grid' ? `
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(360px, 1fr));
    gap: 24px;
    
    @media (max-width: 768px) {
      grid-template-columns: 1fr;
      gap: 16px;
      padding: 16px;
    }
  ` : `
    display: flex;
    flex-direction: column;
    gap: 16px;
  `}
`;

export const EmptyState = styled.div`
  text-align: center;
  padding: 80px 20px;
  
  .empty-icon {
    width: 64px;
    height: 64px;
    margin: 0 auto 20px;
    color: #d1d5db;
  }
  
  .empty-title {
    font-size: 20px;
    font-weight: 600;
    color: #374151;
    margin-bottom: 12px;
  }
  
  .empty-description {
    color: #6b7280;
    margin-bottom: 32px;
    line-height: 1.6;
    max-width: 400px;
    margin-left: auto;
    margin-right: auto;
  }
`;

export const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 80px 20px;
  
  .loading-content {
    text-align: center;
    
    .loading-spinner {
      width: 40px;
      height: 40px;
      border: 3px solid #f3f4f6;
      border-top: 3px solid #667eea;
      border-radius: 50%;
      animation: spin 1s linear infinite;
      margin: 0 auto 16px;
    }
    
    .loading-text {
      color: #6b7280;
      font-size: 16px;
    }
  }
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

export const Pagination = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 8px;
  margin-top: 32px;
  padding: 24px;
  background: white;
  border-radius: 12px;
  border: 1px solid #e5e7eb;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
`;

export const PageButton = styled(motion.button)<{ $active?: boolean; $disabled?: boolean }>`
  padding: 10px 16px;
  border: 1px solid ${({ $active }) => $active ? '#667eea' : '#d1d5db'};
  background: ${({ $active }) => $active ? '#667eea' : 'white'};
  color: ${({ $active }) => $active ? 'white' : '#374151'};
  border-radius: 8px;
  cursor: ${({ $disabled }) => $disabled ? 'not-allowed' : 'pointer'};
  font-size: 14px;
  font-weight: 500;
  opacity: ${({ $disabled }) => $disabled ? 0.5 : 1};
  
  &:hover:not(:disabled) {
    background: ${({ $active }) => $active ? '#5a67d8' : '#f9fafb'};
    border-color: ${({ $active }) => $active ? '#5a67d8' : '#9ca3af'};
  }
`;