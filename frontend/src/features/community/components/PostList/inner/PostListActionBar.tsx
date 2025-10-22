import React from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/shared/components/ui/button/Button';
import { PostListSearch } from './PostListSearch';
import { HeaderActions } from '../styles';
import type { PostListSearchProps } from '../../../types/postListTypes';

interface PostListActionBarProps extends PostListSearchProps {
  onWritePost: () => void;
}

export const PostListActionBar = React.memo<PostListActionBarProps>(
  function PostListActionBar({
    onWritePost 
  }) {
    return (
      <HeaderActions>
        <Button
          variant="primary"
          onClick={onWritePost}
          leftIcon={<Plus />}
        >
          글쓰기
        </Button>
      </HeaderActions>
    );
  }
);