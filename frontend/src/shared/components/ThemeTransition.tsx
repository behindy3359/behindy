import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';

interface ThemeTransitionProps {
  isGameMode: boolean;
  children: React.ReactNode;
}

const TransitionOverlay = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(45deg, #0a0a0a 0%, #1e1b3a 100%);
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1.5rem;
  font-weight: 600;
`;

export const ThemeTransition: React.FC<ThemeTransitionProps> = ({ 
  children 
}) => {
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    const handleGameModeEnter = () => {
      setIsTransitioning(true);
      setTimeout(() => setIsTransitioning(false), 1500);
    };

    document.addEventListener('game-mode-enter', handleGameModeEnter);
    return () => document.removeEventListener('game-mode-enter', handleGameModeEnter);
  }, []);

  return (
    <>
      {children}
      <AnimatePresence>
        {isTransitioning && (
          <TransitionOverlay
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.3 }}
            >
              ⚡ 미지의 세계로 진입중...
            </motion.div>
          </TransitionOverlay>
        )}
      </AnimatePresence>
    </>
  );
};
