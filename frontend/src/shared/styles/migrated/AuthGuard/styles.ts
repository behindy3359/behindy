import styled, { keyframes } from 'styled-components';
import { 
  CenteredContainer,
  Spinner,
  AnimatedContainer 
} from '../../components';

// 스핀 애니메이션 (재사용)
export const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

// LoadingContainer - CenteredContainer 활용
export const LoadingContainer = styled(CenteredContainer)`
  height: 100vh;
  background-color: ${({ theme }) => theme.colors.background.tertiary};
`;

// LoadingContent - 애니메이션 컨테이너 활용
export const LoadingContent = styled(AnimatedContainer).attrs({
  $animation: 'fadeIn' as const,
})`
  text-align: center;
  color: ${({ theme }) => theme.colors.text.secondary};
`;

// Spinner - 기본 Spinner 컴포넌트 재사용
export { Spinner } from '../../components';

// LoadingText - 텍스트 스타일 적용
export const LoadingText = styled.div`
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  color: ${({ theme }) => theme.colors.text.secondary};
  margin-top: ${({ theme }) => theme.spacing[4]};
`;