import React from 'react';
import styled from 'styled-components';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui';

const ErrorContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  text-align: center;
  background: white;
  border-radius: 12px;
  border: 1px solid #e5e7eb;
  
  .error-icon {
    width: 64px;
    height: 64px;
    color: #ef4444;
    margin-bottom: 16px;
  }
  
  .error-title {
    font-size: 20px;
    font-weight: 600;
    color: #111827;
    margin-bottom: 8px;
  }
  
  .error-description {
    color: #6b7280;
    margin-bottom: 24px;
    line-height: 1.5;
  }
`;

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

export class CommunityErrorBoundary extends React.Component<
  React.PropsWithChildren<{}>,
  ErrorBoundaryState
> {
  constructor(props: React.PropsWithChildren<{}>) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Community Error Boundary caught an error:', error, errorInfo);
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: undefined });
  };

  render() {
    if (this.state.hasError) {
      return (
        <ErrorContainer>
          <AlertTriangle className="error-icon" />
          <div className="error-title">문제가 발생했습니다</div>
          <div className="error-description">
            커뮤니티를 불러오는 중 오류가 발생했습니다.<br />
            잠시 후 다시 시도해주세요.
          </div>
          <Button
            variant="primary"
            onClick={this.handleRetry}
            leftIcon={<RefreshCw />}
          >
            다시 시도
          </Button>
        </ErrorContainer>
      );
    }

    return this.props.children;
  }
}