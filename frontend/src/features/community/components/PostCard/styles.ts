import styled from "styled-components";
import { 
  FlexContainer,
  Badge,
  BaseCard 
} from '@/shared/styles/components';

// CardHeader - 카드 헤더
export const CardHeader = styled.div`
  padding: ${({ theme }) => theme.spacing[4]} ${({ theme }) => theme.spacing[6]} ${({ theme }) => theme.spacing[4]} ${({ theme }) => theme.spacing[6]};
  background: ${({ theme }) => theme.colors.background.secondary};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border.light};
  flex-shrink: 0;
`;

// AuthorInfo - 작성자 정보
export const AuthorInfo = styled(FlexContainer).attrs({
  $direction: 'row' as const,
  $justify: 'between' as const,
  $align: 'center' as const,
})`
  margin-bottom: ${({ theme }) => theme.spacing[2]};
`;

// AuthorLeft - 작성자 왼쪽 영역
export const AuthorLeft = styled(FlexContainer).attrs({
  $direction: 'row' as const,
  $align: 'center' as const,
  $gap: 2 as const,
})`
  /* FlexContainer 설정으로 간격 조정 */
`;

// Avatar - 아바타
export const Avatar = styled.div`
  width: 32px;
  height: 32px;
  background: linear-gradient(135deg, ${({ theme }) => theme.colors.primary[500]} 0%, ${({ theme }) => theme.colors.secondary[500]} 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${({ theme }) => theme.colors.text.inverse};
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
`;

// AuthorName - 작성자 이름
export const AuthorName = styled.span`
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
`;

// PostTime - 게시 시간
export const PostTime = styled(FlexContainer).attrs({
  $direction: 'row' as const,
  $align: 'center' as const,
  $gap: 1 as const,
})`
  color: ${({ theme }) => theme.colors.text.tertiary};
  font-size: ${({ theme }) => theme.typography.fontSize.xs};
`;

// MetroLine - 지하철 노선 뱃지 (Badge 컴포넌트 활용)
export const MetroLine = styled.div<{ $lineNumber?: string }>`
  display: inline-flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[1]};
  padding: ${({ theme }) => theme.spacing[1]} ${({ theme }) => theme.spacing[2]};
  border-radius: ${({ theme }) => theme.borderRadius.xl};
  font-size: ${({ theme }) => theme.typography.fontSize.xs};
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  color: ${({ theme }) => theme.colors.text.inverse};
  
  ${({ $lineNumber, theme }) => {
    switch($lineNumber) {
      case '1': return `background: ${theme.colors.metro.line1};`;
      case '2': return `background: ${theme.colors.metro.line2};`;
      case '3': return `background: ${theme.colors.metro.line3};`;
      case '4': return `background: ${theme.colors.metro.line4};`;
      default: return `background: ${theme.colors.text.tertiary};`;
    }
  }}
`;

// CardContent - 카드 내용
export const CardContent = styled.div`
  padding: ${({ theme }) => theme.spacing[6]};
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
`;

// PostTitle - 게시글 제목
export const PostTitle = styled.h3`
  font-size: ${({ theme }) => theme.typography.fontSize.base};
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  color: ${({ theme }) => theme.colors.text.primary};
  margin: 0 0 ${({ theme }) => theme.spacing[4]} 0;
  line-height: ${({ theme }) => theme.typography.lineHeight.normal};
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  flex-shrink: 0;
`;

// PostPreview - 게시글 미리보기
export const PostPreview = styled.p`
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  line-height: ${({ theme }) => theme.typography.lineHeight.relaxed};
  margin: 0;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
  flex: 1;
`;

// CardFooter - 카드 푸터
export const CardFooter = styled(FlexContainer).attrs({
  $direction: 'row' as const,
  $justify: 'between' as const,
  $align: 'center' as const,
})`
  padding: ${({ theme }) => theme.spacing[4]} ${({ theme }) => theme.spacing[6]};
  background: ${({ theme }) => theme.colors.background.secondary};
  border-top: 1px solid ${({ theme }) => theme.colors.border.light};
  flex-shrink: 0;
  margin-top: auto;
`;

// StatsGroup - 통계 그룹
export const StatsGroup = styled(FlexContainer).attrs({
  $direction: 'row' as const,
  $align: 'center' as const,
  $gap: 4 as const,
})`
  /* FlexContainer 설정 활용 */
`;

// StatItem - 개별 통계 항목
export const StatItem = styled(FlexContainer).attrs({
  $direction: 'row' as const,
  $align: 'center' as const,
  $gap: 1 as const,
})`
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: ${({ theme }) => theme.typography.fontSize.xs};
  
  svg {
    width: 14px;
    height: 14px;
  }
  
  .count {
    font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  }
`;

// ReadMoreButton - 더보기 버튼
export const ReadMoreButton = styled(FlexContainer).attrs({
  $direction: 'row' as const,
  $align: 'center' as const,
  $gap: 1 as const,
})`
  color: ${({ theme }) => theme.colors.primary[500]};
  font-size: ${({ theme }) => theme.typography.fontSize.xs};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  
  svg {
    width: 14px;
    height: 14px;
    transition: ${({ theme }) => theme.transition.fast};
  }
  
  /* 부모 카드 호버시 애니메이션 */
  ${BaseCard}:hover & svg {
    transform: translateX(2px);
  }
`;

// HotBadge - 인기글 뱃지 (Badge 컴포넌트 활용)
export const HotBadge = styled(Badge).attrs({
  $variant: 'error' as const,
  $size: 'sm' as const,
})`
  position: absolute;
  top: ${({ theme }) => theme.spacing[4]};
  right: ${({ theme }) => theme.spacing[4]};
  z-index: 1;
  
  /* Badge의 기본 스타일을 오버라이드 */
  background: ${({ theme }) => theme.colors.error};
  color: ${({ theme }) => theme.colors.text.inverse};
  border: none;
`;