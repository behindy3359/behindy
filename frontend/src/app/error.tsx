'use client';

import { AlertCircle } from 'lucide-react';
import { StateContainer } from '@/shared/styles/components';
import { Button } from '@/shared/components/ui/button/Button';

export default function Error({
  error,
  reset
}: {
  error: Error & { digest?: string };
  reset: () => void
}) {
  return (
    <StateContainer $variant="error">
      <AlertCircle className="state-icon" />
      <h2 className="state-title">문제가 발생했습니다</h2>
      <p className="state-description">
        {error.message || '알 수 없는 오류가 발생했습니다.'}
      </p>
      <Button onClick={() => reset()} variant="primary">
        다시 시도
      </Button>
    </StateContainer>
  );
}
