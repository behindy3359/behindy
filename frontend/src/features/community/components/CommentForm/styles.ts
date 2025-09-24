import { motion } from "framer-motion";
import styled from "styled-components";
import { 
  BaseForm,
  FlexContainer,
  BaseTextarea,
  BaseButton,
  ErrorText 
} from '../../../../shared/styles/components';

// FormContainer - 폼 컨테이너 (BaseForm 활용)
export const FormContainer = styled(motion.div)`
  background: ${({ theme }) => theme.colors.background.secondary};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  padding: ${({ theme }) => theme.spacing[4]};
  border: 1px solid ${({ theme }) => theme.colors.border.medium};
`;

// UserInfo - 사용자 정보
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

// TextareaContainer - 텍스트 영역 컨테이너
export const TextareaContainer = styled.div`
  position: relative;
  margin-bottom: ${({ theme }) => theme.spacing[3]};
`;

// Textarea - 텍스트 영역 (BaseTextarea 확장)
export const Textarea = styled(BaseTextarea)<{ $hasError: boolean }>`
  width: 100%;
  min-height: 80px;
  max-height: 80px;
  padding: ${({ theme }) => theme.spacing[3]};
  border: 1px solid ${({ $hasError, theme }) => $hasError ? theme.colors.error : theme.colors.border.medium};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  line-height: ${({ theme }) => theme.typography.lineHeight.normal};
  font-family: inherit;
  
  resize: none;
  overflow-y: auto;
  
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
  
  &:focus {
    outline: none;
    border-color: ${({ $hasError, theme }) => $hasError ? theme.colors.error : theme.colors.primary[500]};
    box-shadow: 0 0 0 3px ${({ $hasError, theme }) => 
      $hasError ? 'rgba(239, 68, 68, 0.1)' : theme.shadows.focus
    };
  }
  
  &::placeholder {
    color: ${({ theme }) => theme.colors.text.tertiary};
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

// ErrorMessage - 에러 메시지 (ErrorText 컴포넌트 활용)
export const ErrorMessage = styled(ErrorText)`
  margin-bottom: ${({ theme }) => theme.spacing[3]};
  
  svg {
    width: 16px;
    height: 16px;
  }
`;

// Actions - 액션 버튼들
export const Actions = styled(FlexContainer).attrs({
  $direction: 'row' as const,
  $justify: 'between' as const,
  $align: 'center' as const,
})`
  /* FlexContainer 설정 활용 */
`;

// CancelButton - 취소 버튼
export const CancelButton = styled.button`
  padding: ${({ theme }) => theme.spacing[2]} ${({ theme }) => theme.spacing[3]};
  background: none;
  border: 1px solid ${({ theme }) => theme.colors.border.medium};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  color: ${({ theme }) => theme.colors.text.secondary};
  cursor: pointer;
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  transition: ${({ theme }) => theme.transition.fast};
  
  &:hover {
    background: ${({ theme }) => theme.colors.background.tertiary};
    color: ${({ theme }) => theme.colors.text.primary};
  }
`;

// Tips - 팁 텍스트
export const Tips = styled.div`
  font-size: ${({ theme }) => theme.typography.fontSize.xs};
  color: ${({ theme }) => theme.colors.text.tertiary};
  
  .tip-item {
    margin-bottom: 2px;
  }
`;