import { eq, and, desc, inArray, or } from 'drizzle-orm';
import type { D1Database } from '@cloudflare/workers-types';
import { drizzle } from 'drizzle-orm/d1';
import { 
  chatConversations, 
  chatParticipants, 
  chatMessages, 
  chatAttachments, 
  chatReadReceipts, 
  chatEvents 
} from '../db/schema';
import type { CreateConversationDto, SendMessageDto } from '../dto/chat.dto';

export class ChatRepository {
  private db;

  constructor(d1: D1Database) {
    this.db = drizzle(d1);
  }

  // ==========================================
  // CONVERSATIONS
  // ==========================================

  async createConversation(
    id: string, 
    ownerId: number, 
    data: CreateConversationDto
  ) {
    return this.db.transaction(async (tx) => {
      // 1. Create the conversation
      await tx.insert(chatConversations).values({
        id,
        type: data.type,
        category: data.category,
        title: data.title,
        description: data.description,
        ownerId,
        status: 'active',
      });

      // 2. Add owner as participant
      const participantsToInsert = [
        {
          conversationId: id,
          userId: ownerId,
          role: 'owner',
        }
      ];

      // 3. Add other participants
      for (const participantId of data.participantIds) {
        if (participantId !== ownerId) {
          participantsToInsert.push({
            conversationId: id,
            userId: participantId,
            role: 'member',
          });
        }
      }

      await tx.insert(chatParticipants).values(participantsToInsert);

      // 4. Log the event
      await tx.insert(chatEvents).values({
        id: crypto.randomUUID(),
        conversationId: id,
        event: 'ROOM_CREATED',
        userId: ownerId,
      });

      return { id };
    });
  }

  async getUserConversations(userId: number) {
    // Busca as conversas que o usuário participa
    const participantRows = await this.db.select({
      conversationId: chatParticipants.conversationId,
    })
    .from(chatParticipants)
    .where(eq(chatParticipants.userId, userId));

    if (participantRows.length === 0) return [];

    const conversationIds = participantRows.map((r) => r.conversationId);

    // Retorna as conversas detalhadas
    return this.db.select()
      .from(chatConversations)
      .where(inArray(chatConversations.id, conversationIds))
      .orderBy(desc(chatConversations.updatedAt));
  }

  async getConversationById(id: string) {
    const result = await this.db.select()
      .from(chatConversations)
      .where(eq(chatConversations.id, id))
      .limit(1);
    
    return result[0] || null;
  }

  // ==========================================
  // MESSAGES
  // ==========================================

  async saveMessage(
    id: string, 
    conversationId: string, 
    senderId: number, 
    data: SendMessageDto
  ) {
    return this.db.transaction(async (tx) => {
      // 1. Save the message
      const msg = await tx.insert(chatMessages).values({
        id,
        conversationId,
        senderId,
        body: data.body,
        type: data.type,
        replyTo: data.replyTo,
        metadata: data.metadata,
      }).returning();

      // 2. Update conversation updatedAt
      await tx.update(chatConversations)
        .set({ updatedAt: new Date() })
        .where(eq(chatConversations.id, conversationId));

      // 3. Log event
      await tx.insert(chatEvents).values({
        id: crypto.randomUUID(),
        conversationId,
        event: 'MESSAGE_CREATED',
        userId: senderId,
      });

      return msg[0];
    });
  }

  async getMessagesByConversation(conversationId: string, limit = 50, offset = 0) {
    return this.db.select()
      .from(chatMessages)
      .where(eq(chatMessages.conversationId, conversationId))
      .orderBy(desc(chatMessages.createdAt))
      .limit(limit)
      .offset(offset);
  }

  // ==========================================
  // PARTICIPANTS
  // ==========================================

  async getParticipants(conversationId: string) {
    return this.db.select()
      .from(chatParticipants)
      .where(eq(chatParticipants.conversationId, conversationId));
  }

  async isUserInConversation(conversationId: string, userId: number) {
    const result = await this.db.select()
      .from(chatParticipants)
      .where(
        and(
          eq(chatParticipants.conversationId, conversationId),
          eq(chatParticipants.userId, userId)
        )
      )
      .limit(1);
      
    return result.length > 0;
  }
}
