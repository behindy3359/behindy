import { env } from '@/config/env';

/**
 * 토큰 가져오기
 */
export const getAccessToken = (): string | null => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(env.TOKEN_KEY);
};

export const getRefreshToken = (): string | null => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(env.REFRESH_TOKEN_KEY);
};

/**
 * 토큰 저장
 */
export const setTokens = (accessToken: string, refreshToken: string): void => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(env.TOKEN_KEY, accessToken);
  localStorage.setItem(env.REFRESH_TOKEN_KEY, refreshToken);
};

/**
 * 토큰 삭제
 */
export const clearTokens = (): void => {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(env.TOKEN_KEY);
  localStorage.removeItem(env.REFRESH_TOKEN_KEY);
};

/**
 * 유효한 토큰 존재 여부
 */
export const hasValidTokens = (): boolean => {
  const accessToken = getAccessToken();
  const refreshToken = getRefreshToken();
  return Boolean(accessToken && refreshToken);
};