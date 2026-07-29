import { MessageBatch } from '@cloudflare/workers-types';
import { Bindings } from '../types/bindings';
import { Logger } from '../utils/logger';
import { drizzle } from 'drizzle-orm/d1';
import { chatEvents, chatParticipants } from '../db/schema';
import { ChatPipelineEvent, ChatEventType } from '../events/chat.events';
import { eq, and } from 'drizzle-orm';

export class ChatQueueWorker {
  static async consume(batch: MessageBatch<ChatPipelineEvent>, env: Bindings): Promise<void> {
    const logger = new Logger('ChatQueueWorker');
    const db = drizzle(env.DB);
    
    logger.info(`Processando batch de ${batch.messages.length} mensagens da fila de chat.`);

    for (const msg of batch.messages) {
      try {
        const event = msg.body;
        
        // 1. Gravar no Log de Auditoria (chatEvents)
        await db.insert(chatEvents).values({
          id: event.eventId,
          conversationId: event.conversationId,
          event: event.type,
          userId: event.userId,
          metadata: event.payload ? JSON.stringify(event.payload) : null,
          createdAt: new Date(event.timestamp)
        }).onConflictDoNothing();

        // 2. Processamento assíncrono específico por Evento
        switch (event.type) {
          case ChatEventType.USER_PRESENCE_CHANGED:
            if (event.payload && event.payload.status) {
              await db.update(chatParticipants)
                .set({ 
                  presence: event.payload.status,
                  lastSeen: new Date()
                })
                .where(eq(chatParticipants.userId, event.userId));
            }
            break;
            
          case ChatEventType.MESSAGE_CREATED:
            // TODO: Integrar com módulo de Notificações (Push Notification/Email) se destinatários estiverem offline.
            // TODO: Integrar com módulo AI se a categoria for 'ai'.
            break;
            
          // Outros eventos não exigem mutação de estado imediato no BD além do log.
        }

        msg.ack(); // Marca a mensagem como processada com sucesso
      } catch (error: any) {
        logger.error(`Falha ao processar mensagem do chat queue: ${error.message}`, {
          messageId: msg.id,
          body: msg.body
        });
        msg.retry(); // Devolve para a fila processar novamente
      }
    }
  }
}
