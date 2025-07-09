import React from 'react';
import { useRouter } from 'next/navigation';
import { AlertTriangle, RefreshCw, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button/Button';
import { PageContainer } from '@/styles/commonStyles';
import { ERROR_MESSAGES, ACTION_MESSAGES } from '@/utils/common/constants';

interface PostFormErrorStateProps {
  error: 'load' | 'permission' | 'network' | 'unknown';
  postId?: number;
  onRetry?: () => void;
}

export const PostFormErrorState = React.memo<PostFormErrorStateProps>(
  function PostFormErrorState({ error, postId, onRetry }) {
    const router = useRouter();

    const getErrorContent = () => {
      switch (error) {
        case 'load':
          return {
            title: '게시글을 불러올 수 없습니다',
            message: ERROR_MESSAGES.POST_LOAD_ERROR,
            actions: (
              <>
                {onRetry && (
                  <Button
                    variant="primary"
                    onClick={onRetry}
                    leftIcon={<RefreshCw />}
                  >
                    다시 시도
                  </Button>
                )}
                <Button
                  variant="ghost"
                  onClick={() => router.push('/community')}
                  leftIcon={<ArrowLeft />}
                >
                  {ACTION_MESSAGES.GO_TO_LIST}
                </Button>
              </>
            )
          };

        case 'permission':
          return {
            title: '권한이 없습니다',
            message: ERROR_MESSAGES.POST_PERMISSION_ERROR,
            actions: (
              <>
                <Button
                  variant="primary"
                  onClick={() => router.push(`/community/${postId}`)}
                  leftIcon={<ArrowLeft />}
                >
                  {ACTION_MESSAGES.GO_TO_POST}
                </Button>
                <Button
                  variant="ghost"
                  onClick={() => router.push('/community')}
                  leftIcon={<ArrowLeft />}
                >
                  {ACTION_MESSAGES.GO_TO_LIST}
                </Button>
              </>
            )
          };

        case 'network':
          return {
            title: '네트워크 오류',
            message: ERROR_MESSAGES.NETWORK_ERROR,
            actions: (
              <Button
                variant="primary"
                onClick={() => window.location.reload()}
                leftIcon={<RefreshCw />}
              >
                페이지 새로고침
              </Button>
            )
          };

        default:
          return {
            title: '알 수 없는 오류',
            message: ERROR_MESSAGES.UNKNOWN_ERROR,
            actions: (
              <Button
                variant="ghost"
                onClick={() => router.push('/community')}
                leftIcon={<ArrowLeft />}
              >
                {ACTION_MESSAGES.GO_TO_LIST}
              </Button>
            )
          };
      }
    };

    const { title, message, actions } = getErrorContent();

    return (
      <PageContainer>
        <div style={{ 
          textAlign: 'center', 
          padding: '60px 20px',
          color: '#ef4444' 
        }}>
          <div style={{ marginBottom: '24px' }}>
            <AlertTriangle size={64} style={{ color: '#ef4444' }} />
          </div>
          
          <h2 style={{ 
            fontSize: '24px', 
            fontWeight: '600', 
            marginBottom: '12px',
            color: '#111827' 
          }}>
            {title}
          </h2>
          
          <p style={{ 
            color: '#6b7280', 
            marginBottom: '32px',
            lineHeight: '1.6' 
          }}>
            {message}
          </p>
          
          <div style={{ 
            display: 'flex', 
            gap: '12px', 
            justifyContent: 'center',
            flexWrap: 'wrap' 
          }}>
            {actions}
          </div>
        </div>
      </PageContainer>
    );
  }
);