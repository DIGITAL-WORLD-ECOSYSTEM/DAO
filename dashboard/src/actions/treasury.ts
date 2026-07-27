import useSWR from 'swr';
import { useMemo } from 'react';

import { fetcher, endpoints } from 'src/lib/axios';

export interface ITreasuryTransaction {
  id: string;
  tenant_id: string;
  version: number;
  created_at: string;
  updated_at: string;
  processed_at: string | null;
  amount: number;
  currency: string;
  base_currency: string;
  base_amount: number;
  exchange_rate: number;
  type: 'income' | 'expense' | 'transfer';
  direction: 'inbound' | 'outbound';
  category: string;
  tags: string[];
  payer_id: string;
  recipient_id: string;
  counterparty_name?: string; // Nome amigável para exibição
  origin_institution?: string; // Banco de Origem
  destination_institution?: string; // Banco de Destino
  payment_method: string;
  external_reference: string | null;
  status: 'pending' | 'confirmed' | 'failed' | 'canceled';
  reconciliation_status: 'matched' | 'unmatched' | 'manual_review';
  risk_score: {
    level: 'low' | 'medium' | 'high';
    score: number;
  };
  integrity_hash: string;
  documents: {
    id: string;
    type: string;
    verified: boolean;
  }[];
  ai_flags: {
    type: string;
    confidence: number;
  }[];
  source_channel: string;
  notes: string | null;
}

export interface ITreasuryAnalytics {
  summary: {
    totalInflow: number;
    avgTicket: number;
    count: number;
    topRecipient: string;
  };
  monthlyTrend: {
    month: string;
    total: number;
  }[];
  distribution: {
    label: string;
    value: number;
  }[];
  availableYears: string[];
  transactions: ITreasuryTransaction[];
}

export function useGetTreasuryAnalytics(year?: string) {
  const url = year
    ? `${endpoints.platform.treasury.analytics}?year=${year}`
    : endpoints.platform.treasury.analytics;

  const { data, isLoading, error, isValidating } = useSWR<{ data: ITreasuryAnalytics }>(
    url,
    fetcher
  );

  const memoizedValue = useMemo(
    () => ({
      analytics: data?.data || null,
      analyticsLoading: isLoading,
      analyticsError: error,
      analyticsValidating: isValidating,
      analyticsEmpty: !isLoading && !data?.data,
    }),
    [data, error, isLoading, isValidating]
  );

  return memoizedValue;
}

export function useGetCitizenLedger(citizenId: string | number | null) {
  const url = citizenId ? `${endpoints.platform.treasury.root}/citizen/${citizenId}/ledger` : '';

  const { data, isLoading, error, isValidating } = useSWR<{ success: boolean; data: any }>(
    url ? url : null,
    fetcher
  );

  const memoizedValue = useMemo(
    () => ({
      profile: data?.data || null,
      profileLoading: isLoading,
      profileError: error,
      profileValidating: isValidating,
      profileEmpty: !isLoading && !data?.data,
    }),
    [data, error, isLoading, isValidating]
  );

  return memoizedValue;
}
