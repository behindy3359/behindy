"use client";

import React from 'react';
import { useAuthGuard } from '@/features/auth/hooks/useAuthGuard';
import { AuthLoadingSpinner } from '@/features/auth/components/AuthGuard/AuthLoadingSpinner';

interface AuthGuardProps {
  children: React.ReactNode;
}

export const AuthGuard: React.FC<AuthGuardProps> = ({ children }) => {
  const { isLoading, shouldRender } = useAuthGuard();

  if (isLoading || !shouldRender) {
    return <AuthLoadingSpinner />;
  }

  return <>{children}</>;
};