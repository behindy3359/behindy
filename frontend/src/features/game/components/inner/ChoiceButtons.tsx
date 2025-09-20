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
  allowEffectToggle?: boolean;
}

export const ChoiceButtons: React.FC<ChoiceButtonsProps> = ({
  options,
  onChoice,
  disabled = false,
  isLoading = false,
  showEffectPreview = false,
}) => {
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [showEffects, setShowEffects] = useState(showEffectPreview);
  const [selectedChoice, setSelectedChoice] = useState<number | null>(null);

  const handleChoice = (optionId: number) => {
    if (disabled || isLoading) return;
    
    setSelectedId(optionId);
    setSelectedChoice(optionId);
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

  // 효과를 보여줄지 결정하는 함수
  const shouldShowEffect = (optionId: number) => {
    // 1. 토글로 모든 효과 보기가 활성화된 경우
    if (showEffects) return true;
    
    // 2. 선택된 옵션이고 로딩 중인 경우 (선택 후 결과 표시)
    if (isLoading && selectedId === optionId) return true;
    
    return false;
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

              {/* 조건부 효과 표시 */}
              <AnimatePresence>
                {option.effectPreview && shouldShowEffect(option.optionId) && (
                  <EffectPreview 
                    as={motion.div}
                    $type={getEffectColor(option.effect, option.amount)}
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    {getEffectIcon(option.effect)}
                    <span>{option.effectPreview}</span>
                  </EffectPreview>
                )}
              </AnimatePresence>

              {/* 로딩 오버레이 */}
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
  background: ${({ $isSelected }) => $isSelected ? 'var(--bg-tertiary)' : 'var(--bg-primary)'};
  border: 2px solid ${({ $isSelected }) => $isSelected ? 'var(--primary-500)' : 'var(--border-medium)'};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  padding: ${({ theme }) => theme.spacing[6]};
  text-align: left;
  cursor: ${({ disabled }) => (disabled ? 'not-allowed' : 'pointer')};
  transition: all 0.3s ease;
  overflow: hidden;
  box-shadow: var(--shadow-card);

  &:hover:not(:disabled) {
    border-color: var(--primary-500);
    background: var(--bg-secondary);
    box-shadow: var(--shadow-lg);
    
    .arrow {
      transform: translateX(4px);
    }
  }

  &:disabled {
    opacity: 0.6;
    background: var(--bg-secondary);
  }

  ${({ $isLoading }) => $isLoading && `pointer-events: none;`}

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
    color: var(--text-secondary);
    transition: transform 0.2s ease;
  }
`;

const ChoiceNumber = styled.span`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  background: linear-gradient(135deg, var(--primary-500) 0%, var(--secondary-500) 100%);
  color: var(--text-inverse);
  border-radius: 50%;
  font-weight: 700;
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  flex-shrink: 0;
`;

const ChoiceText = styled.span`
  flex: 1;
  font-size: ${({ theme }) => theme.typography.fontSize.base};
  color: var(--text-primary);
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
  color: ${({ $type }) => {
    if ($type === 'positive') return 'var(--game-success)';
    if ($type === 'negative') return 'var(--game-danger)';
    return 'var(--text-secondary)';
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
  backdrop-filter: blur(2px);
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Spinner = styled.div`
  width: 24px;
  height: 24px;
  border: 3px solid var(--border-medium);
  border-top-color: var(--primary-500);
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
  background: var(--bg-secondary);
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  color: var(--text-secondary);
`;

const DisabledMessage = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: ${({ theme }) => theme.spacing[2]};
  margin-top: ${({ theme }) => theme.spacing[4]};
  padding: ${({ theme }) => theme.spacing[3]};
  background: var(--bg-secondary);
  border-radius: ${({ theme }) => theme.borderRadius.md};
  color: var(--text-secondary);
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
`;