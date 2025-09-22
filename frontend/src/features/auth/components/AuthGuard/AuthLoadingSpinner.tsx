import React from 'react';
import { LOADING_MESSAGES } from '@/shared/utils/common/constants';
import {
  LoadingContainer,
  LoadingContent,
  Spinner,
  LoadingText
} from '@/features/auth/components/AuthGuard/styles'

interface AuthLoadingSpinnerProps {
  message?: string;
}


export const AuthLoadingSpinner: React.FC<AuthLoadingSpinnerProps> = ({ 
  message = LOADING_MESSAGES.LOADING 
}) => {
  return (
    <LoadingContainer>
      <LoadingContent>
        <Spinner />
        <LoadingText>{message}</LoadingText>
      </LoadingContent>
    </LoadingContainer>
  );
};