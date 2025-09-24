import { motion } from 'framer-motion';
import styled from 'styled-components';
import { 
  PageContainer as BasePageContainer,
  BaseCard,
  SectionContainer as BaseSectionContainer,
  SectionHeader as BaseSectionHeader,
  GridContainer as BaseGridContainer,
  FormContainer as BaseFormContainer,
  FormSection as BaseFormSection,
  StateContainer as BaseStateContainer,
  FullWidthContainer
} from './components';

// PageContainer - 기본 설정으로 재export
export const PageContainer = styled(BasePageContainer)`
  /* 추가 커스터마이징 없이 기본 사용 */
`;

// CommunityContainer - PageContainer의 alias (호환성)
export const CommunityContainer = styled(BasePageContainer)`
  /* CommunityContainer는 PageContainer와 동일하게 처리 */
`;

// CardContainer - BaseCard에 추가 스타일 적용
export const CardContainer = styled(BaseCard).attrs({
  $variant: 'elevated' as const,
  $interactive: true,
})`
  height: 320px;
  display: flex;
  flex-direction: column;
  cursor: pointer;
  transition: ${({ theme }) => theme.transition.normal};
  
  &:hover {
    border-color: ${({ theme }) => theme.colors.primary[500]};
    transform: translateY(-2px);
  }
  
  &:active {
    transform: translateY(0);
  }
`;

// SectionContainer - 기본 설정으로 재export  
export const SectionContainer = styled(BaseSectionContainer)`
  /* 추가 커스터마이징 없이 기본 사용 */
`;

// SectionHeader - 기본 설정으로 재export
export const SectionHeader = styled(BaseSectionHeader)`
  /* 추가 커스터마이징 없이 기본 사용 */
`;

// GridContainer - 기본 설정으로 재export
export const GridContainer = styled(BaseGridContainer)`
  /* 추가 커스터마이징 없이 기본 사용 */
`;

// StateContainer - variant별 스타일 적용
export const StateContainer = styled(BaseStateContainer)`
  /* 기본 StateContainer 사용 */
`;

// FormContainer - 기본 설정으로 재export
export const FormContainer = styled(BaseFormContainer)`
  /* 추가 커스터마이징 없이 기본 사용 */
`;

export const FormSection = styled(BaseFormSection)`
  /* 추가 커스터마이징 없이 기본 사용 */
`;

// 호환성을 위한 추가 컨테이너들
export const BasicFullWidthContainer = styled(FullWidthContainer)`
  /* FullWidthContainer의 alias */
`;

// 로딩/에러 상태를 위한 특화 컨테이너들
export const LoadingContainer = styled(BaseStateContainer).attrs({
  $variant: 'loading' as const,
})`
  /* 로딩 전용 상태 컨테이너 */
`;

export const ErrorContainer = styled(BaseStateContainer).attrs({
  $variant: 'error' as const,
})`
  /* 에러 전용 상태 컨테이너 */
`;

export const EmptyContainer = styled(BaseStateContainer).attrs({
  $variant: 'empty' as const,
})`
  /* 빈 상태 전용 컨테이너 */
`;