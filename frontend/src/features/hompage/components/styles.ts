import { motion } from "framer-motion";
import styled from "styled-components";
import { 
  BaseCard,
  FlexContainer,
  GridContainer
} from '@/shared/styles/components';

export const MetroHeader = styled(FlexContainer).attrs({
  $direction: 'row' as const,
  $justify: 'between' as const,
  $align: 'center' as const,
})`
  padding: ${({ theme }) => theme.spacing[4]} ${({ theme }) => theme.spacing[6]} ${({ theme }) => theme.spacing[4]} ${({ theme }) => theme.spacing[6]};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border.light};
  background: linear-gradient(135deg, 
    ${({ theme }) => theme.colors.background.secondary} 0%, 
    ${({ theme }) => theme.colors.background.tertiary} 100%
  );
  
  h2 {
    font-size: ${({ theme }) => theme.typography.fontSize.xl};
    font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
    color: ${({ theme }) => theme.colors.text.primary};
    margin: 0;
    display: flex;
    align-items: center;
    gap: ${({ theme }) => theme.spacing[2]};
    
    svg {
      color: ${({ theme }) => theme.colors.primary[500]};
    }
  }
  
  .live-indicator,
  .test-indicator,
  .loading-indicator,
  .error-indicator,
  .closed-indicator,
  .limited-indicator,
  .no-data-indicator {
    display: flex;
    align-items: center;
    gap: ${({ theme }) => theme.spacing[2]};
    font-size: ${({ theme }) => theme.typography.fontSize.sm};
    font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
    padding: ${({ theme }) => theme.spacing[1]} ${({ theme }) => theme.spacing[2]};
    border-radius: ${({ theme }) => theme.borderRadius.xl};
    transition: ${({ theme }) => theme.transition.normal};
    
    &::before {
      content: '';
      width: 8px;
      height: 8px;
      border-radius: 50%;
    }
  }
  
  .live-indicator {
    color: ${({ theme }) => theme.colors.error};
    background: rgba(239, 68, 68, 0.1);
    
    &::before {
      background: ${({ theme }) => theme.colors.error};
      animation: pulse 2s infinite;
    }
  }
  
  .test-indicator {
    color: ${({ theme }) => theme.colors.warning};
    background: rgba(245, 158, 11, 0.1);
    
    &::before {
      background: ${({ theme }) => theme.colors.warning};
      animation: blink 3s infinite;
    }
  }
  
  .loading-indicator {
    color: ${({ theme }) => theme.colors.text.secondary};
    background: rgba(107, 114, 128, 0.1);
    
    &::before {
      background: ${({ theme }) => theme.colors.text.secondary};
      animation: spin 1s linear infinite;
    }
  }
  
  .error-indicator {
    color: ${({ theme }) => theme.colors.error};
    background: rgba(239, 68, 68, 0.1);
    
    &::before {
      background: ${({ theme }) => theme.colors.error};
    }
  }
  
  .closed-indicator {
    color: ${({ theme }) => theme.colors.text.secondary};
    background: rgba(107, 114, 128, 0.1);
    
    &::before {
      background: ${({ theme }) => theme.colors.text.secondary};
    }
  }
  
  .limited-indicator {
    color: ${({ theme }) => theme.colors.warning};
    background: rgba(245, 158, 11, 0.1);
    
    &::before {
      background: ${({ theme }) => theme.colors.warning};
      animation: slow-pulse 4s infinite;
    }
  }
  
  .no-data-indicator {
    color: ${({ theme }) => theme.colors.text.secondary};
    background: rgba(107, 114, 128, 0.1);
    
    &::before {
      background: ${({ theme }) => theme.colors.text.secondary};
    }
  }
  
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
    padding: ${({ theme }) => theme.spacing[4]} ${({ theme }) => theme.spacing[4]} ${({ theme }) => theme.spacing[3]} ${({ theme }) => theme.spacing[4]};
    
    h2 {
      font-size: ${({ theme }) => theme.typography.fontSize.lg};
    }
    
    .live-indicator,
    .test-indicator,
    .loading-indicator,
    .error-indicator,
    .closed-indicator,
    .limited-indicator,
    .no-data-indicator {
      font-size: ${({ theme }) => theme.typography.fontSize.xs};
      padding: ${({ theme }) => theme.spacing[1]};
      
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
    padding: ${({ theme }) => theme.spacing[4]} !important;
    box-shadow: none !important;
    margin: 0 !important;
    border: none !important;
  }
`;

export const CommunitySection = styled(BaseCard).attrs({
  $variant: 'elevated' as const,
})`
  overflow: hidden;
`;

