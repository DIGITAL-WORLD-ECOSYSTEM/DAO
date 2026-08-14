import { sqliteTable, text, integer, index, uniqueIndex, primaryKey, check } from 'drizzle-orm/sqlite-core';
import { sql } from 'drizzle-orm';
import type { EmailEventMetadata } from '../../dto/email-event';
import { users } from '../user/tables';



//
//   Omnichannel communication subsystem
//   USER / ACTOR
//   N/A
//   N/A

// ----------------------------------------------------------------------
// Entity: notifications
// ----------------------------------------------------------------------
export const notifications = sqliteTable(
  'notifications',
  {
    id: integer('id').primaryKey({ autoIncrement: true }),
    userId: integer('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    type: text('type').notNull(), // 'system', 'payment', 'social', etc.
    category: text('category').notNull(), // 'Communication', 'Project UI', etc.
    title: text('title').notNull(),
    message: text('message'), // Corpo detalhado em HTML ou Plain
    data: text('data', { mode: 'json' }), // Referências para outras entidades (metadata)
    isRead: integer('is_read', { mode: 'boolean' }).default(false).notNull(),
    readAt: integer('read_at', { mode: 'timestamp' }),
    createdAt: integer('created_at', { mode: 'timestamp' }).default(sql`(strftime('%s', 'now'))`),
    updatedAt: integer('updated_at', { mode: 'timestamp' }).default(sql`(strftime('%s', 'now'))`),
  },
  (table) => ({
    userIdIdx: index('idx_notifications_user_id').on(table.userId),
    isReadIdx: index('idx_notifications_is_read').on(table.isRead),
    createdAtIdx: index('idx_notifications_created_at').on(table.createdAt),
  })
);



// ----------------------------------------------------------------------
// Entity: emailAccounts
// ----------------------------------------------------------------------
export const emailAccounts = sqliteTable('email_accounts', {
  id: text('id').primaryKey(),
  department: text('department'),
  email: text('email').notNull().unique(),
  displayName: text('display_name'),
  type: text('type', {
    enum: [
      'Atendimento',
      'Financeiro',
      'Juridico',
      'Sistema',
      'Marketing',
      'Governança',
      'Newsletter',
      'Diretoria',
    ],
  }),
  criticality: text('criticality', { enum: ['Baixa', 'Média', 'Alta', 'Crítica'] }),
  providerInbound: text('provider_inbound').default('cloudflare'),
  providerOutbound: text('provider_outbound').default('resend'),
  signatureHtml: text('signature_html'),
  replyTo: text('reply_to'),
  color: text('color'),
  status: text('status', {
    enum: ['Provisionando', 'Ativa', 'Erro', 'Suspensa', 'Arquivada', 'Desativada'],
  }).default('Provisionando'),
  healthStatus: text('health_status', { enum: ['Verde', 'Amarelo', 'Vermelho', 'Cinza'] }).default(
    'Cinza'
  ),
  usedSpaceMb: integer('used_space_mb').default(0),
  totalMessages: integer('total_messages').default(0),
  totalAttachments: integer('total_attachments').default(0),
  lastCleanedAt: integer('last_cleaned_at', { mode: 'timestamp' }),
  retentionDays: integer('retention_days').default(365),
  ownerUserId: text('owner_user_id'),
  createdAt: integer('created_at', { mode: 'timestamp' }).default(sql`(strftime('%s', 'now'))`),
  updatedAt: integer('updated_at', { mode: 'timestamp' }),
});



// ----------------------------------------------------------------------
// Entity: emailThreads
// ----------------------------------------------------------------------
export const emailThreads = sqliteTable('email_threads', {
  id: text('id').primaryKey(),
  accountId: text('account_id')
    .references(() => emailAccounts.id)
    .notNull(),
  subject: text('subject').notNull(),
  participants: text('participants', { mode: 'json' }), // array of emails
  messageCount: integer('message_count').default(1),
  status: text('status').default('active'),
  lastMessageDate: integer('last_message_date', { mode: 'timestamp' }),
  createdAt: integer('created_at', { mode: 'timestamp' }).default(sql`(strftime('%s', 'now'))`),
});



// ----------------------------------------------------------------------
// Entity: emailLabels
// ----------------------------------------------------------------------
export const emailLabels = sqliteTable('email_labels', {
  id: text('id').primaryKey(),
  accountId: text('account_id')
    .references(() => emailAccounts.id)
    .notNull(),
  name: text('name').notNull(),
  color: text('color'),
  createdAt: integer('created_at', { mode: 'timestamp' }).default(sql`(strftime('%s', 'now'))`),
});



// ----------------------------------------------------------------------
// Entity: emails
// ----------------------------------------------------------------------
export const emails = sqliteTable(
  'emails',
  {
    id: text('id').primaryKey(), // UUID v4 ou ID do Resend
    accountId: text('account_id').references(() => emailAccounts.id),
    threadId: text('thread_id').references(() => emailThreads.id),
    direction: text('direction', { enum: ['inbound', 'outbound'] })
      .notNull()
      .default('outbound'),
    sender: text('sender').notNull(),
    recipient: text('recipient').notNull(),
    cc: text('cc'),
    bcc: text('bcc'),
    subject: text('subject').notNull(),
    bodyHtml: text('body_html'),
    bodyText: text('body_text'),
    status: text('status', {
      enum: [
        'sent',
        'failed',
        'unread',
        'read',
        'draft',
        'queued',
        'processing',
        'sending',
        'bounced',
        'delivered',
      ],
    })
      .notNull()
      .default('sent'),
    priority: text('priority', { enum: ['low', 'normal', 'high', 'urgent', 'critical'] }).default(
      'normal'
    ),
    messageId: text('message_id').unique(), // Resend Message ID ou Inbound Message-ID
    inReplyTo: text('in_reply_to'), // RFC 5322 In-Reply-To
    references: text('references', { mode: 'json' }).$type<string[]>(), // RFC 5322 References
    provider: text('provider').default('cloudflare'),
    deliveredAt: integer('delivered_at', { mode: 'timestamp' }),
    receivedAt: integer('received_at', { mode: 'timestamp' }),
    processedAt: integer('processed_at', { mode: 'timestamp' }),
    openedAt: integer('opened_at', { mode: 'timestamp' }),
    bouncedAt: integer('bounced_at', { mode: 'timestamp' }),
    errorMessage: text('error_message'),
    providerPayload: text('provider_payload', { mode: 'json' }),
    authMetadata: text('auth_metadata', { mode: 'json' }).$type<Record<string, any>>(), // DKIM, SPF, DMARC, ARC
    createdAt: integer('created_at', { mode: 'timestamp' }).default(sql`(strftime('%s', 'now'))`),
  },
  (table) => ({
    accountIdIdx: index('idx_emails_account_id').on(table.accountId),
    threadIdIdx: index('idx_emails_thread_id').on(table.threadId),
    createdAtIdx: index('idx_emails_created_at').on(table.createdAt),
    messageIdIdx: index('idx_emails_message_id').on(table.messageId),
  })
);



// ----------------------------------------------------------------------
// Entity: emailMessageLabels
// ----------------------------------------------------------------------
export const emailMessageLabels = sqliteTable(
  'email_message_labels',
  {
    messageId: text('message_id')
      .references(() => emails.id)
      .notNull(),
    labelId: text('label_id')
      .references(() => emailLabels.id)
      .notNull(),
  },
  (t) => ({
    pk: primaryKey({ columns: [t.messageId, t.labelId] }),
  })
);



// ----------------------------------------------------------------------
// Entity: emailAttachments
// ----------------------------------------------------------------------
export const emailAttachments = sqliteTable('email_attachments', {
  id: text('id').primaryKey(),
  emailId: text('email_id')
    .references(() => emails.id)
    .notNull(),
  name: text('name').notNull(),
  mimeType: text('mime_type').notNull(),
  sizeBytes: integer('size_bytes').notNull(),
  r2Key: text('r2_key').notNull(),
  publicUrl: text('public_url'),
  contentDisposition: text('content_disposition'),
  inline: integer('inline', { mode: 'boolean' }).default(false),
  cid: text('cid'),
  sha256: text('sha256'),
  virusStatus: text('virus_status', { enum: ['pending', 'clean', 'infected'] }).default('pending'),
  createdAt: integer('created_at', { mode: 'timestamp' }).default(sql`(strftime('%s', 'now'))`),
});



// ----------------------------------------------------------------------
// Entity: emailEvents
// ----------------------------------------------------------------------
export const emailEvents = sqliteTable('email_events', {
  id: text('id').primaryKey(),
  emailId: text('email_id').references(() => emails.id),
  messageId: text('message_id'),
  event: text('event').notNull(),
  source: text('source').notNull(),
  provider: text('provider').default('cloudflare'),
  severity: text('severity', { enum: ['info', 'warning', 'error', 'critical'] }).default('info'),
  requestId: text('request_id'),
  correlationId: text('correlation_id'),
  queueMessageId: text('queue_message_id'),
  traceId: text('trace_id'),
  spanId: text('span_id'),
  workerVersion: text('worker_version'),
  durationMs: integer('duration_ms'),
  metadata: text('metadata', { mode: 'json' }).$type<EmailEventMetadata>(),
  createdAt: integer('created_at', { mode: 'timestamp' }).default(sql`(strftime('%s', 'now'))`),
});



// ----------------------------------------------------------------------
// Entity: chatConversations
// ----------------------------------------------------------------------
export const chatConversations = sqliteTable('chat_conversations', {
  id: text('id').primaryKey(),
  type: text('type', { enum: ['single', 'group'] }).notNull(),
  category: text('category', { enum: ['ai', 'ticket', 'p2p', 'dao', 'system'] }).notNull(),
  title: text('title'),
  description: text('description'),
  ownerId: integer('owner_id').references(() => users.id),
  status: text('status').default('active'),
  createdAt: integer('created_at', { mode: 'timestamp' }).default(sql`(strftime('%s', 'now'))`),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).default(sql`(strftime('%s', 'now'))`),
  deletedAt: integer('deleted_at', { mode: 'timestamp' }),
});



