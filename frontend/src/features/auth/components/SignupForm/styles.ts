import styled from 'styled-components';
import { motion } from 'framer-motion';

export const SignupContainer = styled.div`
  width: 100%;
  /* 높이 제한 및 스크롤 완전 제거 */
  
  /* 간격 조정으로 컴팩트하게 */
  > * + * {
    margin-top: 20px;
  }
  
  @media (max-height: 600px) {
    > * + * {
      margin-top: 16px;
    }
  }
`;

export const ActionsContainer = styled(motion.div)`
  display: flex;
  flex-direction: column;
  gap: 12px; /* 기존 16px에서 줄임 */
  padding-top: 20px; /* 기존 24px에서 줄임 */
  
  @media (max-height: 600px) {
    gap: 10px;
    padding-top: 16px;
  }
`;

export const LoginPrompt = styled(motion.div)`
  text-align: center;
  
  p {
    color: #6b7280;
    font-size: 14px;
    margin: 0;
    
    @media (max-height: 600px) {
      font-size: 13px;
    }
  }
  
  button {
    color: #2563eb;
    font-weight: 600;
    text-decoration: underline;
    text-decoration-style: dotted;
    text-underline-offset: 2px;
    background: none;
    border: none;
    cursor: pointer;
    transition: color 0.2s ease;
    margin-left: 4px;
    
    &:hover {
      color: #1d4ed8;
    }
    
    &:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
  }
`;

export const PasswordToggleButton = styled.button`
  color: #6b7280;
  background: none;
  border: none;
  cursor: pointer;
  transition: color 0.2s ease;
  padding: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  
  &:hover {
    color: #374151;
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

export const PasswordMatchIndicator = styled(motion.div)<{ $isMatch: boolean }>`
  margin-top: 6px; /* 기존 8px에서 줄임 */
  font-size: 12px;
  display: flex;
  align-items: center;
  gap: 4px;
  color: ${({ $isMatch }) => $isMatch ? '#10b981' : '#ef4444'};
  
  svg {
    width: 14px;
    height: 14px;
  }
`;

export const StrengthMeterContainer = styled.div<{ className?: string }>`
  margin-top: 12px; /* 기존 16px에서 줄임 */
  ${({ className }) => className || ''}
`;

export const StrengthBarSection = styled.div`
  margin-bottom: 10px; /* 기존 12px에서 줄임 */
`;

export const StrengthHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 6px; /* 기존 8px에서 줄임 */
`;

export const StrengthLabel = styled.span`
  font-size: 14px;
  font-weight: 500;
  color: #374151;
`;

export const StrengthText = styled.span<{ $color: string }>`
  font-size: 14px;
  font-weight: 600;
  color: ${({ $color }) => $color};
`;

export const StrengthBarTrack = styled.div`
  width: 100%;
  background: #e5e7eb;
  border-radius: 9999px;
  height: 6px; /* 기존 8px에서 줄임 */
  overflow: hidden;
`;

export const StrengthBarFill = styled(motion.div)<{ $color: string }>`
  height: 100%;
  border-radius: 9999px;
  background: ${({ $color }) => $color};
  transition: all 0.3s ease;
`;

export const RequirementsContainer = styled.div`
  padding: 12px; /* 기존 16px에서 줄임 */
  background: #f8fafc;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
`;

export const RequirementsHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px; /* 기존 12px에서 줄임 */
`;

export const RequirementsTitle = styled.span`
  font-size: 14px;
  font-weight: 600;
  color: #475569;
`;

export const RequirementsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px; /* 기존 8px에서 줄임 */
`;

export const RequirementItem = styled(motion.div)<{ $met: boolean }>`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px; /* 기존 14px에서 줄임 */
  color: ${({ $met }) => $met ? '#10b981' : '#6b7280'};
  
  svg {
    width: 14px; /* 기존 16px에서 줄임 */
    height: 14px;
    color: ${({ $met }) => $met ? '#10b981' : '#9ca3af'};
  }
  
  span {
    text-decoration: ${({ $met }) => $met ? 'line-through' : 'none'};
  }
`;

export const HintsContainer = styled.div`
  margin-top: 10px; /* 기존 12px에서 줄임 */
  padding-top: 10px;
  border-top: 1px solid #e2e8f0;
`;

export const HintItem = styled(motion.div)`
  font-size: 11px; /* 기존 12px에서 줄임 */
  color: #6b7280;
  margin-bottom: 3px; /* 기존 4px에서 줄임 */
  
  &:last-child {
    margin-bottom: 0;
  }
`;

