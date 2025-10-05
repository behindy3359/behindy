"use client";

import styled from 'styled-components';
import { motion } from 'framer-motion';
import {
  FlexContainer,
  BaseButton,
  LinkButton,
  BaseCheckbox,
  ErrorText as SharedErrorText, // 🔥 이름 변경으로 충돌 해결
  FormContainer
} from '@/shared/styles/components';

// SignupContainer - 기본 폼 컨테이너
export const SignupContainer = styled.div`
  width: 100%;
  
  > * + * {
    margin-top: ${({ theme }) => theme.spacing[4]};
  }
  
  @media ${({ theme }) => `(max-height: 600px)`} {
    > * + * {
      margin-top: ${({ theme }) => theme.spacing[3]};
    }
  }
`;

// ActionsContainer - motion.div 기반
export const ActionsContainer = styled(motion.div)`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing[3]};
  align-items: center;
  justify-content: center;
  padding-top: ${({ theme }) => theme.spacing[4]};

  @media ${({ theme }) => `(max-width: 768px)`} {
    width: 100%;

    button {
      width: 100%;
    }
  }

  @media ${({ theme }) => `(max-height: 600px)`} {
    gap: ${({ theme }) => theme.spacing[2]};
    padding-top: ${({ theme }) => theme.spacing[3]};
  }
`;

// LoginPrompt - 기존과 유사하지만 로그인 유도용
export const LoginPrompt = styled(motion.div)`
  text-align: center;
  
  p {
    color: ${({ theme }) => theme.colors.text.secondary};
    font-size: ${({ theme }) => theme.typography.fontSize.sm};
    margin: 0;
    
    @media ${({ theme }) => `(max-height: 600px)`} {
      font-size: ${({ theme }) => theme.typography.fontSize.xs};
    }
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

// PasswordToggleButton - 공통 토글 버튼
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

// PasswordMatchIndicator - 비밀번호 일치 표시
export const PasswordMatchIndicator = styled(motion.div)<{ $isMatch: boolean }>`
  margin-top: ${({ theme }) => theme.spacing[2]};
  font-size: ${({ theme }) => theme.typography.fontSize.xs};
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[1]};
  color: ${({ $isMatch, theme }) => $isMatch ? theme.colors.success : theme.colors.error};
  
  svg {
    width: 14px;
    height: 14px;
  }
`;

// StrengthMeterContainer - 비밀번호 강도 미터
export const StrengthMeterContainer = styled.div`
  margin-top: ${({ theme }) => theme.spacing[3]};
`;

export const StrengthBarSection = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing[2]};
`;

export const StrengthHeader = styled(FlexContainer).attrs({
  $direction: 'row' as const,
  $justify: 'between' as const,
  $align: 'center' as const,
})`
  margin-bottom: ${({ theme }) => theme.spacing[2]};
`;

export const StrengthLabel = styled.span`
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  color: ${({ theme }) => theme.colors.text.primary};
`;

export const StrengthText = styled.span<{ $color: string }>`
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  color: ${({ $color }) => $color};
`;

export const StrengthBarTrack = styled.div`
  width: 100%;
  background: ${({ theme }) => theme.colors.background.secondary};
  border-radius: ${({ theme }) => theme.borderRadius.xl};
  height: 6px;
  overflow: hidden;
`;

export const StrengthBarFill = styled(motion.div)<{ $color: string }>`
  height: 100%;
  border-radius: ${({ theme }) => theme.borderRadius.xl};
  background: ${({ $color }) => $color};
  transition: ${({ theme }) => theme.transition.normal};
`;

// 요구사항 컨테이너들
export const RequirementsContainer = styled.div`
  padding: ${({ theme }) => theme.spacing[3]};
  background: ${({ theme }) => theme.colors.background.secondary};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  border: 1px solid ${({ theme }) => theme.colors.border.light};
`;

export const RequirementsHeader = styled(FlexContainer).attrs({
  $direction: 'row' as const,
  $align: 'center' as const,
  $gap: 2 as const,
})`
  margin-bottom: ${({ theme }) => theme.spacing[2]};
`;

export const RequirementsTitle = styled.span`
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  color: ${({ theme }) => theme.colors.text.secondary};
`;

export const RequirementsList = styled(FlexContainer).attrs({
  $direction: 'column' as const,
  $gap: 2 as const,
})``;

export const RequirementItem = styled(motion.div)<{ $met: boolean }>`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[2]};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  color: ${({ $met, theme }) => $met ? theme.colors.success : theme.colors.text.secondary};
  
  svg {
    width: 14px;
    height: 14px;
    color: ${({ $met, theme }) => $met ? theme.colors.success : theme.colors.border.dark};
  }
  
  span {
    text-decoration: ${({ $met }) => $met ? 'line-through' : 'none'};
  }
`;

export const HintsContainer = styled.div`
  margin-top: ${({ theme }) => theme.spacing[2]};
  padding-top: ${({ theme }) => theme.spacing[2]};
  border-top: 1px solid ${({ theme }) => theme.colors.border.light};
`;

export const HintItem = styled(motion.div)`
  font-size: ${({ theme }) => theme.typography.fontSize.xs};
  color: ${({ theme }) => theme.colors.text.secondary};
  margin-bottom: ${({ theme }) => theme.spacing[1]};
  
  &:last-child {
    margin-bottom: 0;
  }
`;

