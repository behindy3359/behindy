import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { GlowContainer, TypewriterContainer } from '@/shared/styles';

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
  background: linear-gradient(45deg, 
    ${({ theme }) => theme.colors.background.primary} 0%, 
    ${({ theme }) => theme.colors.background.primary || theme.colors.background.secondary} 100%
  );
  z-index: ${({ theme }) => theme.zIndex.modal};
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: ${({ theme }) => theme.typography.fontSize.xl};
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
`;

const TransitionContent = styled(GlowContainer)`
  text-align: center;
  padding: ${({ theme }) => theme.spacing[8]};
  border-radius: ${({ theme }) => theme.borderRadius.xl};
  background: rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(10px);
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
            <TransitionContent>
              <TypewriterContainer $duration="1s">
                ⚡ 미지의 세계로 진입중...
              </TypewriterContainer>
            </TransitionContent>
          </TransitionOverlay>
        )}
      </AnimatePresence>
    </>
  );
};