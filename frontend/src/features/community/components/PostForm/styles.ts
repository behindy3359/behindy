import { motion } from "framer-motion";
import styled from "styled-components";
import { FormSection } from "@/shared/styles/commonContainers";

export const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${({ theme }) => theme.spacing[8]};
  padding-bottom: ${({ theme }) => theme.spacing[4]};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border.light};
`;

export const HeaderLeft = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[4]};
`;

export const BackButton = styled(motion.button)`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[2]};
  padding: ${({ theme }) => theme.spacing[2]} ${({ theme }) => theme.spacing[4]};
  background: none;
  border: 1px solid ${({ theme }) => theme.colors.border.light};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  color: ${({ theme }) => theme.colors.text.secondary};
  cursor: pointer;
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  transition: all 0.2s ease;
  
  &:hover {
    background: ${({ theme }) => theme.colors.background.secondary};
    color: ${({ theme }) => theme.colors.text.primary};
  }
`;

export const Title = styled.h1`
  font-size: ${({ theme }) => theme.typography.fontSize['2xl']};
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text.primary};
  margin: 0;
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[2]};
`;

export const Actions = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing[4]};
  align-items: center;
`;

export const TitleSection = styled(FormSection)`
  .title-input {
    .input-wrapper {
      margin-bottom: ${({ theme }) => theme.spacing[2]};
    }
    
    input {
      font-size: ${({ theme }) => theme.typography.fontSize.xl};
      font-weight: 600;
      border: none;
      padding: ${({ theme }) => theme.spacing[4]} 0;
      
      &:focus {
        box-shadow: none;
        border-bottom: 2px solid ${({ theme }) => theme.colors.primary[500]};
      }
      
      &::placeholder {
        color: ${({ theme }) => theme.colors.text.tertiary};
        font-weight: 400;
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
    max-height: 600px; /* 🔥 최대 높이 제한 */
    border: none;
    font-size: ${({ theme }) => theme.typography.fontSize.base};
    line-height: 1.6;
    font-family: inherit;
    padding: 0;
    color: ${({ theme }) => theme.colors.text.primary};
    
    /* 🔥 크기 고정 - 사용자가 늘릴 수 없도록 */
    resize: none;
    overflow-y: auto;
    
    /* 스크롤바 스타일링 */
    &::-webkit-scrollbar {
      width: 8px;
    }
    
    &::-webkit-scrollbar-track {
      background: #f8f9fa;
      border-radius: 4px;
    }
    
    &::-webkit-scrollbar-thumb {
      background: #dee2e6;
      border-radius: 4px;
      
      &:hover {
        background: #adb5bd;
      }
    }
    
    &:focus {
      outline: none;
    }
    
    &::placeholder {
      color: ${({ theme }) => theme.colors.text.tertiary};
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
    line-height: 1.8;
    color: ${({ theme }) => theme.colors.text.primary};
    word-break: break-word;
    
    h1, h2, h3 {
      margin: 1.5em 0 0.5em 0;
      font-weight: 600;
    }
    
    h1 { font-size: 1.5em; }
    h2 { font-size: 1.3em; }
    h3 { font-size: 1.1em; }
    
    p {
      margin: 0 0 1em 0;
    }
    
    strong {
      font-weight: 600;
    }
    
    em {
      font-style: italic;
    }
    
    br {
      line-height: 1.8;
    }
  }
`;

export const BottomActions = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: ${({ theme }) => theme.spacing[6]};
  background: ${({ theme }) => theme.colors.background.secondary};
  border-top: 1px solid ${({ theme }) => theme.colors.border.light};
`;

export const ActionGroup = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing[4]};
  align-items: center;
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
  transition: all 0.2s ease;
  
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
  background: #fef2f2;
  border: 1px solid #fecaca;
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
  z-index: 10;
  
  .loading-content {
    background: white;
    padding: 20px;
    border-radius: 8px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    text-align: center;
    color: ${({ theme }) => theme.colors.text.primary};
  }
`;