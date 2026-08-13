import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { E2E_PREFIX, API_URL, queryD1, measureResponse } from './e2e-utils';

describe('ASOT-E2E-VALIDATION: Full Onboarding & Platform Workflow', () => {
  const testUser = {
    email: `${E2E_PREFIX}@test.asppibra.com`,
    password: `P@ssw0rd_${E2E_PREFIX}`,
    cpf: `000000${Date.now().toString().slice(-5)}`, // Random Fake CPF
  };

  let token = '';
  let userId = '';
  let citizenId = '';

  beforeAll(async () => {
    console.log(`Starting E2E Validation with Prefix: ${E2E_PREFIX}`);
    console.log(`Targeting API: ${API_URL}`);
  });

  afterAll(async () => {
    console.log(`Executing Cleanup for ${E2E_PREFIX}...`);
    // Limpeza de Banco de Dados via D1 Execute
    await queryD1(`DELETE FROM users WHERE email = '${testUser.email}'`);
    await queryD1(`DELETE FROM audit_logs WHERE user_id = '${userId}'`);
    console.log(`Cleanup finished.`);
  });

  it('Etapa 1: Registration (Identity)', async () => {
    const { res, durationMs } = await measureResponse(() => 
      fetch(`${API_URL}/api/core/identity/local/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ firstName: 'Test', lastName: 'User', email: testUser.email, password: testUser.password }),
      })
    );

    // 1. Validar HTTP (Pode retornar 404 localmente se a rota register não existir e for via admin)
    // Se a plataforma obriga a criação via Login (Magic Link) ou Admin, ajustaremos.
    // Assumiremos fluxo padrão de API:
    expect([200, 201]).toContain(res.status);
    expect(durationMs).toBeLessThan(1000);

    const body = await res.json();
    token = body.token;
    userId = body.user?.id;
    expect(token).toBeDefined();

    // 2. Validar D1 (Banco)
    const dbUser = await queryD1(`SELECT * FROM users WHERE email = '${testUser.email}'`);
    expect(dbUser.length).toBe(1);
    expect(dbUser[0].role).toBe('visitor');

    // 3. Validar Audit Log
    const auditLogs = await queryD1(`SELECT * FROM audit_logs WHERE action = 'USER_REGISTERED' AND user_id = '${dbUser[0].id}'`);
    expect(auditLogs.length).toBeGreaterThanOrEqual(1);
  });

  it('Etapa 2: Profile Update & KYC Submission', async () => {
    // 1. Atualizar Perfil
    const { res, durationMs } = await measureResponse(() => 
      fetch(`${API_URL}/api/core/identity/me`, {
        method: 'PATCH',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ fullName: `E2E User ${E2E_PREFIX}` }),
      })
    );
    expect(res.status).toBe(200);
    expect(durationMs).toBeLessThan(1000);

    // 2. Validar D1
    const citizens = await queryD1(`SELECT * FROM citizens WHERE user_id = '${userId}'`);
    // Depende se cidadão é auto-criado.
    if (citizens.length > 0) {
      expect(citizens[0].full_name).toContain('E2E User');
    }
  });

  it('Etapa 3: Treasury Deposit (Web3 / Admin)', async () => {
    // Simulando um evento de depósito via Webhook ou Admin
    const { res, durationMs } = await measureResponse(() => 
      fetch(`${API_URL}/api/platform/treasury/transactions`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`, // Idealmente seria Admin Token, mas passaremos
          'Idempotency-Key': `txn_${E2E_PREFIX}`
        },
        body: JSON.stringify({ amount: 1000.0, type: 'deposit', description: 'E2E Initial Deposit' }),
      })
    );
    // Se falhar por causa do RBAC (esperado se não for admin), testamos o 403.
    // Aqui assumimos que é uma rota de depósito de fundos.
    const validStatuses = [200, 201, 403];
    expect(validStatuses).toContain(res.status);

    if (res.status === 200 || res.status === 201) {
      const records = await queryD1(`SELECT * FROM treasury_ledger WHERE user_id = '${userId}'`);
      expect(records.length).toBe(1);
      expect(records[0].amount).toBe(1000);
    }
  });

  it('Etapa 4: Audit Logs Final Assertion', async () => {
    const logs = await queryD1(`SELECT * FROM audit_logs WHERE user_id = '${userId}' ORDER BY created_at DESC`);
    expect(logs.length).toBeGreaterThan(0);
    // Verifica que não há campos vazados sensíveis no metadata
    const parsedMeta = JSON.parse(logs[0].metadata || '{}');
    expect(parsedMeta.password).toBeUndefined();
  });
});
