import { z } from 'zod';

// ==========================================
// CONVERSATIONS
// ==========================================

export const createConversationSchema = z.object({
  type: z.enum(['single', 'group']),
  category: z.enum(['ai', 'ticket', 'p2p', 'dao', 'system']),
  title: z.string().optional(),
  description: z.string().optional(),
  participantIds: z.array(z.number()).min(1, 'A conversa precisa ter pelo menos um participante'),
});

export type CreateConversationDto = z.infer<typeof createConversationSchema>;

export const updateConversationSchema = z.object({
  title: z.string().optional(),
  description: z.string().optional(),
  status: z.string().optional(),
});

export type UpdateConversationDto = z.infer<typeof updateConversationSchema>;

// ==========================================
// MESSAGES
// ==========================================

export const sendMessageSchema = z.object({
  body: z.string().min(1, 'A mensagem não pode estar vazia'),
  type: z.string().default('text'),
  replyTo: z.string().optional(),
  metadata: z.any().optional(),
});

export type SendMessageDto = z.infer<typeof sendMessageSchema>;

// ==========================================
// READ & STATUS
// ==========================================

export const markAsReadSchema = z.object({
  messageId: z.string().uuid(),
});

export type MarkAsReadDto = z.infer<typeof markAsReadSchema>;
