import { DurableObject } from 'cloudflare:workers';
import { Bindings } from '../../types/bindings';
import { ChatEventType } from '../../events/chat.events';

interface ConnectionInfo {
  userId: number;
  deviceId?: string;
  platform?: string;
  browser?: string;
  ipHash?: string;
  connectedAt: number;
  lastHeartbeat: number;
  presence: 'ONLINE' | 'AWAY' | 'OFFLINE' | 'DO_NOT_DISTURB' | 'INVISIBLE';
  lastSequence: number;
  messageCount: number; // For rate limiting
  windowStart: number; // For rate limiting
}

export class ChatRoomDO extends DurableObject<Bindings> {
  private connections: Map<WebSocket, ConnectionInfo>;
  private typingUsers: Set<number>;
  private globalSequence: number;

  constructor(ctx: DurableObjectState, env: Bindings) {
    super(ctx, env);
    this.connections = new Map();
    this.typingUsers = new Set();
    this.globalSequence = 0;

    // Inicia o loop de heartbeat (a cada 30 segundos)
    ctx.blockConcurrencyWhile(async () => {
      setInterval(() => this.checkHeartbeats(), 30000);
    });
  }

  async fetch(request: Request): Promise<Response> {
    if (request.headers.get('Upgrade') !== 'websocket') {
      return new Response('Expected Upgrade: websocket', { status: 426 });
    }

    const url = new URL(request.url);
    const conversationId = url.pathname.split('/').slice(-2, -1)[0];
    
    // Auth context extracted from the request (passed by the Hono router)
    const userId = Number(request.headers.get('X-User-Id'));
    const deviceId = request.headers.get('X-Device-Id') || 'unknown';
    
    if (!userId) {
      return new Response('Unauthorized', { status: 401 });
    }

    const { 0: client, 1: server } = new WebSocketPair();
    
    this.handleConnection(server, userId, deviceId, conversationId);

    return new Response(null, {
      status: 101,
      webSocket: client,
    });
  }

  private handleConnection(ws: WebSocket, userId: number, deviceId: string, conversationId: string) {
    ws.accept();

    const connectionInfo: ConnectionInfo = {
      userId,
      deviceId,
      connectedAt: Date.now(),
      lastHeartbeat: Date.now(),
      presence: 'ONLINE',
      lastSequence: this.globalSequence,
      messageCount: 0,
      windowStart: Date.now(),
    };

    this.connections.set(ws, connectionInfo);

    // Notify others that user joined
    this.broadcast({
      version: 1,
      type: ChatEventType.USER_JOINED,
      conversationId,
      userId,
      timestamp: Date.now(),
      payload: { presence: 'ONLINE' }
    });

    ws.addEventListener('message', async (event) => {
      try {
        const data = JSON.parse(event.data as string);
        await this.handleMessage(ws, data, connectionInfo, conversationId);
      } catch (err) {
        ws.send(JSON.stringify({ error: 'Invalid message format' }));
      }
    });

    ws.addEventListener('close', () => {
      this.connections.delete(ws);
      this.broadcast({
        version: 1,
        type: ChatEventType.USER_LEFT,
        conversationId,
        userId,
        timestamp: Date.now(),
        payload: { presence: 'OFFLINE' }
      });
      
      // Update Presence in DB via Queue
      this.publishToQueue({
        eventId: crypto.randomUUID(),
        type: ChatEventType.USER_PRESENCE_CHANGED,
        conversationId,
        userId,
        timestamp: Date.now(),
        payload: { status: 'offline' }
      });
    });
  }

  private async handleMessage(ws: WebSocket, data: any, info: ConnectionInfo, conversationId: string) {
    // 1. Rate Limiting: 20 messages per 10 seconds
    const now = Date.now();
    if (now - info.windowStart > 10000) {
      info.windowStart = now;
      info.messageCount = 0;
    }
    
    if (info.messageCount >= 20) {
      ws.send(JSON.stringify({ version: 1, type: 'MESSAGE_RATE_LIMITED' }));
      return;
    }
    info.messageCount++;
    info.lastHeartbeat = now; // Any message counts as heartbeat

    // 2. Routing
    switch (data.type) {
      case 'PING':
        ws.send(JSON.stringify({ type: 'PONG', timestamp: now }));
        break;

      case ChatEventType.MESSAGE_CREATED:
        this.globalSequence++;
        const messagePayload = {
          version: 1,
          type: ChatEventType.MESSAGE_CREATED,
          sequenceNumber: this.globalSequence,
          conversationId,
          userId: info.userId,
          timestamp: now,
          payload: data.payload,
        };
        
        // Broadcast to room
        this.broadcast(messagePayload, ws); // exclude sender
        
        // Send ACK back to sender
        ws.send(JSON.stringify({
          version: 1,
          type: 'ACK',
          originalMessageId: data.payload.id,
          sequenceNumber: this.globalSequence,
          timestamp: now
        }));

        // Send to Queue for Async DB Persistance
        await this.publishToQueue({
          eventId: crypto.randomUUID(),
          ...messagePayload
        });
        break;

      case ChatEventType.USER_TYPING:
      case ChatEventType.USER_STOPPED_TYPING:
        this.broadcast({
          version: 1,
          type: data.type,
          conversationId,
          userId: info.userId,
          timestamp: now
        }, ws);
        break;

      // Adicione outros eventos conforme necessário
    }
  }

  private broadcast(message: any, excludeWs?: WebSocket) {
    const msgStr = JSON.stringify(message);
    for (const [ws, info] of this.connections.entries()) {
      if (ws !== excludeWs) {
        try {
          ws.send(msgStr);
          info.lastSequence = message.sequenceNumber || info.lastSequence;
        } catch (e) {
          this.connections.delete(ws);
        }
      }
    }
  }

  private checkHeartbeats() {
    const now = Date.now();
    for (const [ws, info] of this.connections.entries()) {
      // Timeout after 60 seconds of inactivity
      if (now - info.lastHeartbeat > 60000) {
        ws.close(1011, 'Heartbeat timeout');
        this.connections.delete(ws);
      }
    }
  }

  private async publishToQueue(event: any) {
    if (this.env.CHAT_PIPELINE_QUEUE) {
      await this.env.CHAT_PIPELINE_QUEUE.send(event);
    }
  }
}
