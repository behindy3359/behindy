import React from 'react';
import { MessageSquare } from 'lucide-react';
import { Title, Subtitle } from '../styles';

export const PostListHeader = React.memo(
  function PostListHeader() {
    return (
      <>
        <Title>
          <MessageSquare size={32} />
          커뮤니티
        </Title>
        {/* <Subtitle>
          흥미로운 이야기들을 공유해보세요
        </Subtitle> */}
      </>
    );
  }
);