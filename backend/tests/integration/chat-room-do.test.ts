import {
  env,
  createExecutionContext,
  waitOnExecutionContext,
  getDurableObjectStub,
} from 'cloudflare:test';
import { describe, it, expect, vi } from 'vitest';

// Na documentação do vitest-pool-workers, testar WebSocket requer invocar o fetch do DO.
// Como testar websockets com o miniflare requer configurações avançadas,
// faremos um teste que invoca o DO por uma rota HTTP que retorna um 101 Switching Protocols.

describe('ChatRoomDO Integration', () => {
  it('should accept WebSocket upgrade requests', async () => {
    const id = env.ChatRoomDO.newUniqueId();
    const stub = env.ChatRoomDO.get(id);

    // Mock ephemeral token
    const request = new Request('https://do.test/ws', {
      headers: {
        Upgrade: 'websocket',
        'Sec-WebSocket-Protocol': 'asppibra-chat-v1, dummy-token',
      },
    });

    const response = await stub.fetch(request);

    // O DO deve aceitar e fazer upgrade
    expect(response.status).toBe(101);
    expect(response.webSocket).toBeDefined();

    // Se estiver definido, significa que o DO aceitou a conexão
    const ws = response.webSocket;
    if (ws) {
      ws.accept();
      ws.close();
    }
  });
});
