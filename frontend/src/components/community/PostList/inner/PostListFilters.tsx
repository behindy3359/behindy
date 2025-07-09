import React from 'react';
import { SlidersHorizontal, Grid, List } from 'lucide-react';
import { getSortOptions, formatPostCount, getViewModeLabel } from '../utils';
import { FilterBar, FilterLeft, FilterRight, ViewToggle, ViewButton, SortSelect } from '../styles';
import type { PostListFiltersProps } from '../types';

export const PostListFilters = React.memo<PostListFiltersProps>(
  function PostListFilters({ 
    sortBy, 
    viewMode, 
    totalElements, 
    onSortChange, 
    onViewModeChange 
  }) {
    const sortOptions = getSortOptions();

    return (
      <FilterBar>
        <FilterLeft>
          <div className="filter-title">
            <SlidersHorizontal size={16} />
            게시글 목록
          </div>
          <div className="post-count">
            총 {formatPostCount(totalElements)}개
          </div>
        </FilterLeft>

        <FilterRight>
          <ViewToggle>
            <ViewButton
              $active={viewMode === 'grid'}
              onClick={() => onViewModeChange('grid')}
            >
              <Grid size={16} />
              {getViewModeLabel('grid')}
            </ViewButton>
            <ViewButton
              $active={viewMode === 'list'}
              onClick={() => onViewModeChange('list')}
            >
              <List size={16} />
              {getViewModeLabel('list')}
            </ViewButton>
          </ViewToggle>

          <SortSelect value={sortBy} onChange={onSortChange}>
            {sortOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </SortSelect>
        </FilterRight>
      </FilterBar>
    );
  }
);
