import React from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button/Button';
import { PostListSearch } from './PostListSearch';
import { HeaderRight } from '../styles';
import type { PostListSearchProps } from '../types';

interface PostListActionBarProps extends PostListSearchProps {
  onWritePost: () => void;
}

export const PostListActionBar = React.memo<PostListActionBarProps>(
  function PostListActionBar({ 
    searchQuery,
    showSearch,
    enableSearch,
    onSearch,
    onSearchQueryChange,
    onToggleSearch,
    onWritePost 
  }) {
    return (
      <HeaderRight>
        <PostListSearch
          searchQuery={searchQuery}
          showSearch={showSearch}
          enableSearch={enableSearch}
          onSearch={onSearch}
          onSearchQueryChange={onSearchQueryChange}
          onToggleSearch={onToggleSearch}
        />
        
        <Button
          variant="primary"
          onClick={onWritePost}
          leftIcon={<Plus />}
        >
          글쓰기
        </Button>
      </HeaderRight>
    );
  }
);