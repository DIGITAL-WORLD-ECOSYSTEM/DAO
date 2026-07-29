import React, { useRef, useState, useEffect, useContext, useCallback, createContext } from 'react';

import axios, { endpoints } from 'src/lib/axios';

import { ChatStoreAdapter } from './chat-store-adapter';
import { chatDB, STORE_NAMES } from '../utils/indexed-db';

// ----------------------------------------------------------------------
// Interfaces & Types
// ----------------------------------------------------------------------

export type ConnectionState = 'DISCONNECTED' | 'CONNECTING' | 'AUTHENTICATING' | 'CONNECTED' | 'RECONNECTING' | 'FAILED' | 'SUSPENDED';
export type ConnectionQuality = 'HEALTHY' | 'DEGRADED' | 'UNSTABLE';

export interface ChatRealtimeContextProps {
  connectionState: ConnectionState;
  connectionQuality: ConnectionQuality;
  connect: (conversationId: string) => void;
  disconnect: () => void;
  sendMessage: (payload: any) => void;
  offlineBufferCount: number;
}

const ChatRealtimeContext = createContext<ChatRealtimeContextProps | undefined>(undefined);

// ----------------------------------------------------------------------
// Constants
// ----------------------------------------------------------------------

const COMMUNICATION_REALTIME_ENABLED = import.meta.env.VITE_COMMUNICATION_REALTIME === 'true' || true; // Feature Flag
const WS_BASE_URL = import.meta.env.VITE_WS_URL || 'ws://localhost:8787';

// ----------------------------------------------------------------------
// Managers (Hooks)
// ----------------------------------------------------------------------

function useMetricsCollector() {
  const metrics = useRef<Record<string, number>>({
    connection_count: 0,
    reconnect_count: 0,
    messages_sent: 0,
    messages_received: 0,
  });

  const increment = useCallback((metric: string) => {
    metrics.current[metric] = (metrics.current[metric] || 0) + 1;
  }, []);

  const recordTime = useCallback((metric: string, duration: number) => {
    metrics.current[metric] = duration;
  }, []);

  return { increment, recordTime, metrics: metrics.current };
}

function useOfflineQueueManager() {
  const [offlineBufferCount, setOfflineBufferCount] = useState(0);

  const enqueue = useCallback(async (payload: any) => {
    await chatDB.put(STORE_NAMES.PENDING_MESSAGES, payload);
    const all = await chatDB.getAll(STORE_NAMES.PENDING_MESSAGES);
    setOfflineBufferCount(all.length);
  }, []);

  const drain = useCallback(async (wsSend: (data: string) => void) => {
    const pending = await chatDB.getAll<any>(STORE_NAMES.PENDING_MESSAGES);
    if (pending.length > 0) {
      for (const msg of pending) {
        wsSend(JSON.stringify(msg));
        // Status updates to sent upon ACK
      }
    }
  }, []);

  const acknowledge = useCallback(async (tempId: string) => {
    await chatDB.delete(STORE_NAMES.PENDING_MESSAGES, tempId);
    const all = await chatDB.getAll(STORE_NAMES.PENDING_MESSAGES);
    setOfflineBufferCount(all.length);
  }, []);

  // Sync count on mount
  useEffect(() => {
    chatDB.getAll(STORE_NAMES.PENDING_MESSAGES).then((all) => {
      setOfflineBufferCount(all.length);
    });
  }, []);

  return { enqueue, drain, acknowledge, offlineBufferCount };
}

function useEventDispatcher(ackManager: any) {
  const handleMessageCreated = useCallback((payload: any) => {
    ChatStoreAdapter.appendMessage(payload.conversationId, payload);
  }, []);

  const handlePresenceChanged = useCallback((payload: any) => {
    ChatStoreAdapter.updatePresence(payload.userId, payload.status, payload.lastSeen);
  }, []);

  const handleAck = useCallback((payload: any) => {
    ackManager.acknowledge(payload.tempId);
    ChatStoreAdapter.updateMessageStatus(payload.conversationId, payload.tempId, 'sent');
  }, [ackManager]);

  const dispatch = useCallback((event: any) => {
    if (!event || event.version !== 1) {
      console.warn('Unknown event version or format', event);
      return;
    }
    
    switch (event.type) {
      case 'MESSAGE_CREATED':
        handleMessageCreated(event.payload);
        break;
      case 'USER_PRESENCE_CHANGED':
        handlePresenceChanged(event.payload);
        break;
      case 'ACK':
        handleAck(event.payload);
        break;
      default:
        console.warn('Unhandled event type', event.type);
    }
  }, [handleMessageCreated, handlePresenceChanged, handleAck]);

  return { dispatch };
}

function useAuthenticationManager() {
  const getEphemeralToken = useCallback(async () => {
    const tokenRes = await axios.get(`${endpoints.chat}/ws-token`);
    return tokenRes.data.token;
  }, []);

  return { getEphemeralToken };
}

// ----------------------------------------------------------------------
// Provider
// ----------------------------------------------------------------------

