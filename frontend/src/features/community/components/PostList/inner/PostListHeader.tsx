import React from 'react';
import { MessageSquare } from 'lucide-react';
import { HeaderActions, Title, Subtitle } from '../styles';
import type { PostListHeaderProps } from '../../../types/postListTypes';

export const PostListHeader = React.memo<PostListHeaderProps>(
  function PostListHeader() {
    return (
      <HeaderActions>
        <Title>
          <MessageSquare size={32} />
          커뮤니티
        </Title>
        <Subtitle>
          흥미로운 이야기들을 공유해보세요
        </Subtitle>
      </HeaderActions>
    );
  }
);