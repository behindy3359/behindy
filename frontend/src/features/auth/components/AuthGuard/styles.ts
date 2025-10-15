import styled, { keyframes } from 'styled-components';
import { 
  CenteredContainer,
  Spinner,
  AnimatedContainer 
} from '@/shared/styles/components';

export const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

export const LoadingContainer = styled(CenteredContainer)`
  height: 100vh;
  background-color: ${({ theme }) => theme.colors.background.tertiary};
`;

export const LoadingContent = styled(AnimatedContainer).attrs({
  $animation: 'fadeIn' as const,
})`
  text-align: center;
  color: ${({ theme }) => theme.colors.text.secondary};
`;

export { Spinner } from '../../../../shared/styles/components';

export const LoadingText = styled.div`
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  color: ${({ theme }) => theme.colors.text.secondary};
  margin-top: ${({ theme }) => theme.spacing[4]};
`;