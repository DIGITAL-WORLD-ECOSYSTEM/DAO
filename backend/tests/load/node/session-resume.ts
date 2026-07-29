/**
 * Node Script: Session Resume & Gaps Test
 * Run with: npx tsx backend/tests/load/node/session-resume.ts
 */

import WebSocket from 'ws';

const BASE_URL = process.env.WS_BASE_URL || 'ws://127.0.0.1:8787';
const ROOM = 'session-resume-room';
const TOKEN = 'mock-ephemeral-token';
const URL = `${BASE_URL}/api/platform/chat/conversations/${ROOM}/ws`;

async function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function runSessionResumeTest() {
  console.log('[Test] Starting Session Resume Validation...');

  // Conexão 1 - O "Gerador" de mensagens
  const generator = new WebSocket(URL, ['asppibra-chat-v1', TOKEN]);

  await new Promise((resolve) => generator.on('open', resolve));
  console.log('[Generator] Connected.');

  // Conexão 2 - O "Receiver" que vai cair e voltar
  const receiver = new WebSocket(URL, ['asppibra-chat-v1', TOKEN]);

  let lastSeq = 0;

  receiver.on('message', (data: any) => {
    const msg = JSON.parse(data.toString());
    if (msg.sequenceNumber) {
      lastSeq = msg.sequenceNumber;
      console.log(`[Receiver] Received seq: ${lastSeq}`);
    }
  });

  await new Promise((resolve) => receiver.on('open', resolve));

  // 1. Envia 2 mensagens
  generator.send(
    JSON.stringify({ version: 1, type: 'MESSAGE_CREATED', payload: { id: 'm1', body: 'msg 1' } })
  );
  await delay(500);
  generator.send(
    JSON.stringify({ version: 1, type: 'MESSAGE_CREATED', payload: { id: 'm2', body: 'msg 2' } })
  );
  await delay(1000);

  console.log(`[Test] Receiver last sequence: ${lastSeq}. Dropping Receiver...`);

  // 2. Derruba o receiver
  receiver.close(1006);
  await delay(1000);

  // 3. Gerador continua mandando mensagens que o receiver vai "perder"
  generator.send(
    JSON.stringify({
      version: 1,
      type: 'MESSAGE_CREATED',
      payload: { id: 'm3', body: 'msg 3 (missed)' },
    })
  );
  await delay(500);
  generator.send(
    JSON.stringify({
      version: 1,
      type: 'MESSAGE_CREATED',
      payload: { id: 'm4', body: 'msg 4 (missed)' },
    })
  );
  await delay(1000);

  // 4. Reconecta o Receiver informando o SESSION_RESUME
  console.log('[Test] Reconnecting receiver with lastSeq: ' + lastSeq);
  const resumedReceiver = new WebSocket(URL, ['asppibra-chat-v1', TOKEN]);

  resumedReceiver.on('open', () => {
    resumedReceiver.send(
      JSON.stringify({
        version: 1,
        type: 'SESSION_RESUME',
        payload: { lastSequence: lastSeq },
      })
    );
  });

  let missedRecovered = 0;
  resumedReceiver.on('message', (data: any) => {
    const msg = JSON.parse(data.toString());
    if (msg.payload && msg.payload.body && msg.payload.body.includes('(missed)')) {
      missedRecovered++;
      console.log(
        `[ResumedReceiver] Recovered missed message: ${msg.payload.body} (seq: ${msg.sequenceNumber})`
      );
    }
  });

  await delay(2000);

  if (missedRecovered === 2) {
    console.log('✅ [Test] Session Resume SUCCESS! All missed messages recovered.');
  } else {
    console.error(`❌ [Test] Session Resume FAILED! Recovered ${missedRecovered}/2 messages.`);
  }

  generator.close();
  resumedReceiver.close();
  process.exit(0);
}

runSessionResumeTest();
