import { useEffect, useCallback } from 'react';
import { useUIStore } from '@/store/uiStore';

export const useSidebarKeyboard = () => {
  const { toggleSidebar } = useUIStore();

  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    // Ctrl/Cmd + B: 사이드바 토글
    if ((event.ctrlKey || event.metaKey) && event.key === 'b') {
      event.preventDefault();
      toggleSidebar();
    }

    // ESC: 모바일에서 사이드바 닫기
    if (event.key === 'Escape' && window.innerWidth < 768) {
      toggleSidebar();
    }
  }, [toggleSidebar]);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  return {
    // 필요시 추가 키보드 관련 상태나 함수들
  };
};