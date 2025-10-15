import { motion } from "framer-motion";
import styled from "styled-components";

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
} from '@/shared/styles/components/containers';

import { 
  BaseSelect
} from '@/shared/styles/components/inputs';

export const Header = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing[8]};
  
  @media (max-width: 768px) {
    align-items: stretch;
  }
`;

export const HeaderTop = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: ${({ theme }) => theme.spacing[4]};
  
  @media (max-width: 768px) {
    flex-direction: column;
    gap: ${({ theme }) => theme.spacing[4]};
  }
`;

export const HeaderContent = styled.div`
  flex: 1;
`;

export const HeaderActions = styled(CommonActionGroup).attrs({
  $justify: 'end' as const,
  $responsive: false,
})`
  flex-shrink: 0;
  
  @media (max-width: 768px) {
    width: 100%;
    flex-direction: column;
    
    button {
      width: 100%;
    }
  }
`;

export const Title = styled.h1`
  svg {
    color: ${({ theme }) => theme.colors.primary[500]};
  }
`;

export const Subtitle = styled.p``;

export const SearchContainer = styled(FlexContainer).attrs({
  $direction: 'row' as const,
  $gap: 2 as const,
  $align: 'center' as const,
})`
  min-width: 300px;
  
  @media (max-width: 768px) {
    min-width: 100%;
    flex-direction: column;
  }
`;

export const FilterBar = styled(CommonSectionHeader).attrs({
  $variant: 'default' as const,
  $spacing: 'normal' as const,
})`
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

export const PostsContainer = styled(BaseCard).attrs({
  $variant: 'elevated' as const,
})`
  overflow: hidden;
`;

export const PostGrid = styled(GridContainer)<{ $viewMode: 'grid' | 'list' }>`
  ${({ $viewMode, theme }) => $viewMode === 'grid' ? `
    grid-template-columns: repeat(auto-fill, minmax(360px, 1fr));
    
    @media (max-width: 768px) {
      grid-template-columns: 1fr;
    }
  ` : `
    display: flex;
    flex-direction: column;
    gap: ${theme.spacing[4]};
  `}
`;

export const EmptyState = styled(CommonErrorState).attrs({
  $variant: 'section' as const,
})`
  color: ${({ theme }) => theme.colors.text.secondary};
  
  .error-icon {
    color: ${({ theme }) => theme.colors.border.dark};
  }
  
  .error-title {
    color: ${({ theme }) => theme.colors.text.primary};
  }
`;

export const LoadingContainer = styled(CommonLoadingState).attrs({
  $variant: 'section',
})``;

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

export const ActionBar = styled(FlexContainer).attrs({
  $direction: 'row' as const,
  $align: 'center' as const,
  $justify: 'between' as const,
  $gap: 4 as const,
})`
  width: 100%;
  padding: ${({ theme }) => theme.spacing[4]} 0;
  margin-bottom: ${({ theme }) => theme.spacing[6]};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border.light};
  
  @media (max-width: 768px) {
    flex-direction: column;
    align-items: stretch;
    gap: ${({ theme }) => theme.spacing[3]};
  }
`;