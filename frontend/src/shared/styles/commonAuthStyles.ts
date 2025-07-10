import { motion } from "framer-motion";
import styled from "styled-components";

export const CommonAuthAlertContainer = styled(motion.div)`
  display: flex;
  align-items: flex-start;
  gap: 10px; /* 기존 12px에서 줄임 */
  padding: 12px; /* 기존 16px에서 줄임 */
  border-radius: 8px;
  font-size: 13px; /* 기존 14px에서 줄임 */
  margin-bottom: 16px; /* 기존 24px에서 줄임 */
  
  svg {
    width: 18px; /* 기존 20px에서 줄임 */
    height: 18px;
    flex-shrink: 0;
    margin-top: 1px; /* 기존 2px에서 줄임 */
  }
  
  .content {
    flex: 1;
    
    .title {
      font-weight: 600;
      margin-bottom: 3px; /* 기존 4px에서 줄임 */
      font-size: 13px;
    }
    
    .message {
      margin: 0;
      font-size: 12px;
      line-height: 1.4;
    }
  }
  
  @media (max-height: 600px) {
    padding: 10px;
    margin-bottom: 14px;
    
    .content {
      .title {
        font-size: 12px;
      }
      
      .message {
        font-size: 11px;
      }
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
  margin-bottom: 24px; /* 기존 32px에서 줄임 */
  
  @media (max-height: 600px) {
    margin-bottom: 20px;
  }
`;

export const CommonAuthPageTitle = styled(motion.h1)`
  font-size: 28px; /* 기존 32px에서 줄임 */
  font-weight: 700;
  color: #111827;
  margin: 0 0 6px 0; /* 기존 8px에서 줄임 */
  
  @media (max-height: 600px) {
    font-size: 24px;
    margin-bottom: 4px;
  }
  
  @media (max-width: 480px) {
    font-size: 22px;
  }
`;

export const CommonAuthPageSubtitle = styled(motion.p)`
  color: #6b7280;
  font-size: 15px; /* 기존 16px에서 줄임 */
  margin: 0;
  line-height: 1.4;
  
  @media (max-height: 600px) {
    font-size: 14px;
  }
  
  @media (max-width: 480px) {
    font-size: 13px;
  }
`;

export const CommonAuthDivider = styled(motion.div)`
  display: flex;
  align-items: center;
  margin: 20px 0; /* 기존 32px에서 줄임 */
  
  &::before,
  &::after {
    content: '';
    flex: 1;
    height: 1px;
    background: #d1d5db;
  }
  
  span {
    padding: 0 12px; /* 기존 16px에서 줄임 */
    color: #6b7280;
    font-size: 13px; /* 기존 14px에서 줄임 */
    font-weight: 500;
  }
  
  @media (max-height: 600px) {
    margin: 16px 0;
    
    span {
      padding: 0 10px;
      font-size: 12px;
    }
  }
`;