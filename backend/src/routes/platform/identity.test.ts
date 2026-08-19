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
  JWT_SECRET: 'test_secret',
} as any;

const mockCtx = { waitUntil: () => {}, passThroughOnException: () => {} } as any;

describe('Platform Identity Route (/api/platform/identity)', () => {
  it('should return 200 OK and list of citizens for /list', async () => {
    const res = await app.fetch(
      new Request('http://localhost/api/platform/identity/list'),
      mockEnv,
      mockCtx
    );

    expect(res.status).toBe(200);
    const body = (await res.json()) as any;
    expect(body.success).toBe(true);
    expect(Array.isArray(body.data)).toBe(true);
    expect(body.data.length).toBeGreaterThan(0);
  });
});