// 약관 동의 관련
export const AgreementContainer = styled(motion.div)`
  border: 1px solid ${({ theme }) => theme.colors.border.medium};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  padding: ${({ theme }) => theme.spacing[4]};
  background: ${({ theme }) => theme.colors.background.secondary};
  
  @media ${({ theme }) => `(max-height: 600px)`} {
    padding: ${({ theme }) => theme.spacing[3]};
  }
`;

export const AgreementTitle = styled.h3`
  font-size: ${({ theme }) => theme.typography.fontSize.base};
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  color: ${({ theme }) => theme.colors.text.primary};
  margin: 0 0 ${({ theme }) => theme.spacing[3]} 0;
  
  @media ${({ theme }) => `(max-height: 600px)`} {
    font-size: ${({ theme }) => theme.typography.fontSize.sm};
    margin-bottom: ${({ theme }) => theme.spacing[2]};
  }
`;

export const AgreementsList = styled(FlexContainer).attrs({
  $direction: 'column' as const,
  $gap: 3 as const,
})`
  @media ${({ theme }) => `(max-height: 600px)`} {
    gap: ${({ theme }) => theme.spacing[2]};
  }
`;

export const AgreementItem = styled.div``;

export const AgreementLabel = styled.label`
  display: flex;
  align-items: flex-start;
  gap: ${({ theme }) => theme.spacing[2]};
  cursor: pointer;
  
  &:hover {
    .checkbox-wrapper {
      border-color: ${({ theme }) => theme.colors.primary[500]};
    }
  }
`;

export const CheckboxWrapper = styled.div<{ $required?: boolean; $checked?: boolean }>`
  display: flex;
  align-items: center;
  height: 18px;
  
  input[type="checkbox"] {
    width: 18px;
    height: 18px;
    border-radius: ${({ theme }) => theme.borderRadius.sm};
    border: 2px solid ${({ $required, $checked, theme }) => 
      $checked ? theme.colors.primary[500] : ($required ? theme.colors.error : theme.colors.border.medium)
    };
    background: ${({ $checked, theme }) => $checked ? theme.colors.primary[500] : theme.colors.background.primary};
    cursor: pointer;
    margin: 0;
    transition: ${({ theme }) => theme.transition.fast};
    
    &:checked {
      background-color: ${({ theme }) => theme.colors.primary[500]};
      border-color: ${({ theme }) => theme.colors.primary[500]};
      background-image: url("data:image/svg+xml,%3csvg viewBox='0 0 16 16' fill='white' xmlns='http://www.w3.org/2000/svg'%3e%3cpath d='m13.854 3.646-8 8-.5-.5 8-8 .5.5z'/%3e%3cpath d='m6.854 7.146-2-2-.5.5 2 2 .5-.5z'/%3e%3c/svg%3e");
      background-size: contain;
      background-repeat: no-repeat;
      background-position: center;
    }
    
    &:focus {
      outline: none;
      box-shadow: ${({ theme }) => theme.shadows.focus};
    }
    
    &:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
  }
`;

export const AgreementContent = styled.div`
  flex: 1;
`;

export const AgreementText = styled(FlexContainer).attrs({
  $direction: 'row' as const,
  $align: 'center' as const,
  $gap: 2 as const,
  $wrap: true,
})`
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  line-height: ${({ theme }) => theme.typography.lineHeight.normal};
  
  @media ${({ theme }) => `(max-height: 600px)`} {
    font-size: ${({ theme }) => theme.typography.fontSize.xs};
  }
`;

export const RequiredMark = styled.span`
  color: ${({ theme }) => theme.colors.error};
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
`;

export const AgreementLink = styled(LinkButton)`
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
`;

export const ExternalLinkIcon = styled.span`
  color: ${({ theme }) => theme.colors.text.tertiary};
  
  svg {
    width: 12px;
    height: 12px;
  }
`;

export const AgreementDescription = styled.div`
  margin-top: ${({ theme }) => theme.spacing[1]};
  font-size: ${({ theme }) => theme.typography.fontSize.xs};
  color: ${({ theme }) => theme.colors.text.secondary};
`;

export const OptionalText = styled.span`
  color: ${({ theme }) => theme.colors.text.secondary};
  margin-left: ${({ theme }) => theme.spacing[1]};
`;

// 🔥 ErrorText 이름 충돌 해결 - 로컬 컴포넌트로 정의
export const AgreementErrorText = styled(SharedErrorText)`
  margin: ${({ theme }) => theme.spacing[1]} 0 0 ${({ theme }) => theme.spacing[6]};
`;

export const RequiredNotice = styled.div`
  margin-top: ${({ theme }) => theme.spacing[3]};
  padding-top: ${({ theme }) => theme.spacing[3]};
  border-top: 1px solid ${({ theme }) => theme.colors.border.medium};
  
  p {
    font-size: ${({ theme }) => theme.typography.fontSize.xs};
    color: ${({ theme }) => theme.colors.text.secondary};
    margin: 0;
  }
  
  .required-mark {
    color: ${({ theme }) => theme.colors.error};
  }
`;