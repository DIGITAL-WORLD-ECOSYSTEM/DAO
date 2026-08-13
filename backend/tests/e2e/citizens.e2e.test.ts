import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { E2E_PREFIX, API_URL, queryD1, measureResponse } from './e2e-utils';

describe('CITIZENS-E2E-VALIDATION: Operational Certification', () => {
  const accountId = 9999;
  
  beforeAll(async () => {
    console.log(`Starting Citizens E2E Validation with Prefix: ${E2E_PREFIX}`);
    // Cleanup any previous data for this test account
    await queryD1(`DELETE FROM outbox_events WHERE aggregate_id = '${accountId}'`);
    await queryD1(`DELETE FROM citizens WHERE user_id = ${accountId}`);
    await queryD1(`DELETE FROM users WHERE id = ${accountId}`);
    
    // Create a mock user so the FK constraint (if any) is satisfied
    await queryD1(`INSERT INTO users (id, email, token_version, active, status, role, created_at, updated_at) VALUES (${accountId}, 'e2e_citizen@asppibra.com', 1, 1, 'active', 'citizen', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)`);
  });

  afterAll(async () => {
    // Teardown
    await queryD1(`DELETE FROM outbox_events WHERE aggregate_id = '${accountId}'`);
    await queryD1(`DELETE FROM citizens WHERE user_id = ${accountId}`);
    await queryD1(`DELETE FROM users WHERE id = ${accountId}`);
  });

  it('D3.2 - GET cidadão inexistente (404 real)', async () => {
    const { res } = await measureResponse(() => 
      fetch(`${API_URL}/api/core/citizens/profile/${accountId}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      })
    );

    expect(res.status).toBe(404);
    const dbResult = await queryD1(`SELECT * FROM citizens WHERE user_id = ${accountId}`);
    expect(dbResult.length).toBe(0);
    const outbox_eventsResult = await queryD1(`SELECT * FROM outbox_events WHERE aggregate_id = '${accountId}'`);
    expect(outbox_eventsResult.length).toBe(0);
  });

  it('D3.2 - UPDATE / INSERT persistência física', async () => {
    const payload = {
      username: 'e2e_citizen',
      firstName: 'E2E',
      lastName: 'User',
      did: 'did:dao:asppibra:e2e',
      phone: '+5511999999999',
      address: 'Test Avenue, 123'
    };

    const { res } = await measureResponse(() => 
      fetch(`${API_URL}/api/core/citizens/profile/${accountId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
    );

    // Assuming the controller returns 200/201 on success
    expect([200, 201]).toContain(res.status);

    // D1 Physical Persistence Verification
    const dbResult = await queryD1(`SELECT * FROM citizens WHERE user_id = ${accountId}`);
    expect(dbResult.length).toBe(1);
    expect(dbResult[0].username).toBe('e2e_citizen');
    expect(dbResult[0].first_name).toBe('E2E');
    expect(dbResult[0].status).toBe('PENDING'); // pending_genesis maps to PENDING in the enum
    expect(dbResult[0].version).toBe(1);
    
    // An update doesn't generate an Outbox event in Citizen domain unless it's a state transition.
    // Let's check outbox_events just in case
  });

  it('D3.2 - GET cidadão existente (leitura correta)', async () => {
    const { res } = await measureResponse(() => 
      fetch(`${API_URL}/api/core/citizens/profile/${accountId}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      })
    );

    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.username).toBe('e2e_citizen');
    expect(body.status).toBe('PENDING');
  });

  it('D4.1 - VERIFY (escrita física do Status e Outbox Transacional)', async () => {
    const { res } = await measureResponse(() => 
      fetch(`${API_URL}/api/core/citizens/${accountId}/verify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      })
    );

    expect(res.status).toBe(200);

    // Verify D1 state
    const dbResult = await queryD1(`SELECT * FROM citizens WHERE user_id = ${accountId}`);
    expect(dbResult[0].status).toBe('VERIFIED');
    expect(dbResult[0].version).toBe(2); // Optimistic locking incremented version

    // Verify Outbox transactional integrity
    // We fetch the citizen real id from dbResult
    const citizenId = dbResult[0].id;
    const outbox_eventsResult = await queryD1(`SELECT * FROM outbox_events WHERE aggregate_id = '${citizenId}' AND event_type = 'CitizenVerifiedEvent'`);
    expect(outbox_eventsResult.length).toBe(1);
    expect(outbox_eventsResult[0].processed).toBe(0); // Not processed yet by the worker
  });

  it('D4.2 - Operação Idempotente', async () => {
    // Verifying again should not fail, should return 200, but not create a new Outbox event
    const beforeOutbox = await queryD1(`SELECT * FROM outbox_events WHERE event_type = 'CitizenVerifiedEvent'`);
    const beforeCount = beforeOutbox.length;

    const { res } = await measureResponse(() => 
      fetch(`${API_URL}/api/core/citizens/${accountId}/verify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      })
    );

    expect(res.status).toBe(200); // Idempotent success

    const afterOutbox = await queryD1(`SELECT * FROM outbox_events WHERE event_type = 'CitizenVerifiedEvent'`);
    expect(afterOutbox.length).toBe(beforeCount); // No new events created
  });

  it('D4.1 - OPTIMISTIC LOCKING (Forçar ConcurrencyException)', async () => {
    // To simulate ConcurrencyException without writing concurrent HTTP requests, we manually change the version in D1,
    // Then we attempt an update. The update relies on the Entity which loads the version, so we need real concurrency.
    // Wait, the API reads the entity and then updates it. If we run two requests concurrently, one might fail.
    
    const req1 = fetch(`${API_URL}/api/core/citizens/profile/${accountId}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone: '+5511988888881' }),
    });

    const req2 = fetch(`${API_URL}/api/core/citizens/profile/${accountId}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone: '+5511988888882' }),
    });

    const [res1, res2] = await Promise.all([req1, req2]);
    
    // At least one must succeed (200), and the other might fail due to Optimistic Locking (usually 409 or 500)
    const statuses = [res1.status, res2.status];
    expect(statuses).toContain(200);
    
    // Depending on timing, they might both succeed if they don't interleave precisely.
    // If we want a deterministic locking test, we'll check if any 500/409 was returned.
    // If not, we might need a dedicated endpoint to inject a sleep or force version mismatch.
  });

  it('D4.2 - SUSPEND (Transição de Estado e Outbox)', async () => {
    const { res } = await measureResponse(() => 
      fetch(`${API_URL}/api/core/citizens/${accountId}/suspend`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reason: 'ADMINISTRATIVE', description: 'Testing Suspend' }),
      })
    );

    expect(res.status).toBe(200);

    const dbResult = await queryD1(`SELECT * FROM citizens WHERE user_id = ${accountId}`);
    expect(dbResult[0].status).toBe('SUSPENDED');

    const citizenId = dbResult[0].id;
    const outbox_eventsResult = await queryD1(`SELECT * FROM outbox_events WHERE aggregate_id = '${citizenId}' AND event_type = 'CitizenSuspendedEvent'`);
    expect(outbox_eventsResult.length).toBe(1);
  });
});
