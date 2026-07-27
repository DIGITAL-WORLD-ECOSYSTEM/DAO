import type { IDateValue } from './common';

// ----------------------------------------------------------------------
// CONTRATOS DO BACKEND (DTOs da API Hono)
// ----------------------------------------------------------------------

export type EmailDTO = {
  id: string;
  accountId: string;
  folderId?: string | null;
  threadId?: string | null;
  direction: 'inbound' | 'outbound';
  sender: string;
  recipient: string;
  cc?: string | null;
  bcc?: string | null;
  subject: string;
  bodyHtml?: string | null;
  bodyText?: string | null;
  status: 'sent' | 'failed' | 'unread' | 'read' | 'draft' | 'queued' | 'bounced';
  priority: 'low' | 'normal' | 'high' | 'urgent' | 'critical';
  messageId?: string | null;
  createdAt: string;
};

export type EmailFolderDTO = {
  id: string;
  accountId: string;
  name: string;
  isSystem: boolean;
  createdAt: string;
};

// ----------------------------------------------------------------------
// MODELOS DE UI (Frontend)
// ----------------------------------------------------------------------


export type IMailLabel = {
  id: string;
  type: string;
  name: string;
  color: string;
  unreadCount?: number;
};

export type IMailSender = {
  name: string;
  email: string;
  avatarUrl: string | null;
};

export type IMailAttachment = {
  id: string;
  name: string;
  size: number;
  type: string;
  path: string;
  preview: string;
  createdAt: IDateValue;
  modifiedAt: IDateValue;
};

export type IMail = {
  id: string;
  folder: string;
  subject: string;
  message: string;
  isUnread: boolean;
  from: IMailSender;
  to: IMailSender[];
  labelIds: string[];
  isStarred: boolean;
  isImportant: boolean;
  createdAt: IDateValue;
  attachments: IMailAttachment[];
};

export type IMails = {
  allIds: string[];
  byId: Record<string, IMail>;
};
