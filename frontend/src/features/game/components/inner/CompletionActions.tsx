import React from 'react';
import { Home } from 'lucide-react';
import { Button } from '@/shared/components/ui/button/Button';

interface CompletionActionsProps {
  onBackToMain: () => void;
}

export const CompletionActions: React.FC<CompletionActionsProps> = ({
  onBackToMain
}) => {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      gap: '0.75rem'
    }}>
      <Button
        variant="primary"
        size="lg"
        onClick={onBackToMain}
        leftIcon={<Home size={18} />}
        fullWidth
      >
        메인으로 돌아가기
      </Button>
    </div>
  );
};
