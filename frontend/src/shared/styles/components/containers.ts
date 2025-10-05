import styled from 'styled-components';

// 컨테이너 크기 정의
export const containerSizes = {
  sm: '640px',
  md: '768px',
  lg: '900px',
  xl: '1200px',
  full: '100%',
} as const;

// FormSection - 정적 컴포넌트 (motion 불필요)
export const FormSection = styled.div`
  padding: ${({ theme }) => theme.spacing[6]};

  &:not(:last-child) {
    border-bottom: 1px solid ${({ theme }) => theme.colors.border.light};
  }
`;

// 애니메이션이 필요한 컨테이너들은 containers-animated.ts로 이동했습니다:
// - PageContainer
// - BaseCard
// - SectionContainer
// - SectionHeader
// - GridContainer
// - FormContainer
// - StateContainer
// - FullWidthContainer
// - CenteredContainer
// - FlexContainer
