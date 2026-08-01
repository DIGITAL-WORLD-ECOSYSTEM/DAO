import http from 'k6/http';
import { check, sleep } from 'k6';
import { Trend, Rate } from 'k6/metrics';

// Custom metrics
const latencyP95 = new Trend('latency_p95');
const errorRate = new Rate('error_rate');

export const options = {
  // Goal: P95 < 500ms, P99 < 1s, Error Rate < 1%
  thresholds: {
    http_req_duration: ['p(95)<500', 'p(99)<1000'],
    error_rate: ['rate<0.01'],
  },
  scenarios: {
    // Perfil A: Read Heavy (Pode rodar em produção)
    read_heavy: {
      executor: 'ramping-vus',
      startVUs: 0,
      stages: [
        { duration: '30s', target: 50 },
        { duration: '1m', target: 250 },
        { duration: '1m', target: 1000 },
        { duration: '30s', target: 0 },
      ],
      gracefulRampDown: '10s',
    },
  },
};

const BASE_URL = __ENV.API_URL || 'https://api.asppibra.com';

export default function () {
  // 1. Health Liveness (Edge caching)
  const res1 = http.get(`${BASE_URL}/api/core/health/live`);
  check(res1, { 'is status 200 (live)': (r) => r.status === 200 });
  errorRate.add(res1.status !== 200);

  // 2. Health Readiness (D1 Connection)
  const res2 = http.get(`${BASE_URL}/api/core/health/ready`);
  check(res2, { 'is status 200 (ready)': (r) => r.status === 200 });
  errorRate.add(res2.status !== 200);

  sleep(1);
}
