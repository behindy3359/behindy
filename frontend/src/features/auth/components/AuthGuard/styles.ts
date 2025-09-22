import styled, { keyframes } from 'styled-components';

export const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

export const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: var(--bg-tertiary);
`;

export const LoadingContent = styled.div`
  text-align: center;
  color: var(--text-secondary);
`;

export const Spinner = styled.div`
  width: 40px;
  height: 40px;
  border: 3px solid var(--border-light);
  border-top: 3px solid var(--primary-500);
  border-radius: 50%;
  animation: ${spin} 1s linear infinite;
  margin: 0 auto 16px;
`;

export const LoadingText = styled.div`
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  color: var(--text-secondary);
`;