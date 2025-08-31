"use client";

import React, { useState } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Brain, AlertCircle, ChevronRight } from 'lucide-react';
import { GameOption } from '../../types/gameTypes';

interface ChoiceButtonsProps {
  options: GameOption[];
  onChoice: (optionId: number) => void;
  disabled?: boolean;
  isLoading?: boolean;
  showEffectPreview?: boolean;
}

export const ChoiceButtons: React.FC<ChoiceButtonsProps> = ({
  options,
  onChoice,
  disabled = false,
  isLoading = false,
  showEffectPreview = true
}) => {
  const [selectedId, setSelectedId] = useState<number | null>(null);

  const handleChoice = (optionId: number) => {
    if (disabled || isLoading) return;
    
    setSelectedId(optionId);
    onChoice(optionId);
  };

  const getEffectIcon = (effect?: string) => {
    switch (effect) {
      case 'health':
        return <Heart size={16} />;
      case 'sanity':
        return <Brain size={16} />;
      case 'both':
        return <AlertCircle size={16} />;
      default:
        return null;
    }
  };

  const getEffectColor = (effect?: string, amount?: number) => {
    if (!effect || !amount) return 'default';
    return amount > 0 ? 'positive' : 'negative';
  };

  if (!options || options.length === 0) {
    return (
      <Container>
        <EmptyState>
          <AlertCircle size={24} />
          <span>선택 가능한 옵션이 없습니다</span>
        </EmptyState>
      </Container>
    );
  }

  return (
    <Container>
      <OptionsGrid>
        <AnimatePresence mode="wait">
          {options.map((option, index) => (
            <ChoiceButton
              key={option.optionId}
              onClick={() => handleChoice(option.optionId)}
              disabled={disabled || isLoading}
              $isSelected={selectedId === option.optionId}
              $isLoading={isLoading && selectedId === option.optionId}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ delay: index * 0.1 }}
              whileHover={!disabled && !isLoading ? { scale: 1.02 } : {}}
              whileTap={!disabled && !isLoading ? { scale: 0.98 } : {}}
            >
              <ButtonContent>
                <ChoiceNumber>{index + 1}</ChoiceNumber>
                <ChoiceText>{option.content}</ChoiceText>
                <ChevronRight size={20} className="arrow" />
              </ButtonContent>

              {showEffectPreview && option.effectPreview && (
                <EffectPreview $type={getEffectColor(option.effect, option.amount)}>
                  {getEffectIcon(option.effect)}
                  <span>{option.effectPreview}</span>
                </EffectPreview>
              )}

              {isLoading && selectedId === option.optionId && (
                <LoadingOverlay>
                  <Spinner />
                </LoadingOverlay>
              )}
            </ChoiceButton>
          ))}
        </AnimatePresence>
      </OptionsGrid>

      {disabled && !isLoading && (
        <DisabledMessage>
          <AlertCircle size={16} />
          <span>스토리를 읽고 있는 중입니다...</span>
        </DisabledMessage>
      )}
    </Container>
  );
};

// Styled Components
const Container = styled.div`
  margin-top: ${({ theme }) => theme.spacing[6]};
`;

const OptionsGrid = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing[4]};
`;

const ChoiceButton = styled(motion.button)<{ 
  $isSelected?: boolean; 
  $isLoading?: boolean;
}>`
  position: relative;
  background: ${({ theme }) => theme.colors.background.primary};
  border: 2px solid ${({ theme, $isSelected }) => 
    $isSelected ? theme.colors.primary[500] : theme.colors.border.medium};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  padding: ${({ theme }) => theme.spacing[6]};
  text-align: left;
  cursor: ${({ disabled }) => (disabled ? 'not-allowed' : 'pointer')};
  transition: all 0.3s ease;
  overflow: hidden;

  &:hover:not(:disabled) {
    border-color: ${({ theme }) => theme.colors.primary[500]};
    box-shadow: ${({ theme }) => theme.shadows.md};
    
    .arrow {
      transform: translateX(4px);
    }
  }

  &:disabled {
    opacity: 0.6;
    background: ${({ theme }) => theme.colors.background.secondary};
  }

  ${({ $isLoading }) => $isLoading && `
    pointer-events: none;
  `}

  @media (max-width: 768px) {
    padding: ${({ theme }) => theme.spacing[4]};
  }
`;

const ButtonContent = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[4]};

  .arrow {
    margin-left: auto;
    color: ${({ theme }) => theme.colors.text.secondary};
    transition: transform 0.2s ease;
  }
`;

const ChoiceNumber = styled.span`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  background: linear-gradient(135deg, ${({ theme }) => theme.colors.primary[500]} 0%, ${({ theme }) => theme.colors.secondary[500]} 100%);
  color: white;
  border-radius: 50%;
  font-weight: 700;
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  flex-shrink: 0;
`;

const ChoiceText = styled.span`
  flex: 1;
  font-size: ${({ theme }) => theme.typography.fontSize.base};
  color: ${({ theme }) => theme.colors.text.primary};
  line-height: 1.6;

  @media (max-width: 768px) {
    font-size: ${({ theme }) => theme.typography.fontSize.sm};
  }
`;

const EffectPreview = styled.div<{ $type: string }>`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[2]};
  margin-top: ${({ theme }) => theme.spacing[3]};
  margin-left: 48px;
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  
  color: ${({ theme, $type }) => {
    if ($type === 'positive') return theme.colors.success;
    if ($type === 'negative') return theme.colors.error;
    return theme.colors.text.secondary;
  }};

  svg {
    flex-shrink: 0;
  }
`;

const LoadingOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.9);
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Spinner = styled.div`
  width: 24px;
  height: 24px;
  border: 3px solid ${({ theme }) => theme.colors.border.light};
  border-top-color: ${({ theme }) => theme.colors.primary[500]};
  border-radius: 50%;
  animation: spin 0.8s linear infinite;

  @keyframes spin {
    to { transform: rotate(360deg); }
  }
`;

const EmptyState = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: ${({ theme }) => theme.spacing[3]};
  padding: ${({ theme }) => theme.spacing[8]};
  background: ${({ theme }) => theme.colors.background.secondary};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  color: ${({ theme }) => theme.colors.text.secondary};
`;

const DisabledMessage = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: ${({ theme }) => theme.spacing[2]};
  margin-top: ${({ theme }) => theme.spacing[4]};
  padding: ${({ theme }) => theme.spacing[3]};
  background: ${({ theme }) => theme.colors.background.secondary};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
`;

export default ChoiceButtons;