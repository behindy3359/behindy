// frontend/src/features/community/components/PostList/styles.ts
// 🔥 완전 마이그레이션 버전 - inner 컴포넌트들까지 모두 포함

"use client";

import { motion } from "framer-motion";
import styled from "styled-components";

// 🎯 직접 import - 필요한 것만 정확히 가져오기
import { 
  CommonPageHeader,
  CommonSectionHeader,
  CommonActionGroup,
  CommonLoadingState,
  CommonErrorState
} from '@/shared/styles/components/common';

import {
  FlexContainer,
  BaseCard,
  GridContainer
} from '@/shared/styles/components/containers-animated';

import { 
  BaseSelect
} from '@/shared/styles/components/inputs';

// ========================================
// 1. 헤더 영역
// ========================================

export const Header = styled(CommonPageHeader).attrs({
  $textAlign: 'left' as const,
  $spacing: 'normal' as const,
})`
  @media (max-width: 768px) {
    align-items: stretch;
  }
`;

export const HeaderLeft = styled.div`
  flex: 1;
`;

export const Title = styled.h1`
  font-size: ${({ theme }) => theme.textStyles.heading.h1.fontSize};
  font-weight: ${({ theme }) => theme.textStyles.heading.h1.fontWeight};
  color: ${({ theme }) => theme.colors.text.primary};
  margin: 0 0 ${({ theme }) => theme.spacing[4]} 0;
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[3]};
  
  svg {
    color: ${({ theme }) => theme.colors.primary[500]};
  }
  
  @media (max-width: 768px) {
    font-size: ${({ theme }) => theme.textStyles.heading.h2.fontSize};
    text-align: center;
    justify-content: center;
  }
`;

export const Subtitle = styled.p`
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: ${({ theme }) => theme.typography.fontSize.base};
  margin: 0;
  line-height: ${({ theme }) => theme.typography.lineHeight.relaxed};
  
  @media (max-width: 768px) {
    text-align: center;
  }
`;

export const HeaderRight = styled(FlexContainer).attrs({
  $direction: 'column' as const,
  $gap: 4 as const,
})`
  align-items: flex-end;
  
  @media (max-width: 768px) {
    align-items: stretch;
  }
`;

// ========================================
// 2. 검색 및 액션 영역 (inner 컴포넌트용)
// ========================================

// 🔥 ActionBar - PostListSearch에서 사용
export const ActionBar = styled(FlexContainer).attrs({
  $direction: 'row' as const,
  $align: 'center' as const,
  $gap: 3 as const,
})`
  @media (max-width: 768px) {
    flex-direction: column;
    width: 100%;
  }
`;

// 🔥 SearchContainer - PostListSearch에서 사용
export const SearchContainer = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing[2]};
  align-items: center;
  min-width: 300px;
  
  @media (max-width: 768px) {
    min-width: 100%;
    flex-direction: column;
  }
`;

// ========================================
// 3. 필터 영역
// ========================================

export const FilterBar = styled(BaseCard).attrs({
  $variant: 'elevated' as const,
})`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${({ theme }) => theme.spacing[6]};
  
  @media (max-width: 768px) {
    flex-direction: column;
    gap: ${({ theme }) => theme.spacing[4]};
    align-items: stretch;
  }
`;

export const FilterLeft = styled(FlexContainer).attrs({
  $direction: 'row' as const,
  $align: 'center' as const,
  $gap: 4 as const,
})`
  .filter-title {
    font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
    color: ${({ theme }) => theme.colors.text.primary};
    display: flex;
    align-items: center;
    gap: ${({ theme }) => theme.spacing[2]};
  }
  
  .post-count {
    color: ${({ theme }) => theme.colors.text.secondary};
    font-size: ${({ theme }) => theme.typography.fontSize.sm};
  }
  
  @media (max-width: 768px) {
    justify-content: space-between;
  }
`;

export const FilterRight = styled(FlexContainer).attrs({
  $direction: 'row' as const,
  $align: 'center' as const,
  $gap: 3 as const,
})`
  @media (max-width: 768px) {
    justify-content: space-between;
  }
`;

// ========================================
// 4. 뷰 컨트롤
// ========================================

export const ViewToggle = styled.div`
  display: flex;
  background: ${({ theme }) => theme.colors.background.secondary};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  padding: ${({ theme }) => theme.spacing[1]};
`;

export const ViewButton = styled.button<{ $active: boolean }>`
  padding: ${({ theme }) => theme.spacing[2]} ${({ theme }) => theme.spacing[3]};
  border: none;
  background: ${({ $active, theme }) => 
    $active ? theme.colors.background.primary : 'transparent'
  };
  color: ${({ $active, theme }) => 
    $active ? theme.colors.text.primary : theme.colors.text.secondary
  };
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  cursor: pointer;
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[2]};
  transition: ${({ theme }) => theme.transition.fast};
  box-shadow: ${({ $active, theme }) => 
    $active ? theme.shadows.base.sm : 'none'
  };
  
  &:hover {
    color: ${({ theme }) => theme.colors.text.primary};
  }
