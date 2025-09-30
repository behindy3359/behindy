import { motion } from 'framer-motion';
import styled from 'styled-components';
import {
  PageContainer,
  BaseCard,
  BaseButton,
  FlexContainer,
  StateContainer,
  SkeletonLoader,
  AnimatedContainer
} from '@/shared/styles';

// 메인 컨테이너 - PageContainer 기반
export const GameContainer = styled(PageContainer)`
  min-height: 100vh;
  max-width: 1200px;
  
  @media (max-width: 768px) {
    padding: ${({ theme }) => theme.spacing[4]};
  }
`;

export const Container = styled(PageContainer)`
  @media (max-width: 768px) {
    padding: ${({ theme }) => theme.spacing[4]};
  }
`;

// 헤더 - FlexContainer 기반
export const GameHeader = styled(FlexContainer).attrs({
  $direction: 'row' as const,
  $justify: 'between' as const,
  $align: 'center' as const,
})`
  margin-bottom: ${({ theme }) => theme.spacing[8]};
  padding-bottom: ${({ theme }) => theme.spacing[4]};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border.light};
`;

export const BackButton = styled(BaseButton).attrs({
  variant: 'ghost' as const,
})`
  gap: ${({ theme }) => theme.spacing[2]};
  color: ${({ theme }) => theme.colors.text.secondary};
  
  &:hover {
    color: ${({ theme }) => theme.colors.text.primary};
  }
`;

export const HeaderTitle = styled.h1`
  font-size: ${({ theme }) => theme.typography.fontSize.xl};
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  color: ${({ theme }) => theme.colors.text.primary};
  margin: 0;
`;

export const HeaderActions = styled(FlexContainer).attrs({
  $direction: 'row' as const,
  $gap: 3 as const,
})``;

// 콘텐츠 영역 - StateContainer 기반
export const GameContent = styled(StateContainer)`
  min-height: 60vh;
`;

// 로딩 섹션 - StateContainer 기반
export const LoadingSection = styled(StateContainer).attrs({
  $variant: 'loading' as const,
})`
  color: ${({ theme }) => theme.colors.text.secondary};

  p {
    margin-top: ${({ theme }) => theme.spacing[4]};
  }
`;

export const Spinner = styled.div`
  width: 48px;
  height: 48px;
  border: 4px solid ${({ theme }) => theme.colors.border.light};
  border-top-color: ${({ theme }) => theme.colors.primary[500]};
  border-radius: 50%;
  animation: spin 1s linear infinite;

  @keyframes spin {
    to { transform: rotate(360deg); }
  }
`;

// 캐릭터 생성 섹션
export const CharacterCreateSection = styled(AnimatedContainer).attrs({
  $animation: 'fadeIn' as const,
})`
  text-align: center;
  max-width: 500px;
  width: 100%;
`;

// 게임 플레이 섹션
export const GamePlayingSection = styled.div`
  width: 100%;
  display: grid;
  grid-template-columns: 300px 1fr;
  gap: ${({ theme }) => theme.spacing[6]};

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: ${({ theme }) => theme.spacing[4]};
  }
`;

export const CharacterSection = styled.div`
  @media (max-width: 768px) {
    order: 2;
  }
`;

export const StorySection = styled.div`
  @media (max-width: 768px) {
    order: 1;
  }
`;

// 게임 완료 섹션
export const GameCompletionSection = styled(FlexContainer).attrs({
  $direction: 'column' as const,
  $align: 'center' as const,
  $justify: 'center' as const,
})`
  width: 100%;
  min-height: 60vh;
  padding: ${({ theme }) => theme.spacing[4]};
`;

// 에러 섹션
export const ErrorSection = styled(AnimatedContainer).attrs({
  $animation: 'fadeIn' as const,
})`
  text-align: center;
  max-width: 500px;
  width: 100%;
`;

export const ErrorTitle = styled.h2`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: ${({ theme }) => theme.spacing[3]};
  font-size: ${({ theme }) => theme.typography.fontSize.xl};
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  color: ${({ theme }) => theme.colors.error};
  margin-bottom: ${({ theme }) => theme.spacing[4]};
`;

export const ErrorMessage = styled.p`
  font-size: ${({ theme }) => theme.typography.fontSize.base};
  color: ${({ theme }) => theme.colors.text.secondary};
  margin-bottom: ${({ theme }) => theme.spacing[6]};
`;

export const ErrorActions = styled(FlexContainer).attrs({
  $direction: 'row' as const,
  $gap: 4 as const,
  $justify: 'center' as const,
})``;

