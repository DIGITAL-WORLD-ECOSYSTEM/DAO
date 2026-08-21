import { describe, it, expect } from 'vitest';
import { app } from '../../index';

const mockEnv = {
  ENVIRONMENT: 'test',
  DB: {
    prepare: () => ({
      bind: () => ({
        first: () => Promise.resolve({}),
        all: () => Promise.resolve({ results: [], success: true }),
        run: () => Promise.resolve({ success: true, meta: {} }),
        raw: () => Promise.resolve([]),
      }),
      first: () => Promise.resolve({}),
      all: () => Promise.resolve({ results: [], success: true }),
      run: () => Promise.resolve({ success: true, meta: {} }),
      raw: () => Promise.resolve([]),
    }),
  },
  KV_AUTH: {},
  KV_CACHE: {},
  STORAGE: {},
} as any;

const mockCtx = { waitUntil: () => {}, passThroughOnException: () => {} } as any;

describe('Treasury Platform Route (/api/platform/treasury)', () => {
  it('should return 200 OK for treasury root endpoint', async () => {
    const res = await app.fetch(
      new Request('http://localhost/api/platform/treasury'),
      mockEnv,
      mockCtx
    );
    expect(res.status).toBe(200);
    const json = (await res.json()) as any;
    expect(json.module).toBe('Treasury Analytics & Ledger API');
    expect(json.client.client_name).toBe('Andressa de Lima Ferreira');
  });

  it('should return analytics data populated with report 2026-07-PM4', async () => {
    const res = await app.fetch(
      new Request('http://localhost/api/platform/treasury/analytics'),
      mockEnv,
      mockCtx
    );
    expect(res.status).toBe(200);
    const json = (await res.json()) as any;
    expect(json.success).toBe(true);
    expect(json.data.summary.totalInflow).toBe(36623); // R$ 36.623,00 (Total Auditado Reconciliado)
    expect(json.data.summary.outstandingBalance).toBe(28377); // R$ 28.377,00 (Saldo Devedor Reconciliado)
    expect(json.data.transactions.length).toBe(45);
  });
});
