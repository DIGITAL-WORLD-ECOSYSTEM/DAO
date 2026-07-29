/**
 * Soak Test (Long Running Test)
 *
 * Executa por 24h para identificar vazamentos de memória ou objetos órfãos no DO.
 * Run: npx tsx backend/tests/load/node/soak-test.ts
 */

import WebSocket from 'ws';

const BASE_URL = process.env.WS_BASE_URL || 'ws://127.0.0.1:8787';
const ROOM = 'soak-test-room';
const TOKEN = 'mock-ephemeral-token';
const URL = `${BASE_URL}/api/platform/chat/conversations/${ROOM}/ws`;

console.log('[Soak Test] Starting 24h Soak Test...');

let totalMessages = 0;
let connectionsCount = 0;
const DURATION = 24 * 60 * 60 * 1000; // 24h

function createSoakConnection(id: number) {
  const ws = new WebSocket(URL, ['asppibra-chat-v1', TOKEN]);
  let interval: NodeJS.Timeout;

  ws.on('open', () => {
    connectionsCount++;
    console.log(`[Soak Test] Connection ${id} opened. Total: ${connectionsCount}`);

    // Heartbeat & Low-frequency payload every 30s
    interval = setInterval(() => {
      ws.send(
        JSON.stringify({
          version: 1,
          type: 'MESSAGE_CREATED',
          payload: { id: `soak-${id}-${Date.now()}`, body: 'soak' },
        })
      );
      totalMessages++;
    }, 30000);
  });

  ws.on('close', () => {
    connectionsCount--;
    clearInterval(interval);
    console.log(`[Soak Test] Connection ${id} closed. Reconnecting...`);
    // Soak test keeps reconnecting silently
    setTimeout(() => createSoakConnection(id), 5000);
  });
}

// Inicia 20 conexões concorrentes permanentes
for (let i = 1; i <= 20; i++) {
  setTimeout(() => createSoakConnection(i), i * 1000);
}

// Monitor de Saúde
setInterval(() => {
  const memoryUsage = process.memoryUsage();
  console.log(
    `[Soak Test Metrics] Conns: ${connectionsCount} | Msgs: ${totalMessages} | RSS: ${Math.round(memoryUsage.rss / 1024 / 1024)}MB`
  );
}, 60000); // 1 minuto

setTimeout(() => {
  console.log('[Soak Test] 24h Completed. Exiting.');
  process.exit(0);
}, DURATION);
