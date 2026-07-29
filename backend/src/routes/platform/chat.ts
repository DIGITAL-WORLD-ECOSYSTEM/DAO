import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import { createConversationSchema, sendMessageSchema } from '../../dto/chat.dto';
import { ChatService } from '../../services/chat/chat.service';
import { Bindings, Variables } from '../../types/bindings';

const chatApp = new Hono<{
  Bindings: Bindings;
  Variables: Variables;
}>();

// ==========================================
// Módulo: Chat (Mensageria P0)
// ==========================================

/**
 * [GET] /conversations
 * Lista todas as conversas do usuário autenticado.
 */
chatApp.get('/conversations', async (c) => {
  const user = c.var.user;
  const service = new ChatService(c.env.DB);
  
  const conversations = await service.getConversations(user.userId);
  
  return c.json({
    success: true,
    conversations,
  });
});

/**
 * [POST] /conversations
 * Cria uma nova sala de chat.
 */
chatApp.post(
  '/conversations', 
  zValidator('json', createConversationSchema), 
  async (c) => {
    const user = c.var.user;
    const body = c.req.valid('json');
    const service = new ChatService(c.env.DB);
    
    const result = await service.createConversation(user.userId, body);
    
    return c.json({
      success: true,
      conversationId: result.id,
      message: 'Conversa criada com sucesso.',
    });
  }
);

/**
 * [GET] /conversations/:id/messages
 * Retorna o histórico de mensagens da conversa (Paginado).
 */
chatApp.get('/conversations/:id/messages', async (c) => {
  const user = c.var.user;
  const conversationId = c.req.param('id');
  const limit = Number(c.req.query('limit')) || 50;
  const offset = Number(c.req.query('offset')) || 0;
  
  const service = new ChatService(c.env.DB);
  const messages = await service.getMessages(user.userId, conversationId, limit, offset);
  
  return c.json({
    success: true,
    messages,
  });
});

/**
 * [POST] /conversations/:id/messages
 * Envia uma mensagem para a conversa.
 */
chatApp.post(
  '/conversations/:id/messages', 
  zValidator('json', sendMessageSchema), 
  async (c) => {
    const user = c.var.user;
    const conversationId = c.req.param('id');
    const body = c.req.valid('json');
    
    const service = new ChatService(c.env.DB);
    const message = await service.sendMessage(user.userId, conversationId, body);
    
    return c.json({
      success: true,
      message,
    });
  }
);

// Endpoints mockados para P0, lógica a ser expandida no P1/P2
chatApp.post('/conversations/:id/read', async (c) => {
  return c.json({ success: true, message: 'Leitura registrada (P0 Stub).' });
});

chatApp.post('/conversations/:id/archive', async (c) => {
  return c.json({ success: true, message: 'Conversa arquivada (P0 Stub).' });
});

chatApp.post('/conversations/:id/pin', async (c) => {
  return c.json({ success: true, message: 'Conversa fixada (P0 Stub).' });
});

export default chatApp;
