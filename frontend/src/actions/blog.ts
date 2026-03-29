'use client';

import type { SWRConfiguration } from 'swr';
import type { ISoFiItem } from 'src/types/blog';

import useSWR from 'swr';
import { useMemo } from 'react';

import { fetcher, endpoints } from 'src/lib/axios';

// ----------------------------------------------------------------------

const swrOptions: SWRConfiguration = {
  revalidateIfStale: false,
  revalidateOnFocus: false,
  revalidateOnReconnect: false,
};

// ----------------------------------------------------------------------

type SoFisData = {
  sofi: ISoFiItem[];
};

export function useGetSoFis() {
  const url = endpoints.post.list;

  const { data, isLoading, error, isValidating } = useSWR<SoFisData>(url, fetcher, swrOptions);

  const memoizedValue = useMemo(
    () => ({
      sofi: data?.sofi || [],
      sofiLoading: isLoading,
      sofiError: error,
      sofiValidating: isValidating,
      sofiEmpty: !isLoading && !data?.sofi?.length,
    }),
    [data?.sofi, error, isLoading, isValidating]
  );

  return memoizedValue;
}

// ----------------------------------------------------------------------

/**
 * Busca sofi por categoria específica (Ex: DEX, Análise)
 */
export function useGetSoFisByCategory(category: string) {
  const url = category ? [endpoints.post.list, { params: { category } }] : '';

  const { data, isLoading, error, isValidating } = useSWR<SoFisData>(url, fetcher, swrOptions);

  const memoizedValue = useMemo(
    () => ({
      sofi: data?.sofi || [],
      sofiLoading: isLoading,
      sofiError: error,
      sofiValidating: isValidating,
      sofiEmpty: !isLoading && !data?.sofi?.length,
    }),
    [data?.sofi, error, isLoading, isValidating]
  );

  return memoizedValue;
}

// ----------------------------------------------------------------------

type SoFiData = {
  post: ISoFiItem;
};

export function useGetSoFi(title: string) {
  // Ajustado para garantir que use a função de detalhes se disponível ou o params
  const url = title ? [endpoints.post.details(title), { params: { title } }] : '';

  const { data, isLoading, error, isValidating } = useSWR<SoFiData>(url, fetcher, swrOptions);

  const memoizedValue = useMemo(
    () => ({
      post: data?.post,
      postLoading: isLoading,
      postError: error,
      postValidating: isValidating,
    }),
    [data?.post, error, isLoading, isValidating]
  );

  return memoizedValue;
}

// ----------------------------------------------------------------------

type LatestSoFisData = {
  latestSoFis: ISoFiItem[];
};

export function useGetLatestSoFis(title: string) {
  // ✅ CORREÇÃO: Usando o endpoint 'list' com parâmetro 'latest' para evitar erro TS2339
  const url = title ? [endpoints.post.list, { params: { title, latest: true } }] : '';

  const { data, isLoading, error, isValidating } = useSWR<LatestSoFisData>(url, fetcher, swrOptions);

  const memoizedValue = useMemo(
    () => ({
      latestSoFis: data?.latestSoFis || [],
      latestSoFisLoading: isLoading,
      latestSoFisError: error,
      latestSoFisValidating: isValidating,
      latestSoFisEmpty: !isLoading && !data?.latestSoFis?.length,
    }),
    [data?.latestSoFis, error, isLoading, isValidating]
  );

  return memoizedValue;
}

// ----------------------------------------------------------------------

type SearchResultsData = {
  results: ISoFiItem[];
};

export function useSearchSoFis(query: string) {
  // ✅ CORREÇÃO: Usando o endpoint 'list' com parâmetro 'query' para busca
  const url = query ? [endpoints.post.list, { params: { query } }] : '';

  const { data, isLoading, error, isValidating } = useSWR<SearchResultsData>(url, fetcher, {
    ...swrOptions,
    keepPreviousData: true,
  });

  const memoizedValue = useMemo(
    () => ({
      searchResults: data?.results || [],
      searchLoading: isLoading,
      searchError: error,
      searchValidating: isValidating,
      searchEmpty: !isLoading && !isValidating && !data?.results?.length,
    }),
    [data?.results, error, isLoading, isValidating]
  );

  return memoizedValue;
}