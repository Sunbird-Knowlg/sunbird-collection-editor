import { create } from 'zustand';
import type { IContent } from '../types/content';
import type { LibraryFilters } from '../components/LibraryDock/LibraryFilterPanel';

interface LibraryState {
  allContent: IContent[];
  filteredContent: IContent[];
  searchQuery: string;
  activeFilter: string;
  advancedFilters: LibraryFilters;
  isLoading: boolean;
  totalCount: number;
  offset: number;
  sortAZ: boolean;
  // actions
  setContent: (content: IContent[], total: number) => void;
  appendContent: (content: IContent[], total: number) => void;
  setFilter: (filter: string) => void;
  setSearch: (query: string) => void;
  setLoading: (loading: boolean) => void;
  setAdvancedFilters: (filters: LibraryFilters) => void;
  setOffset: (offset: number) => void;
  setSortAZ: (sortAZ: boolean) => void;
  applyFilter: () => void;
}

export const useLibraryStore = create<LibraryState>((set, get) => ({
  allContent: [],
  filteredContent: [],
  searchQuery: '',
  activeFilter: 'all',
  advancedFilters: {},
  isLoading: false,
  totalCount: 0,
  offset: 0,
  sortAZ: false,

  setContent: (content, total) => {
    set({ allContent: content, totalCount: total, offset: content.length });
    get().applyFilter();
  },

  appendContent: (content, total) => {
    const current = get().allContent;
    const merged = [...current, ...content];
    set({ allContent: merged, totalCount: total, offset: merged.length });
    get().applyFilter();
  },

  setFilter: (filter) => {
    set({ activeFilter: filter });
    get().applyFilter();
  },

  setSearch: (query) => {
    set({ searchQuery: query });
    get().applyFilter();
  },

  setLoading: (loading) => set({ isLoading: loading }),

  setAdvancedFilters: (filters) => set({ advancedFilters: filters }),

  setOffset: (offset) => set({ offset }),

  setSortAZ: (sortAZ) => set({ sortAZ }),

  applyFilter: () => {
    const { allContent, activeFilter, searchQuery } = get();
    let filtered = allContent;

    if (activeFilter && activeFilter !== 'all') {
      const filterLower = activeFilter.toLowerCase();
      filtered = filtered.filter((item) => {
        const combined = [
          item.mimeType ?? '',
          item.primaryCategory ?? '',
          item.contentType ?? '',
        ]
          .join(' ')
          .toLowerCase();
        return combined.includes(filterLower);
      });
    }

    if (searchQuery && searchQuery.trim() !== '') {
      const queryLower = searchQuery.toLowerCase().trim();
      filtered = filtered.filter((item) =>
        (item.name ?? '').toLowerCase().includes(queryLower),
      );
    }

    set({ filteredContent: filtered });
  },
}));
