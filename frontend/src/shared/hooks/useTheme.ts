import { useState, useEffect, useCallback } from 'react';
import { useRouter, usePathname } from 'next/navigation';

export type ThemeMode = 'light' | 'dark' | 'auto';
export type ResolvedTheme = 'light' | 'dark';

interface ThemeConfig {
  mode: ThemeMode;
  resolvedTheme: ResolvedTheme;
  isGameMode: boolean;
  systemTheme: ResolvedTheme;
}

// 🎮 게임 관련 라우트 정의
const GAME_ROUTES = ['/game', '/character'];
const DARK_ROUTES = ['/game', '/character']; // 다크 테마 강제 적용 라우트

export const useTheme = () => {
  const pathname = usePathname();
  const [themeConfig, setThemeConfig] = useState<ThemeConfig>({
    mode: 'auto',
    resolvedTheme: 'light',
    isGameMode: false,
    systemTheme: 'light'
  });

  // 시스템 테마 감지
  const getSystemTheme = useCallback((): ResolvedTheme => {
    if (typeof window === 'undefined') return 'light';
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }, []);

  // 라우트 기반 게임 모드 판단
  const isGameRoute = useCallback((path: string): boolean => {
    return GAME_ROUTES.some(route => path.startsWith(route));
  }, []);

  // 다크 테마 강제 적용 라우트 판단
  const isDarkRoute = useCallback((path: string): boolean => {
    return DARK_ROUTES.some(route => path.startsWith(route));
  }, []);

  // 최종 테마 계산
  const calculateResolvedTheme = useCallback((mode: ThemeMode, systemTheme: ResolvedTheme, path: string): ResolvedTheme => {
    // 🎮 게임 라우트는 항상 다크 테마
    if (isDarkRoute(path)) {
      return 'dark';
    }

    // 사용자 설정에 따른 테마
    switch (mode) {
      case 'dark':
        return 'dark';
      case 'light':
        return 'light';
      case 'auto':
      default:
        return systemTheme;
    }
  }, [isDarkRoute]);

  // 테마 모드 변경
  const setThemeMode = useCallback((mode: ThemeMode) => {
    setThemeConfig(prev => {
      const newResolvedTheme = calculateResolvedTheme(mode, prev.systemTheme, pathname);
      const newConfig = {
        ...prev,
        mode,
        resolvedTheme: newResolvedTheme
      };
      
      // localStorage에 사용자 설정 저장 (게임 모드가 아닐 때만)
      if (!prev.isGameMode) {
        try {
          localStorage.setItem('theme-mode', mode);
        } catch (error) {
          // Silent failure
        }
      }
      
      return newConfig;
    });
  }, [pathname, calculateResolvedTheme]);

  // 시스템 테마 변경 감지
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleSystemThemeChange = (e: MediaQueryListEvent) => {
      const newSystemTheme = e.matches ? 'dark' : 'light';
      setThemeConfig(prev => ({
        ...prev,
        systemTheme: newSystemTheme,
        resolvedTheme: calculateResolvedTheme(prev.mode, newSystemTheme, pathname)
      }));
    };

    mediaQuery.addEventListener('change', handleSystemThemeChange);
    return () => mediaQuery.removeEventListener('change', handleSystemThemeChange);
  }, [pathname, calculateResolvedTheme]);

  // 라우트 변경 감지 및 자동 테마 전환
  useEffect(() => {
    const isGame = isGameRoute(pathname);
    const systemTheme = getSystemTheme();
    
    // 저장된 사용자 설정 로드 (게임 모드가 아닐 때만)
    let savedMode: ThemeMode = 'auto';
    if (!isGame) {
      try {
        savedMode = (localStorage.getItem('theme-mode') as ThemeMode) || 'auto';
      } catch (error) {
        // Silent failure
      }
    }

    const resolvedTheme = calculateResolvedTheme(savedMode, systemTheme, pathname);

    setThemeConfig({
      mode: savedMode,
      resolvedTheme,
      isGameMode: isGame,
      systemTheme
    });

    // 🎨 DOM에 테마 클래스 적용
    document.documentElement.setAttribute('data-theme', resolvedTheme);
    document.documentElement.classList.toggle('game-mode', isGame);
    
    // 🌟 게임 진입 시 전환 이벤트 발생
    if (isGame) {
      document.dispatchEvent(new CustomEvent('game-mode-enter', { 
        detail: { theme: resolvedTheme } 
      }));
    }

  }, [pathname, calculateResolvedTheme, isGameRoute, getSystemTheme]);

  return {
    theme: themeConfig.resolvedTheme,
    themeMode: themeConfig.mode,
    isGameMode: themeConfig.isGameMode,
    systemTheme: themeConfig.systemTheme,
    setThemeMode,
    
    // 유틸리티 함수들
    isDark: themeConfig.resolvedTheme === 'dark',
    isLight: themeConfig.resolvedTheme === 'light',
    canToggle: !themeConfig.isGameMode, // 게임 모드에서는 테마 토글 비활성화
  };
};