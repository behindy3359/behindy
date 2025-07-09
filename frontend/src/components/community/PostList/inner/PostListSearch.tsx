import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Search, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button/Button';
import { Input } from '@/components/ui/input/Input';
import { getSearchPlaceholder } from '../utils';
import { ActionBar, SearchContainer } from '../styles';
import type { PostListSearchProps } from '../types';

export const PostListSearch = React.memo<PostListSearchProps>(
  function PostListSearch({ 
    searchQuery, 
    showSearch, 
    enableSearch, 
    onSearch, 
    onSearchQueryChange, 
    onToggleSearch 
  }) {
    return (
      <ActionBar>
        <SearchContainer>
          <AnimatePresence>
            {(showSearch || !enableSearch) && enableSearch && (
              <motion.form
                initial={{ width: 0, opacity: 0 }}
                animate={{ width: 'auto', opacity: 1 }}
                exit={{ width: 0, opacity: 0 }}
                onSubmit={onSearch}
                style={{ display: 'flex', gap: '8px' }}
              >
                <Input
                  placeholder={getSearchPlaceholder()}
                  value={searchQuery}
                  onChange={(e) => onSearchQueryChange(e.target.value)}
                  leftIcon={<Search />}
                  autoFocus
                />
              </motion.form>
            )}
          </AnimatePresence>
          
          {enableSearch && !showSearch && (
            <Button
              variant="ghost"
              onClick={onToggleSearch}
              leftIcon={<Search />}
            >
              검색
            </Button>
          )}
        </SearchContainer>
      </ActionBar>
    );
  }
);