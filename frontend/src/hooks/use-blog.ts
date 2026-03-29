'use client';

import type { ISoFiItem } from 'src/types/blog';

import { useState, useCallback } from 'react';

// ----------------------------------------------------------------------

type ReturnType = {
  sofi: {
    all: ISoFiItem[];
    featured: ISoFiItem[];
    paginated: ISoFiItem[];
  };
  filters: {
    page: number;
    sortBy: string;
    search: {
      query: string;
      results: ISoFiItem[];
    };
  };
  methods: {
    onSortBy: (newValue: string) => void;
    onSearch: (event: React.ChangeEvent<HTMLInputElement>) => void;
    onChangePage: (event: unknown, newPage: number) => void;
  };
};

export function useBlog(sofi: ISoFiItem[]): ReturnType {
  const [sortBy, setSortBy] = useState('latest');
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');

  const onSortBy = useCallback((newValue: string) => {
    setSortBy(newValue);
  }, []);

  const onChangePage = useCallback((event: unknown, newPage: number) => {
    setPage(newPage);
  }, []);

  const onSearch = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    setPage(1);
    setSearchQuery(event.target.value);
  }, []);

  const filteredSoFis = applyFilter(sofi, sortBy, searchQuery);

  const searchResults = searchQuery ? filteredSoFis : [];
  const paginatedSoFis = applyPagination(filteredSoFis, page);

  return {
    sofi: {
      all: filteredSoFis,
      featured: sofi.filter((post) => post.featured),
      paginated: paginatedSoFis,
    },
    filters: {
      page,
      sortBy,
      search: {
        query: searchQuery,
        results: searchResults,
      },
    },
    methods: {
      onSortBy,
      onSearch,
      onChangePage,
    },
  };
}

// ----------------------------------------------------------------------

function applyFilter(sofi: ISoFiItem[], sortBy: string, searchQuery: string) {
  const newSoFis = sofi || [];
  // SORT
  if (sortBy === 'latest') {
    newSoFis.sort(
      (a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime()
    );
  }
  if (sortBy === 'oldest') {
    newSoFis.sort(
      (a, b) => new Date(a.createdAt || 0).getTime() - new Date(b.createdAt || 0).getTime()
    );
  }
  if (sortBy === 'popular') {
    newSoFis.sort((a, b) => b.totalViews - a.totalViews);
  }

  // SEARCH
  if (searchQuery) {
    return newSoFis.filter(
      (post) => post.title.toLowerCase().indexOf(searchQuery.toLowerCase()) !== -1
    );
  }

  return newSoFis;
}

// ----------------------------------------------------------------------

function applyPagination(sofi: ISoFiItem[], page: number) {
  const POSTS_PER_PAGE = 8;
  return sofi.slice((page - 1) * POSTS_PER_PAGE, page * POSTS_PER_PAGE);
}
