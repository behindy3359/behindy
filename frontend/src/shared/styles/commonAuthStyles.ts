import { motion } from "framer-motion";
import styled from "styled-components";
import { 
  FormError, 
  FormSuccess, 
  FormHeader,
  FormDivider
} from './components';

const BaseAlert = styled(motion.div)`
  display: flex;
  align-items: flex-start;
  gap: ${({ theme }) => theme.spacing[2]};
  padding: ${({ theme }) => theme.spacing[3]};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  margin-bottom: ${({ theme }) => theme.spacing[4]};
  
  svg {
    width: 18px;
    height: 18px;
    flex-shrink: 0;
    margin-top: 1px;
  }
  
  .content {
    flex: 1;
    
    .title {
      font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
      margin-bottom: ${({ theme }) => theme.spacing[1]};
      font-size: ${({ theme }) => theme.typography.fontSize.sm};
    }
    
    .message {
      margin: 0;
      font-size: ${({ theme }) => theme.typography.fontSize.xs};
      line-height: ${({ theme }) => theme.typography.lineHeight.normal};
    }
  }
  
  @media ${({ theme }) => `(max-height: 600px)`} {
    padding: ${({ theme }) => theme.spacing[2]};
    margin-bottom: ${({ theme }) => theme.spacing[3]};
    
    .content {
      .title {
        font-size: ${({ theme }) => theme.typography.fontSize.xs};
      }
      
      .message {
        font-size: ${({ theme }) => theme.typography.fontSize.xs};
      }
    }
  }
`;

// 성공 알림 - 새로운 시스템 활용
export const CommonAuthSuccessAlert = styled(BaseAlert)`
  background: rgba(16, 185, 129, 0.1);
  border: 1px solid rgba(16, 185, 129, 0.2);
  color: ${({ theme }) => theme.colors.success};
  
  .title {
    color: ${({ theme }) => theme.colors.success};
  }
  
  .message {
    color: ${({ theme }) => theme.colors.success};
    opacity: 0.8;
  }
`;

// 에러 알림 - 새로운 시스템 활용
export const CommonAuthErrorAlert = styled(BaseAlert)`
  background: rgba(239, 68, 68, 0.1);
  border: 1px solid rgba(239, 68, 68, 0.2);
  color: ${({ theme }) => theme.colors.error};
  
  .title {
    color: ${({ theme }) => theme.colors.error};
  }
  
  .message {
    color: ${({ theme }) => theme.colors.error};
    opacity: 0.8;
  }
`;

// Auth 헤더 - FormHeader 재활용
export const CommonAuthHeaderSection = styled.div`
  text-align: center;
  margin-bottom: ${({ theme }) => theme.spacing[6]};
  
  @media ${({ theme }) => `(max-height: 600px)`} {
    margin-bottom: ${({ theme }) => theme.spacing[4]};
  }
`;

// Auth 페이지 제목 - 텍스트 스타일 적용
export const CommonAuthPageTitle = styled(motion.h1)`
  font-size: ${({ theme }) => theme.textStyles.heading.h2.fontSize};
  font-weight: ${({ theme }) => theme.textStyles.heading.h2.fontWeight};
  line-height: ${({ theme }) => theme.textStyles.heading.h2.lineHeight};
  color: ${({ theme }) => theme.colors.text.primary};
  margin: 0 0 ${({ theme }) => theme.spacing[2]} 0;
  
  @media ${({ theme }) => `(max-height: 600px)`} {
    font-size: ${({ theme }) => theme.textStyles.heading.h3.fontSize};
    margin-bottom: ${({ theme }) => theme.spacing[1]};
  }
  
  @media ${({ theme }) => `(max-width: 480px)`} {
    font-size: ${({ theme }) => theme.textStyles.heading.h4.fontSize};
  }
`;

// Auth 페이지 부제목
export const CommonAuthPageSubtitle = styled(motion.p)`
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: ${({ theme }) => theme.typography.fontSize.base};
  margin: 0;
  line-height: ${({ theme }) => theme.typography.lineHeight.normal};
  
  @media ${({ theme }) => `(max-height: 600px)`} {
    font-size: ${({ theme }) => theme.typography.fontSize.sm};
  }
  
  @media ${({ theme }) => `(max-width: 480px)`} {
    font-size: ${({ theme }) => theme.typography.fontSize.sm};
  }
`;

// Auth 구분선 - FormDivider 재활용하되 스타일 조정
export const CommonAuthDivider = styled(motion.div)`
  display: flex;
  align-items: center;
  margin: ${({ theme }) => theme.spacing[4]} 0;
  
  &::before,
  &::after {
    content: '';
    flex: 1;
    height: 1px;
    background: ${({ theme }) => theme.colors.border.medium};
  }
  
  span {
    padding: 0 ${({ theme }) => theme.spacing[3]};
    color: ${({ theme }) => theme.colors.text.secondary};
    font-size: ${({ theme }) => theme.typography.fontSize.sm};
    font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  }
  
  @media ${({ theme }) => `(max-height: 600px)`} {
    margin: ${({ theme }) => theme.spacing[3]} 0;
    
    span {
      padding: 0 ${({ theme }) => theme.spacing[2]};
      font-size: ${({ theme }) => theme.typography.fontSize.xs};
    }
  }
`;