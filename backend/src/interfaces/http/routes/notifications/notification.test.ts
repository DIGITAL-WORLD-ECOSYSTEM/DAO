import { describe, it, expect, vi } from 'vitest';
import { app } from '../../../../index';

describe('Notifications Module Canonical Integration', () => {
  const baseEnv = {
    DB: {
      prepare: () => ({
        bind: () => ({
          first: () => Promise.resolve(null),
          all: () => Promise.resolve({ results: [], success: true }),
          run: () => Promise.resolve({ success: true, meta: {} }),
          raw: () => Promise.resolve([]),
        }),
        first: () => Promise.resolve(null),
        all: () => Promise.resolve({ results: [], success: true }),
        run: () => Promise.resolve({ success: true, meta: {} }),
        raw: () => Promise.resolve([]),
      }),
    },
    KV_AUTH: {
      get: vi.fn().mockResolvedValue(null),
      put: vi.fn().mockResolvedValue(undefined),
      delete: vi.fn().mockResolvedValue(undefined),
    },
    KV_CACHE: {},
    STORAGE: {},
    JWT_SECRET: 'test_secret',
  };

  it('bloqueia GET /api/core/notifications sem autenticação (401)', async () => {
    const res = await app.fetch(
      new Request('http://localhost/api/core/notifications', {
        method: 'GET',
      }),
      baseEnv as any,
      { waitUntil: () => {}, passThroughOnException: () => {} } as any
    );
    expect(res.status).toBe(401);
  });

  it('bloqueia GET /api/core/notifications/unread-count sem autenticação (401)', async () => {
    const res = await app.fetch(
      new Request('http://localhost/api/core/notifications/unread-count', {
        method: 'GET',
      }),
      baseEnv as any,
      { waitUntil: () => {}, passThroughOnException: () => {} } as any
    );
    expect(res.status).toBe(401);
  });

  it('bloqueia PUT /api/core/notifications/1/read sem autenticação (401)', async () => {
    const res = await app.fetch(
      new Request('http://localhost/api/core/notifications/1/read', {
        method: 'PUT',
      }),
      baseEnv as any,
      { waitUntil: () => {}, passThroughOnException: () => {} } as any
    );
    expect(res.status).toBe(401);
  });

  it('bloqueia PUT /api/core/notifications/read-all sem autenticação (401)', async () => {
    const res = await app.fetch(
      new Request('http://localhost/api/core/notifications/read-all', {
        method: 'PUT',
      }),
      baseEnv as any,
      { waitUntil: () => {}, passThroughOnException: () => {} } as any
    );
    expect(res.status).toBe(401);
  });
});
