'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import styled from 'styled-components';
import { AppLayout } from '@/shared/components/layout/applayout/AppLayout';
import { useAdminAuth } from '@/features/admin/hooks/useAdmin';

// Dynamic Import: 관리자 대시보드는 필요시에만 로드
const AdminDashboard = dynamic(
  () => import('@/features/admin/components/AdminDashboard').then(mod => ({ default: mod.AdminDashboard })),
  {
    loading: () => (
      <LoadingContainer>
        <LoadingText>관리자 대시보드 로딩 중...</LoadingText>
      </LoadingContainer>
    ),
    ssr: false, // 관리자 페이지는 CSR만
  }
);

export default function AdminPage() {
  const router = useRouter();
  const { data: authData, isLoading, error } = useAdminAuth();

  useEffect(() => {
    // 권한 없으면 리다이렉트
    if (!isLoading && authData && !authData.isAdmin) {
      alert('관리자 권한이 필요합니다.');
      router.push('/');
    }
  }, [authData, isLoading, router]);

  if (isLoading) {
    return (
      <AppLayout>
        <LoadingContainer>
          <LoadingText>권한 확인 중...</LoadingText>
        </LoadingContainer>
      </AppLayout>
    );
  }

  if (error || !authData || !authData.isAdmin) {
    return (
      <AppLayout>
        <ErrorContainer>
          <ErrorText>권한이 없습니다</ErrorText>
          <ErrorSubtext>관리자만 접근할 수 있습니다.</ErrorSubtext>
        </ErrorContainer>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <AdminDashboard />
    </AppLayout>
  );
}

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 70vh;
`;

const LoadingText = styled.div`
  font-size: 1.2rem;
  color: #666;
`;

const ErrorContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  min-height: 70vh;
`;

const ErrorText = styled.div`
  font-size: 1.5rem;
  font-weight: 600;
  color: #f44336;
  margin-bottom: 1rem;
`;

const ErrorSubtext = styled.div`
  font-size: 1rem;
  color: #999;
`;