// 페이지 헤더
export const PageHeader = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing[8]};
`;

export const PageTitle = styled.h1`
  font-size: ${({ theme }) => theme.textStyles.heading.h1.fontSize};
  font-weight: ${({ theme }) => theme.textStyles.heading.h1.fontWeight};
  color: ${({ theme }) => theme.colors.text.primary};
  margin: 0;
`;

// 콘텐츠 그리드
export const ContentGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: ${({ theme }) => theme.spacing[6]};

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: ${({ theme }) => theme.spacing[4]};
  }
`;

// 공통 카드 - BaseCard 기반
export const Card = styled(BaseCard).attrs({
  $variant: 'elevated' as const,
  $size: 'md' as const,
})``;

export const CardHeader = styled.div`
  padding: ${({ theme }) => theme.spacing[6]};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border.light};
`;

export const CardTitle = styled.h2`
  font-size: ${({ theme }) => theme.typography.fontSize.lg};
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  color: ${({ theme }) => theme.colors.text.primary};
  margin: 0;
`;

// 캐릭터 프로필
export const CharacterProfile = styled(FlexContainer).attrs({
  $direction: 'row' as const,
  $align: 'center' as const,
  $gap: 4 as const,
})`
  padding: ${({ theme }) => theme.spacing[6]};
`;

export const ProfileIcon = styled.div`
  width: 80px;
  height: 80px;
  background: linear-gradient(135deg, ${({ theme }) => theme.colors.primary[500]} 0%, ${({ theme }) => theme.colors.secondary[500]} 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${({ theme }) => theme.colors.text.inverse};
`;

export const ProfileInfo = styled.div`
  flex: 1;
`;

export const CharacterName = styled.h3`
  font-size: ${({ theme }) => theme.typography.fontSize.xl};
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  color: ${({ theme }) => theme.colors.text.primary};
  margin: 0 0 ${({ theme }) => theme.spacing[2]} 0;
`;

export const StatusBadge = styled.div<{ $status: string }>`
  display: inline-flex;
  padding: ${({ theme }) => theme.spacing[2]} ${({ theme }) => theme.spacing[3]};
  background: ${({ theme }) => theme.colors.background.secondary};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  color: ${({ theme }) => theme.colors.text.secondary};
`;

export const StatsGrid = styled(FlexContainer).attrs({
  $direction: 'column' as const,
  $gap: 4 as const,
})`
  padding: 0 ${({ theme }) => theme.spacing[6]} ${({ theme }) => theme.spacing[6]};
`;

export const StatCard = styled(FlexContainer).attrs({
  $direction: 'row' as const,
  $gap: 3 as const,
})``;

export const StatIcon = styled.div<{ $type: 'health' | 'sanity' }>`
  width: 40px;
  height: 40px;
  background: ${({ theme, $type }) => 
    $type === 'health' 
      ? 'rgba(239, 68, 68, 0.1)' 
      : 'rgba(102, 126, 234, 0.1)'};
  color: ${({ theme, $type }) => 
    $type === 'health' 
      ? theme.colors.error 
      : theme.colors.primary[500]};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const StatInfo = styled.div`
  flex: 1;
`;

export const StatLabel = styled.div`
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  color: ${({ theme }) => theme.colors.text.secondary};
  margin-bottom: ${({ theme }) => theme.spacing[1]};
`;

export const StatValue = styled.div`
  font-size: ${({ theme }) => theme.typography.fontSize.base};
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  color: ${({ theme }) => theme.colors.text.primary};
  margin-bottom: ${({ theme }) => theme.spacing[2]};
`;

export const StatBar = styled.div`
  width: 100%;
  height: 6px;
  background: ${({ theme }) => theme.colors.background.tertiary};
  border-radius: 3px;
  overflow: hidden;
`;

export const StatBarFill = styled.div<{ $percentage: number; $color: string }>`
  width: ${({ $percentage }) => `${$percentage}%`};
  height: 100%;
  background: ${({ $color }) => $color};
  transition: width 0.3s ease;
`;

export const DeathNotice = styled.div`
  margin: 0 ${({ theme }) => theme.spacing[6]} ${({ theme }) => theme.spacing[6]};
  padding: ${({ theme }) => theme.spacing[4]};
  background: rgba(239, 68, 68, 0.1);
  color: ${({ theme }) => theme.colors.error};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  text-align: center;
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
`;

// 게임 통계
export const StatsList = styled(FlexContainer).attrs({
  $direction: 'column' as const,
  $gap: 4 as const,
})`
  padding: ${({ theme }) => theme.spacing[6]};
