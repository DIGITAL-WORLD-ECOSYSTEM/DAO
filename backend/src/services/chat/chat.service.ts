import { ChatRepository } from '../../repositories/chat.repository';
import type { D1Database } from '@cloudflare/workers-types';
import type { CreateConversationDto, SendMessageDto } from '../../dto/chat.dto';
import { HTTPException } from 'hono/http-exception';

export class ChatService {
  private repository: ChatRepository;

  constructor(d1: D1Database) {
    this.repository = new ChatRepository(d1);
  }

  async getConversations(userId: number) {
    return this.repository.getUserConversations(userId);
  }

  async createConversation(userId: number, data: CreateConversationDto) {
    // Validação básica
    if (data.type === 'single' && data.participantIds.length !== 1) {
      throw new HTTPException(400, { message: 'Conversas individuais precisam de exatamente 1 outro participante.' });
    }

    const conversationId = crypto.randomUUID();
    return this.repository.createConversation(conversationId, userId, data);
  }

  async getMessages(userId: number, conversationId: string, limit = 50, offset = 0) {
    // 1. Verificar se o usuário participa desta conversa
    const isParticipant = await this.repository.isUserInConversation(conversationId, userId);
    
    if (!isParticipant) {
      throw new HTTPException(403, { message: 'Acesso negado. Você não participa desta conversa.' });
    }

    // 2. Retornar mensagens
    return this.repository.getMessagesByConversation(conversationId, limit, offset);
  }

  async sendMessage(userId: number, conversationId: string, data: SendMessageDto) {
    // 1. Verificar se a conversa existe e o usuário é participante
    const isParticipant = await this.repository.isUserInConversation(conversationId, userId);
    
    if (!isParticipant) {
      throw new HTTPException(403, { message: 'Acesso negado. Você não participa desta conversa.' });
    }

    // 2. Gravar a mensagem
    const messageId = crypto.randomUUID();
    return this.repository.saveMessage(messageId, conversationId, userId, data);
  }
}
