import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import { createConversationSchema, sendMessageSchema } from '../../dto/chat.dto';
import { ChatService } from '../../services/chat/chat.service';
import { sign, verify } from 'hono/jwt';
import { Bindings, Variables } from '../../types/bindings';

const chatApp = new Hono<{
  Bindings: Bindings;
  Variables: Variables;
}>();

// ==========================================
// Módulo: Chat (Mensageria P0 / P1.2)
// ==========================================

/**
 * [GET] /ws-token
 * Gera um token efêmero para o handshake do WebSocket.
 */
chatApp.get('/ws-token', async (c) => {
  const user = c.var.user;

  // Token curto de 60 segundos
  const exp = Math.floor(Date.now() / 1000) + 60;

  const token = await sign({ userId: user.userId, exp, type: 'chat-ws' }, c.env.JWT_SECRET);

  return c.json({ success: true, token });
});

/**
 * [GET] /conversations/:id/ws
 * Rota de Upgrade HTTP 101 para WebSocket (Durable Object).
 * ACL validada via Sec-WebSocket-Protocol.
 */
chatApp.get('/conversations/:id/ws', async (c) => {
  const conversationId = c.req.param('id');
  const upgradeHeader = c.req.header('Upgrade');

  if (!upgradeHeader || upgradeHeader !== 'websocket') {
    return c.text('Expected Upgrade: websocket', 426);
  }

  // Extrair token do subprotocolo
  // Exemplo de header: "asppibra-chat-v1, eyJhbGciOi..."
  const protocolHeader = c.req.header('Sec-WebSocket-Protocol') || '';
  const protocols = protocolHeader.split(',').map((p) => p.trim());
  const token = protocols.length > 1 ? protocols[1] : null;

  if (!token) {
    return c.text('Missing Authentication Token in Subprotocol', 401);
  }

  let decodedToken: any;
  try {
    decodedToken = await verify(token, c.env.JWT_SECRET, 'HS256');
    if (decodedToken.type !== 'chat-ws') throw new Error('Invalid token type');
  } catch (error) {
    return c.text('Invalid or Expired Ephemeral Token', 401);
  }

  const userId = decodedToken.userId;

  // Validar se o usuário pertence à sala no D1
  const service = new ChatService(c.env.DB);
  const isInConversation = await service.isUserInConversation(userId, conversationId);

  if (!isInConversation) {
    return c.text('Forbidden: You do not belong to this conversation', 403);
  }

  // Upgrade para o Durable Object
  const id = c.env.CHAT_ROOM.idFromName(conversationId);
  const room = c.env.CHAT_ROOM.get(id);

  // Repassar metadados (IP, Browser) nos headers pro DO
  const headers = new Headers(c.req.raw.headers);
  headers.set('X-User-Id', userId.toString());
  headers.set('X-Device-Id', c.req.header('User-Agent') || 'unknown');

  const doRequest = new Request(c.req.url, {
    method: 'GET',
    headers: headers,
  });

  return room.fetch(doRequest);
});

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
chatApp.post('/conversations', zValidator('json', createConversationSchema), async (c) => {
  const user = c.var.user;
  const body = c.req.valid('json');
  const service = new ChatService(c.env.DB);

  const result = await service.createConversation(user.userId, body);

  return c.json({
    success: true,
    conversationId: result.id,
    message: 'Conversa criada com sucesso.',
  });
});

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
chatApp.post('/conversations/:id/messages', zValidator('json', sendMessageSchema), async (c) => {
  const user = c.var.user;
  const conversationId = c.req.param('id');
  const body = c.req.valid('json');

  const service = new ChatService(c.env.DB);
  const message = await service.sendMessage(user.userId, conversationId, body);

  return c.json({
    success: true,
    message,
  });
});

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
