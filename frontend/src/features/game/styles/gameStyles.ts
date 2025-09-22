import { motion } from 'framer-motion';
import styled from 'styled-components';

// 메인 컨테이너
export const GameContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 1.5rem;
  min-height: 100vh;

  @media (max-width: 768px) {
    padding: 1rem;
  }
`;

// 헤더
export const GameHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid var(--border-light);
`;

export const BackButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 0.75rem;
  background: transparent;
  border: none;
  color: var(--text-secondary);
  cursor: pointer;
  transition: color 0.2s ease;

  &:hover {
    color: var(--text-primary);
  }
`;

export const HeaderTitle = styled.h1`
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--text-primary);
  margin: 0;
`;

export const HeaderActions = styled.div`
  display: flex;
  gap: 0.75rem;
`;

// 콘텐츠 영역
export const GameContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 60vh;
`;

// 로딩 섹션
export const LoadingSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: var(--text-secondary);

  p {
    margin-top: 1rem;
  }
`;

export const Spinner = styled.div`
  width: 48px;
  height: 48px;
  border: 4px solid var(--border-light);
  border-top-color: var(--primary-500);
  border-radius: 50%;
  animation: spin 1s linear infinite;

  @keyframes spin {
    to { transform: rotate(360deg); }
  }
`;

// 캐릭터 생성 섹션
export const CharacterCreateSection = styled(motion.div)`
  text-align: center;
  max-width: 500px;
  width: 100%;
`;

// 게임 플레이 섹션
export const GamePlayingSection = styled.div`
  width: 100%;
  display: grid;
  grid-template-columns: 300px 1fr;
  gap: 1.5rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
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
export const GameCompletionSection = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  min-height: 60vh;
  padding: 1rem;
`;

// 에러 섹션
export const ErrorSection = styled(motion.div)`
  text-align: center;
  max-width: 500px;
  width: 100%;
`;

export const ErrorTitle = styled.h2`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--error);
  margin-bottom: 1rem;
`;

export const ErrorMessage = styled.p`
  font-size: 1rem;
  color: var(--text-secondary);
  margin-bottom: 1.5rem;
`;

export const ErrorActions = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: center;
`;

// 메인 컨테이너
export const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: ${({ theme }) => theme.spacing[6]};

  @media (max-width: 768px) {
    padding: ${({ theme }) => theme.spacing[4]};
  }
`;

// 헤더
export const PageHeader = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing[8]};
`;

export const PageTitle = styled.h1`
  font-size: ${({ theme }) => theme.typography.fontSize['3xl']};
  font-weight: 700;
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
  }
`;

// 공통 카드
export const Card = styled(motion.div)`
  background: ${({ theme }) => theme.colors.background.primary};
  border-radius: ${({ theme }) => theme.borderRadius.xl};
  border: 1px solid ${({ theme }) => theme.colors.border.light};
  box-shadow: ${({ theme }) => theme.shadows.card};
  overflow: hidden;
`;

export const CardHeader = styled.div`
  padding: ${({ theme }) => theme.spacing[6]};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border.light};
`;

export const CardTitle = styled.h2`
  font-size: ${({ theme }) => theme.typography.fontSize.lg};
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text.primary};
  margin: 0;
`;

// 캐릭터 프로필
export const CharacterProfile = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[4]};
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
  color: white;
`;

export const ProfileInfo = styled.div`
  flex: 1;
`;

export const CharacterName = styled.h3`
  font-size: ${({ theme }) => theme.typography.fontSize.xl};
  font-weight: 700;
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

// 스탯 영역
export const StatsGrid = styled.div`
  padding: 0 ${({ theme }) => theme.spacing[6]} ${({ theme }) => theme.spacing[6]};
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing[4]};
`;

export const StatCard = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing[3]};
`;

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
  font-weight: 600;
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
  font-weight: 500;
`;

// 게임 통계
export const StatsList = styled.div`
  padding: ${({ theme }) => theme.spacing[6]};
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing[4]};
`;

export const StatsItem = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[3]};
`;

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

export const StatsText = styled.div`
  flex: 1;
  display: flex;
  justify-content: space-between;
  align-items: center;
  
  span {
    font-size: ${({ theme }) => theme.typography.fontSize.sm};
    color: ${({ theme }) => theme.colors.text.secondary};
  }
  
  strong {
    font-size: ${({ theme }) => theme.typography.fontSize.base};
    color: ${({ theme }) => theme.colors.text.primary};
    font-weight: 600;
  }
`;

// 현재 게임 카드
export const ActiveGameInfo = styled.div`
  padding: ${({ theme }) => theme.spacing[6]};
`;

export const GameTitle = styled.h3`
  font-size: ${({ theme }) => theme.typography.fontSize.lg};
  font-weight: 600;
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

