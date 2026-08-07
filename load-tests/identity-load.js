import http from 'k6/http';
import { check, sleep } from 'k6';

// Nível 1 - CI (Smoke/Regression) - Pode ser configurado via ENV VAR
export const options = {
  stages: [
    { duration: '30s', target: 20 }, // Rampa para 20 VUs
    { duration: '1m', target: 20 },  // Mantém 20 VUs
    { duration: '10s', target: 0 },  // Reduz para 0 VUs
  ],
  thresholds: {
    // Performance Budgets (SLOs)
    http_req_duration: ['p(95)<2000'], // 95% das requisições abaixo de 2s
    http_req_failed: ['rate<0.01'],    // Erros abaixo de 1%
  },
};

const BASE_URL = __ENV.BASE_URL || 'http://localhost:8787';

export default function () {
  // 1. Testa Rota de Login (Rate limit deve segurar falhas se usarmos credenciais falsas, ou testamos mock)
  const loginPayload = JSON.stringify({
    email: `loadtest_${__VU}@asppibra.com.br`,
    password: 'Password123!',
  });

  const headers = { 'Content-Type': 'application/json' };

  // Chamada de Login
  const loginRes = http.post(`${BASE_URL}/api/v1/identity/login`, loginPayload, { headers });
  
  // Validamos se o status é 400/401/200 (se falhar auth, 401 é sucesso do rate limit, 500 é falha de sistema)
  check(loginRes, {
    'login is not 500': (r) => r.status !== 500,
    'login response time < 2s': (r) => r.timings.duration < 2000,
  });

  sleep(1);

  // 2. Testa Recuperação de Senha (Anti-enumeração)
  const forgotPayload = JSON.stringify({
    email: `loadtest_${__VU}@asppibra.com.br`,
  });

  const forgotRes = http.post(`${BASE_URL}/api/v1/identity/forgot-password`, forgotPayload, { headers });
  
  // Rota de recuperação DEVE retornar 200 sempre (anti-enumeração)
  check(forgotRes, {
    'forgot-password is 200': (r) => r.status === 200,
    'forgot-password response time < 1s': (r) => r.timings.duration < 1000,
  });

  sleep(1);
}
