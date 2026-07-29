import type { SWRConfiguration } from 'swr';
import type { IChatMessage, IChatParticipant, IChatConversation } from 'src/types/chat';

import useSWR from 'swr';
import { useMemo } from 'react';
import { keyBy } from 'es-toolkit';

import axios, { fetcher, endpoints } from 'src/lib/axios';

// ----------------------------------------------------------------------

const CHAT_ENDPOINT = endpoints.chat;

const swrOptions: SWRConfiguration = {
  revalidateIfStale: true,
  revalidateOnFocus: true,
  revalidateOnReconnect: true,
};

// ----------------------------------------------------------------------

type ContactsData = {
  contacts: IChatParticipant[];
};

export function useGetContacts() {
  const url = [CHAT_ENDPOINT, { params: { endpoint: 'contacts' } }];

  const { data, isLoading, error, isValidating } = useSWR<ContactsData>(url, fetcher, {
    ...swrOptions,
  });

  const memoizedValue = useMemo(() => {
    const dataSource = data?.contacts || [];
    return {
      contacts: dataSource,
      contactsLoading: isLoading,
      contactsError: error,
      contactsValidating: isValidating,
      contactsEmpty: !dataSource.length,
    };
  }, [data?.contacts, error, isLoading, isValidating]);

  return memoizedValue;
}

// ----------------------------------------------------------------------

type ConversationsData = {
  conversations: IChatConversation[];
};

export function useGetConversations() {
  const url = `${CHAT_ENDPOINT}/conversations`;

  const { data, isLoading, error, isValidating } = useSWR<ConversationsData>(url, fetcher, {
    ...swrOptions,
  });

  const memoizedValue = useMemo(() => {
    const dataSource = data?.conversations || [];
    const byId = dataSource.length ? keyBy(dataSource, (option) => option.id) : {};
    const allIds = Object.keys(byId);

    return {
      conversations: { byId, allIds },
      conversationsLoading: isLoading,
      conversationsError: error,
      conversationsValidating: isValidating,
      conversationsEmpty: !allIds.length,
    };
  }, [data?.conversations, error, isLoading, isValidating]);

  return memoizedValue;
}

// ----------------------------------------------------------------------

type ConversationData = {
  conversation: IChatConversation;
};

export function useGetConversation(conversationId: string) {
  const url = conversationId
    ? `${CHAT_ENDPOINT}/conversations/${conversationId}/messages`
    : '';

  const { data, isLoading, error, isValidating } = useSWR<ConversationData>(url, fetcher, {
    ...swrOptions,
  });

  const memoizedValue = useMemo(() => {
    const dataSource = data?.conversation;

    return {
      conversation: dataSource,
      conversationLoading: isLoading,
      conversationError: error,
      conversationValidating: isValidating,
      conversationEmpty: !dataSource,
    };
  }, [data?.conversation, error, isLoading, isValidating, conversationId]);

  return memoizedValue;
}

// ----------------------------------------------------------------------

export async function sendMessage(conversationId: string, messageData: IChatMessage) {
  const data = { conversationId, messageData };
  await axios.post(`${CHAT_ENDPOINT}/conversations/${conversationId}/messages`, data);
}

// ----------------------------------------------------------------------

export async function createConversation(conversationData: IChatConversation) {
  const data = { conversationData };
  const res = await axios.post(`${CHAT_ENDPOINT}/conversations`, data);
  return res.data;
}

// ----------------------------------------------------------------------

export async function clickConversation(conversationId: string) {
  await axios.post(`${CHAT_ENDPOINT}/conversations/${conversationId}/read`);
}
