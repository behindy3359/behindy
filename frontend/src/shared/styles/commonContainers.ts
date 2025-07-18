import { motion } from 'framer-motion';
import styled from 'styled-components';

// 메인 페이지 컨테이너
export const PageContainer = styled.div`
  max-width: ${({ theme }) => theme.container.lg}; /* 900px */
  margin: 0 auto;
  padding: ${({ theme }) => theme.spacing[6]} ${({ theme }) => theme.spacing[6]};
  
  @media (max-width: 900px) {
    padding: ${({ theme }) => theme.spacing[4]} ${({ theme }) => theme.spacing[4]};
  }
`;

// 커뮤니티/게시판 컨테이너
export const CommunityContainer = styled.div`
  max-width: ${({ theme }) => theme.container.lg}; /* 900px */
  margin: 0 auto;
  padding: ${({ theme }) => theme.spacing[6]};
  
  @media (max-width: 1200px) {
    padding: ${({ theme }) => theme.spacing[4]};
  }
`;

// 카드 형태 컨테이너
export const CardContainer = styled(motion.div)`
  background: ${({ theme }) => theme.colors.background.primary};
  border-radius: ${({ theme }) => theme.borderRadius.xl};
  border: 1px solid ${({ theme }) => theme.colors.border.light};
  overflow: hidden;
  cursor: pointer;
  transition: all 0.3s ease;
  height: 320px;
  display: flex;
  flex-direction: column;
  box-shadow: ${({ theme }) => theme.shadows.card};
  
  &:hover {
    border-color: ${({ theme }) => theme.colors.primary[500]};
    box-shadow: ${({ theme }) => theme.shadows.lg};
    transform: translateY(-2px);
  }
`;

// 섹션 컨테이너
export const SectionContainer = styled.div`
  background: ${({ theme }) => theme.colors.background.primary};
  border-radius: ${({ theme }) => theme.borderRadius.xl};
  border: 1px solid ${({ theme }) => theme.colors.border.light};
  margin-bottom: ${({ theme }) => theme.spacing[8]};
  overflow: hidden;
  box-shadow: ${({ theme }) => theme.shadows.card};
`;

// 섹션 헤더
export const SectionHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: ${({ theme }) => theme.spacing[6]};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border.light};
  background: linear-gradient(135deg, ${({ theme }) => theme.colors.background.secondary} 0%, ${({ theme }) => theme.colors.background.tertiary} 100%);
  
  h2, h3 {
    font-size: ${({ theme }) => theme.typography.fontSize.xl};
    font-weight: 700;
    color: ${({ theme }) => theme.colors.text.primary};
    margin: 0;
    display: flex;
    align-items: center;
    gap: ${({ theme }) => theme.spacing[2]};
  }
  
  @media (max-width: 768px) {
    flex-direction: column;
    gap: ${({ theme }) => theme.spacing[4]};
    align-items: stretch;
  }
`;

// 그리드 레이아웃
export const GridContainer = styled.div<{ $columns?: string }>`
  display: grid;
  grid-template-columns: ${({ $columns }) => $columns || 'repeat(auto-fill, minmax(320px, 1fr))'};
  gap: ${({ theme }) => theme.spacing[6]};
  padding: ${({ theme }) => theme.spacing[6]};
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: ${({ theme }) => theme.spacing[4]};
    padding: ${({ theme }) => theme.spacing[4]};
  }
`;


// 로딩/에러 상태 컨테이너
export const StateContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: ${({ theme }) => theme.spacing[20]};
  text-align: center;
  color: ${({ theme }) => theme.colors.text.secondary};
  
  .state-icon {
    width: 64px;
    height: 64px;
    margin-bottom: ${({ theme }) => theme.spacing[6]};
    color: ${({ theme }) => theme.colors.border.dark};
  }
  
  .state-title {
    font-size: ${({ theme }) => theme.typography.fontSize.xl};
    font-weight: 600;
    color: ${({ theme }) => theme.colors.text.primary};
    margin-bottom: ${({ theme }) => theme.spacing[4]};
  }
  
  .state-description {
    color: ${({ theme }) => theme.colors.text.secondary};
    font-size: ${({ theme }) => theme.typography.fontSize.base};
    margin-bottom: ${({ theme }) => theme.spacing[8]};
    line-height: 1.6;
    max-width: 400px;
  }
`;

// 폼 컨테이너
export const FormContainer = styled(motion.div)`
  background: ${({ theme }) => theme.colors.background.primary};
  border-radius: ${({ theme }) => theme.borderRadius.xl};
  border: 1px solid ${({ theme }) => theme.colors.border.light};
  overflow: hidden;
  box-shadow: ${({ theme }) => theme.shadows.card};
  position: relative;
`;

export const FormSection = styled.div`
  padding: ${({ theme }) => theme.spacing[6]};
  
  &:not(:last-child) {
    border-bottom: 1px solid ${({ theme }) => theme.colors.border.light};
  }
`;

export const BasicFullWidthContainer = styled(motion.div)`
  width: 100%;
`;