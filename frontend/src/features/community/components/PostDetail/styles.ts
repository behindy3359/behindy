import { motion } from "framer-motion";
import styled from "styled-components";
import { 
  BaseCard,
  BaseButton,
  FlexContainer
} from '@/shared/styles/components';

export const BackButton = styled(BaseButton).attrs({
  variant: 'ghost' as const,
  size: 'sm' as const,
})`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[2]};
`;

export const ActionMenu = styled.div`
  position: relative;
`;

export const MenuButton = styled(BaseButton).attrs({
  variant: 'ghost' as const,
  size: 'sm' as const,
})`
  padding: ${({ theme }) => theme.spacing[2]};
`;

export const MenuDropdown = styled(motion.div)`
  position: absolute;
  top: 100%;
  right: 0;
  margin-top: ${({ theme }) => theme.spacing[2]};
  background: ${({ theme }) => theme.colors.background.primary};
  border: 1px solid ${({ theme }) => theme.colors.border.light};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  box-shadow: ${({ theme }) => theme.shadows.dropdown};
  z-index: ${({ theme }) => theme.zIndex.dropdown};
  min-width: 120px;
  overflow: hidden;
`;

export const MenuItem = styled.button<{ $danger?: boolean }>`
  width: 100%;
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[2]};
  padding: ${({ theme }) => theme.spacing[3]} ${({ theme }) => theme.spacing[4]};
  background: none;
  border: none;
  cursor: pointer;
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  color: ${({ $danger, theme }) => 
    $danger ? theme.colors.error : theme.colors.text.primary
  };
  transition: ${({ theme }) => theme.transition.fast};
  
  &:hover {
    background: ${({ $danger, theme }) => 
      $danger ? 'rgba(239, 68, 68, 0.1)' : theme.colors.background.secondary
    };
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

export const PostContainer = styled(BaseCard).attrs({
  $variant: 'elevated' as const,
})`
  overflow: hidden;
  margin-bottom: ${({ theme }) => theme.spacing[6]};
`;

export const PostHeader = styled.div`
  padding: ${({ theme }) => theme.spacing[6]} ${({ theme }) => theme.spacing[6]} ${({ theme }) => theme.spacing[4]} ${({ theme }) => theme.spacing[6]};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border.light};
`;

export const PostMeta = styled(FlexContainer).attrs({
  $direction: 'row' as const,
  $align: 'center' as const,
  $gap: 4 as const,
  $wrap: true,
})`
  margin-bottom: ${({ theme }) => theme.spacing[4]};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  color: ${({ theme }) => theme.colors.text.secondary};
  
  .meta-item {
    display: flex;
    align-items: center;
    gap: ${({ theme }) => theme.spacing[2]};
  }
  
  .author {
    font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
    color: ${({ theme }) => theme.colors.text.primary};
  }
`;

export const PostTitle = styled.h1`
  font-size: ${({ theme }) => theme.textStyles.heading.h1.fontSize};
  font-weight: ${({ theme }) => theme.textStyles.heading.h1.fontWeight};
  color: ${({ theme }) => theme.colors.text.primary};
  margin: 0;
  line-height: ${({ theme }) => theme.textStyles.heading.h1.lineHeight};
