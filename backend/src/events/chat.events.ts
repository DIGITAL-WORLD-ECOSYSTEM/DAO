/**
 * Definições do Event Bus para o Módulo de Chat
 * Desacopla o I/O do Durable Object de outros módulos (Email, Notificações, Analytics)
 */

export enum ChatEventType {
  MESSAGE_CREATED = 'MESSAGE_CREATED',
  MESSAGE_EDITED = 'MESSAGE_EDITED',
  MESSAGE_DELETED = 'MESSAGE_DELETED',
  MESSAGE_READ = 'MESSAGE_READ',
  USER_TYPING = 'USER_TYPING',
  USER_STOPPED_TYPING = 'USER_STOPPED_TYPING',
  USER_JOINED = 'USER_JOINED',
  USER_LEFT = 'USER_LEFT',
  USER_PRESENCE_CHANGED = 'USER_PRESENCE_CHANGED',
  CONVERSATION_CREATED = 'CONVERSATION_CREATED',
  CONVERSATION_ARCHIVED = 'CONVERSATION_ARCHIVED',
  ATTACHMENT_UPLOADED = 'ATTACHMENT_UPLOADED',
}

export interface BaseChatEvent {
  eventId: string;
  type: ChatEventType;
  timestamp: number;
  conversationId: string;
  userId: number; // Quem causou o evento
}

export interface MessageCreatedEvent extends BaseChatEvent {
  type: ChatEventType.MESSAGE_CREATED;
  payload: {
    messageId: string;
    body: string;
    messageType: string;
  };
}

export interface UserPresenceEvent extends BaseChatEvent {
  type: ChatEventType.USER_PRESENCE_CHANGED;
  payload: {
    status: 'online' | 'away' | 'offline';
  };
}

// União de todos os eventos possíveis na Fila
export type ChatPipelineEvent =
  | MessageCreatedEvent
  | UserPresenceEvent
  | (BaseChatEvent & { payload?: any });
