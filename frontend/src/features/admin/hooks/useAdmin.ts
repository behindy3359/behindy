import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import axiosInstance from '@/config/axiosConfig';
import type { AdminStats, AdminUser, AdminCheckResponse } from '../types/adminTypes';

/**
 * 관리자 권한 확인 훅
 */
export const useAdminAuth = () => {
  return useQuery<AdminCheckResponse>({
    queryKey: ['admin', 'auth'],
    queryFn: async () => {
      const response = await axiosInstance.get('/api/admin/check') as any;
      return response.data as AdminCheckResponse;
    },
    staleTime: 5 * 60 * 1000, // 5분
    retry: false,
  });
};

/**
 * 관리자 통계 조회 훅
 */
export const useAdminStats = () => {
  return useQuery<AdminStats>({
    queryKey: ['admin', 'stats'],
    queryFn: async () => {
      const response = await axiosInstance.get('/api/admin/stats') as any;
      return response.data as AdminStats;
    },
    staleTime: 1 * 60 * 1000, // 1분
    refetchInterval: 5 * 60 * 1000, // 5분마다 자동 갱신
  });
};

/**
 * 관리자 사용자 목록 조회 훅
 */
export const useAdminUsers = (page: number = 0, size: number = 20) => {
  return useQuery<{
    content: AdminUser[];
    totalElements: number;
    totalPages: number;
    number: number;
    size: number;
  }>({
    queryKey: ['admin', 'users', page, size],
    queryFn: async () => {
      const response = await axiosInstance.get('/api/admin/users', {
        params: { page, size },
      }) as any;
      return response.data;
    },
    staleTime: 1 * 60 * 1000,
  });
};

/**
 * 최근 활동 사용자 조회 훅
 */
export const useAdminRecentUsers = () => {
  return useQuery<AdminUser[]>({
    queryKey: ['admin', 'users', 'recent'],
    queryFn: async () => {
      const response = await axiosInstance.get('/api/admin/users/recent') as any;
      return response.data as AdminUser[];
    },
    staleTime: 1 * 60 * 1000,
  });
};
