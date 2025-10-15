import styled from 'styled-components';
import { motion } from 'framer-motion';
import { 
  FlexContainer,
  LinkButton,
  BaseButton,
  BaseCheckbox,
  CommonActionGroup 
} from '@/shared/styles/components';

// SignupPrompt - 기존과 동일 (특수한 스타일이라 유지)
export const SignupPrompt = styled(motion.div)`
  text-align: center;
  
  p {
    color: ${({ theme }) => theme.colors.text.secondary};
    font-size: ${({ theme }) => theme.typography.fontSize.sm};
    margin: 0;
  }
  
  button {
    color: ${({ theme }) => theme.colors.primary[500]};
    font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
    text-decoration: underline;
    text-decoration-style: dotted;
    text-underline-offset: 2px;
    background: none;
    border: none;
    cursor: pointer;
    transition: ${({ theme }) => theme.transition.fast};
    margin-left: ${({ theme }) => theme.spacing[1]};
    
    &:hover {
      color: ${({ theme }) => theme.colors.primary[600]};
    }
    
    &:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
  }
`;

// OptionsContainer - CommonActionGroup 활용
export const OptionsContainer = styled(CommonActionGroup).attrs({
  $justify: 'between' as const,
})`
  margin-top: ${({ theme }) => theme.spacing[2]};
`;

// RememberMeWrapper - 체크박스 공통 패턴 적용
export const RememberMeWrapper = styled.label`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[2]};
  cursor: pointer;
  
  input[type="checkbox"] {
    width: 16px;
    height: 16px;
    border-radius: ${({ theme }) => theme.borderRadius.sm};
    border: 1px solid ${({ theme }) => theme.colors.border.medium};
    background: ${({ theme }) => theme.colors.background.primary};
    cursor: pointer;
    
    &:checked {
      background-color: ${({ theme }) => theme.colors.primary[500]};
      border-color: ${({ theme }) => theme.colors.primary[500]};
      background-image: url("data:image/svg+xml,%3csvg viewBox='0 0 16 16' fill='white' xmlns='http://www.w3.org/2000/svg'%3e%3cpath d='m13.854 3.646-8 8-.5-.5 8-8 .5.5z'/%3e%3cpath d='m6.854 7.146-2-2-.5.5 2 2 .5-.5z'/%3e%3c/svg%3e");
    }
    
    &:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
  }
  
  span {
    font-size: ${({ theme }) => theme.typography.fontSize.sm};
    color: ${({ theme }) => theme.colors.text.primary};
  }
`;

// ForgotPasswordLink - LinkButton 재사용
export const ForgotPasswordLink = styled(LinkButton)`
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
`;

// PasswordToggleButton - 공통 아이콘 버튼 패턴
export const PasswordToggleButton = styled.button`
  color: ${({ theme }) => theme.colors.text.secondary};
  background: none;
  border: none;
  cursor: pointer;
  transition: ${({ theme }) => theme.transition.fast};
  padding: ${({ theme }) => theme.spacing[1]};
  display: flex;
  align-items: center;
  justify-content: center;
  
  &:hover {
    color: ${({ theme }) => theme.colors.text.primary};
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

// DemoContainer - 공통 알림 패턴 적용
export const DemoContainer = styled(motion.div)`
  margin-bottom: ${({ theme }) => theme.spacing[6]};
  padding: ${({ theme }) => theme.spacing[4]};
  background: linear-gradient(to right, #eff6ff, #eef2ff);
  border: 1px solid #bfdbfe;
  border-radius: ${({ theme }) => theme.borderRadius.md};
`;

// DemoContent - 중앙 정렬 패턴
export const DemoContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing[3]};
`;

// DemoAccountList - 데모 계정 목록
export const DemoAccountList = styled(motion.div)`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing[2]};
  padding: ${({ theme }) => theme.spacing[2]} 0;
`;

// DemoAccountItem - 데모 계정 아이템
export const DemoAccountItem = styled(motion.button)`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: ${({ theme }) => theme.spacing[3]};
  background: ${({ theme }) => theme.colors.background.primary};
  border: 1px solid ${({ theme }) => theme.colors.border.light};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  cursor: pointer;
  transition: ${({ theme }) => theme.transition.fast};
  width: 100%;

  &:hover {
    background: ${({ theme }) => theme.colors.background.secondary};
    border-color: ${({ theme }) => theme.colors.primary[500]};
  }

  .account-name {
    font-size: ${({ theme }) => theme.typography.fontSize.sm};
    font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
    color: ${({ theme }) => theme.colors.text.primary};
    margin-bottom: ${({ theme }) => theme.spacing[1]};
  }

  .account-email {
    font-size: ${({ theme }) => theme.typography.fontSize.xs};
    color: ${({ theme }) => theme.colors.text.secondary};
  }
`;