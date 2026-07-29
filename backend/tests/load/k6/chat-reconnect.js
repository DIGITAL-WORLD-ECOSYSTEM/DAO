import ws from 'k6/ws';
import { check, sleep } from 'k6';
import { Trend, Counter } from 'k6/metrics';

const reconnectCount = new Counter('reconnect_count');

export const options = {
  stages: [
    { duration: '30s', target: 50 }, // Conecta 50
    { duration: '30s', target: 50 }, // Mantém 50
    { duration: '30s', target: 0 }, // Desconecta
  ],
};

const BASE_URL = __ENV.WS_BASE_URL || 'ws://127.0.0.1:8787';

export default function () {
  const conversationId = 'chaos-room';
  const url = `${BASE_URL}/api/platform/chat/conversations/${conversationId}/ws`;

  const params = {
    headers: { 'Sec-WebSocket-Protocol': 'asppibra-chat-v1, mock-ephemeral-token' },
  };

  function connectAndChaos(attempt) {
    if (attempt > 3) return; // Limita a 3 tentativas por VU

    const response = ws.connect(url, params, function (socket) {
      socket.on('open', () => {
        // Envia ping e logo após simula queda abrupta no cliente
        socket.send(
          JSON.stringify({
            version: 1,
            type: 'MESSAGE_CREATED',
            payload: { id: `chaos-${__VU}-${attempt}`, body: 'chaos' },
          })
        );

        socket.setTimeout(
          () => {
            socket.close(1006); // Simula drop de conexão "anormal"
          },
          Math.random() * 5000 + 1000
        ); // Entre 1 e 6 segundos
      });

      socket.on('close', (code) => {
        if (code === 1006) {
          reconnectCount.add(1);
          sleep(Math.random() * 3 + 1); // Jitter backoff delay simulado
          connectAndChaos(attempt + 1);
        }
      });
    });

    check(response, { 'status is 101': (r) => r && r.status === 101 });
  }

  connectAndChaos(1);
}
