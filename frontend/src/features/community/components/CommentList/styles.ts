import { motion } from "framer-motion";
import styled from "styled-components";
import { 
  BaseCard,
  FlexContainer,
  BaseButton,
  CommonActionGroup
} from '@/shared/styles/components';

// CommentContainer - 각 댓글 컨테이너
export const CommentContainer = styled(motion.div)`
  & + & {
    margin-top: ${({ theme }) => theme.spacing[4]};
  }
`;

// CommentItem - BaseCard 기반
export const CommentItem = styled(BaseCard).attrs({
  $variant: 'outlined' as const,
  $size: 'sm' as const,
})<{ $isReply?: boolean }>`
  margin-left: ${({ $isReply }) => $isReply ? '32px' : '0'};
  position: relative;
  overflow: visible;
  /* z-index 제거: CommonCommentHeader가 ActionMenu를 포함하므로 stacking context 생성 방지 */
  background: ${({ $isReply, theme }) =>
    $isReply ? theme.colors.background.secondary : theme.colors.background.primary};

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

// StyledCommentMeta - FlexContainer 재사용
export const StyledCommentMeta = styled(FlexContainer).attrs({
  $direction: 'row' as const,
  $align: 'center' as const,
  $gap: 4 as const,
})`
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

// StyledCommentActions - 액션 컨테이너
export const StyledCommentActions = styled.div`
  position: relative;
  z-index: ${({ theme }) => theme.zIndex.modal};
`;

// CommentContent - 댓글 내용
export const CommentContent = styled.div`
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  line-height: 1.6;
  color: ${({ theme }) => theme.colors.text.primary};
  margin-bottom: ${({ theme }) => theme.spacing[4]};
  white-space: pre-wrap;
  word-break: break-word;
`;

// StyledCommentFooter - CommonActionGroup 재사용
export const StyledCommentFooter = styled(CommonActionGroup).attrs({
  $justify: 'between' as const,
})``;

// FooterActions - FlexContainer 재사용
export const FooterActions = styled(FlexContainer).attrs({
  $direction: 'row' as const,
  $gap: 4 as const,
  $align: 'center' as const,
})``;

// FooterButton - 공통 액션 버튼
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

// CommentTime - 시간 표시
export const CommentTime = styled.div`
  font-size: ${({ theme }) => theme.typography.fontSize.xs};
  color: ${({ theme }) => theme.colors.text.tertiary};
`;

// EditingContainer - 편집 모드 컨테이너
export const EditingContainer = styled.div`
  margin-top: ${({ theme }) => theme.spacing[4]};
  padding: ${({ theme }) => theme.spacing[4]};
  background: #f0f4ff;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  border: 1px solid #c7d2fe;
`;

// MenuButton - BaseButton 재사용
export const MenuButton = styled(BaseButton).attrs({
  variant: 'ghost' as const,
  size: 'sm' as const,
})`
  padding: 4px;
  color: ${({ theme }) => theme.colors.text.tertiary};

  &:hover {
    color: ${({ theme }) => theme.colors.text.primary};
    background: ${({ theme }) => theme.colors.background.secondary};
  }
`;

// DropdownMenu - 공통 드롭다운 패턴
export const DropdownMenu = styled(motion.div)`
  position: absolute;
  top: 100%;
  right: 0;
  margin-top: 8px;
  background: ${({ theme }) => theme.colors.background.primary};
  border: 1px solid ${({ theme }) => theme.colors.border.light};
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  z-index: ${({ theme }) => theme.zIndex.modal + 1};
  overflow: hidden;
  min-width: 120px;
`;

// MenuItem - 드롭다운 메뉴 아이템
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