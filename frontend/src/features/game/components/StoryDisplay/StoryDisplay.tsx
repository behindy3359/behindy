"use client";

import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { BookOpen, FastForward } from 'lucide-react';
import { useTypingEffect } from '../../hooks/useTypingEffect';
import { GamePage } from '../../types/gameTypes';

interface StoryDisplayProps {
  page: GamePage | null;
  storyTitle?: string;
  isLoading?: boolean;
  typingSpeed?: number;
  onTypingComplete?: () => void;
}

export const StoryDisplay: React.FC<StoryDisplayProps> = ({
  page,
  storyTitle,
  isLoading = false,
  typingSpeed = 30,
  onTypingComplete
}) => {
  const {
    displayedText,
    isTyping,
    isComplete,
    skipTyping
  } = useTypingEffect(page?.content || '', {
    speed: typingSpeed,
    onComplete: onTypingComplete,
    enabled: !isLoading
  });

  if (isLoading) {
    return (
      <Container>
        <LoadingState>
          <BookOpen className="loading-icon" />
          <p>스토리를 불러오는 중...</p>
        </LoadingState>
      </Container>
    );
  }

  if (!page) {
    return (
      <Container>
        <EmptyState>
          <BookOpen className="empty-icon" />
          <p>표시할 스토리가 없습니다</p>
        </EmptyState>
      </Container>
    );
  }

  return (
    <Container
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {storyTitle && (
        <StoryHeader>
          <StoryTitle>{storyTitle}</StoryTitle>
          <PageIndicator>
            {page.pageNumber} / {page.totalPages || '?'}
          </PageIndicator>
        </StoryHeader>
      )}

      <StoryContent>
        <StoryText>
          {displayedText}
          {isTyping && <Cursor />}
        </StoryText>

        {isTyping && (
          <SkipButton
            onClick={skipTyping}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <FastForward size={16} />
            <span>스킵</span>
          </SkipButton>
        )}
      </StoryContent>

      {page.isLastPage && isComplete && (
        <LastPageIndicator
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          - 마지막 페이지 -
        </LastPageIndicator>
      )}
    </Container>
  );
};

// 🔥 CSS 변수 기반 Styled Components
const Container = styled(motion.div)`
  background: var(--bg-primary);
  border-radius: ${({ theme }) => theme.borderRadius.xl};
  border: 1px solid var(--border-light);
  padding: ${({ theme }) => theme.spacing[8]};
  margin-bottom: ${({ theme }) => theme.spacing[6]};
  box-shadow: var(--shadow-card);
  position: relative;
  min-height: 300px;

  @media (max-width: 768px) {
    padding: ${({ theme }) => theme.spacing[6]};
    min-height: 250px;
  }
`;

const StoryHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${({ theme }) => theme.spacing[6]};
  padding-bottom: ${({ theme }) => theme.spacing[4]};
  border-bottom: 1px solid var(--border-light);
`;

const StoryTitle = styled.h2`
  font-size: ${({ theme }) => theme.typography.fontSize.xl};
  font-weight: 700;
  color: var(--text-primary);
  margin: 0;
`;

const PageIndicator = styled.span`
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  color: var(--text-secondary);
  background: var(--bg-secondary);
  padding: ${({ theme }) => theme.spacing[2]} ${({ theme }) => theme.spacing[3]};
  border-radius: ${({ theme }) => theme.borderRadius.md};
`;

const StoryContent = styled.div`
  position: relative;
`;

const StoryText = styled.p`
  font-size: ${({ theme }) => theme.typography.fontSize.base};
  line-height: 1.8;
  color: var(--text-primary);
  white-space: pre-wrap;
  word-break: keep-all;
  margin: 0;
  min-height: 150px;

  @media (max-width: 768px) {
    font-size: ${({ theme }) => theme.typography.fontSize.sm};
    line-height: 1.7;
    min-height: 120px;
  }
`;

const Cursor = styled.span`
  display: inline-block;
  width: 2px;
  height: 1.2em;
  background: var(--primary-500);
  margin-left: 2px;
  animation: blink 1s infinite;

  @keyframes blink {
    0%, 49% { opacity: 1; }
    50%, 100% { opacity: 0; }
  }
`;

const SkipButton = styled(motion.button)`
  position: absolute;
  top: 0;
  right: 0;
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[1]};
  padding: ${({ theme }) => theme.spacing[2]} ${({ theme }) => theme.spacing[3]};
  background: var(--bg-secondary);
  border: 1px solid var(--border-medium);
  border-radius: ${({ theme }) => theme.borderRadius.md};
  color: var(--text-secondary);
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: var(--bg-tertiary);
    color: var(--text-primary);
  }
`;

const LastPageIndicator = styled(motion.div)`
  text-align: center;
  margin-top: ${({ theme }) => theme.spacing[6]};
  padding-top: ${({ theme }) => theme.spacing[4]};
  border-top: 1px solid var(--border-light);
  color: var(--text-secondary);
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  font-style: italic;
`;

const LoadingState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 300px;
  color: var(--text-secondary);

  .loading-icon {
    width: 48px;
    height: 48px;
    margin-bottom: ${({ theme }) => theme.spacing[4]};
    animation: pulse 2s infinite;
  }

  @keyframes pulse {
    0%, 100% { opacity: 0.5; }
    50% { opacity: 1; }
  }
`;

const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 300px;
  color: var(--text-tertiary);

  .empty-icon {
    width: 48px;
    height: 48px;
    margin-bottom: ${({ theme }) => theme.spacing[4]};
  }
`;

export default StoryDisplay;