// ----------------------------------------------------------------------
// Entity: chatParticipants
// ----------------------------------------------------------------------
export const chatParticipants = sqliteTable(
  'chat_participants',
  {
    conversationId: text('conversation_id')
      .references(() => chatConversations.id)
      .notNull(),
    userId: integer('user_id')
      .references(() => users.id)
      .notNull(),
    role: text('role').default('member'),
    joinedAt: integer('joined_at', { mode: 'timestamp' }).default(sql`(strftime('%s', 'now'))`),
    lastReadMessageId: text('last_read_message_id'),
    lastReadAt: integer('last_read_at', { mode: 'timestamp' }),
    muted: integer('muted', { mode: 'boolean' }).default(false),
    archived: integer('archived', { mode: 'boolean' }).default(false),
    pinned: integer('pinned', { mode: 'boolean' }).default(false),
    presence: text('presence', { enum: ['online', 'away', 'offline'] }).default('offline'),
    lastSeen: integer('last_seen', { mode: 'timestamp' }),
  },
  (t) => ({
    pk: primaryKey({ columns: [t.conversationId, t.userId] }),
    convoIdx: index('idx_chat_participants_convo').on(t.conversationId),
    userIdx: index('idx_chat_participants_user').on(t.userId),
  })
);



// ----------------------------------------------------------------------
// Entity: chatMessages
// ----------------------------------------------------------------------
export const chatMessages = sqliteTable(
  'chat_messages',
  {
    id: text('id').primaryKey(),
    conversationId: text('conversation_id')
      .references(() => chatConversations.id)
      .notNull(),
    senderId: integer('sender_id').references(() => users.id), // Nullable for system messages
    type: text('type').default('text'),
    body: text('body').notNull(),
    status: text('status').default('sent'), // sent, delivered, read, edited, deleted
    replyTo: text('reply_to'), // Self-referencing chatMessages.id handled at app level to avoid circular deps
    metadata: text('metadata', { mode: 'json' }),
    version: integer('version').default(1),
    createdAt: integer('created_at', { mode: 'timestamp' }).default(sql`(strftime('%s', 'now'))`),
    editedAt: integer('edited_at', { mode: 'timestamp' }),
    deletedAt: integer('deleted_at', { mode: 'timestamp' }),
  },
  (t) => ({
    convoIdx: index('idx_chat_messages_convo').on(t.conversationId),
    createdAtIdx: index('idx_chat_messages_created_at').on(t.createdAt),
  })
);



