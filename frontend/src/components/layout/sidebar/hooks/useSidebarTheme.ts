import { useState, useCallback } from 'react';

export const useSidebarTheme = () => {
  const [isDarkTheme, setIsDarkTheme] = useState(false);

  const handleThemeToggle = useCallback(() => {
    setIsDarkTheme(!isDarkTheme);
    // 실제 테마 변경 로직은 여기에 추가
    // 예: document.documentElement.setAttribute('data-theme', isDarkTheme ? 'light' : 'dark');
  }, [isDarkTheme]);

  return {
    isDarkTheme,
    handleThemeToggle,
  };
};