import { motion } from "framer-motion";
import styled from "styled-components";

export const CommonGroup = styled.div`
  display: flex;
  gap: 10px; /* 기존 12px에서 줄임 */
  align-items: center;
`;

export const CommonWrapper = styled(motion.div)`
  display: flex;
  flex-direction: column;
  gap: 18px; /* 기존 24px에서 줄임 */
  
  @media (max-height: 600px) {
    gap: 16px;
  }
`;

export const CommonLoadingState = styled.div`
  text-align: center;
  padding: ${({ theme }) => theme.spacing[4]};
  color: ${({ theme }) => theme.colors.text.tertiary};
  font-size: 13px;
  
  @media (max-height: 600px) {
    padding: ${({ theme }) => theme.spacing[3]};
    font-size: 12px;
  }
`;

export const CommonCommentHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: ${({ theme }) => theme.spacing[2]};
`;