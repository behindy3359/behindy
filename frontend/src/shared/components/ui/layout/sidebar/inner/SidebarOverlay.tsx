import React from 'react';
import { AnimatePresence } from 'framer-motion';
import { SidebarOverlay as StyledSidebarOverlay } from '../styles';

interface SidebarOverlayProps {
  isVisible: boolean;
  onClick: () => void;
}

export const SidebarOverlay: React.FC<SidebarOverlayProps> = ({
  isVisible,
  onClick,
}) => {
  return (
    <AnimatePresence>
      {isVisible && (
        <StyledSidebarOverlay
          $visible={isVisible}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClick}
        />
      )}
    </AnimatePresence>
  );
};