'use client';

import type { SWRConfiguration } from 'swr';

import { useMemo } from 'react';
import useSWR, { mutate } from 'swr';

import axios, { fetcher, endpoints } from 'src/lib/axios';

import { mapToPostItem, mapToPostList, mapToCommentList } from './mappers/blog-mapper';

// ----------------------------------------------------------------------

const swrOptions: SWRConfiguration = {
  revalidateIfStale: false,
  revalidateOnFocus: false,
  revalidateOnReconnect: false,
};

// ----------------------------------------------------------------------

type PostsData = {
  success: boolean;
  data: any[];
  pagination?: {
    total: number;
    page: number;
    limit: number;
    pages: number;
  };
};

export function useGetPosts(params?: { category?: string; publish?: string; sortBy?: string; page?: number; limit?: number }) {
  const query = new URLSearchParams();
  if (params?.category) query.append('category', params.category);
  if (params?.publish) query.append('publish', params.publish);
  if (params?.sortBy) query.append('sortBy', params.sortBy);
  if (params?.page) query.append('page', String(params.page));
  if (params?.limit) query.append('limit', String(params.limit));

  const url = `${endpoints.post.root}${query.toString() ? `?${query.toString()}` : ''}`;

  const { data, isLoading, error, isValidating } = useSWR<PostsData>(url, fetcher, swrOptions);

  const posts = useMemo(() => mapToPostList(data?.data || []), [data?.data]);

  return {
    posts,
    postsLoading: isLoading,
    postsError: error,
    postsValidating: isValidating,
    postsEmpty: !isLoading && !posts.length,
    pagination: data?.pagination,
  };
}

// ----------------------------------------------------------------------

/**
 * Busca posts por categoria específica (Ex: DEX, Análise)
 */
export function useGetPostsByCategory(category: string) {
  const url = category ? [endpoints.post.list, { params: { category } }] : '';

  const { data, isLoading, error, isValidating } = useSWR<PostsData>(url, fetcher, swrOptions);

  const posts = useMemo(() => mapToPostList(data?.data || []), [data?.data]);

  const memoizedValue = useMemo(
    () => ({
      posts,
      postsLoading: isLoading,
      postsError: error,
      postsValidating: isValidating,
      postsEmpty: !isLoading && !posts.length,
    }),
    [posts, error, isLoading, isValidating]
  );

  return memoizedValue;
}

// ----------------------------------------------------------------------

type PostData = {
  success: boolean;
  data: any;
};

export function useGetPost(slug: string) {
  const url = slug ? endpoints.post.details(slug) : '';

  const { data, isLoading, error, isValidating } = useSWR<PostData>(url, fetcher, swrOptions);

  const post = useMemo(() => (data?.data ? mapToPostItem(data.data) : undefined), [data?.data]);

  const memoizedValue = useMemo(
    () => ({
      post,
      postLoading: isLoading,
      postError: error,
      postValidating: isValidating,
    }),
    [post, error, isLoading, isValidating]
  );

  return memoizedValue;
}

// ----------------------------------------------------------------------

/**
 * Busca posts relacionados (simplificado)
 */
export function useGetLatestPosts(slug: string) {
  const url = endpoints.post.list;

  const { data, isLoading, error, isValidating } = useSWR<PostsData>(url, fetcher, swrOptions);

  const posts = useMemo(() => mapToPostList(data?.data || []), [data?.data]);

  const latestPosts = useMemo(
    () => posts.filter((p) => p.slug !== slug).slice(0, 4),
    [posts, slug]
  );

  const memoizedValue = useMemo(
    () => ({
      latestPosts,
      latestPostsLoading: isLoading,
      latestPostsError: error,
      latestPostsValidating: isValidating,
      latestPostsEmpty: !isLoading && !latestPosts.length,
    }),
    [latestPosts, error, isLoading, isValidating]
  );

  return memoizedValue;
}

// ----------------------------------------------------------------------

/**
 * BUSCA SEMÂNTICA / PESQUISA
 */
export function useSearchPosts(query: string) {
  const url = query ? [endpoints.post.search, { params: { q: query } }] : '';

  const { data, isLoading, error, isValidating } = useSWR<PostsData>(url, fetcher, {
    ...swrOptions,
    keepPreviousData: true,
  });

  const searchResults = useMemo(() => mapToPostList(data?.data || []), [data?.data]);

  const memoizedValue = useMemo(
    () => ({
      searchResults,
      searchLoading: isLoading,
      searchError: error,
      searchValidating: isValidating,
      searchEmpty: !isLoading && !isValidating && !searchResults.length,
    }),
    [searchResults, error, isLoading, isValidating]
  );

  return memoizedValue;
}

// ----------------------------------------------------------------------
// MUTAÇÕES (DASHBOARD)
// ----------------------------------------------------------------------

export async function createPost(postData: any) {
  const res = await axios.post(endpoints.post.list, postData);
  mutate(endpoints.post.list);
  return res.data;
}

export async function updatePost(id: string, postData: any) {
  const res = await axios.put(`${endpoints.post.list}/${id}`, postData);
  mutate(endpoints.post.list);
  if (postData.slug) mutate(endpoints.post.details(postData.slug));
  return res.data;
}

export async function deletePost(id: string) {
  const res = await axios.delete(`${endpoints.post.list}/${id}`);
  mutate(endpoints.post.list);
  return res.data;
}

// ----------------------------------------------------------------------

export function useGetPostComments(postId: string) {
  const url = postId ? `${endpoints.post.root}/${postId}/comments` : null;

  const { data, isLoading, error, isValidating } = useSWR<{ success: boolean; data: any[] }>(url, fetcher);

  const comments = useMemo(() => mapToCommentList(data?.data || []), [data?.data]);

  const memoizedValue = useMemo(
    () => ({
      comments,
      commentsLoading: isLoading,
      commentsError: error,
      commentsValidating: isValidating,
      commentsEmpty: !isLoading && !data?.data?.length,
    }),
    [data, error, isLoading, isValidating]
  );

  return memoizedValue;
}

export async function addComment(postId: string, commentData: { content: string }) {
  const url = `${endpoints.post.root}/${postId}/comments`;

  const res = await axios.post(url, commentData);

  mutate(`${endpoints.post.root}/${postId}/comments`);

  return res.data;
}
export async function favoritePost(postId: string) {
  const url = `${endpoints.post.root}/${postId}/favorite`;
  const res = await axios.post(url);
  // Revalidar o post para atualizar o contador de favoritos
  mutate((key) => typeof key === 'string' && key.includes(`${endpoints.post.root}/`), undefined, { revalidate: true });
  return res.data;
}

type BlogStatsData = {
  success: boolean;
  data: {
    all: number;
    published: number;
    draft: number;
  };
};

export function useGetBlogStats() {
  const url = `${endpoints.post.root}/stats`;
  const { data, isLoading, error, isValidating } = useSWR<BlogStatsData>(url, fetcher, swrOptions);

  return {
    stats: data?.data || { all: 0, published: 0, draft: 0 },
    statsLoading: isLoading,
    statsError: error,
    statsValidating: isValidating,
  };
}