// ----------------------------------------------------------------------
// Entity: chatAttachments
// ----------------------------------------------------------------------
export const chatAttachments = sqliteTable('chat_attachments', {
  id: text('id').primaryKey(),
  messageId: text('message_id')
    .references(() => chatMessages.id)
    .notNull(),
  r2Key: text('r2_key').notNull(),
  mime: text('mime'),
  size: integer('size'),
  width: integer('width'),
  height: integer('height'),
  duration: integer('duration'), // Para áudios/vídeos
});



// ----------------------------------------------------------------------
// Entity: chatReadReceipts
// ----------------------------------------------------------------------
export const chatReadReceipts = sqliteTable(
  'chat_read_receipts',
  {
    messageId: text('message_id')
      .references(() => chatMessages.id)
      .notNull(),
    userId: integer('user_id')
      .references(() => users.id)
      .notNull(),
    readAt: integer('read_at', { mode: 'timestamp' }).default(sql`(strftime('%s', 'now'))`),
  },
  (t) => ({
    pk: primaryKey({ columns: [t.messageId, t.userId] }),
  })
);



// ----------------------------------------------------------------------
// Entity: chatEvents
// ----------------------------------------------------------------------
export const chatEvents = sqliteTable('chat_events', {
  id: text('id').primaryKey(),
  conversationId: text('conversation_id')
    .references(() => chatConversations.id)
    .notNull(),
  event: text('event').notNull(),
  userId: integer('user_id').references(() => users.id), // Quem disparou o evento
  metadata: text('metadata', { mode: 'json' }),
  createdAt: integer('created_at', { mode: 'timestamp' }).default(sql`(strftime('%s', 'now'))`),
});