export const ButtonGroup = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing[3]};
`;

// Empty State
export const EmptyStateCard = styled(motion.div)`
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
  font-size: ${({ theme }) => theme.typography.fontSize['2xl']};
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text.primary};
  margin-bottom: ${({ theme }) => theme.spacing[3]};
`;

export const EmptyDescription = styled.p`
  font-size: ${({ theme }) => theme.typography.fontSize.base};
  color: ${({ theme }) => theme.colors.text.secondary};
  margin-bottom: ${({ theme }) => theme.spacing[8]};
`;

// 로딩 상태
export const LoadingState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 400px;
  color: ${({ theme }) => theme.colors.text.secondary};

  p {
    margin-top: ${({ theme }) => theme.spacing[4]};
  }
`;

// 카드 컨테이너
export const CreateCard = styled(motion.div)`
  width: 100%;
  background: ${({ theme }) => theme.colors.background.primary};
  border-radius: ${({ theme }) => theme.borderRadius['2xl']};
  border: 1px solid ${({ theme }) => theme.colors.border.light};
  box-shadow: ${({ theme }) => theme.shadows.lg};
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

export const NameHelper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
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
  transition: all 0.2s ease;

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
  font-weight: 600;
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
export const ExistingCharacterInfo = styled.div`
  padding: ${({ theme }) => theme.spacing[8]};
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing[6]};
`;

export const CharacterCard = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing[6]};
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
  color: white;
  flex-shrink: 0;
`;

export const CharacterDetails = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing[3]};
`;

export const CharacterStats = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing[6]};
`;

export const StatItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing[1]};
`;

export const InfoMessage = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[2]};
  padding: ${({ theme }) => theme.spacing[4]};
  background: rgba(102, 126, 234, 0.1);
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  color: ${({ theme }) => theme.colors.primary[500]};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
`;

export const DestinationInfo = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: ${({ theme }) => theme.spacing[3]};
  background: rgba(102, 126, 234, 0.1);
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  color: ${({ theme }) => theme.colors.primary[600]};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  font-weight: 500;
  margin-bottom: ${({ theme }) => theme.spacing[4]};
`;

export const StoryHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${({ theme }) => theme.spacing[6]};
  padding-bottom: ${({ theme }) => theme.spacing[4]};
  border-bottom: 1px solid var(--border-light);
`;

export const StoryTitle = styled.h2`
  font-size: ${({ theme }) => theme.typography.fontSize.xl};
  font-weight: 700;
  color: var(--text-primary);
  margin: 0;
`;

export const PageIndicator = styled.span`
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  color: var(--text-secondary);
  background: var(--bg-secondary);
  padding: ${({ theme }) => theme.spacing[2]} ${({ theme }) => theme.spacing[3]};
  border-radius: ${({ theme }) => theme.borderRadius.md};
`;

export const StoryContent = styled.div`
  position: relative;
`;

export const StoryText = styled.p`
  font-size: ${({ theme }) => theme.typography.fontSize.base};
  line-height: 1.8;
  color: var(--text-primary);
  white-space: pre-wrap;
  word-break: keep-all;
  margin: 0;
  min-height: 150px;

  @media (max-width: 768px) {
    font-size: ${({ theme }) => theme.typography.fontSize.sm};
    line-height: 1.7;
    min-height: 120px;
  }
`;

export const Cursor = styled.span`
  display: inline-block;
  width: 2px;
  height: 1.2em;
  background: var(--primary-500);
  margin-left: 2px;
  animation: blink 1s infinite;

  @keyframes blink {
    0%, 49% { opacity: 1; }
    50%, 100% { opacity: 0; }
  }
`;

export const SkipButton = styled(motion.button)`
  position: absolute;
  top: 0;
  right: 0;
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[1]};
  padding: ${({ theme }) => theme.spacing[2]} ${({ theme }) => theme.spacing[3]};
  background: var(--bg-secondary);
  border: 1px solid var(--border-medium);
  border-radius: ${({ theme }) => theme.borderRadius.md};
  color: var(--text-secondary);
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: var(--bg-tertiary);
    color: var(--text-primary);
  }
`;

export const LastPageIndicator = styled(motion.div)`
  text-align: center;
  margin-top: ${({ theme }) => theme.spacing[6]};
  padding-top: ${({ theme }) => theme.spacing[4]};
  border-top: 1px solid var(--border-light);
  color: var(--text-secondary);
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  font-style: italic;
`;

export const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 300px;
  color: var(--text-tertiary);

  .empty-icon {
    width: 48px;
    height: 48px;
    margin-bottom: ${({ theme }) => theme.spacing[4]};
  }
`;