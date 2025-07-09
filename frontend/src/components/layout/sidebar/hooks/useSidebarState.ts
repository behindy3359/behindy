import { useState, useEffect, useCallback } from 'react';
import { useUIStore } from '@/store/uiStore';

export const useSidebarState = () => {
  const { sidebar, toggleSidebar } = useUIStore();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    const handleResize = () => checkMobile();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleOverlayClick = useCallback(() => {
    if (isMobile) {
      toggleSidebar();
    }
  }, [isMobile, toggleSidebar]);

  return {
    sidebar,
    isMobile,
    toggleSidebar,
    handleOverlayClick,
  };
};