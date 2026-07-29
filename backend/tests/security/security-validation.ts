import WebSocket from 'ws';

const BASE_URL = process.env.WS_BASE_URL || 'ws://127.0.0.1:8787';
const ROOM = 'security-room';

// 1. Simula token inválido
console.log('[Security Test] Testing Invalid Token...');
const wsInvalid = new WebSocket(`${BASE_URL}/api/platform/chat/conversations/${ROOM}/ws`, [
  'asppibra-chat-v1',
  'invalid-token-123',
]);

wsInvalid.on('error', (err) => {
  console.log('✅ [Security Test] Connection properly refused for invalid token.');
});
wsInvalid.on('close', (code) => {
  if (code !== 1000)
    console.log(`✅ [Security Test] Closed with code ${code} (Expected close on auth fail).`);
});

// 2. Simula Payload Injeção (Flood)
setTimeout(() => {
  console.log('[Security Test] Testing Flood / Rate Limit...');
  const wsFlood = new WebSocket(`${BASE_URL}/api/platform/chat/conversations/${ROOM}/ws`, [
    'asppibra-chat-v1',
    'mock-ephemeral-token',
  ]);

  wsFlood.on('open', () => {
    // Tenta quebrar o Rate Limiter enviando 1000 mensagens no mesmo segundo
    for (let i = 0; i < 1000; i++) {
      wsFlood.send(
        JSON.stringify({ version: 1, type: 'MESSAGE_CREATED', payload: { body: 'flood' } })
      );
    }
  });

  wsFlood.on('message', (data: any) => {
    const msg = JSON.parse(data.toString());
    if (msg.type === 'ERROR' && msg.payload.code === 'RATE_LIMIT_EXCEEDED') {
      console.log('✅ [Security Test] Flood blocked by Rate Limiter!');
      wsFlood.close();
    }
  });
}, 2000);
