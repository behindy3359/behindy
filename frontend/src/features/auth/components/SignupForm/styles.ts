import styled from 'styled-components';
import { motion } from 'framer-motion';

export const SignupContainer = styled.div`
  width: 100%;
  max-height: 80vh;
  overflow-y: auto;
  
  /* 커스텀 스크롤바 */
  &::-webkit-scrollbar {
    width: 6px;
  }
  
  &::-webkit-scrollbar-track {
    background: #f1f5f9;
    border-radius: 3px;
  }
  
  &::-webkit-scrollbar-thumb {
    background: #cbd5e1;
    border-radius: 3px;
    
    &:hover {
      background: #94a3b8;
    }
  }
`;

export const HeaderSection = styled.div`
  text-align: center;
  margin-bottom: 32px;
`;

export const PageTitle = styled(motion.h1)`
  font-size: 32px;
  font-weight: 700;
  color: #111827;
  margin: 0 0 8px 0;
`;

export const SignupFormContainer = styled(motion.form)`
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

export const AlertContainer = styled(motion.div)`
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 16px;
  border-radius: 8px;
  font-size: 14px;
  margin-bottom: 24px;
  
  svg {
    width: 20px;
    height: 20px;
    flex-shrink: 0;
    margin-top: 2px;
  }
  
  .content {
    flex: 1;
    
    .title {
      font-weight: 600;
      margin-bottom: 4px;
    }
    
    .message {
      margin: 0;
    }
  }
`;

export const ErrorAlert = styled(AlertContainer)`
  background: #fef2f2;
  border: 1px solid #fecaca;
  color: #dc2626;
  
  .title {
    color: #dc2626;
  }
  
  .message {
    color: #b91c1c;
  }
`;

export const SuccessAlert = styled(AlertContainer)`
  background: #f0fdf4;
  border: 1px solid #bbf7d0;
  color: #16a34a;
  
  .title {
    color: #16a34a;
  }
  
  .message {
    color: #15803d;
  }
`;

export const ActionsContainer = styled(motion.div)`
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding-top: 24px;
`;

export const Divider = styled(motion.div)`
  display: flex;
  align-items: center;
  margin: 32px 0;
  
  &::before,
  &::after {
    content: '';
    flex: 1;
    height: 1px;
    background: #d1d5db;
  }
  
  span {
    padding: 0 16px;
    color: #6b7280;
    font-size: 14px;
    font-weight: 500;
  }
`;

export const LoginPrompt = styled(motion.div)`
  text-align: center;
  
  p {
    color: #6b7280;
    font-size: 14px;
    margin: 0;
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

export const FieldsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

export const FieldWrapper = styled(motion.div)`
  width: 100%;
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
  margin-top: 8px;
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
  margin-top: 16px;
  ${({ className }) => className || ''}
`;

export const StrengthBarSection = styled.div`
  margin-bottom: 12px;
`;

export const StrengthHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
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
  height: 8px;
  overflow: hidden;
`;

export const StrengthBarFill = styled(motion.div)<{ $color: string }>`
  height: 100%;
  border-radius: 9999px;
  background: ${({ $color }) => $color};
  transition: all 0.3s ease;
`;

export const RequirementsContainer = styled.div`
  padding: 16px;
  background: #f8fafc;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
`;

export const RequirementsHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 12px;
`;

export const RequirementsTitle = styled.span`
  font-size: 14px;
  font-weight: 600;
  color: #475569;
`;

export const RequirementsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

export const RequirementItem = styled(motion.div)<{ $met: boolean }>`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  color: ${({ $met }) => $met ? '#10b981' : '#6b7280'};
  
  svg {
    width: 16px;
    height: 16px;
    color: ${({ $met }) => $met ? '#10b981' : '#9ca3af'};
  }
  
  span {
    text-decoration: ${({ $met }) => $met ? 'line-through' : 'none'};
  }
`;

export const HintsContainer = styled.div`
  margin-top: 12px;
  padding-top: 12px;
  border-top: 1px solid #e2e8f0;
`;

export const HintItem = styled(motion.div)`
  font-size: 12px;
  color: #6b7280;
  margin-bottom: 4px;
  
  &:last-child {
    margin-bottom: 0;
  }
`;

export const AgreementContainer = styled(motion.div)`
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 24px;
  background: #fafbfc;
`;

export const AgreementTitle = styled.h3`
  font-size: 18px;
  font-weight: 600;
  color: #111827;
  margin: 0 0 16px 0;
`;

export const AgreementsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

export const AgreementItem = styled.div`
  /* 기본 스타일 */
`;

export const AgreementLabel = styled.label`
  display: flex;
  align-items: flex-start;
  gap: 12px;
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
  height: 20px;
  
  input[type="checkbox"] {
    width: 20px;
    height: 20px;
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
  gap: 8px;
  flex-wrap: wrap;
  color: #374151;
  font-size: 14px;
  line-height: 1.5;
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
    width: 14px;
    height: 14px;
  }
`;

export const AgreementDescription = styled.div`
  margin-top: 4px;
  font-size: 12px;
  color: #6b7280;
`;

export const OptionalText = styled.span`
  color: #6b7280;
  margin-left: 4px;
`;

export const ErrorText = styled(motion.p)`
  color: #ef4444;
  font-size: 12px;
  margin: 4px 0 0 32px;
`;

export const RequiredNotice = styled.div`
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px solid #e5e7eb;
  
  p {
    font-size: 12px;
    color: #6b7280;
    margin: 0;
  }
  
  .required-mark {
    color: #dc2626;
  }
`;