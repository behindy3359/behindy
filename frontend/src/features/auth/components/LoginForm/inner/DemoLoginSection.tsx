import React from 'react';
import { GamepadIcon } from 'lucide-react';
import { Button } from '@/shared/components/ui/button/Button';
import { DemoContainer, DemoContent } from '../styles';
import type { DemoLoginSectionProps } from '../../../types/types';

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
      <DemoContent>
        <Button
          variant="ghost"
          size="sm"
          onClick={onDemoLogin}
          disabled={disabled}
          leftIcon={<GamepadIcon size={20} />}
          style={{
            width: '100%',
            color: '#1e3a8a',
            borderColor: '#3b82f6',
            backgroundColor: 'transparent'
          }}
        >
          🎮 데모 계정으로 접속하기
        </Button>
      </DemoContent>
    </DemoContainer>
  );
};