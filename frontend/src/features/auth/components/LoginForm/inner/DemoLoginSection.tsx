import React from 'react';
import { UserCog } from 'lucide-react';
import { Button } from '@/shared/components/ui/button/Button';
import { DemoContainer } from '../styles';

interface DemoLoginSectionProps {
  onDemoLogin: () => void;
  disabled?: boolean;
}

export const DemoLoginSection: React.FC<DemoLoginSectionProps> = ({
  onDemoLogin,
  disabled = false,
}) => {
  return (
    <DemoContainer
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Button
        variant="ghost"
        size="lg"
        onClick={onDemoLogin}
        disabled={disabled}
        leftIcon={<UserCog size={20} />}
        fullWidth
        style={{
          color: '#1e3a8a',
          backgroundColor: 'transparent',
          justifyContent: 'center',
          padding: '12px 16px'
        }}
      >
        데모 계정으로 접속하기
      </Button>
    </DemoContainer>
  );
};