export const CommunityHeader = styled.div`
  padding: ${({ theme }) => theme.spacing[6]};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border.light};
  background: linear-gradient(135deg, 
    ${({ theme }) => theme.colors.background.secondary} 0%, 
    ${({ theme }) => theme.colors.background.tertiary} 100%
  );
  
  .header-top {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: ${({ theme }) => theme.spacing[4]};
  }
  
  .section-title {
    font-size: ${({ theme }) => theme.typography.fontSize.xl};
    font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
    color: ${({ theme }) => theme.colors.text.primary};
    margin: 0;
    display: flex;
    align-items: center;
    gap: ${({ theme }) => theme.spacing[2]};
    
    svg {
      color: ${({ theme }) => theme.colors.primary[500]};
    }
  }
  
  .stats-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
    gap: ${({ theme }) => theme.spacing[4]};
  }
  
  @media (max-width: 768px) {
    .header-top {
      flex-direction: column;
      gap: ${({ theme }) => theme.spacing[4]};
      align-items: stretch;
    }
    
    .stats-grid {
      grid-template-columns: repeat(2, 1fr);
      gap: ${({ theme }) => theme.spacing[3]};
    }
  }
`;

export const PostGrid = styled(GridContainer).attrs({
  $columns: 'repeat(auto-fill, minmax(320px, 1fr))' as const,
})`
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: ${({ theme }) => theme.spacing[4]};
    padding: ${({ theme }) => theme.spacing[4]};
  }
`;

export const EmptyState = styled.div`
  text-align: center;
  padding: ${({ theme }) => theme.spacing[16]};
  
  .empty-icon {
    width: 64px;
    height: 64px;
    margin: 0 auto ${({ theme }) => theme.spacing[4]};
    color: ${({ theme }) => theme.colors.border.dark};
  }
  
  .empty-title {
    font-size: ${({ theme }) => theme.typography.fontSize.lg};
    font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
    color: ${({ theme }) => theme.colors.text.primary};
    margin-bottom: ${({ theme }) => theme.spacing[2]};
  }
  
  .empty-description {
    color: ${({ theme }) => theme.colors.text.secondary};
    font-size: ${({ theme }) => theme.typography.fontSize.sm};
    margin-bottom: ${({ theme }) => theme.spacing[6]};
    line-height: ${({ theme }) => theme.typography.lineHeight.relaxed};
  }
`;

export const ViewAllButton = styled(motion.div)`
  margin: 0 ${({ theme }) => theme.spacing[6]} ${({ theme }) => theme.spacing[6]} ${({ theme }) => theme.spacing[6]};
  padding: ${({ theme }) => theme.spacing[4]} ${({ theme }) => theme.spacing[6]};
  background: linear-gradient(135deg, ${({ theme }) => theme.colors.primary[500]} 0%, ${({ theme }) => theme.colors.secondary[500]} 100%);
  border-radius: ${({ theme }) => theme.borderRadius.xl};
  cursor: pointer;
  text-align: center;
  color: ${({ theme }) => theme.colors.text.inverse};
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  font-size: ${({ theme }) => theme.typography.fontSize.base};
  transition: ${({ theme }) => theme.transition.fast};
  
  &:hover {
    transform: translateY(-1px);
    box-shadow: ${({ theme }) => theme.shadows.buttonHover};
  }
  
  .view-all-content {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: ${({ theme }) => theme.spacing[2]};
  }
`;

export const StatItem = styled(motion.div)`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[2]};
  padding: ${({ theme }) => theme.spacing[3]} ${({ theme }) => theme.spacing[4]};
  background: ${({ theme }) => theme.colors.background.primary};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  border: 1px solid ${({ theme }) => theme.colors.border.light};
  
  .stat-icon {
    width: 36px;
    height: 36px;
    border-radius: ${({ theme }) => theme.borderRadius.md};
    display: flex;
    align-items: center;
    justify-content: center;
    background: linear-gradient(135deg, ${({ theme }) => theme.colors.primary[500]} 0%, ${({ theme }) => theme.colors.secondary[500]} 100%);
    color: ${({ theme }) => theme.colors.text.inverse};
  }
  
  .stat-content {
    .stat-number {
      font-size: ${({ theme }) => theme.typography.fontSize.lg};
      font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
      color: ${({ theme }) => theme.colors.text.primary};
      line-height: 1;
      margin-bottom: ${({ theme }) => theme.spacing[1]};
    }
    
    .stat-label {
      font-size: ${({ theme }) => theme.typography.fontSize.xs};
      color: ${({ theme }) => theme.colors.text.secondary};
      font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
    }
    
    .stat-change {
      font-size: ${({ theme }) => theme.typography.fontSize.xs};
      color: ${({ theme }) => theme.colors.success};
      font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
      margin-top: ${({ theme }) => theme.spacing[1]};
    }
  }
`;