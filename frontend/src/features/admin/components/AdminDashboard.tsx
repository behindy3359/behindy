'use client';

import React from 'react';
import { useAdminStats } from '../hooks/useAdmin';
import { AdminHeader } from './inner/AdminHeader';
import { AdminStatsCard } from './inner/AdminStatsCard';
import { AdminStatsSection } from './inner/AdminStatsSection';
import {
  AdminContainer,
  AdminFooter,
  LoadingContainer,
  ErrorContainer,
} from '../styles/adminStyles';

export const AdminDashboard: React.FC = () => {
  const { data: stats, isLoading, error } = useAdminStats();

  if (isLoading) {
    return <LoadingContainer>통계 로딩 중...</LoadingContainer>;
  }

  if (error) {
    return <ErrorContainer>통계를 불러오지 못했습니다.</ErrorContainer>;
  }

  if (!stats) {
    return <ErrorContainer>데이터가 없습니다.</ErrorContainer>;
  }

  return (
    <AdminContainer>
      <AdminHeader
        title="관리자 대시보드"
        subtitle="읽기 전용 - 통계 및 모니터링"
      />

      {/* 시스템 상태 */}
      <AdminStatsSection title="시스템 상태">
        <AdminStatsCard
          title="서버 상태"
          value={stats.serverStatus}
          status={stats.serverStatus}
        />
        <AdminStatsCard
          title="서버 시간"
          value={new Date(stats.serverTime).toLocaleString('ko-KR')}
          color="#2196F3"
        />
      </AdminStatsSection>

      {/* 사용자 통계 */}
      <AdminStatsSection title="사용자 통계">
        <AdminStatsCard
          title="전체 사용자"
          value={stats.totalUsers}
          subtext={`활성: ${stats.activeUsers}`}
          color="#2196F3"
        />
        <AdminStatsCard
          title="오늘 신규 가입"
          value={stats.newUsersToday}
          color="#4CAF50"
        />
        <AdminStatsCard
          title="이번 주 신규 가입"
          value={stats.newUsersThisWeek}
          color="#4CAF50"
        />
      </AdminStatsSection>

      {/* 게시글 통계 */}
      <AdminStatsSection title="게시글 통계">
        <AdminStatsCard
          title="전체 게시글"
          value={stats.totalPosts}
          subtext={`활성: ${stats.activePosts}`}
          color="#FF9800"
        />
        <AdminStatsCard
          title="오늘 작성"
          value={stats.newPostsToday}
          color="#FF5722"
        />
        <AdminStatsCard
          title="이번 주 작성"
          value={stats.newPostsThisWeek}
          color="#FF5722"
        />
      </AdminStatsSection>

      {/* 댓글 통계 */}
      <AdminStatsSection title="댓글 통계">
        <AdminStatsCard
          title="전체 댓글"
          value={stats.totalComments}
          subtext={`활성: ${stats.activeComments}`}
          color="#9C27B0"
        />
        <AdminStatsCard
          title="오늘 작성"
          value={stats.newCommentsToday}
          color="#E91E63"
        />
        <AdminStatsCard
          title="이번 주 작성"
          value={stats.newCommentsThisWeek}
          color="#E91E63"
        />
      </AdminStatsSection>

      {/* AI & 지하철 통계 */}
      <AdminStatsSection title="AI & 지하철 통계">
        <AdminStatsCard
          title="전체 AI 스토리"
          value={stats.totalStories}
          color="#00BCD4"
        />
        <AdminStatsCard
          title="등록된 역"
          value={stats.totalStations}
          color="#607D8B"
        />
        <AdminStatsCard
          title="지하철 노선"
          value={stats.totalLines}
          color="#607D8B"
        />
      </AdminStatsSection>

      <AdminFooter>
        마지막 업데이트: {new Date().toLocaleTimeString('ko-KR')}
      </AdminFooter>
    </AdminContainer>
  );
};
