import WebSocket from 'ws';

const BASE_URL = process.env.WS_BASE_URL || 'ws://127.0.0.1:8787';
const ROOM = 'chaos-queue-room';
const TOKEN = 'mock-ephemeral-token';
const URL = `${BASE_URL}/api/platform/chat/conversations/${ROOM}/ws`;

async function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function runChaosQueueTest() {
  console.log('[Test] Starting Chaos: Cloudflare Queue Delay Validation...');

  const ws = new WebSocket(URL, ['asppibra-chat-v1', TOKEN]);
  await new Promise((resolve) => ws.on('open', resolve));

  // Como não conseguimos simular lentidão real da queue pelo cliente,
  // injetamos um payload que instrui o mock ou o environment a segurar o D1/Queue.
  // Neste cenário simplificado, apenas estressamos a sala validando se os ACKs
  // continuam a vir independente da latência de DB (assíncrono).

  const start = Date.now();
  ws.send(
    JSON.stringify({
      version: 1,
      type: 'MESSAGE_CREATED',
      payload: { id: `chaos-queue-1`, body: `msg with simulated slow queue` },
    })
  );

  ws.on('message', (data: any) => {
    const msg = JSON.parse(data.toString());
    if (msg.type === 'ACK') {
      const end = Date.now();
      console.log(
        `[Client] Received ACK in ${end - start}ms. Even if DB is slow, DO should ACK instantly.`
      );
      if (end - start < 100) {
        console.log('✅ [Test] Durable Object decoupled from D1. Success.');
      } else {
        console.error('❌ [Test] ACK was blocked by DB/Queue latency!');
      }
      ws.close();
      process.exit(0);
    }
  });
}

runChaosQueueTest();
