import React from 'react';
import { MessageSquare } from 'lucide-react';
import { HeaderLeft, Title, Subtitle } from '../styles';
import type { PostListHeaderProps } from '../types';

export const PostListHeader = React.memo<PostListHeaderProps>(
  function PostListHeader({ onWritePost }) {
    return (
      <HeaderLeft>
        <Title>
          <MessageSquare size={32} />
          커뮤니티
        </Title>
        <Subtitle>
          흥미로운 이야기들을 공유해보세요
        </Subtitle>
      </HeaderLeft>
    );
  }
);