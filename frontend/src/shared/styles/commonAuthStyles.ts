import { motion } from "framer-motion";
import styled from "styled-components";

export const CommonAuthAlertContainer = styled(motion.div)`
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

export const CommonAuthSuccessAlert = styled(CommonAuthAlertContainer)`
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

export const CommonAuthErrorAlert = styled(CommonAuthAlertContainer)`
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

export const CommonAuthHeaderSection = styled.div`
  text-align: center;
  margin-bottom: 32px;
`;

export const CommonAuthPageTitle = styled(motion.h1)`
  font-size: 32px;
  font-weight: 700;
  color: #111827;
  margin: 0 0 8px 0;
`;


export const CommonAuthPageSubtitle = styled(motion.p)`
  color: #6b7280;
  font-size: 16px;
  margin: 0;
`;

export const CommonAuthDivider = styled(motion.div)`
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