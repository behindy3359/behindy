import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { Trophy, Home, RotateCcw } from 'lucide-react';
import { Button } from '@/shared/components/ui/button/Button';

interface GameEndingPageProps {
  completionType: 'success' | 'death';
  storyTitle: string;
  finalMessage?: string;
  onViewResults: () => void;
  onBackToHome: () => void;
  onPlayAgain?: () => void;
}

export const GameEndingPage: React.FC<GameEndingPageProps> = ({
  completionType,
  storyTitle,
  finalMessage,
  onViewResults,
  onBackToHome,
  onPlayAgain,
}) => {
  const [isTyping, setIsTyping] = useState(true);
  const [displayedText, setDisplayedText] = useState('');

  const getDefaultMessage = () => {
    if (completionType === 'success') {
      return '어둠이 물러가고 출구가 드러납니다.\n\n당신은 무사히 이 이야기를 마쳤습니다.';
    } else {
      return '어둠이 당신을 집어삼킵니다.\n\n당신의 이야기는 여기서 끝났습니다.';
    }
  };

  const message = finalMessage || getDefaultMessage();

  // 타이핑 효과
  useEffect(() => {
    let currentIndex = 0;
    setDisplayedText('');

    const typingInterval = setInterval(() => {
      if (currentIndex < message.length) {
        setDisplayedText(message.substring(0, currentIndex + 1));
        currentIndex++;
      } else {
        setIsTyping(false);
        clearInterval(typingInterval);
      }
    }, 30);

    return () => clearInterval(typingInterval);
  }, [message]);

  return (
    <Container
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <StorySection>
        <StoryTitle
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          {storyTitle}
        </StoryTitle>

        <MessageContainer
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <MessageText $completionType={completionType}>
            {displayedText}
            {isTyping && <Cursor>|</Cursor>}
          </MessageText>
        </MessageContainer>
      </StorySection>

      <ActionButtons
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: isTyping ? 0 : 1, y: isTyping ? 20 : 0 }}
        transition={{ delay: 0.6 }}
      >
        <Button
          onClick={onViewResults}
          leftIcon={<Trophy size={18} />}
          size="lg"
          disabled={isTyping}
        >
          결과 확인하기
        </Button>

        <SecondaryActions>
          {onPlayAgain && (
            <Button
              variant="outline"
              onClick={onPlayAgain}
              leftIcon={<RotateCcw size={18} />}
              disabled={isTyping}
            >
              다시 도전하기
            </Button>
          )}
          <Button
            variant="ghost"
            onClick={onBackToHome}
            leftIcon={<Home size={18} />}
            disabled={isTyping}
          >
            홈으로 돌아가기
          </Button>
        </SecondaryActions>
      </ActionButtons>
    </Container>
  );
};

// Styled Components
const Container = styled(motion.div)`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing[8]};
  min-height: 500px;
  padding: ${({ theme }) => theme.spacing[6]};

  @media (max-width: 768px) {
    padding: ${({ theme }) => theme.spacing[4]};
    min-height: 400px;
  }
`;

const StorySection = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing[6]};
  background: var(--bg-secondary);
  border-radius: ${({ theme }) => theme.borderRadius.xl};
  padding: ${({ theme }) => theme.spacing[8]};
  box-shadow: var(--shadow-card);
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: linear-gradient(
      90deg,
      var(--primary-500),
      var(--secondary-500)
    );
  }

  @media (max-width: 768px) {
    padding: ${({ theme }) => theme.spacing[6]};
  }
`;

const StoryTitle = styled(motion.h2)`
  font-size: ${({ theme }) => theme.typography.fontSize['2xl']};
  font-weight: 700;
  color: var(--text-primary);
  text-align: center;
  padding-bottom: ${({ theme }) => theme.spacing[4]};
  border-bottom: 2px solid var(--border-light);

  @media (max-width: 768px) {
    font-size: ${({ theme }) => theme.typography.fontSize.xl};
  }
`;

const MessageContainer = styled(motion.div)`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: ${({ theme }) => theme.spacing[8]} ${({ theme }) => theme.spacing[4]};
`;

const MessageText = styled.div<{ $completionType: 'success' | 'death' }>`
  font-size: ${({ theme }) => theme.typography.fontSize.xl};
  line-height: 1.8;
  color: ${({ $completionType }) =>
    $completionType === 'success'
      ? 'var(--game-success)'
      : 'var(--game-danger)'};
  text-align: center;
  white-space: pre-line;
  font-weight: 600;

  @media (max-width: 768px) {
    font-size: ${({ theme }) => theme.typography.fontSize.lg};
  }
`;

const Cursor = styled.span`
  animation: blink 1s step-end infinite;
  margin-left: 2px;

  @keyframes blink {
    0%,
    100% {
      opacity: 1;
    }
    50% {
      opacity: 0;
    }
  }
`;

const ActionButtons = styled(motion.div)`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing[4]};
  align-items: center;
`;

const SecondaryActions = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing[3]};
  flex-wrap: wrap;
  justify-content: center;

  @media (max-width: 768px) {
    flex-direction: column;
    width: 100%;
  }
`;
