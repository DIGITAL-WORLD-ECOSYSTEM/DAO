import { describe, it, expect, beforeEach, beforeAll } from 'vitest';
import { E2E_PREFIX, API_URL, queryD1, measureResponse } from './e2e-utils';

describe('ASOT-E2E-VALIDATION: Notifications Core', () => {
  const testUser = {
    email: `${E2E_PREFIX}_notify@test.asppibra.com`,
    password: `P@ssw0rd_${E2E_PREFIX}`,
  };
  const testUser2 = {
    email: `${E2E_PREFIX}_notify2@test.asppibra.com`,
    password: `P@ssw0rd_${E2E_PREFIX}`,
  };

  let accessTokenA = '';
  let userIdA = '';
  let accessTokenB = '';
  let userIdB = '';
  let notificationIdA = 0;

  beforeAll(async () => {
    console.log(`Starting Notifications E2E Validation with Prefix: ${E2E_PREFIX}`);
    
    // Register User A
    const resA = await fetch(`${API_URL}/api/core/identity/local/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ firstName: 'Test', lastName: 'User', email: testUser.email, password: testUser.password }),
    });
    const bodyA = await resA.json();
    accessTokenA = bodyA.accessToken || '';
    userIdA = bodyA.user?.id || '0';

    // Register User B
    const resB = await fetch(`${API_URL}/api/core/identity/local/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ firstName: 'Test', lastName: 'User', email: testUser2.email, password: testUser2.password }),
    });
    const bodyB = await resB.json();
    accessTokenB = bodyB.accessToken || '';
    userIdB = bodyB.user?.id || '0';
  });

  it('Cenário A — lista vazia inicial e Auth Protection', async () => {
    // 1. Without Auth
    const noAuth = await fetch(`${API_URL}/api/core/notifications`, {
      method: 'GET'
    });
    expect([401, 403]).toContain(noAuth.status);

    // 2. With Auth, should be empty initially
    const { res, durationMs } = await measureResponse(() => 
      fetch(`${API_URL}/api/core/notifications`, {
        method: 'GET',
        headers: { 'Authorization': `Bearer ${accessTokenA}` }
      })
    );
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.success).toBe(true);
    expect(body.data.length).toBe(0);
  });

  it('Cenário B — Inserir notificação via D1 e ler via API', async () => {
    // Inserting directly into D1 since we don't have a POST route for public consumption
    const sql = `INSERT INTO notifications (user_id, type, category, title, message, is_read, created_at) VALUES (${userIdA}, 'system', 'test', 'Test Notification A', 'Message A', 0, strftime('%s', 'now')) RETURNING id;`;
    const insertRes = await queryD1(sql);
    notificationIdA = insertRes[0]?.id;

    expect(notificationIdA).toBeDefined();

    // Fetch via API
    const res = await fetch(`${API_URL}/api/core/notifications`, {
      method: 'GET',
      headers: { 'Authorization': `Bearer ${accessTokenA}` }
    });
    const body = await res.json();
    
    expect(body.data.length).toBe(1);
    expect(body.data[0].title).toBe('Test Notification A');
    expect(body.data[0].isRead).toBe(false);
  });

  it('Cenário C — Contagem unread', async () => {
    const res = await fetch(`${API_URL}/api/core/notifications/unread-count`, {
      method: 'GET',
      headers: { 'Authorization': `Bearer ${accessTokenA}` }
    });
    const body = await res.json();
    expect(body.success).toBe(true);
    expect(body.data.count).toBeGreaterThanOrEqual(1);
  });

  it('Cenário F — Isolamento (Usuário B não vê notificação A)', async () => {
    // Listar para Usuário B
    const res = await fetch(`${API_URL}/api/core/notifications`, {
      method: 'GET',
      headers: { 'Authorization': `Bearer ${tokenB}` }
    });
    const body = await res.json();
    expect(body.data.length).toBe(0); // Não deve ver as de A

    // Usuário B tenta marcar notificação A como lida
    const resRead = await fetch(`${API_URL}/api/core/notifications/${notificationIdA}/read`, {
      method: 'PUT',
      headers: { 'Authorization': `Bearer ${tokenB}` }
    });
    expect([400, 403, 404]).toContain(resRead.status); // Deve ser negado ou não encontrado
  });

  it('Cenário D — Marcar como lida', async () => {
    const res = await fetch(`${API_URL}/api/core/notifications/${notificationIdA}/read`, {
      method: 'PUT',
      headers: { 'Authorization': `Bearer ${accessTokenA}` }
    });
    expect(res.status).toBe(200);

    // Check count again
    const resCount = await fetch(`${API_URL}/api/core/notifications/unread-count`, {
      method: 'GET',
      headers: { 'Authorization': `Bearer ${accessTokenA}` }
    });
    const bodyCount = await resCount.json();
    expect(bodyCount.data.count).toBe(0);
  });

  it('Cenário G — ID Inexistente', async () => {
    const res = await fetch(`${API_URL}/api/core/notifications/9999999/read`, {
      method: 'PUT',
      headers: { 'Authorization': `Bearer ${accessTokenA}` }
    });
    expect([404, 400]).toContain(res.status); // 404 Not Found expected
  });

  it('Cenário E — Marcar todas como lidas', async () => {
    // Insert 2 unread for User A
    await queryD1(`INSERT INTO notifications (user_id, type, category, title, is_read, created_at) VALUES (${userIdA}, 'system', 't', 't1', 0, strftime('%s', 'now'))`);
    await queryD1(`INSERT INTO notifications (user_id, type, category, title, is_read, created_at) VALUES (${userIdA}, 'system', 't', 't2', 0, strftime('%s', 'now'))`);

    const countRes = await fetch(`${API_URL}/api/core/notifications/unread-count`, {
      headers: { 'Authorization': `Bearer ${accessTokenA}` }
    });
    const countBody = await (countRes).json();
    expect(countBody.data.count).toBe(2);

    const markAllRes = await fetch(`${API_URL}/api/core/notifications/read-all`, {
      method: 'PUT',
      headers: { 'Authorization': `Bearer ${accessTokenA}` }
    });
    expect(markAllRes.status).toBe(200);

    const checkCountRes = await fetch(`${API_URL}/api/core/notifications/unread-count`, {
      headers: { 'Authorization': `Bearer ${accessTokenA}` }
    });
    const checkCountBody = await (checkCountRes).json();
    expect(checkCountBody.data.count).toBe(0);
  });
});