`;

export const PostContent = styled.div`
  padding: ${({ theme }) => theme.spacing[6]};
  font-size: ${({ theme }) => theme.typography.fontSize.base};
  line-height: ${({ theme }) => theme.typography.lineHeight.relaxed};
  color: ${({ theme }) => theme.colors.text.primary};
  white-space: pre-wrap;
  word-break: break-word;
  
  h1, h2, h3 {
    margin: 1.5em 0 0.5em 0;
    font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  }
  
  h1 { 
    font-size: ${({ theme }) => theme.typography.fontSize.xl}; 
  }
  h2 { 
    font-size: ${({ theme }) => theme.typography.fontSize.lg}; 
  }
  h3 { 
    font-size: ${({ theme }) => theme.typography.fontSize.base}; 
  }
  
  p {
    margin: 0 0 1em 0;
  }
  
  strong {
    font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  }
  
  em {
    font-style: italic;
  }
  
  blockquote {
    border-left: 4px solid ${({ theme }) => theme.colors.border.medium};
    padding-left: ${({ theme }) => theme.spacing[4]};
    margin: 1em 0;
    color: ${({ theme }) => theme.colors.text.secondary};
    font-style: italic;
  }
  
  code {
    background: ${({ theme }) => theme.colors.background.secondary};
    padding: ${({ theme }) => theme.spacing[1]} ${({ theme }) => theme.spacing[1]};
    border-radius: ${({ theme }) => theme.borderRadius.sm};
    font-family: 'Monaco', 'Consolas', monospace;
    font-size: 0.9em;
  }
`;

export const PostActions = styled(FlexContainer).attrs({
  $direction: 'row' as const,
  $justify: 'between' as const,
  $align: 'center' as const,
})`
  padding: ${({ theme }) => theme.spacing[4]} ${({ theme }) => theme.spacing[6]};
  background: ${({ theme }) => theme.colors.background.secondary};
  border-top: 1px solid ${({ theme }) => theme.colors.border.light};
`;

export const ActionButton = styled(motion.button)<{ $active?: boolean }>`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[2]};
  padding: ${({ theme }) => theme.spacing[2]} ${({ theme }) => theme.spacing[3]};
  background: ${({ $active, theme }) => 
    $active ? 'rgba(102, 126, 234, 0.1)' : 'none'
  };
  border: 1px solid ${({ $active, theme }) => 
    $active ? theme.colors.primary[500] : theme.colors.border.medium
  };
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  color: ${({ $active, theme }) => 
    $active ? theme.colors.primary[500] : theme.colors.text.secondary
  };
  cursor: pointer;
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  transition: ${({ theme }) => theme.transition.fast};
  
  &:hover {
    background: ${({ $active, theme }) => 
      $active ? 'rgba(102, 126, 234, 0.15)' : theme.colors.background.secondary
    };
    color: ${({ $active, theme }) => 
      $active ? theme.colors.primary[600] : theme.colors.text.primary
    };
  }
  
  .count {
    font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  }
`;

export const CommentsSection = styled(BaseCard).attrs({
  $variant: 'elevated' as const,
})`
  overflow: hidden;
`;

export const CommentsSectionHeader = styled.div`
  padding: ${({ theme }) => theme.spacing[4]} ${({ theme }) => theme.spacing[6]};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border.light};
  background: ${({ theme }) => theme.colors.background.secondary};
  
  h3 {
    font-size: ${({ theme }) => theme.typography.fontSize.lg};
    font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
    color: ${({ theme }) => theme.colors.text.primary};
    margin: 0;
    display: flex;
    align-items: center;
    gap: ${({ theme }) => theme.spacing[2]};
  }
`;

export const ErrorState = styled.div`
  text-align: center;
  padding: ${({ theme }) => theme.spacing[10]};
  
  .error-icon {
    width: 48px;
    height: 48px;
    margin: 0 auto ${({ theme }) => theme.spacing[4]};
    color: ${({ theme }) => theme.colors.error};
  }
  
  .error-title {
    font-size: ${({ theme }) => theme.typography.fontSize.lg};
    font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
    color: ${({ theme }) => theme.colors.text.primary};
    margin-bottom: ${({ theme }) => theme.spacing[2]};
  }
  
  .error-message {
    color: ${({ theme }) => theme.colors.text.secondary};
    margin-bottom: ${({ theme }) => theme.spacing[6]};
  }
  
  .error-actions {
    display: flex;
    gap: ${({ theme }) => theme.spacing[3]};
    justify-content: center;
    flex-wrap: wrap;
  }
`;