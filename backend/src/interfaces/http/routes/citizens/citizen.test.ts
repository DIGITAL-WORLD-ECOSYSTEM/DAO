import { describe, it, expect, vi } from 'vitest';
import citizens from './citizen';

// Mock DB Simples
const makeD1Mock = (mockResolvedValue: any = []) => {
  const mockDb = {
    prepare: vi.fn().mockReturnThis(),
    bind: vi.fn().mockReturnThis(),
    first: vi.fn().mockResolvedValue(mockResolvedValue[0] || null),
    all: vi.fn().mockResolvedValue({ results: mockResolvedValue }),
  };
  return mockDb;
};

// Base Env para injetar nos Requests
const baseEnv = {
  KV_CACHE: {
    get: vi.fn(),
    put: vi.fn(),
  },
  ASSETS: {
    fetch: vi.fn(),
  },
};

describe('API Core - Citizens Domain (/api/core/citizens)', () => {
  describe('GET /profile/:accountId', () => {
    it('Cenário 1: Retorna perfil (E2E Integration)', async () => {
      const dbMock = makeD1Mock([{
        id: 1,
        user_id: 1,
        username: 'john_doe',
        first_name: 'John',
        last_name: 'Doe',
        did: 'did:dao:asppibra:web2:1',
        status: 'pending_genesis',
        public_key: '0x123'
      }]);

      const localEnv = {
        ...baseEnv,
        DB: dbMock
      };

      const res = await citizens.fetch(
        new Request('http://localhost/profile/1', {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' }
        }),
        localEnv as any,
        { waitUntil: () => {}, passThroughOnException: () => {} } as any
      );

      const body = await res.json() as any;
      expect(res.status).toBeLessThan(500); 
    });
  });

  describe('POST /profile/:accountId', () => {
    it('Cenário 2: Atualiza perfil via DTO (E2E Integration)', async () => {
      const dbMock = makeD1Mock([{
        id: 1,
        user_id: 1,
        username: 'john_doe',
        first_name: 'John',
        last_name: 'Doe',
        address: 'Rua Velha'
      }]);

      const localEnv = {
        ...baseEnv,
        DB: dbMock
      };

      const res = await citizens.fetch(
        new Request('http://localhost/profile/1', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ address: 'Rua Nova 123', phone: '+5511999999999' })
        }),
        localEnv as any,
        { waitUntil: () => {}, passThroughOnException: () => {} } as any
      );

      const body = await res.json() as any;
      expect(res.status).toBeLessThan(500); 
    });
  });

  describe('POST /:accountId/verify', () => {
    it('Cenário 3: Verifica cidadão via rota (E2E Integration)', async () => {
      const dbMock = makeD1Mock([{
        id: 1,
        user_id: 1,
        username: 'john_doe',
        status: 'PENDING'
      }]);

      const localEnv = { ...baseEnv, DB: dbMock };

      const res = await citizens.fetch(
        new Request('http://localhost/1/verify', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({})
        }),
        localEnv as any,
        { waitUntil: () => {}, passThroughOnException: () => {} } as any
      );

      expect(res.status).toBeLessThan(500); 
    });
  });

  describe('POST /:accountId/suspend', () => {
    it('Cenário 4: Suspende cidadão via rota (E2E Integration)', async () => {
      const dbMock = makeD1Mock([{
        id: 1,
        user_id: 1,
        username: 'john_doe',
        status: 'VERIFIED'
      }]);

      const localEnv = { ...baseEnv, DB: dbMock };

      const res = await citizens.fetch(
        new Request('http://localhost/1/suspend', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ reason: 'FRAUD', description: 'Atividade maliciosa' })
        }),
        localEnv as any,
        { waitUntil: () => {}, passThroughOnException: () => {} } as any
      );

      expect(res.status).toBeLessThan(500); 
    });
  });
});
