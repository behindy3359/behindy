import styled from 'styled-components';
import { motion } from 'framer-motion';

export const SignupPrompt = styled(motion.div)`
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

export const OptionsContainer = styled(motion.div)`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 8px;
`;

export const RememberMeWrapper = styled.label`
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  
  input[type="checkbox"] {
    width: 16px;
    height: 16px;
    border-radius: 4px;
    border: 1px solid #d1d5db;
    background: white;
    cursor: pointer;
    
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
  
  span {
    font-size: 14px;
    color: #374151;
  }
`;

export const ForgotPasswordLink = styled.button`
  font-size: 14px;
  color: #2563eb;
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

export const DemoContainer = styled(motion.div)`
  margin-bottom: 24px;
  padding: 16px;
  background: linear-gradient(to right, #eff6ff, #eef2ff);
  border: 1px solid #bfdbfe;
  border-radius: 8px;
`;

export const DemoContent = styled.div`
  text-align: center;
`;