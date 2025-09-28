import { motion } from "framer-motion";
import styled from "styled-components";
import { 
  BaseCard,
  FlexContainer,
  BaseTextarea,
  BaseButton,
  ErrorText,
  CommonActionGroup
} from '@/shared/styles/components';

// FormContainer - BaseCard 재사용
export const FormContainer = styled(BaseCard).attrs({
  $variant: 'outlined' as const,
  $size: 'md' as const,
})`
  background: ${({ theme }) => theme.colors.background.secondary};
`;

// UserInfo - FlexContainer 재사용
export const UserInfo = styled(FlexContainer).attrs({
  $direction: 'row' as const,
  $align: 'center' as const,
  $gap: 2 as const,
})`
  margin-bottom: ${({ theme }) => theme.spacing[3]};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  
  .avatar {
    width: 32px;
    height: 32px;
    background: linear-gradient(135deg, ${({ theme }) => theme.colors.primary[500]} 0%, ${({ theme }) => theme.colors.secondary[500]} 100%);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: ${({ theme }) => theme.colors.text.inverse};
    font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
    font-size: ${({ theme }) => theme.typography.fontSize.sm};
  }
  
  .name {
    font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
    color: ${({ theme }) => theme.colors.text.primary};
  }
`;

// TextareaContainer - 기본 컨테이너
export const TextareaContainer = styled.div`
  position: relative;
  margin-bottom: ${({ theme }) => theme.spacing[3]};
`;

// Textarea - BaseTextarea 확장
export const Textarea = styled(BaseTextarea)<{ $hasError: boolean }>`
  width: 100%;
  min-height: 80px;
  max-height: 80px;
  resize: none;
  overflow-y: auto;
  
  border-color: ${({ $hasError, theme }) => 
    $hasError ? theme.colors.error : theme.colors.border.medium
  };
  
  &:focus {
    border-color: ${({ $hasError, theme }) => 
      $hasError ? theme.colors.error : theme.colors.primary[500]
    };
    box-shadow: 0 0 0 3px ${({ $hasError, theme }) => 
      $hasError ? 'rgba(239, 68, 68, 0.1)' : theme.shadows.focus
    };
  }
  
  /* 스크롤바 스타일링 */
  &::-webkit-scrollbar {
    width: 6px;
  }
  
  &::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-radius: 3px;
  }
  
  &::-webkit-scrollbar-thumb {
    background: #c1c1c1;
    border-radius: 3px;
    
    &:hover {
      background: #a8a8a8;
    }
  }
`;

// CharCount - 글자 수 표시
export const CharCount = styled.div<{ $isOver: boolean }>`
  position: absolute;
  bottom: 8px;
  right: 12px;
  font-size: ${({ theme }) => theme.typography.fontSize.xs};
  color: ${({ $isOver, theme }) => $isOver ? theme.colors.error : theme.colors.text.tertiary};
  background: rgba(255, 255, 255, 0.9);
  padding: 2px 4px;
  border-radius: ${({ theme }) => theme.borderRadius.sm};
`;

// ErrorMessage - ErrorText 재사용
export const ErrorMessage = styled(ErrorText)`
  margin-bottom: ${({ theme }) => theme.spacing[3]};
`;

// Actions - CommonActionGroup 재사용  
export const Actions = styled(CommonActionGroup).attrs({
  $justify: 'between' as const,
})`
  /* CommonActionGroup 설정 활용 */
`;

// CancelButton - BaseButton 기반
export const CancelButton = styled(BaseButton).attrs({
  variant: 'secondary' as const,
  size: 'sm' as const,
})`
  /* BaseButton 기본 스타일 활용 */
`;

// Tips - 도움말 텍스트
export const Tips = styled.div`
  font-size: ${({ theme }) => theme.typography.fontSize.xs};
  color: ${({ theme }) => theme.colors.text.tertiary};
  
  .tip-item {
    margin-bottom: 2px;
  }
`;