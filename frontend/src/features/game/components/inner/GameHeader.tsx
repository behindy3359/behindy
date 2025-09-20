import React from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, LogOut } from 'lucide-react';
import { Button } from '@/shared/components/ui/button/Button';
import { gameThemeControls } from '@/shared/hooks/useAutoTheme';
import { GameFlowState } from '../../types/gameTypes';
import { GameHeader as StyledGameHeader, BackButton, HeaderTitle, HeaderActions } from '../../styles/gameStyles';

interface GameHeaderProps {
  stationName: string | null;
  lineNumber: string | null;
  gameState: GameFlowState;
  onQuit: () => void;
}

export const GameHeader: React.FC<GameHeaderProps> = ({
  stationName,
  lineNumber,
  gameState,
  onQuit,
}) => {
  const router = useRouter();

  const handleBack = () => {
    gameThemeControls.disableGameMode();
    router.push('/');
  };

  return (
    <StyledGameHeader>
      <BackButton onClick={handleBack}>
        <ArrowLeft size={20} />
        <span>돌아가기</span>
      </BackButton>
      
      <HeaderTitle>
        {stationName && lineNumber && `${stationName}역 ${lineNumber}호선`}
      </HeaderTitle>

      <HeaderActions>
        {gameState === 'GAME_PLAYING' && (
          <Button
            variant="outline"
            size="sm"
            onClick={onQuit}
            leftIcon={<LogOut size={16} />}
          >
            포기
          </Button>
        )}
      </HeaderActions>
    </StyledGameHeader>
  );
};