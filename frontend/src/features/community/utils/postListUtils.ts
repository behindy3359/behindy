export const getViewModeIcon = (mode: 'grid' | 'list') => {
  return mode === 'grid' ? 'grid' : 'list';
};

export const getViewModeLabel = (mode: 'grid' | 'list') => {
  return mode === 'grid' ? '카드' : '목록';
};

export const formatPostCount = (count: number): string => {
  return count.toLocaleString();
};

export const createPageNumbers = (currentPage: number, totalPages: number, maxVisible: number = 5): number[] => {
  const startPage = Math.max(0, Math.min(
    totalPages - maxVisible,
    currentPage - Math.floor(maxVisible / 2)
  ));
  
  return Array.from(
    { length: Math.min(maxVisible, totalPages) }, 
    (_, i) => startPage + i
  );
};

export const shouldShowPagination = (totalPages: number): boolean => {
  return totalPages > 1;
};

export const getGridClassName = (viewMode: 'grid' | 'list'): string => {
  return viewMode === 'grid' 
    ? 'grid-template-columns: repeat(auto-fill, minmax(360px, 1fr));'
    : 'display: flex; flex-direction: column;';
};

export const getEmptyStateMessage = (searchQuery: string): {
  title: string;
  description: string;
} => {
  if (searchQuery.trim()) {
    return {
      title: `"${searchQuery}"에 대한 검색 결과가 없습니다`,
      description: '다른 키워드로 검색해보세요.'
    };
  }
  
  return {
    title: '아직 게시글이 없습니다',
    description: '지하철에서 경험한 흥미로운 이야기나 신기한 경험을\n첫 번째로 공유해보세요!'
  };
};

export const validateSearchQuery = (query: string): boolean => {
  return query.trim().length >= 1;
};

export const getSearchPlaceholder = (): string => {
  return '게시글 검색...';
};