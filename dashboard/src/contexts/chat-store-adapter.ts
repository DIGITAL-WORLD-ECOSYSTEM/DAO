import { mutate } from 'swr';

import { endpoints } from 'src/lib/axios';

/**
 * Enterprise Pattern: Store Adapter
 * Isolates the underlying state management (SWR) from the Realtime Transport (WebSocket).
 * If we ever migrate to TanStack Query, Redux, or Zustand, we only change this file.
 */
export class ChatStoreAdapter {
  /**
   * Append a new message to the local conversation cache
   */
  static appendMessage(conversationId: string, payload: any) {
    const convUrl = `${endpoints.chat}/conversations/${conversationId}/messages`;
    
    mutate(
      convUrl,
      (currentData: any) => {
        if (!currentData || !currentData.conversation) return currentData;
        
        // Prevent duplicates (e.g. we already have the optimistic message)
        const exists = currentData.conversation.messages?.find((m: any) => m.id === payload.id);
        if (exists) {
          // If exists and we are just confirming an ACK, maybe update status?
          // Since we might be doing optimistic updates, let's replace it just in case
          const newMessages = currentData.conversation.messages.map((m: any) => 
            m.id === payload.id ? { ...m, ...payload } : m
          );
          return {
            ...currentData,
            conversation: {
              ...currentData.conversation,
              messages: newMessages,
            },
          };
        }

        // It doesn't exist, append to end
        return {
          ...currentData,
          conversation: {
            ...currentData.conversation,
            messages: [...(currentData.conversation.messages || []), payload],
          },
        };
      },
      false
    );
  }

  /**
   * Update message status (e.g., from 'queued' to 'sent' when ACK is received)
   */
  static updateMessageStatus(conversationId: string, messageId: string, status: string) {
    const convUrl = `${endpoints.chat}/conversations/${conversationId}/messages`;
    
    mutate(
      convUrl,
      (currentData: any) => {
        if (!currentData || !currentData.conversation) return currentData;

        const newMessages = currentData.conversation.messages.map((m: any) => 
          m.id === messageId || m.tempId === messageId ? { ...m, status, id: messageId } : m
        );

        return {
          ...currentData,
          conversation: {
            ...currentData.conversation,
            messages: newMessages,
          },
        };
      },
      false
    );
  }

  /**
   * Update presence status in isolated SWR cache
   */
  static updatePresence(userId: number, presence: 'ONLINE' | 'AWAY' | 'OFFLINE', lastSeen?: string) {
    const presenceUrl = `chat:presence:${userId}`;
    mutate(
      presenceUrl,
      () => ({ presence, lastSeen }),
      false
    );
  }

  /**
   * Update typing status in isolated SWR cache
   */
  static updateTyping(conversationId: string, userId: number, isTyping: boolean) {
    const typingUrl = `chat:typing:${conversationId}`;
    mutate(
      typingUrl,
      (currentData: number[] = []) => {
        if (isTyping) {
          if (!currentData.includes(userId)) return [...currentData, userId];
          return currentData;
        } else {
          return currentData.filter(id => id !== userId);
        }
      },
      false
    );
  }
}
