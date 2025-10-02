'use client';

import { Gamepad2, Home } from 'lucide-react';
import { StateContainer } from '@/shared/styles/components';
import { Button } from '@/shared/components/ui/button/Button';
import { FlexContainer } from '@/shared/styles/components';

export default function GameError({
  error,
  reset
}: {
  error: Error & { digest?: string };
  reset: () => void
}) {
  return (
    <StateContainer $variant="error">
      <Gamepad2 className="state-icon" />
      <h2 className="state-title">게임 로드 중 오류가 발생했습니다</h2>
      <p className="state-description">
        {error.message || '게임을 불러올 수 없습니다.'}
      </p>
      <FlexContainer $gap={3} $justify="center">
        <Button onClick={() => reset()} variant="primary">
          다시 시도
        </Button>
        <Button
          onClick={() => window.location.href = '/'}
          variant="secondary"
          leftIcon={<Home size={16} />}
        >
          홈으로
        </Button>
      </FlexContainer>
    </StateContainer>
  );
}
