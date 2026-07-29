import ws from 'k6/ws';
import { check } from 'k6';
import { Trend } from 'k6/metrics';

// Métricas Customizadas
const messageLatency = new Trend('message_latency');

export const options = {
  stages: [
    { duration: '30s', target: 50 }, // Ramp-up: 50 usuários
    { duration: '1m', target: 100 }, // Sustain: 100 usuários
    { duration: '30s', target: 0 }, // Ramp-down
  ],
};

const BASE_URL = __ENV.WS_BASE_URL || 'ws://127.0.0.1:8787';

export default function () {
  const conversationId = 'default-load-test-room';
  const url = `${BASE_URL}/api/platform/chat/conversations/${conversationId}/ws`;

  // Em ambiente real, o token seria provido pelo REST
  const params = {
    headers: { 'Sec-WebSocket-Protocol': 'asppibra-chat-v1, mock-ephemeral-token' },
  };

  const response = ws.connect(url, params, function (socket) {
    socket.on('open', () => {
      // Dispara 5 mensagens no decorrer do teste
      let msgsSent = 0;
      const interval = socket.setInterval(() => {
        if (msgsSent >= 5) {
          socket.clearInterval(interval);
          socket.close();
          return;
        }

        const payload = JSON.stringify({
          version: 1,
          type: 'MESSAGE_CREATED',
          payload: {
            id: `k6-msg-${msgsSent}-${__VU}-${__ITER}`,
            conversationId,
            body: `Load Test Message ${msgsSent} from VU ${__VU}`,
            senderId: `vu-${__VU}`,
          },
        });

        socket.send(payload);
        msgsSent++;
      }, 5000); // 1 msg a cada 5 segundos
    });

    socket.on('message', (msg) => {
      const data = JSON.parse(msg);
      check(data, {
        'version is 1': (d) => d.version === 1,
        'sequence exists': (d) => d.sequenceNumber > 0,
      });

      if (data.type === 'ACK') {
        // Log ACK Latency se passássemos timestamp original
      }
    });

    socket.on('close', () => console.log('VU ' + __VU + ' disconnected'));
  });

  check(response, { 'status is 101': (r) => r && r.status === 101 });
}
