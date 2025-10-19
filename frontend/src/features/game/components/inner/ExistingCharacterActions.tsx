
import React from 'react';
import { ArrowRight, Home, Trash2 } from 'lucide-react';
import { Button } from '@/shared/components/ui/button/Button';

interface ExistingCharacterActionsProps {
  stationName: string | null;
  lineNumber: string | null;
  isLoading: boolean;
  onContinueWithExisting: () => void;
  onGoHome: () => void;
  onAbandonAndCreate: () => void;
}

export const ExistingCharacterActions: React.FC<ExistingCharacterActionsProps> = ({
  stationName,
  lineNumber,
  isLoading,
  onContinueWithExisting,
  onGoHome,
  onAbandonAndCreate
}) => {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      gap: '0.75rem'
    }}>
      {/* 메인 액션 버튼 */}
      <Button
        onClick={onContinueWithExisting}
        size="lg"
        fullWidth
        rightIcon={stationName && lineNumber ? <ArrowRight size={20} /> : <Home size={20} />}
      >
        {stationName && lineNumber 
          ? `${stationName}역으로 이동하기` 
          : '이 캐릭터로 계속하기'
        }
      </Button>
      
      {/* 홈으로 돌아가기 */}
      {/* <Button
        variant="outline"
        onClick={onGoHome}
        size="lg"
        fullWidth
        leftIcon={<Home size={20} />}
      >
        홈으로 돌아가기
      </Button> */}

      {/* 위험한 액션 */}
      <Button
        variant="destructive"
        onClick={onAbandonAndCreate}
        size="lg"
        fullWidth
        disabled={isLoading}
        leftIcon={<Trash2 size={18} />}
      >
        포기하고 새로 만들기
      </Button>
    </div>
  );
};
