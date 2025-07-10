import { motion } from "framer-motion";
import styled from "styled-components";

export const CommonGroup = styled.div`
  display: flex;
  gap: 12px;
  align-items: center;
`;

export const CommonWrapper = styled(motion.div)`
display: flex;
flex-direction: column;
gap: 24px;
`;

export const CommonLoadingState = styled.div`
  text-align: center;
  padding: ${({ theme }) => theme.spacing[6]};
  color: ${({ theme }) => theme.colors.text.tertiary};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
`;

export const CommonCommentHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: ${({ theme }) => theme.spacing[2]};
`;