// frontend/src/features/community/components/PostForm/styles.ts
import { motion } from "framer-motion";
import styled from "styled-components";
import { 
  FlexContainer,
  BaseButton,
  FormSection
} from '@/shared/styles/components';

export const Header = styled(FlexContainer).attrs({
  $direction: 'row' as const,
  $justify: 'between' as const,
  $align: 'center' as const,
})`
  margin-bottom: ${({ theme }) => theme.spacing[8]};
  padding-bottom: ${({ theme }) => theme.spacing[4]};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border.light};
`;

export const HeaderLeft = styled(FlexContainer).attrs({
  $direction: 'row' as const,
  $align: 'center' as const,
  $gap: 4 as const,
})`
  /* FlexContainer 설정 활용 */
`;

export const BackButton = styled(BaseButton).attrs({
  variant: 'ghost' as const,
  size: 'sm' as const,
})`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[2]};
`;

export const Title = styled.h1`
  font-size: ${({ theme }) => theme.textStyles.heading.h2.fontSize};
  font-weight: ${({ theme }) => theme.textStyles.heading.h2.fontWeight};
  color: ${({ theme }) => theme.colors.text.primary};
  margin: 0;
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[2]};
  
  svg {
    color: ${({ theme }) => theme.colors.primary[500]};
  }
`;

export const Actions = styled(FlexContainer).attrs({
  $direction: 'row' as const,
  $gap: 4 as const,
  $align: 'center' as const,
})`
  /* FlexContainer 설정 활용 */
`;

export const TitleSection = styled(FormSection)`
  .title-input {
    .input-wrapper {
      margin-bottom: ${({ theme }) => theme.spacing[2]};
    }
    
    input {
      font-size: ${({ theme }) => theme.typography.fontSize.xl};
      font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
      border: none;
      padding: ${({ theme }) => theme.spacing[4]} 0;
      
      &:focus {
        box-shadow: none;
        border-bottom: 2px solid ${({ theme }) => theme.colors.primary[500]};
      }
      
      &::placeholder {
        color: ${({ theme }) => theme.colors.text.tertiary};
        font-weight: ${({ theme }) => theme.typography.fontWeight.normal};
      }
    }
  }
  
  .char-count {
    text-align: right;
    font-size: ${({ theme }) => theme.typography.fontSize.xs};
    color: ${({ theme }) => theme.colors.text.tertiary};
  }
`;

export const ContentSection = styled(FormSection)`
  .content-textarea {
    width: 100%;
    min-height: 400px;
    max-height: 600px;
    border: none;
    font-size: ${({ theme }) => theme.typography.fontSize.base};
    line-height: ${({ theme }) => theme.typography.lineHeight.relaxed};
    font-family: inherit;
    padding: 0;
    color: ${({ theme }) => theme.colors.text.primary};
    background: ${({ theme }) => theme.colors.background.primary};
    
    resize: none;
    overflow-y: auto;
    
    &::-webkit-scrollbar {
      width: 8px;
    }
    
    &::-webkit-scrollbar-track {
      background: ${({ theme }) => theme.colors.background.secondary};
      border-radius: ${({ theme }) => theme.borderRadius.sm};
    }
    
    &::-webkit-scrollbar-thumb {
      background: ${({ theme }) => theme.colors.border.medium};
      border-radius: ${({ theme }) => theme.borderRadius.sm};
      
      &:hover {
        background: ${({ theme }) => theme.colors.border.dark};
      }
    }
    
    &:focus {
      outline: none;
    }
    
    &::placeholder {
      color: ${({ theme }) => theme.colors.text.tertiary};
    }
    
    &:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }
  }
  
  .char-count {
    text-align: right;
    font-size: ${({ theme }) => theme.typography.fontSize.xs};
    color: ${({ theme }) => theme.colors.text.tertiary};
    margin-top: ${({ theme }) => theme.spacing[2]};
  }
`;

export const PreviewMode = styled.div`
  .preview-content {
    line-height: ${({ theme }) => theme.typography.lineHeight.relaxed};
    color: ${({ theme }) => theme.colors.text.primary};
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
    
    br {
      line-height: ${({ theme }) => theme.typography.lineHeight.relaxed};
    }
  }
`;

export const BottomActions = styled(FlexContainer).attrs({
  $direction: 'row' as const,
  $justify: 'between' as const,
  $align: 'center' as const,
})`
  padding: ${({ theme }) => theme.spacing[6]};
  background: ${({ theme }) => theme.colors.background.secondary};
  border-top: 1px solid ${({ theme }) => theme.colors.border.light};
`;

export const ActionGroup = styled(FlexContainer).attrs({
  $direction: 'row' as const,
  $gap: 4 as const,
  $align: 'center' as const,
})`
  /* FlexContainer 설정 활용 */
`;

export const PreviewToggle = styled.button<{ $active: boolean }>`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[2]};
  padding: ${({ theme }) => theme.spacing[2]} ${({ theme }) => theme.spacing[4]};
  border: 1px solid ${({ theme }) => theme.colors.border.light};
  background: ${({ $active, theme }) => 
    $active ? theme.colors.primary[500] : theme.colors.background.primary};
  color: ${({ $active, theme }) => 
    $active ? theme.colors.text.inverse : theme.colors.text.secondary};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  cursor: pointer;
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  transition: ${({ theme }) => theme.transition.fast};
  
  &:hover {
    background: ${({ $active, theme }) => 
      $active ? theme.colors.primary[600] : theme.colors.background.secondary};
  }
`;

export const ErrorMessage = styled(motion.div)`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[2]};
  padding: ${({ theme }) => theme.spacing[4]};
  background: rgba(239, 68, 68, 0.1);
  border: 1px solid rgba(239, 68, 68, 0.2);
  border-radius: ${({ theme }) => theme.borderRadius.md};
  color: ${({ theme }) => theme.colors.error};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  margin-bottom: ${({ theme }) => theme.spacing[4]};
`;

export const LoadingOverlay = styled(motion.div)`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: ${({ theme }) => theme.zIndex.modal};
  backdrop-filter: blur(2px);
  
  .loading-content {
    background: ${({ theme }) => theme.colors.background.primary};
    padding: ${({ theme }) => theme.spacing[4]};
    border-radius: ${({ theme }) => theme.borderRadius.lg};
    box-shadow: ${({ theme }) => theme.shadows.dropdown};
    text-align: center;
    color: ${({ theme }) => theme.colors.text.primary};
  }
`;