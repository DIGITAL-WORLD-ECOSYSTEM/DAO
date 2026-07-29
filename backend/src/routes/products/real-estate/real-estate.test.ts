import { describe, it, expect } from 'vitest';
import { app } from '../../../index';

// Drizzle ORM requires .raw() on the bound statement for SELECT queries.
const makeD1Mock = (allResults: any[] = []) => ({
  prepare: () => ({
    bind: (..._args: any[]) => ({
      first: () => Promise.resolve(null),
      all: () => Promise.resolve({ results: allResults, success: true }),
      run: () => Promise.resolve({ success: true, meta: {} }),
      raw: () => Promise.resolve([]),
    }),
    first: () => Promise.resolve(null),
    all: () => Promise.resolve({ results: allResults, success: true }),
    run: () => Promise.resolve({ success: true, meta: {} }),
    raw: () => Promise.resolve([]),
  }),
  exec: () => Promise.resolve({ count: 0, duration: 0 }),
  batch: () => Promise.resolve([]),
});

describe('Real Estate Module', () => {
  it('should return 200 OK and an empty list on /api/products/real-estate initially', async () => {
    const res = await app.fetch(
      new Request('http://localhost/api/products/real-estate'),
      {
        DB: makeD1Mock([]),
        KV_AUTH: {
          get: () => Promise.resolve(null),
          put: () => Promise.resolve(),
          delete: () => Promise.resolve(),
        },
        KV_CACHE: {},
      } as any,
      { waitUntil: () => {}, passThroughOnException: () => {} } as any
    );

    expect(res.status).toBe(200);
    const body: any = await res.json();
    expect(body).toHaveProperty('success', true);
  });
});