`;

export const SortSelect = styled(BaseSelect).attrs({
  size: 'sm' as const,
})`
  min-width: 120px;
`;

// ========================================
// 5. 포스트 컨테이너
// ========================================

export const PostsContainer = styled(BaseCard).attrs({
  $variant: 'elevated' as const,
})`
  overflow: hidden;
`;

export const PostGrid = styled.div<{ $viewMode: 'grid' | 'list' }>`
  padding: ${({ theme }) => theme.spacing[6]};
  
  ${({ $viewMode, theme }) => $viewMode === 'grid' ? `
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(360px, 1fr));
    gap: ${theme.spacing[6]};
    
    @media (max-width: 768px) {
      grid-template-columns: 1fr;
      gap: ${theme.spacing[4]};
      padding: ${theme.spacing[4]};
    }
  ` : `
    display: flex;
    flex-direction: column;
    gap: ${theme.spacing[4]};
  `}
`;

// ========================================
// 6. 상태 표시 - 통합 컴포넌트 활용
// ========================================

export const EmptyState = styled.div`
  text-align: center;
  padding: ${({ theme }) => theme.spacing[20]};
  
  .empty-icon {
    width: 64px;
    height: 64px;
    margin: 0 auto ${({ theme }) => theme.spacing[4]};
    color: ${({ theme }) => theme.colors.border.dark};
  }
  
  .empty-title {
    font-size: ${({ theme }) => theme.typography.fontSize.xl};
    font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
    color: ${({ theme }) => theme.colors.text.primary};
    margin-bottom: ${({ theme }) => theme.spacing[3]};
  }
  
  .empty-description {
    color: ${({ theme }) => theme.colors.text.secondary};
    margin-bottom: ${({ theme }) => theme.spacing[8]};
    line-height: ${({ theme }) => theme.typography.lineHeight.relaxed};
    max-width: 400px;
    margin-left: auto;
    margin-right: auto;
    white-space: pre-line;
  }
`;

export const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: ${({ theme }) => theme.spacing[20]};
  
  .loading-content {
    text-align: center;
    
    .loading-spinner {
      width: 40px;
      height: 40px;
      border: 3px solid ${({ theme }) => theme.colors.background.secondary};
      border-top: 3px solid ${({ theme }) => theme.colors.primary[500]};
      border-radius: 50%;
      animation: spin 1s linear infinite;
      margin: 0 auto ${({ theme }) => theme.spacing[4]};
    }
    
    .loading-text {
      color: ${({ theme }) => theme.colors.text.secondary};
      font-size: ${({ theme }) => theme.typography.fontSize.base};
    }
  }
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

// ========================================
// 7. 페이지네이션
// ========================================

export const Pagination = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[2]};
  margin-top: ${({ theme }) => theme.spacing[8]};
  padding: ${({ theme }) => theme.spacing[6]};
  background: ${({ theme }) => theme.colors.background.primary};
  border-radius: ${({ theme }) => theme.borderRadius.xl};
  border: 1px solid ${({ theme }) => theme.colors.border.light};
  box-shadow: ${({ theme }) => theme.shadows.base.sm};
  
  @media (max-width: 768px) {
    flex-wrap: wrap;
    gap: ${({ theme }) => theme.spacing[2]};
    padding: ${({ theme }) => theme.spacing[4]};
  }
`;

export const PageButton = styled(motion.button)<{ 
  $active?: boolean; 
  $disabled?: boolean;
}>`
  padding: ${({ theme }) => theme.spacing[2]} ${({ theme }) => theme.spacing[4]};
  border: 1px solid ${({ $active, theme }) => 
    $active ? theme.colors.primary[500] : theme.colors.border.medium
  };
  background: ${({ $active, theme }) => 
    $active ? theme.colors.primary[500] : theme.colors.background.primary
  };
  color: ${({ $active, theme }) => 
    $active ? theme.colors.text.inverse : theme.colors.text.primary
  };
  border-radius: ${({ theme }) => theme.borderRadius.md};
  cursor: ${({ $disabled }) => $disabled ? 'not-allowed' : 'pointer'};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  opacity: ${({ $disabled }) => $disabled ? 0.5 : 1};
  min-width: 44px;
  
  &:hover:not(:disabled) {
    background: ${({ $active, theme }) => 
      $active ? theme.colors.primary[600] : theme.colors.background.secondary
    };
    border-color: ${({ $active, theme }) => 
      $active ? theme.colors.primary[600] : theme.colors.border.dark
    };
  }
  
  @media (max-width: 768px) {
    padding: ${({ theme }) => theme.spacing[2]} ${({ theme }) => theme.spacing[3]};
    font-size: ${({ theme }) => theme.typography.fontSize.xs};
    min-width: 36px;
  }
`;