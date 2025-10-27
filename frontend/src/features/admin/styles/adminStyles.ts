import styled from 'styled-components';
import {
  PageContainer,
  BaseCard,
  FlexContainer,
  StateContainer,
} from '@/shared/styles';

// ==================== 메인 컨테이너 ====================

export const AdminContainer = styled(PageContainer)`
  max-width: 1400px;
  margin: 0 auto;
  padding: ${({ theme }) => theme.spacing[8]};

  @media (max-width: 768px) {
    padding: ${({ theme }) => theme.spacing[4]};
  }
`;

// ==================== 헤더 ====================

export const AdminHeader = styled(FlexContainer).attrs({
  $direction: 'column' as const,
  $gap: 2,
})`
  margin-bottom: ${({ theme }) => theme.spacing[8]};
`;

export const AdminTitle = styled.h1`
  font-size: ${({ theme }) => theme.typography.fontSize['2xl']};
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  color: ${({ theme }) => theme.colors.text.primary};
  margin: 0;

  @media (max-width: 768px) {
    font-size: ${({ theme }) => theme.typography.fontSize.xl};
  }
`;

export const AdminSubtitle = styled.p`
  font-size: ${({ theme }) => theme.typography.fontSize.base};
  color: ${({ theme }) => theme.colors.text.secondary};
  margin: 0;

  @media (max-width: 768px) {
    font-size: ${({ theme }) => theme.typography.fontSize.sm};
  }
`;

// ==================== 섹션 ====================

export const AdminSection = styled.section`
  margin-bottom: ${({ theme }) => theme.spacing[12]};

  &:last-child {
    margin-bottom: ${({ theme }) => theme.spacing[8]};
  }
`;

export const SectionTitle = styled.h2`
  font-size: ${({ theme }) => theme.typography.fontSize.xl};
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  color: ${({ theme }) => theme.colors.text.primary};
  margin: 0 0 ${({ theme }) => theme.spacing[4]} 0;
  padding-bottom: ${({ theme }) => theme.spacing[2]};
  border-bottom: 2px solid ${({ theme }) => theme.colors.border.light};

  @media (max-width: 768px) {
    font-size: ${({ theme }) => theme.typography.fontSize.lg};
  }
`;

// ==================== 통계 그리드 ====================

export const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: ${({ theme }) => theme.spacing[6]};
  margin-top: ${({ theme }) => theme.spacing[4]};

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: ${({ theme }) => theme.spacing[4]};
  }
`;

// ==================== 통계 카드 ====================

export const StatsCard = styled(BaseCard)`
  padding: ${({ theme }) => theme.spacing[6]};
  transition: transform 0.2s ease, box-shadow 0.2s ease;

  &:hover {
    transform: translateY(-4px);
    box-shadow: ${({ theme }) => theme.shadows.base.lg};
  }

  @media (max-width: 768px) {
    padding: ${({ theme }) => theme.spacing[4]};
  }
`;

export const CardTitle = styled.h3`
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  color: ${({ theme }) => theme.colors.text.secondary};
  margin: 0 0 ${({ theme }) => theme.spacing[2]} 0;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

export const CardValue = styled.div<{ $color?: string }>`
  font-size: ${({ theme }) => theme.typography.fontSize['3xl']};
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  color: ${({ $color }) => $color || '#4CAF50'};
  margin: ${({ theme }) => theme.spacing[2]} 0;
  line-height: 1.2;

  @media (max-width: 768px) {
    font-size: ${({ theme }) => theme.typography.fontSize['2xl']};
  }
`;

export const CardSubtext = styled.div`
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  color: ${({ theme }) => theme.colors.text.tertiary};
  margin-top: ${({ theme }) => theme.spacing[2]};
`;

// ==================== 상태 표시 ====================

export const StatusBadge = styled.span<{ $status: 'HEALTHY' | 'WARNING' | 'ERROR' }>`
  display: inline-flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[2]};
  padding: ${({ theme }) => `${theme.spacing[1]} ${theme.spacing[3]}`};
  border-radius: ${({ theme }) => theme.spacing[1]};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};

  ${({ $status, theme }) => {
    switch ($status) {
      case 'HEALTHY':
        return `
          background: rgba(76, 175, 80, 0.1);
          color: #4CAF50;
        `;
      case 'WARNING':
        return `
          background: rgba(255, 152, 0, 0.1);
          color: #FF9800;
        `;
      case 'ERROR':
        return `
          background: rgba(244, 67, 54, 0.1);
          color: #F44336;
        `;
    }
  }}

  &::before {
    content: '';
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: currentColor;
  }
`;

// ==================== 로딩/에러 상태 ====================

export const LoadingContainer = styled(StateContainer)`
  min-height: 400px;
  font-size: ${({ theme }) => theme.typography.fontSize.lg};
  color: ${({ theme }) => theme.colors.text.secondary};
`;

export const ErrorContainer = styled(StateContainer)`
  min-height: 400px;
  font-size: ${({ theme }) => theme.typography.fontSize.lg};
  color: ${({ theme }) => theme.colors.error};
`;

// ==================== 푸터 ====================

export const AdminFooter = styled.div`
  text-align: center;
  color: ${({ theme }) => theme.colors.text.tertiary};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  margin-top: ${({ theme }) => theme.spacing[12]};
  padding-top: ${({ theme }) => theme.spacing[8]};
  border-top: 1px solid ${({ theme }) => theme.colors.border.light};
`;

// ==================== 사용자 테이블 (향후 확장용) ====================

export const UserTable = styled.div`
  width: 100%;
  overflow-x: auto;
  background: ${({ theme }) => theme.colors.background.primary};
  border-radius: ${({ theme }) => theme.spacing[2]};
  border: 1px solid ${({ theme }) => theme.colors.border.light};
`;

export const TableHeader = styled.div`
  display: grid;
  grid-template-columns: 1fr 2fr 1fr 1fr 1fr 1fr;
  padding: ${({ theme }) => theme.spacing[4]};
  background: ${({ theme }) => theme.colors.background.secondary};
  border-bottom: 2px solid ${({ theme }) => theme.colors.border.medium};
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  color: ${({ theme }) => theme.colors.text.secondary};

  @media (max-width: 768px) {
    display: none;
  }
`;

export const TableRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 2fr 1fr 1fr 1fr 1fr;
  padding: ${({ theme }) => theme.spacing[4]};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border.light};
  transition: background 0.2s ease;

  &:hover {
    background: ${({ theme }) => theme.colors.background.secondary};
  }

  &:last-child {
    border-bottom: none;
  }

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: ${({ theme }) => theme.spacing[2]};
    padding: ${({ theme }) => theme.spacing[3]};
  }
`;

export const TableCell = styled.div`
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  color: ${({ theme }) => theme.colors.text.primary};
  display: flex;
  align-items: center;

  @media (max-width: 768px) {
    &::before {
      content: attr(data-label) ': ';
      font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
      margin-right: ${({ theme }) => theme.spacing[2]};
    }
  }
`;
