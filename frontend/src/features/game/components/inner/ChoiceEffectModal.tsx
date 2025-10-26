import React, { useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';

interface ChoiceEffectModalProps {
  isVisible: boolean;
  effect?: 'health' | 'sanity' | 'both' | 'none';
  amount?: number;
  effectPreview?: string | null;
  onClose: () => void;
  autoCloseDuration?: number;
}

export const ChoiceEffectModal: React.FC<ChoiceEffectModalProps> = ({
  isVisible,
  effect,
  amount = 0,
  effectPreview,
  onClose,
  autoCloseDuration = 2000,
}) => {
  useEffect(() => {
    if (isVisible && autoCloseDuration > 0) {
      const timer = setTimeout(() => {
        onClose();
      }, autoCloseDuration);

      return () => clearTimeout(timer);
    }
  }, [isVisible, autoCloseDuration, onClose]);

  if (!effect || !amount || amount === 0) return null;

  const isPositive = amount > 0;
  const isNegative = amount < 0;

  const getEffectText = () => {
    if (effectPreview) return effectPreview;

    const absAmount = Math.abs(amount);
    const sign = isPositive ? '+' : '';

    if (effect === 'health') return `${sign}${absAmount} 체력`;
    if (effect === 'sanity') return `${sign}${absAmount} 정신력`;
    if (effect === 'both') return `${sign}${absAmount} 체력 & 정신력`;
    return '효과 없음';
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <Overlay
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <ModalCard
            onClick={(e) => e.stopPropagation()}
            $isPositive={isPositive}
            $isNegative={isNegative}
            initial={{ scale: 0.8, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.8, opacity: 0, y: -20 }}
            transition={{
              type: 'spring',
              stiffness: 300,
              damping: 25
            }}
          >
            <EffectText $isPositive={isPositive} $isNegative={isNegative}>
              {getEffectText()}
            </EffectText>

            <ProgressBar>
              <ProgressFill
                $isPositive={isPositive}
                $isNegative={isNegative}
                initial={{ width: '0%' }}
                animate={{ width: '100%' }}
                transition={{ duration: autoCloseDuration / 1000 }}
              />
            </ProgressBar>
          </ModalCard>
        </Overlay>
      )}
    </AnimatePresence>
  );
};

// Styled Components
const Overlay = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: ${({ theme }) => theme.spacing[4]};
`;

const pulseAnimation = keyframes`
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
`;

const ModalCard = styled(motion.div)<{ $isPositive: boolean; $isNegative: boolean }>`
  background: var(--bg-primary);
  border-radius: ${({ theme }) => theme.borderRadius.xl};
  padding: ${({ theme }) => theme.spacing[8]};
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  min-width: 320px;
  max-width: 400px;
  animation: ${pulseAnimation} 2s ease-in-out infinite;
  border: 3px solid ${({ $isPositive, $isNegative }) => {
    if ($isPositive) return '#22c55e';
    if ($isNegative) return '#ef4444';
    return 'var(--border-medium)';
  }};

  @media (max-width: 768px) {
    min-width: 280px;
    padding: ${({ theme }) => theme.spacing[6]};
  }
`;

const EffectText = styled.div<{ $isPositive: boolean; $isNegative: boolean }>`
  font-size: ${({ theme }) => theme.typography.fontSize['3xl']};
  font-weight: 700;
  color: ${({ $isPositive, $isNegative }) => {
    if ($isPositive) return '#22c55e';
    if ($isNegative) return '#ef4444';
    return 'var(--text-primary)';
  }};
  text-align: center;
  text-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  margin-bottom: ${({ theme }) => theme.spacing[6]};
  line-height: 1.4;

  @media (max-width: 768px) {
    font-size: ${({ theme }) => theme.typography.fontSize['2xl']};
  }
`;

const ProgressBar = styled.div`
  width: 100%;
  height: 4px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 2px;
  overflow: hidden;
`;

const ProgressFill = styled(motion.div)<{ $isPositive: boolean; $isNegative: boolean }>`
  height: 100%;
  background: rgba(255, 255, 255, 0.8);
  border-radius: 2px;
`;
