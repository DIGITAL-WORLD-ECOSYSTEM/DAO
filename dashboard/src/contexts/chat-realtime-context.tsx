import React, { createContext, useContext, useEffect, useState, useRef, useCallback } from 'react';
import axios, { endpoints } from 'src/lib/axios';
import { mutate } from 'swr';
import { IChatMessage } from 'src/types/chat';

// ----------------------------------------------------------------------

export type ConnectionState = 'DISCONNECTED' | 'CONNECTING' | 'AUTHENTICATING' | 'CONNECTED' | 'RECONNECTING' | 'FAILED';

export interface ChatRealtimeContextProps {
  connectionState: ConnectionState;
  connect: (conversationId: string) => void;
  disconnect: () => void;
  sendMessage: (payload: any) => void;
  offlineBufferCount: number;
}

const ChatRealtimeContext = createContext<ChatRealtimeContextProps | undefined>(undefined);

// ----------------------------------------------------------------------

interface ChatRealtimeProviderProps {
  children: React.ReactNode;
}

const CHAT_REALTIME_ENABLED = import.meta.env.VITE_CHAT_REALTIME === 'true' || true; // Feature Flag
const WS_BASE_URL = import.meta.env.VITE_WS_URL || 'ws://localhost:8787';

export function ChatRealtimeProvider({ children }: ChatRealtimeProviderProps) {
  const [connectionState, setConnectionState] = useState<ConnectionState>('DISCONNECTED');
  const [offlineBuffer, setOfflineBuffer] = useState<any[]>([]);
  
  const wsRef = useRef<WebSocket | null>(null);
  const conversationIdRef = useRef<string | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lastSequenceRef = useRef<number>(0);

  const disconnect = useCallback(() => {
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }
    setConnectionState('DISCONNECTED');
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
    }
  }, []);

  const handleMessage = useCallback((event: MessageEvent) => {
    try {
      const data = JSON.parse(event.data);
      
      // Event Dispatcher
      switch (data.type) {
        case 'ACK':
          // Confirmação de recebimento (atualizar UI de enviando para enviado)
          console.log('[ChatRealtime] ACK Received:', data);
          break;

        case 'MESSAGE_CREATED':
          lastSequenceRef.current = data.sequenceNumber;
          // Optimistic Update via SWR
          const convUrl = `${endpoints.chat}/conversations/${conversationIdRef.current}/messages`;
          mutate(
            convUrl,
            (currentData: any) => {
              if (!currentData || !currentData.conversation) return currentData;
              
              // Verifica se a mensagem já existe no cache (evita duplicatas do próprio cliente)
              const exists = currentData.conversation.messages?.find((m: any) => m.id === data.payload.id);
              if (exists) return currentData;

              return {
                ...currentData,
                conversation: {
                  ...currentData.conversation,
                  messages: [...(currentData.conversation.messages || []), data.payload],
                },
              };
            },
            false
          );
          break;

        case 'USER_PRESENCE_CHANGED':
          console.log('[ChatRealtime] Presence Update:', data);
          break;
          
        case 'MESSAGE_RATE_LIMITED':
          console.warn('[ChatRealtime] Rate Limited by DO!');
          break;
      }
    } catch (err) {
      console.error('[ChatRealtime] Error parsing message:', err);
    }
  }, []);

  const connect = useCallback(async (conversationId: string) => {
    if (!CHAT_REALTIME_ENABLED) return;
    
    // Evita reconectar na mesma sala se já estiver conectado/conectando
    if (
      conversationIdRef.current === conversationId &&
      (connectionState === 'CONNECTED' || connectionState === 'CONNECTING')
    ) {
      return;
    }

    disconnect(); // Limpa conexões antigas
    
    conversationIdRef.current = conversationId;
    setConnectionState('AUTHENTICATING');

    try {
      // 1. Handshake REST para obter o Ephemeral Token
      const tokenRes = await axios.get(`${endpoints.chat}/ws-token`);
      const ephemeralToken = tokenRes.data.token;

      setConnectionState('CONNECTING');

      // 2. Inicializar WebSocket passando o token no Subprotocol
      const wsUrl = `${WS_BASE_URL}/api/platform/chat/conversations/${conversationId}/ws`;
      const ws = new WebSocket(wsUrl, ['asppibra-chat-v1', ephemeralToken]);
      
      wsRef.current = ws;

      ws.onopen = () => {
        setConnectionState('CONNECTED');
        
        // Session Resume Sync (Se caiu e voltou)
        if (lastSequenceRef.current > 0) {
          ws.send(JSON.stringify({
            type: 'SESSION_RESUME',
            lastSequence: lastSequenceRef.current
          }));
        }

        // Descarregar buffer offline
        if (offlineBuffer.length > 0) {
          offlineBuffer.forEach(msg => ws.send(JSON.stringify(msg)));
          setOfflineBuffer([]);
        }
      };

      ws.onmessage = handleMessage;

      ws.onclose = (event) => {
        console.warn(`[ChatRealtime] Disconnected. Code: ${event.code}`);
        if (event.code !== 1000) {
          setConnectionState('RECONNECTING');
          reconnectTimeoutRef.current = setTimeout(() => {
            if (conversationIdRef.current) connect(conversationIdRef.current);
          }, 5000); // Backoff simples
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
  }, [connectionState, disconnect, handleMessage, offlineBuffer]);

  const sendMessage = useCallback((payload: any) => {
    const event = {
      version: 1,
      type: 'MESSAGE_CREATED',
      payload
    };

    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify(event));
    } else {
      // Fila Offline
      console.warn('[ChatRealtime] Offline. Queuing message...');
      setOfflineBuffer(prev => [...prev, event]);
    }
  }, []);

  return (
    <ChatRealtimeContext.Provider
      value={{
        connectionState,
        connect,
        disconnect,
        sendMessage,
        offlineBufferCount: offlineBuffer.length,
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
