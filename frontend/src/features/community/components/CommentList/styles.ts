import { motion } from "framer-motion";
import styled from "styled-components";

export const CommentContainer = styled(motion.div)`
  & + & {
    margin-top: ${({ theme }) => theme.spacing[4]};
  }
`;

export const CommentItem = styled.div<{ $isReply?: boolean }>`
  padding: ${({ theme }) => theme.spacing[4]};
  background: ${({ $isReply, theme }) => 
    $isReply ? theme.colors.background.secondary : theme.colors.background.primary};
  border: 1px solid ${({ theme }) => theme.colors.border.light};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  margin-left: ${({ $isReply }) => $isReply ? '32px' : '0'};
  position: relative;
  
  ${({ $isReply, theme }) => $isReply && `
    &::before {
      content: '';
      position: absolute;
      left: -16px;
      top: ${theme.spacing[4]};
      width: 12px;
      height: 12px;
      border-left: 2px solid ${theme.colors.border.dark};
      border-bottom: 2px solid ${theme.colors.border.dark};
      border-bottom-left-radius: ${theme.borderRadius.sm};
    }
  `}
`;

export const StyledCommentMeta = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[4]};
  
  .user-info {
    display: flex;
    align-items: center;
    gap: ${({ theme }) => theme.spacing[2]};
    
    .avatar {
      width: 28px;
      height: 28px;
      background: linear-gradient(135deg, ${({ theme }) => theme.colors.primary[500]} 0%, ${({ theme }) => theme.colors.secondary[500]} 100%);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      color: ${({ theme }) => theme.colors.text.inverse};
      font-weight: 600;
      font-size: ${({ theme }) => theme.typography.fontSize.xs};
    }
    
    .name {
      font-weight: 600;
      color: ${({ theme }) => theme.colors.text.primary};
      font-size: ${({ theme }) => theme.typography.fontSize.sm};
    }
  }
  
  .date {
    font-size: ${({ theme }) => theme.typography.fontSize.xs};
    color: ${({ theme }) => theme.colors.text.tertiary};
    display: flex;
    align-items: center;
    gap: ${({ theme }) => theme.spacing[1]};
  }
`;

export const StyledCommentActions = styled.div`
  position: relative;
`;

export const CommentContent = styled.div`
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  line-height: 1.6;
  color: ${({ theme }) => theme.colors.text.primary};
  margin-bottom: ${({ theme }) => theme.spacing[4]};
  white-space: pre-wrap;
  word-break: break-word;
`;

export const StyledCommentFooter = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export const FooterActions = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing[4]};
  align-items: center;
`;

export const FooterButton = styled(motion.button)<{ $active?: boolean }>`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[1]};
  padding: ${({ theme }) => theme.spacing[1]} ${({ theme }) => theme.spacing[2]};
  background: none;
  border: none;
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  font-size: ${({ theme }) => theme.typography.fontSize.xs};
  color: ${({ $active, theme }) => 
    $active ? theme.colors.primary[500] : theme.colors.text.tertiary};
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background: ${({ theme }) => theme.colors.background.secondary};
    color: ${({ $active, theme }) => 
      $active ? theme.colors.primary[600] : theme.colors.text.secondary};
  }
  
  .count {
    font-weight: 500;
  }
`;

export const CommentTime = styled.div`
  font-size: ${({ theme }) => theme.typography.fontSize.xs};
  color: ${({ theme }) => theme.colors.text.tertiary};
`;

export const EditingContainer = styled.div`
  margin-top: ${({ theme }) => theme.spacing[4]};
  padding: ${({ theme }) => theme.spacing[4]};
  background: #f0f4ff;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  border: 1px solid #c7d2fe;
`;

export const MenuButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  padding: 4px;
  color: ${({ theme }) => theme.colors.text.tertiary};
  display: flex;
  align-items: center;
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  transition: all 0.2s ease;

  &:hover {
    color: ${({ theme }) => theme.colors.text.primary};
    background: ${({ theme }) => theme.colors.background.secondary};
  }
`;

export const DropdownMenu = styled(motion.div)`
  position: absolute;
  top: 100%;
  right: 0;
  margin-top: 8px;
  background: ${({ theme }) => theme.colors.background.primary};
  border: 1px solid ${({ theme }) => theme.colors.border.light};
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  z-index: 100;
  overflow: hidden;
  min-width: 120px;
`;

export const MenuItem = styled.button`
  width: 100%;
  padding: 8px 12px;
  background: none;
  border: none;
  text-align: left;
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  color: ${({ theme }) => theme.colors.text.primary};
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: background 0.2s ease;

  &:hover {
    background-color: ${({ theme }) => theme.colors.background.secondary};
  }

  &.danger {
    color: ${({ theme }) => theme.colors.error};
    
    &:hover {
      background-color: #fef2f2;
    }
  }
`;