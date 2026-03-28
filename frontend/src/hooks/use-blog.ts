'use client';

import type { IPostItem } from 'src/types/blog';

import { useState, useCallback } from 'react';

// ----------------------------------------------------------------------

type ReturnType = {
  posts: {
    all: IPostItem[];
    featured: IPostItem[];
    paginated: IPostItem[];
  };
  filters: {
    page: number;
    sortBy: string;
    search: {
      query: string;
      results: IPostItem[];
    };
  };
  methods: {
    onSortBy: (newValue: string) => void;
    onSearch: (event: React.ChangeEvent<HTMLInputElement>) => void;
    onChangePage: (event: unknown, newPage: number) => void;
  };
};

export function useBlog(posts: IPostItem[]): ReturnType {
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

  const filteredPosts = applyFilter(posts, sortBy, searchQuery);

  const searchResults = searchQuery ? filteredPosts : [];
  const paginatedPosts = applyPagination(filteredPosts, page);

  return {
    posts: {
      all: filteredPosts,
      featured: posts.filter((post) => post.featured),
      paginated: paginatedPosts,
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

function applyFilter(posts: IPostItem[], sortBy: string, searchQuery: string) {
  const newPosts = posts || [];
  // SORT
  if (sortBy === 'latest') {
    newPosts.sort(
      (a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime()
    );
  }
  if (sortBy === 'oldest') {
    newPosts.sort(
      (a, b) => new Date(a.createdAt || 0).getTime() - new Date(b.createdAt || 0).getTime()
    );
  }
  if (sortBy === 'popular') {
    newPosts.sort((a, b) => b.totalViews - a.totalViews);
  }

  // SEARCH
  if (searchQuery) {
    return newPosts.filter(
      (post) => post.title.toLowerCase().indexOf(searchQuery.toLowerCase()) !== -1
    );
  }

  return newPosts;
}

// ----------------------------------------------------------------------

function applyPagination(posts: IPostItem[], page: number) {
  const POSTS_PER_PAGE = 8;
  return posts.slice((page - 1) * POSTS_PER_PAGE, page * POSTS_PER_PAGE);
}
