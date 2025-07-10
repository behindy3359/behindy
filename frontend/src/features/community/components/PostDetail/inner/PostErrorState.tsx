import React from 'react';
import { useRouter } from 'next/navigation';
import { AlertTriangle, RefreshCw, LogIn, ArrowLeft } from 'lucide-react';
import { ErrorState } from '../styles';
import { ERROR_MESSAGES } from '@/shared/utils/common/constants';
import { apiErrorHandler } from '@/shared/utils/common/api';
import Button from '@/shared/components/ui/button/Button';

interface PostErrorStateProps {
  error: unknown;
  apiError: string | null;
  onBack: () => void;
}

export const PostErrorState: React.FC<PostErrorStateProps> = ({
  error,
  apiError,
  onBack,
}) => {
  const router = useRouter();
  
  const errorMessage = apiError || ERROR_MESSAGES.POST_LOAD_ERROR;
  const errorInfo = error ? apiErrorHandler.parseError(error) : null;

  return (
    <ErrorState>
      <div className="error-icon">
        <AlertTriangle size={48} />
      </div>
      <div className="error-title">게시글을 불러올 수 없습니다</div>
      <div className="error-message">{errorMessage}</div>
      
      {errorInfo && (
        <div className="error-actions">
          {errorInfo.code === 'NETWORK_ERROR' && (
            <Button
              variant="primary"
              onClick={() => window.location.reload()}
              leftIcon={<RefreshCw />}
            >
              다시 시도
            </Button>
          )}
          {errorInfo.code === '401' && (
            <Button
              variant="primary"
              onClick={() => router.push('/auth/login')}
              leftIcon={<LogIn />}
            >
              로그인하기
            </Button>
          )}
          <Button
            variant="ghost"
            onClick={onBack}
            leftIcon={<ArrowLeft />}
          >
            목록으로 돌아가기
          </Button>
        </div>
      )}
    </ErrorState>
  );
};