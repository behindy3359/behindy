import React from 'react';
import { User, Plus } from 'lucide-react';
import { Button } from '@/shared/components/ui/button/Button';
import {
  EmptyStateCard,
  EmptyIcon,
  EmptyTitle,
  EmptyDescription,
} from '../../styles/gameStyles';

interface EmptyCharacterStateProps {
  onCreateCharacter: () => void;
}

export const EmptyCharacterState: React.FC<EmptyCharacterStateProps> = ({
  onCreateCharacter,
}) => {
  return (
    <EmptyStateCard>
      <EmptyIcon>
        <User size={64} />
      </EmptyIcon>
      <EmptyTitle>캐릭터가 없습니다</EmptyTitle>
      <EmptyDescription>
        지하철 모험을 시작하려면 먼저 캐릭터를 생성해주세요
      </EmptyDescription>
      <Button
        size="lg"
        onClick={onCreateCharacter}
        leftIcon={<Plus size={20} />}
      >
        캐릭터 생성하기
      </Button>
    </EmptyStateCard>
  );
};