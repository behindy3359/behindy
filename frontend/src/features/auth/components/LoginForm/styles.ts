import styled from 'styled-components';
import { motion } from 'framer-motion';
import { 
  FlexContainer,
  LinkButton,
  BaseButton,
  BaseCheckbox 
} from '@/shared/styles/components';

// SignupPrompt - 회원가입 유도 텍스트
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

// OptionsContainer - 로그인 옵션 컨테이너
export const OptionsContainer = styled(motion.div)`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: ${({ theme }) => theme.spacing[2]};
`;

// RememberMeWrapper - 로그인 상태 유지 체크박스
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

// ForgotPasswordLink - LinkButton 활용
export const ForgotPasswordLink = styled(LinkButton)`
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
`;

// PasswordToggleButton - 비밀번호 표시/숨김 버튼
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

// DemoContainer - 데모 로그인 컨테이너
export const DemoContainer = styled(motion.div)`
  margin-bottom: ${({ theme }) => theme.spacing[6]};
  padding: ${({ theme }) => theme.spacing[4]};
  background: linear-gradient(to right, #eff6ff, #eef2ff);
  border: 1px solid #bfdbfe;
  border-radius: ${({ theme }) => theme.borderRadius.md};
`;

// DemoContent - 데모 로그인 내용
export const DemoContent = styled.div`
  text-align: center;
`;