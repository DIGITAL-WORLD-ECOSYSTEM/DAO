import type { SWRConfiguration } from 'swr';
import type { IPostItem } from 'src/types/blog';

import { useMemo } from 'react';
import useSWR, { mutate } from 'swr';

import axios, { fetcher, endpoints } from 'src/lib/axios';

// ----------------------------------------------------------------------

const swrOptions: SWRConfiguration = {
  revalidateIfStale: false,
  revalidateOnFocus: false,
  revalidateOnReconnect: false,
};

// ----------------------------------------------------------------------

type PostsData = {
  success: boolean;
  data: IPostItem[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    pages: number;
  };
};

export function useGetPosts() {
  const url = endpoints.post.list;

  const { data, isLoading, error, isValidating } = useSWR<PostsData>(url, fetcher, swrOptions);

  const memoizedValue = useMemo(
    () => ({
      posts: data?.data || [],
      postsLoading: isLoading,
      postsError: error,
      postsValidating: isValidating,
      postsEmpty: !isLoading && !data?.data.length,
      pagination: data?.pagination,
    }),
    [data?.data, data?.pagination, error, isLoading, isValidating]
  );

  return memoizedValue;
}

// ----------------------------------------------------------------------

type PostData = {
  success: boolean;
  data: IPostItem;
};

export function useGetPost(slug: string) {
  const url = slug ? `${endpoints.post.details}/${slug}` : '';

  const { data, isLoading, error, isValidating } = useSWR<PostData>(url, fetcher, swrOptions);

  const memoizedValue = useMemo(
    () => ({
      post: data?.data,
      postLoading: isLoading,
      postError: error,
      postValidating: isValidating,
    }),
    [data?.data, error, isLoading, isValidating]
  );

  return memoizedValue;
}

// ----------------------------------------------------------------------

export function useGetLatestPosts(limit: number = 4) {
  const url = [endpoints.post.list, { params: { limit, sortBy: 'latest', status: 'published' } }];

  const { data, isLoading, error, isValidating } = useSWR<PostsData>(url, fetcher, swrOptions);

  const memoizedValue = useMemo(
    () => ({
      latestPosts: data?.data || [],
      latestPostsLoading: isLoading,
      latestPostsError: error,
      latestPostsValidating: isValidating,
      latestPostsEmpty: !isLoading && !data?.data.length,
    }),
    [data?.data, error, isLoading, isValidating]
  );

  return memoizedValue;
}

// ----------------------------------------------------------------------

type SearchResultsData = {
  success: boolean;
  data: IPostItem[];
};

export function useSearchPosts(query: string) {
  const url = query ? [endpoints.post.search, { params: { q: query } }] : '';

  const { data, isLoading, error, isValidating } = useSWR<SearchResultsData>(url, fetcher, {
    ...swrOptions,
    keepPreviousData: true,
  });

  const memoizedValue = useMemo(
    () => ({
      searchResults: data?.data || [],
      searchLoading: isLoading,
      searchError: error,
      searchValidating: isValidating,
      searchEmpty: !isLoading && !isValidating && !data?.data.length,
    }),
    [data?.data, error, isLoading, isValidating]
  );

  return memoizedValue;
}

// ----------------------------------------------------------------------

export async function createPost(postData: any) {
  const res = await axios.post(endpoints.post.list, postData);
  mutate(endpoints.post.list);
  return res.data;
}

export async function updatePost(id: string, postData: any) {
  const url = `${endpoints.post.list}/${id}`;
  const res = await axios.put(url, postData);
  mutate(endpoints.post.list);
  mutate(url);
  return res.data;
}

export async function deletePost(id: string) {
  const url = `${endpoints.post.list}/${id}`;
  const res = await axios.delete(url);
  mutate(endpoints.post.list);
  return res.data;
}