`;

export const StatsItem = styled(FlexContainer).attrs({
  $direction: 'row' as const,
  $align: 'center' as const,
  $gap: 3 as const,
})``;

export const StatsIcon = styled.div`
  width: 36px;
  height: 36px;
  background: ${({ theme }) => theme.colors.background.secondary};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${({ theme }) => theme.colors.text.secondary};
`;

export const StatsText = styled(FlexContainer).attrs({
  $direction: 'row' as const,
  $justify: 'between' as const,
  $align: 'center' as const,
})`
  flex: 1;
  
  span {
    font-size: ${({ theme }) => theme.typography.fontSize.sm};
    color: ${({ theme }) => theme.colors.text.secondary};
  }
  
  strong {
    font-size: ${({ theme }) => theme.typography.fontSize.base};
    color: ${({ theme }) => theme.colors.text.primary};
    font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  }
`;

// 현재 게임 카드
export const ActiveGameInfo = styled.div`
  padding: ${({ theme }) => theme.spacing[6]};
`;

export const GameTitle = styled.h3`
  font-size: ${({ theme }) => theme.typography.fontSize.lg};
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  color: ${({ theme }) => theme.colors.text.primary};
  margin-bottom: ${({ theme }) => theme.spacing[2]};
`;

export const GameProgress = styled.div`
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  color: ${({ theme }) => theme.colors.text.secondary};
  margin-bottom: ${({ theme }) => theme.spacing[4]};
`;

export const NoGameInfo = styled.div`
  padding: ${({ theme }) => theme.spacing[6]};
  text-align: center;
`;

export const NoGameMessage = styled.p`
  color: ${({ theme }) => theme.colors.text.secondary};
  margin-bottom: ${({ theme }) => theme.spacing[4]};
`;

export const CannotEnterMessage = styled.p`
  color: ${({ theme }) => theme.colors.warning};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  padding: ${({ theme }) => theme.spacing[3]};
  background: rgba(245, 158, 11, 0.1);
  border-radius: ${({ theme }) => theme.borderRadius.md};
`;

export const ButtonGroup = styled(FlexContainer).attrs({
  $direction: 'row' as const,
  $gap: 3 as const,
})``;

// Empty State - StateContainer 기반
export const EmptyStateCard = styled(StateContainer).attrs({
  $variant: 'empty' as const,
})`
  background: ${({ theme }) => theme.colors.background.primary};
  border-radius: ${({ theme }) => theme.borderRadius.xl};
  border: 1px solid ${({ theme }) => theme.colors.border.light};
  box-shadow: ${({ theme }) => theme.shadows.card};
  padding: ${({ theme }) => theme.spacing[12]};
  text-align: center;
  max-width: 500px;
  width: 100%;
`;

export const EmptyIcon = styled.div`
  margin: 0 auto ${({ theme }) => theme.spacing[6]};
  width: 120px;
  height: 120px;
  background: ${({ theme }) => theme.colors.background.secondary};
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${({ theme }) => theme.colors.text.tertiary};
`;

export const EmptyTitle = styled.h2`
  font-size: ${({ theme }) => theme.textStyles.heading.h2.fontSize};
  font-weight: ${({ theme }) => theme.textStyles.heading.h2.fontWeight};
  color: ${({ theme }) => theme.colors.text.primary};
  margin-bottom: ${({ theme }) => theme.spacing[3]};
`;

export const EmptyDescription = styled.p`
  font-size: ${({ theme }) => theme.typography.fontSize.base};
  color: ${({ theme }) => theme.colors.text.secondary};
  margin-bottom: ${({ theme }) => theme.spacing[8]};
`;

// 로딩 상태
export const LoadingState = styled(StateContainer).attrs({
  $variant: 'loading' as const,
})`
  min-height: 400px;
  color: ${({ theme }) => theme.colors.text.secondary};

  p {
    margin-top: ${({ theme }) => theme.spacing[4]};
  }
`;

// 카드 컨테이너 - BaseCard 기반
export const CreateCard = styled(BaseCard).attrs({
  $variant: 'elevated' as const,
  $size: 'lg' as const,
})`
  width: 100%;
  max-width: 600px;
  margin: 0 auto;
  overflow: hidden;
`;

export const CardDescription = styled.p`
  margin-top: ${({ theme }) => theme.spacing[3]};
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: ${({ theme }) => theme.typography.fontSize.base};
`;

// 폼 섹션
export const FormSection = styled.div`
  padding: ${({ theme }) => theme.spacing[8]};
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing[6]};
`;

export const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing[2]};
`;