// 🔥 변경: 약관 동의 섹션도 컴팩트하게
export const AgreementContainer = styled(motion.div)`
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 20px; /* 기존 24px에서 줄임 */
  background: #fafbfc;
  
  @media (max-height: 600px) {
    padding: 16px;
  }
`;

export const AgreementTitle = styled.h3`
  font-size: 16px; /* 기존 18px에서 줄임 */
  font-weight: 600;
  color: #111827;
  margin: 0 0 12px 0; /* 기존 16px에서 줄임 */
  
  @media (max-height: 600px) {
    font-size: 15px;
    margin-bottom: 10px;
  }
`;

export const AgreementsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px; /* 기존 16px에서 줄임 */
  
  @media (max-height: 600px) {
    gap: 10px;
  }
`;

export const AgreementItem = styled.div`
  /* 기본 스타일 */
`;

export const AgreementLabel = styled.label`
  display: flex;
  align-items: flex-start;
  gap: 10px; /* 기존 12px에서 줄임 */
  cursor: pointer;
  
  &:hover {
    .checkbox-wrapper {
      border-color: #2563eb;
    }
  }
`;

export const CheckboxWrapper = styled.div<{ $required?: boolean; $checked?: boolean }>`
  display: flex;
  align-items: center;
  height: 18px; /* 기존 20px에서 줄임 */
  
  input[type="checkbox"] {
    width: 18px; /* 기존 20px에서 줄임 */
    height: 18px;
    border-radius: 4px;
    border: 2px solid ${({ $required, $checked }) => 
      $checked ? '#2563eb' : ($required ? '#dc2626' : '#d1d5db')
    };
    background: ${({ $checked }) => $checked ? '#2563eb' : 'white'};
    cursor: pointer;
    margin: 0;
    transition: all 0.2s ease;
    
    &:checked {
      background-color: #2563eb;
      border-color: #2563eb;
      background-image: url("data:image/svg+xml,%3csvg viewBox='0 0 16 16' fill='white' xmlns='http://www.w3.org/2000/svg'%3e%3cpath d='m13.854 3.646-8 8-.5-.5 8-8 .5.5z'/%3e%3cpath d='m6.854 7.146-2-2-.5.5 2 2 .5-.5z'/%3e%3c/svg%3e");
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

export const AgreementText = styled.div`
  display: flex;
  align-items: center;
  gap: 6px; /* 기존 8px에서 줄임 */
  flex-wrap: wrap;
  color: #374151;
  font-size: 13px; /* 기존 14px에서 줄임 */
  line-height: 1.4; /* 기존 1.5에서 줄임 */
  
  @media (max-height: 600px) {
    font-size: 12px;
  }
`;

export const RequiredMark = styled.span`
  color: #dc2626;
  font-weight: 600;
`;

export const AgreementLink = styled.button`
  color: #2563eb;
  font-weight: 500;
  text-decoration: underline;
  text-decoration-style: dotted;
  text-underline-offset: 2px;
  background: none;
  border: none;
  cursor: pointer;
  transition: color 0.2s ease;
  
  &:hover {
    color: #1d4ed8;
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

export const ExternalLinkIcon = styled.span`
  color: #9ca3af;
  
  svg {
    width: 12px; /* 기존 14px에서 줄임 */
    height: 12px;
  }
`;

export const AgreementDescription = styled.div`
  margin-top: 3px; /* 기존 4px에서 줄임 */
  font-size: 11px; /* 기존 12px에서 줄임 */
  color: #6b7280;
  
  @media (max-height: 600px) {
    font-size: 10px;
  }
`;

export const OptionalText = styled.span`
  color: #6b7280;
  margin-left: 4px;
`;

export const ErrorText = styled(motion.p)`
  color: #ef4444;
  font-size: 11px; /* 기존 12px에서 줄임 */
  margin: 3px 0 0 28px; /* 기존 4px, 32px에서 줄임 */
`;

export const RequiredNotice = styled.div`
  margin-top: 12px; /* 기존 16px에서 줄임 */
  padding-top: 12px;
  border-top: 1px solid #e5e7eb;
  
  p {
    font-size: 11px; /* 기존 12px에서 줄임 */
    color: #6b7280;
    margin: 0;
    
    @media (max-height: 600px) {
      font-size: 10px;
    }
  }
  
  .required-mark {
    color: #dc2626;
  }
`;