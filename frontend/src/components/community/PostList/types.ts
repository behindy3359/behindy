import { Post } from '@/types/community/community';

export interface PostListProps {
  initialPage?: number;
  pageSize?: number;
  enableSearch?: boolean;
  viewMode?: 'grid' | 'list';
}

export interface PostListState {
  currentPage: number;
  searchQuery: string;
  showSearch: boolean;
  sortBy: string;
  viewMode: 'grid' | 'list';
}

export interface UsePostListReturn {
  postsData: any;
  isLoading: boolean;
  error: any;
  
  state: PostListState;
  
  handlePostClick: (postId: number) => void;
  handleWritePost: () => void;
  handleSearch: (e: React.FormEvent) => void;
  handleSortChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  handleViewModeChange: (mode: 'grid' | 'list') => void;
  handlePageChange: (page: number) => void;
  setSearchQuery: (query: string) => void;
  setShowSearch: (show: boolean) => void;
}

export interface PostListHeaderProps {
  onWritePost: () => void;
}

export interface PostListSearchProps {
  searchQuery: string;
  showSearch: boolean;
  enableSearch: boolean;
  onSearch: (e: React.FormEvent) => void;
  onSearchQueryChange: (query: string) => void;
  onToggleSearch: () => void;
}

export interface PostListFiltersProps {
  sortBy: string;
  viewMode: 'grid' | 'list';
  totalElements: number;
  onSortChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  onViewModeChange: (mode: 'grid' | 'list') => void;
}

export interface PostListContentProps {
  posts: Post[];
  viewMode: 'grid' | 'list';
  isLoading: boolean;
  error: any;
  onPostClick: (postId: number) => void;
  onWritePost: () => void;
}

export interface PostListPaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export interface PostListStatsProps {
  totalPosts: number;
  todayPosts: number;
  totalComments: number;
  activeUsers: number;
}