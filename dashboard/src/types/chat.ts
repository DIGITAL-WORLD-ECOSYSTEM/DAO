import type { BadgeProps } from '@mui/material/Badge';
import type { IDateValue } from './common';

// ----------------------------------------------------------------------

export type IChatAttachment = {
  name: string;
  size: number;
  type: string;
  path: string;
  preview: string;
  createdAt: IDateValue;
  modifiedAt: IDateValue;
};

export type IChatMessage = {
  id: string;
  body: string;
  senderId: string;
  contentType: string;
  createdAt: IDateValue;
  attachments: IChatAttachment[];
  messageType?: 'text' | 'card' | 'invoice' | 'proposal' | 'system';
  readReceipt?: 'sent' | 'delivered' | 'read';
  systemData?: any; // Para carregar métricas de tx no sistema
};

export type IChatParticipant = {
  id: string;
  name: string;
  role: string;
  email: string;
  address: string;
  avatarUrl: string;
  phoneNumber: string;
  lastActivity: IDateValue;
  status: BadgeProps['variant'];
  presenceStatus?: 'online' | 'offline' | 'busy' | 'away';
};

export type IChatConversation = {
  id: string;
  type: string;
  unreadCount: number;
  messages: IChatMessage[];
  participants: IChatParticipant[];
  chatCategory?: 'ai' | 'ticket' | 'p2p' | 'dao' | 'system';
  ticketSla?: string;
  ticketStatus?: string;
};

export type IChatConversations = {
  allIds: string[];
  byId: Record<string, IChatConversation>;
};
