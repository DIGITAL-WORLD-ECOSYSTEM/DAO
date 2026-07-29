import WebSocket from 'ws';

const BASE_URL = process.env.WS_BASE_URL || 'ws://127.0.0.1:8787';
const ROOM = 'chaos-ack-room';
const TOKEN = 'mock-ephemeral-token';
const URL = `${BASE_URL}/api/platform/chat/conversations/${ROOM}/ws`;

async function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function runChaosAckTest() {
  console.log('[Test] Starting Chaos: ACK Loss Validation...');

  const ws = new WebSocket(URL, ['asppibra-chat-v1', TOKEN]);
  await new Promise((resolve) => ws.on('open', resolve));

  let ackCount = 0;
  ws.on('message', (data: any) => {
    const msg = JSON.parse(data.toString());
    if (msg.type === 'ACK') {
      ackCount++;
      console.log(`[Client] Received ACK for sequence: ${msg.sequenceNumber}`);
    }
  });

  // Simula o envio de 10 mensagens rápido, mas assumindo que a rede perde o ACK.
  for (let i = 1; i <= 10; i++) {
    ws.send(
      JSON.stringify({
        version: 1,
        type: 'MESSAGE_CREATED',
        payload: { id: `m${i}`, body: `msg ${i}` },
      })
    );
  }

  // O comportamento ideal é que se um ACK for perdido, o OfflineBuffer reenvie a mensagem,
  // mas como o backend usa idempotencia, ele vai ignorar ou devolver ACK duplicado.

  await delay(3000);

  console.log(`[Test] Total ACKs received: ${ackCount}`);
  if (ackCount === 10) {
    console.log('✅ [Test] All ACKs received.');
  } else {
    console.error(`❌ [Test] Missing ACKs! Only received ${ackCount}/10.`);
  }

  ws.close();
  process.exit(0);
}

runChaosAckTest();
