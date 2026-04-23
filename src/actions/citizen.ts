'use client';

import { useMemo } from 'react';
import useSWR, { SWRConfiguration } from 'swr';

import { fetcher, endpoints } from 'src/lib/axios';

import type { ICitizenItem, IMembershipCard } from 'src/types/citizen';

// ----------------------------------------------------------------------

const swrOptions: SWRConfiguration = {
  revalidateIfStale: false,
  revalidateOnFocus: false,
  revalidateOnReconnect: false,
};

// ----------------------------------------------------------------------

type ProfileData = {
  success: boolean;
  data: ICitizenItem;
};

export function useGetCitizen(username: string) {
  const url = username ? endpoints.identity.profile(username) : '';

  const { data, isLoading, error, isValidating } = useSWR<ProfileData>(url, fetcher, swrOptions);

  const memoizedValue = useMemo(
    () => ({
      citizen: data?.data,
      citizenLoading: isLoading,
      citizenError: error,
      citizenValidating: isValidating,
    }),
    [data?.data, error, isLoading, isValidating]
  );

  return memoizedValue;
}

// ----------------------------------------------------------------------

type CardData = {
  success: boolean;
  data: {
    citizen: ICitizenItem;
    card: IMembershipCard;
  };
};

export function useGetMyMembershipCard() {
  const url = endpoints.identity.card;

  const { data, isLoading, error, isValidating } = useSWR<CardData>(url, fetcher, swrOptions);

  const memoizedValue = useMemo(
    () => ({
      cardInfo: data?.data,
      cardLoading: isLoading,
      cardError: error,
      cardValidating: isValidating,
    }),
    [data?.data, error, isLoading, isValidating]
  );

  return memoizedValue;
}

// ----------------------------------------------------------------------

type CitizenListData = {
  success: boolean;
  data: ICitizenItem[];
};

export function useGetCitizens() {
  const url = endpoints.identity.list;

  const { data, isLoading, error, isValidating } = useSWR<CitizenListData>(url, fetcher, swrOptions);

  const memoizedValue = useMemo(
    () => ({
      citizens: data?.data || [],
      citizensLoading: isLoading,
      citizensError: error,
      citizensValidating: isValidating,
      citizensEmpty: !isLoading && !data?.data?.length,
    }),
    [data?.data, error, isLoading, isValidating]
  );

  return memoizedValue;
}
