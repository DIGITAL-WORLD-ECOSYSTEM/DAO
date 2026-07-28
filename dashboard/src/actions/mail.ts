import type { SWRConfiguration } from 'swr';
import type { IMail, EmailDTO , IMailLabel, EmailFolderDTO } from 'src/types/mail';

import useSWR from 'swr';
import { useMemo } from 'react';

import axiosInstance, { fetcher, endpoints } from 'src/lib/axios';

import { MailAdapter } from './mail-adapter';

// ----------------------------------------------------------------------

export interface MailItem {
  id: string;
  direction: 'inbound' | 'outbound';
  sender: string;
  recipient: string;
  subject: string;
  bodyHtml: string;
  status: 'sent' | 'failed' | 'unread' | 'read';
  createdAt: string | number;
}

export interface MailAccountItem {
  id: string;
  email: string;
  department?: string;
  displayName?: string;
  type?: string;
  criticality?: string;
  status: string;
  healthStatus: string;
}

export async function sendCampaign(composeData: { to: string; subject: string; message: string }) {
  const payload = MailAdapter.toPayload(composeData);
  const idempotencyKey = crypto.randomUUID();
  const response = await axiosInstance.post('/api/platform/email/campaign', payload, {
    headers: {
      'Idempotency-Key': idempotencyKey
    }
  });
  return response.data;
}

export async function syncEmails(accountId: string) {
  const response = await axiosInstance.post('/api/platform/email/sync', { accountId });
  return response.data;
}

const swrOptions: SWRConfiguration = {
  revalidateIfStale: false,
  revalidateOnFocus: false,
  revalidateOnReconnect: false,
};

// ----------------------------------------------------------------------

const HARDCODED_LABELS: IMailLabel[] = [
  { id: 'all', type: 'system', name: 'All mail', color: '#00AB55' },
  { id: 'inbox', type: 'system', name: 'Inbox', color: '#1890FF' },
  { id: 'sent', type: 'system', name: 'Sent', color: '#54D62C' },
  { id: 'drafts', type: 'system', name: 'Drafts', color: '#FFC107' },
  { id: 'trash', type: 'system', name: 'Trash', color: '#FF4842' },
  { id: 'spam', type: 'system', name: 'Spam', color: '#04297A' },
  { id: 'important', type: 'system', name: 'Important', color: '#FFC107' },
  { id: 'starred', type: 'system', name: 'Starred', color: '#FF4842' },
];

export function useGetLabels(accountId: string = '') {
  const memoizedValue = useMemo(() => {
    return {
      labels: HARDCODED_LABELS,
      labelsLoading: false,
      labelsError: null,
      labelsValidating: false,
      labelsEmpty: false,
    };
  }, []);

  return memoizedValue;
}

// ----------------------------------------------------------------------

type MailsData = {
  mails: IMail[];
};

export function useGetMails(labelId: string = 'inbox', accountId: string = '') {
  const URL = accountId ? `/api/platform/email/list?accountId=${accountId}` : '/api/platform/email/list';

  const { data, isLoading, error, isValidating, mutate } = useSWR<{ data: EmailDTO[] }>(URL, fetcher, {
    revalidateOnFocus: true,
    revalidateIfStale: true,
  });

  const memoizedValue = useMemo(() => {
    const rawList: EmailDTO[] = data?.data || [];

    // Filtra por pasta se necessário, assumindo que Inbox = inbound, e Sent = outbound
    let filteredList = rawList;
    if (labelId === 'inbox') {
      filteredList = rawList.filter((m) => m.direction === 'inbound');
    } else if (labelId === 'sent') {
      filteredList = rawList.filter((m) => m.direction === 'outbound');
    }

    // Adapta o formato do banco D1 (EmailDTO) para a estrutura esperada pela UI (IMail)
    const mails = filteredList.map((mail) => MailAdapter.toIMail(mail));

    // Estrutura normalizada em mapa (byId e allIds) para a UI de e-mail
    const byId = mails.reduce((acc: Record<string, any>, item) => {
      acc[item.id] = item;
      return acc;
    }, {});

    const allIds = mails.map((m) => m.id);

    return {
      mails: { byId, allIds },
      mailsLoading: isLoading,
      mailsError: error,
      mailsValidating: isValidating,
      mailsEmpty: !isLoading && !mails.length,
      refetchMails: mutate,
    };
  }, [data?.data, error, isLoading, isValidating, mutate, labelId]);

  return memoizedValue;
}

// ----------------------------------------------------------------------

type MailData = {
  mail: IMail;
};

export function useGetMail(mailId: string) {
  const url = mailId ? [endpoints.mail.details, { params: { mailId } }] : '';

  const { data, isLoading, error, isValidating } = useSWR<MailData>(url, fetcher, {
    ...swrOptions,
  });

  const memoizedValue = useMemo(
    () => ({
      mail: data?.mail,
      mailLoading: isLoading,
      mailError: error,
      mailValidating: isValidating,
      mailEmpty: !isLoading && !isValidating && !data?.mail,
    }),
    [data?.mail, error, isLoading, isValidating]
  );

  return memoizedValue;
}

// ----------------------------------------------------------------------

export function useGetAccounts() {
  const url = endpoints.platform.email.accounts;

  const { data, isLoading, error, isValidating } = useSWR<{ data: MailAccountItem[] }>(url, fetcher, {
    ...swrOptions,
  });

  const memoizedValue = useMemo(
    () => ({
      accounts: data?.data || [],
      accountsLoading: isLoading,
      accountsError: error,
      accountsValidating: isValidating,
      accountsEmpty: !isLoading && !isValidating && !data?.data?.length,
    }),
    [data?.data, error, isLoading, isValidating]
  );

  return memoizedValue;
}
