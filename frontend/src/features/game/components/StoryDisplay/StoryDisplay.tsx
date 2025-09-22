"use client";

import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { BookOpen, FastForward } from 'lucide-react';
import { useTypingEffect } from '../../hooks/useTypingEffect';
import { GamePage } from '../../types/gameTypes';
import {
  Container,
  LoadingState,
  EmptyState,
  StoryHeader,
  StoryContent,
  StoryText,
  StoryTitle,
  PageIndicator,
  SkipButton,
  Cursor,
  LastPageIndicator
} from '@/features/game/styles/gameStyles';

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
      // initial={{ opacity: 0, y: 20 }}
      // animate={{ opacity: 1, y: 0 }}
      // transition={{ duration: 0.5 }}
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

export default StoryDisplay;