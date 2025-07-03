import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

interface CommunityState {
  // UI 상태
  currentPage: number;
  searchQuery: string;
  selectedCategory: string;
  sortBy: 'latest' | 'popular' | 'comments';
  
  // 필터 상태
  showOnlyMyPosts: boolean;
  showOnlyUnanswered: boolean;
  
  // 임시 저장 (글 작성 중)
  draftPost: {
    title: string;
    content: string;
    lastSaved: number | null;
  };
}

interface CommunityActions {
  // 페이지네이션
  setCurrentPage: (page: number) => void;
  
  // 검색 및 필터
  setSearchQuery: (query: string) => void;
  setSelectedCategory: (category: string) => void;
  setSortBy: (sort: CommunityState['sortBy']) => void;
  setShowOnlyMyPosts: (show: boolean) => void;
  setShowOnlyUnanswered: (show: boolean) => void;
  
  // 임시 저장
  saveDraft: (title: string, content: string) => void;
  clearDraft: () => void;
  
  // 초기화
  reset: () => void;
}

const initialState: CommunityState = {
  currentPage: 0,
  searchQuery: '',
  selectedCategory: 'all',
  sortBy: 'latest',
  showOnlyMyPosts: false,
  showOnlyUnanswered: false,
  draftPost: {
    title: '',
    content: '',
    lastSaved: null,
  },
};

export const useCommunityStore = create<CommunityState & CommunityActions>()(
  devtools(
    (set, get) => ({
      ...initialState,

      setCurrentPage: (page) => set({ currentPage: page }),
      setSearchQuery: (query) => set({ searchQuery: query, currentPage: 0 }),
      setSelectedCategory: (category) => set({ selectedCategory: category, currentPage: 0 }),
      setSortBy: (sort) => set({ sortBy: sort, currentPage: 0 }),
      setShowOnlyMyPosts: (show) => set({ showOnlyMyPosts: show, currentPage: 0 }),
      setShowOnlyUnanswered: (show) => set({ showOnlyUnanswered: show, currentPage: 0 }),
      
      saveDraft: (title, content) => set({
        draftPost: {
          title,
          content,
          lastSaved: Date.now(),
        },
      }),
      
      clearDraft: () => set({
        draftPost: {
          title: '',
          content: '',
          lastSaved: null,
        },
      }),
      
      reset: () => set(initialState),
    }),
    { name: 'community-store' }
  )
);