export const NameHelper = styled(FlexContainer).attrs({
  $direction: 'row' as const,
  $justify: 'between' as const,
  $align: 'center' as const,
})`
  padding: 0 ${({ theme }) => theme.spacing[2]};
  
  span {
    font-size: ${({ theme }) => theme.typography.fontSize.sm};
    color: ${({ theme }) => theme.colors.text.tertiary};
  }
`;

export const RandomButton = styled(motion.button)`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[1]};
  padding: ${({ theme }) => theme.spacing[1]} ${({ theme }) => theme.spacing[3]};
  background: ${({ theme }) => theme.colors.background.secondary};
  border: 1px solid ${({ theme }) => theme.colors.border.medium};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  cursor: pointer;
  transition: ${({ theme }) => theme.transition.normal};

  &:hover {
    background: ${({ theme }) => theme.colors.background.tertiary};
    color: ${({ theme }) => theme.colors.primary[500]};
    border-color: ${({ theme }) => theme.colors.primary[500]};
  }
`;

// 정보 박스
export const InfoBox = styled.div`
  padding: ${({ theme }) => theme.spacing[4]};
  background: ${({ theme }) => theme.colors.background.secondary};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  border: 1px solid ${({ theme }) => theme.colors.border.light};
`;

export const InfoTitle = styled.h3`
  font-size: ${({ theme }) => theme.typography.fontSize.base};
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  color: ${({ theme }) => theme.colors.text.primary};
  margin-bottom: ${({ theme }) => theme.spacing[3]};
`;

export const InfoList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing[2]};
`;

export const InfoItem = styled.li`
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  color: ${({ theme }) => theme.colors.text.secondary};
`;

// 기존 캐릭터 정보
export const ExistingCharacterInfo = styled(FlexContainer).attrs({
  $direction: 'column' as const,
  $gap: 6 as const,
})`
  padding: ${({ theme }) => theme.spacing[8]};
`;

export const CharacterCard = styled(FlexContainer).attrs({
  $direction: 'row' as const,
  $gap: 6 as const,
})`
  padding: ${({ theme }) => theme.spacing[6]};
  background: ${({ theme }) => theme.colors.background.secondary};
  border-radius: ${({ theme }) => theme.borderRadius.xl};
  border: 1px solid ${({ theme }) => theme.colors.border.light};
`;

export const CharacterIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 80px;
  height: 80px;
  background: linear-gradient(135deg, ${({ theme }) => theme.colors.primary[500]} 0%, ${({ theme }) => theme.colors.secondary[500]} 100%);
  border-radius: 50%;
  color: ${({ theme }) => theme.colors.text.inverse};
  flex-shrink: 0;
`;

export const CharacterDetails = styled(FlexContainer).attrs({
  $direction: 'column' as const,
  $gap: 3 as const,
})`
  flex: 1;
`;

export const CharacterStats = styled(FlexContainer).attrs({
  $direction: 'row' as const,
  $gap: 6 as const,
})``;

export const StatItem = styled(FlexContainer).attrs({
  $direction: 'column' as const,
  $gap: 1 as const,
})``;

export const InfoMessage = styled(FlexContainer).attrs({
  $direction: 'row' as const,
  $align: 'center' as const,
  $gap: 2 as const,
})`
  padding: ${({ theme }) => theme.spacing[4]};
  background: rgba(102, 126, 234, 0.1);
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  color: ${({ theme }) => theme.colors.primary[500]};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
`;

export const DestinationInfo = styled(FlexContainer).attrs({
  $direction: 'row' as const,
  $align: 'center' as const,
  $justify: 'center' as const,
})`
  padding: ${({ theme }) => theme.spacing[3]};
  background: rgba(102, 126, 234, 0.1);
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  color: ${({ theme }) => theme.colors.primary[600]};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  margin-bottom: ${({ theme }) => theme.spacing[4]};
`;

// 스토리 관련 스타일
export const StoryHeader = styled(FlexContainer).attrs({
  $direction: 'row' as const,
  $justify: 'between' as const,
  $align: 'center' as const,
})`
  margin-bottom: ${({ theme }) => theme.spacing[6]};
  padding-bottom: ${({ theme }) => theme.spacing[4]};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border.light};
`;

export const StoryTitle = styled.h2`
  font-size: ${({ theme }) => theme.typography.fontSize.xl};
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  color: ${({ theme }) => theme.colors.text.primary};
  margin: 0;
`;

export const PageIndicator = styled.span`
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  color: ${({ theme }) => theme.colors.text.secondary};
  background: ${({ theme }) => theme.colors.background.secondary};
  padding: ${({ theme }) => theme.spacing[2]} ${({ theme }) => theme.spacing[3]};
  border-radius: ${({ theme }) => theme.borderRadius.md};
`;

export const StoryContent = styled.div`
  position: relative;
`;

