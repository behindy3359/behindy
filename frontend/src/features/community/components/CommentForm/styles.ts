import { motion } from "framer-motion";
import styled from "styled-components";

export const FormContainer = styled(motion.div)`
  background: #f9fafb;
  border-radius: 8px;
  padding: 16px;
  border: 1px solid #e5e7eb;
`;

export const UserInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 12px;
  font-size: 14px;
  
  .avatar {
    width: 32px;
    height: 32px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    font-weight: 600;
    font-size: 14px;
  }
  
  .name {
    font-weight: 600;
    color: #374151;
  }
`;

export const TextareaContainer = styled.div`
  position: relative;
  margin-bottom: 12px;
`;

export const Textarea = styled.textarea<{ $hasError: boolean }>`
  width: 100%;
  min-height: 80px;
  max-height: 200px;
  padding: 12px;
  border: 1px solid ${({ $hasError }) => $hasError ? '#ef4444' : '#d1d5db'};
  border-radius: 6px;
  font-size: 14px;
  line-height: 1.5;
  font-family: inherit;
  
  resize: none;
  overflow-y: auto;
  
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
    border-color: ${({ $hasError }) => $hasError ? '#ef4444' : '#667eea'};
    box-shadow: 0 0 0 3px ${({ $hasError }) => 
      $hasError ? 'rgba(239, 68, 68, 0.1)' : 'rgba(102, 126, 234, 0.1)'
    };
  }
  
  &::placeholder {
    color: #9ca3af;
  }
`;


export const CharCount = styled.div<{ $isOver: boolean }>`
  position: absolute;
  bottom: 8px;
  right: 12px;
  font-size: 12px;
  color: ${({ $isOver }) => $isOver ? '#ef4444' : '#9ca3af'};
  background: rgba(255, 255, 255, 0.9);
  padding: 2px 4px;
  border-radius: 4px;
`;

export const ErrorMessage = styled(motion.div)`
  display: flex;
  align-items: center;
  gap: 6px;
  color: #ef4444;
  font-size: 14px;
  margin-bottom: 12px;
  
  svg {
    width: 16px;
    height: 16px;
  }
`;

export const Actions = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export const CancelButton = styled.button`
  padding: 6px 12px;
  background: none;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  color: #6b7280;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.2s ease;
  
  &:hover {
    background: #f3f4f6;
    color: #374151;
  }
`;

export const Tips = styled.div`
  font-size: 12px;
  color: #9ca3af;
  
  .tip-item {
    margin-bottom: 2px;
  }
`;