export function ChatRealtimeProvider({ children }: { children: React.ReactNode }) {
  const [connectionState, setConnectionState] = useState<ConnectionState>('DISCONNECTED');
  const [connectionQuality, setConnectionQuality] = useState<ConnectionQuality>('HEALTHY');
  
  const wsRef = useRef<WebSocket | null>(null);
  const conversationIdRef = useRef<string | null>(null);
  const reconnectAttemptsRef = useRef(0);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lastSequenceRef = useRef<number>(0);

  const metrics = useMetricsCollector();
  const offlineQueue = useOfflineQueueManager();
  const eventDispatcher = useEventDispatcher(offlineQueue);
  const authManager = useAuthenticationManager();

  // Garbage Collection
  const disconnect = useCallback(() => {
    if (wsRef.current) {
      wsRef.current.close(1000, 'User Disconnected');
      wsRef.current = null;
    }
    setConnectionState('DISCONNECTED');
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
    }
    reconnectAttemptsRef.current = 0;
  }, []);

  useEffect(() => () => {
      // GC on unmount
      disconnect();
    }, [disconnect]);

  // SUSPENDED state via Page Visibility API
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden && connectionState === 'CONNECTED') {
        setConnectionState('SUSPENDED');
      } else if (!document.hidden && connectionState === 'SUSPENDED') {
        setConnectionState('CONNECTED');
        // Trigger a ping or fetch gaps if needed
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [connectionState]);

  const connect = useCallback(async (conversationId: string) => {
    if (!COMMUNICATION_REALTIME_ENABLED) return;
    
    if (
      conversationIdRef.current === conversationId &&
      (connectionState === 'CONNECTED' || connectionState === 'CONNECTING')
    ) {
      return;
    }

    disconnect();
    
    conversationIdRef.current = conversationId;
    setConnectionState('AUTHENTICATING');

    try {
      const ephemeralToken = await authManager.getEphemeralToken();

      setConnectionState('CONNECTING');

      const wsUrl = `${WS_BASE_URL}/api/platform/chat/conversations/${conversationId}/ws`;
      const ws = new WebSocket(wsUrl, ['asppibra-chat-v1', ephemeralToken]);
      
      wsRef.current = ws;

      ws.onopen = () => {
        setConnectionState('CONNECTED');
        setConnectionQuality('HEALTHY');
        reconnectAttemptsRef.current = 0;
        metrics.increment('connection_count');
        
        // Session Resume
        if (lastSequenceRef.current > 0) {
          ws.send(JSON.stringify({
            version: 1,
            type: 'SESSION_RESUME',
            payload: { lastSequence: lastSequenceRef.current }
          }));
        }

        // Drain Offline Queue
        offlineQueue.drain((data) => ws.send(data));
      };

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          
          if (data.sequenceNumber) {
            lastSequenceRef.current = data.sequenceNumber;
          }
          
          metrics.increment('messages_received');
          eventDispatcher.dispatch(data);
        } catch (err) {
          console.error('[ChatRealtime] Error parsing message:', err);
        }
      };

      ws.onclose = (event) => {
        console.warn(`[ChatRealtime] Disconnected. Code: ${event.code}`);
        if (event.code !== 1000) {
          setConnectionState('RECONNECTING');
          setConnectionQuality('UNSTABLE');
          
          // Exponential Backoff with Jitter
          const attempt = reconnectAttemptsRef.current;
          const backoffTimes = [1000, 2000, 4000, 8000, 16000, 30000];
          const baseDelay = backoffTimes[Math.min(attempt, backoffTimes.length - 1)];
          const jitter = Math.floor(Math.random() * 500);
          const delay = baseDelay + jitter;
          
          reconnectAttemptsRef.current += 1;
          metrics.increment('reconnect_count');

          reconnectTimeoutRef.current = setTimeout(() => {
            if (conversationIdRef.current) connect(conversationIdRef.current);
          }, delay);
        } else {
          setConnectionState('DISCONNECTED');
        }
      };

      ws.onerror = (error) => {
        console.error('[ChatRealtime] Error:', error);
        setConnectionState('FAILED');
      };

    } catch (err) {
      console.error('[ChatRealtime] Authentication or Connection Failed:', err);
      setConnectionState('FAILED');
    }
  }, [connectionState, disconnect, authManager, metrics, offlineQueue, eventDispatcher]);

  const sendMessage = useCallback((payload: any) => {
    const event = {
      version: 1,
      type: 'MESSAGE_CREATED',
      payload
    };

    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      // Optimistic update status: sending
      ChatStoreAdapter.appendMessage(payload.conversationId, { ...payload, status: 'sending' });
      wsRef.current.send(JSON.stringify(event));
      metrics.increment('messages_sent');
    } else {
      // Offline Queue Transaction
      const tempId = payload.id;
      ChatStoreAdapter.appendMessage(payload.conversationId, { ...payload, status: 'queued', tempId });
      offlineQueue.enqueue({ ...event, tempId });
    }
  }, [metrics, offlineQueue]);

  return (
    <ChatRealtimeContext.Provider
      value={{
        connectionState,
        connectionQuality,
        connect,
        disconnect,
        sendMessage,
        offlineBufferCount: offlineQueue.offlineBufferCount,
      }}
    >
      {children}
    </ChatRealtimeContext.Provider>
  );
}

// ----------------------------------------------------------------------

export function useChatRealtime() {
  const context = useContext(ChatRealtimeContext);

  if (!context) {
    throw new Error('useChatRealtime must be used within a ChatRealtimeProvider');
  }

  return context;
}