export const StoryText = styled.p`
  font-size: ${({ theme }) => theme.typography.fontSize.base};
  line-height: ${({ theme }) => theme.typography.lineHeight.relaxed};
  color: ${({ theme }) => theme.colors.text.inverse};
  white-space: pre-wrap;
  word-break: keep-all;
  margin: 0;
  min-height: 150px;

  @media (max-width: 768px) {
    font-size: ${({ theme }) => theme.typography.fontSize.sm};
    line-height: ${({ theme }) => theme.typography.lineHeight.normal};
    min-height: 120px;
  }
`;

export const Cursor = styled.span`
  display: inline-block;
  width: 2px;
  height: 1.2em;
  background: ${({ theme }) => theme.colors.primary[500]};
  margin-left: 2px;
  animation: blink 1s infinite;

  @keyframes blink {
    0%, 49% { opacity: 1; }
    50%, 100% { opacity: 0; }
  }
`;

export const SkipButton = styled(BaseButton).attrs({
  variant: 'ghost' as const,
  size: 'sm' as const,
})`
  position: absolute;
  top: 0;
  right: 0;
  gap: ${({ theme }) => theme.spacing[1]};
`;

export const LastPageIndicator = styled(motion.div)`
  text-align: center;
  margin-top: ${({ theme }) => theme.spacing[6]};
  padding-top: ${({ theme }) => theme.spacing[4]};
  border-top: 1px solid ${({ theme }) => theme.colors.border.light};
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  font-style: italic;
`;

export const EmptyState = styled(StateContainer).attrs({
  $variant: 'empty' as const,
})`
  min-height: 300px;
  color: ${({ theme }) => theme.colors.text.tertiary};

  .empty-icon {
    width: 48px;
    height: 48px;
    margin-bottom: ${({ theme }) => theme.spacing[4]};
  }
`;

// 게임 완료 관련
export const CompletionHeader = styled.div`
  text-align: center;
  padding: ${({ theme }) => theme.spacing[12]} ${({ theme }) => theme.spacing[8]};
  background: linear-gradient(135deg, ${({ theme }) => theme.colors.background.secondary} 0%, ${({ theme }) => theme.colors.background.tertiary} 100%);
  border-bottom: 1px solid ${({ theme }) => theme.colors.border.light};
`;

export const CompletionEmoji = styled.div`
  font-size: 4rem;
  margin-bottom: ${({ theme }) => theme.spacing[4]};
`;

export const CompletionTitle = styled.h1`
  font-size: ${({ theme }) => theme.textStyles.heading.h1.fontSize};
  font-weight: ${({ theme }) => theme.textStyles.heading.h1.fontWeight};
  color: ${({ theme }) => theme.colors.text.primary};
  margin-bottom: ${({ theme }) => theme.spacing[2]};
`;

export const CompletionSubtitle = styled.p`
  font-size: ${({ theme }) => theme.typography.fontSize.lg};
  color: ${({ theme }) => theme.colors.text.secondary};
  margin-bottom: ${({ theme }) => theme.spacing[6]};
`;

export const GradeBadge = styled.div<{ $color: string }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 80px;
  height: 80px;
  background: ${({ $color }) => $color};
  color: ${({ theme }) => theme.colors.text.inverse};
  border-radius: 50%;
  font-size: ${({ theme }) => theme.typography.fontSize['2xl']};
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  box-shadow: ${({ theme }) => theme.shadows.dropdown};
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
`;

export const ResultSummary = styled.div`
  padding: ${({ theme }) => theme.spacing[8]};
`;

export const SummaryHeader = styled(FlexContainer).attrs({
  $direction: 'row' as const,
  $align: 'center' as const,
  $gap: 2 as const,
})`
  margin-bottom: ${({ theme }) => theme.spacing[6]};
  font-size: ${({ theme }) => theme.typography.fontSize.lg};
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  color: ${({ theme }) => theme.colors.text.primary};
`;

export const StoryInfo = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing[8]};
  text-align: center;
`;

export const StoryLocation = styled(FlexContainer).attrs({
  $direction: 'row' as const,
  $align: 'center' as const,
  $justify: 'center' as const,
  $gap: 2 as const,
})`
  font-size: ${({ theme }) => theme.typography.fontSize.base};
  color: ${({ theme }) => theme.colors.text.secondary};
`;

export const ActionButtons = styled(FlexContainer).attrs({
  $direction: 'column' as const,
  $gap: 3 as const,
})`
  padding: ${({ theme }) => theme.spacing[8]};
  border-top: 1px solid ${({ theme }) => theme.colors.border.light};
`;