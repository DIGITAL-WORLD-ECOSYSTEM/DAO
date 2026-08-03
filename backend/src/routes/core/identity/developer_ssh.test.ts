import { describe, it, expect, vi, beforeEach } from 'vitest';
import { app } from '../../../index';

const makeD1Mock = () => {
  return {
    prepare: (sql: string) => {
      let bindArgs: any[] = [];
      const stmt = {
        bind: (...args: any[]) => {
          bindArgs = args;
          return stmt;
        },
        first: (_col?: string) => {
          if (sql.includes('citizens')) {
            return Promise.resolve({
              id: 1,
              userId: 99,
              username: 'felipe_dev',
              publicKey: JSON.stringify([1, 2, 3]),
              status: 'active',
            });
          }
          return Promise.resolve(null);
        },
        all: () => {
          let mockRows: any[] = [];
          if (sql.includes('user_sessions')) {
            const isNormalUser = bindArgs.includes('session-id-user');
            mockRows = [
              {
                id: isNormalUser ? 'session-id-user' : 'session-id',
                user_id: isNormalUser ? 100 : 99,
                jti: isNormalUser ? 'session-jti-user' : 'session-jti',
                refresh_token_hash: isNormalUser ? 'hash-user' : 'hash',
                aal: 1,
                revoked: 0,
                expires_at: Date.now() + 3600000,
              },
            ];
          } else if (sql.includes('users')) {
            mockRows = [
              {
                id: 99,
                email: 'felipe.dev@empresa.com.br',
                token_version: 1,
                active: 1,
                status: 'active',
                role: 'dev',
              },
              {
                id: 100,
                email: 'citizen@asppibra.org',
                token_version: 1,
                active: 1,
                status: 'active',
                role: 'citizen',
              },
            ];
            const userIdBind = bindArgs.find((arg) => typeof arg === 'number');
            if (userIdBind) {
              mockRows = mockRows.filter((u) => u.id === userIdBind);
            }
          } else if (sql.includes('citizens')) {
            mockRows = [
              {
                id: 1,
                userId: 99,
                username: 'felipe_dev',
                publicKey: JSON.stringify([1, 2, 3]),
                status: 'active',
              },
            ];
          }
          // Map all keys in mockRows to snake_case
          const results = mockRows.map((row) => {
            const snakeRow: any = {};
            for (const key of Object.keys(row)) {
              const snakeKey = key.replace(/([A-Z])/g, '_$1').toLowerCase();
              snakeRow[snakeKey] = row[key];
            }
            return snakeRow;
          });
          return Promise.resolve({ success: true, results });
        },
        run: () => {
          return Promise.resolve({ success: true, meta: {} });
        },
        raw: () => {
          let mockRows: any[] = [];
          if (sql.includes('user_sessions')) {
            const isNormalUser = bindArgs.includes('session-id-user');
            mockRows = [
              {
                id: isNormalUser ? 'session-id-user' : 'session-id',
                user_id: isNormalUser ? 100 : 99,
                jti: isNormalUser ? 'session-jti-user' : 'session-jti',
                refresh_token_hash: isNormalUser ? 'hash-user' : 'hash',
                aal: 1,
                revoked: 0,
                expires_at: Date.now() + 3600000,
              },
            ];
          } else if (sql.includes('users')) {
            mockRows = [
              {
                id: 99,
                email: 'felipe.dev@empresa.com.br',
                token_version: 1,
                active: 1,
                status: 'active',
                role: 'dev',
              },
              {
                id: 100,
                email: 'citizen@asppibra.org',
                token_version: 1,
                active: 1,
                status: 'active',
                role: 'citizen',
              },
            ];
            const userIdBind = bindArgs.find((arg) => typeof arg === 'number');
            if (userIdBind) {
              mockRows = mockRows.filter((u) => u.id === userIdBind);
            }
          } else if (sql.includes('citizens')) {
            mockRows = [
              {
                id: 1,
                userId: 99,
                username: 'felipe_dev',
                publicKey: JSON.stringify([1, 2, 3]),
                status: 'active',
              },
            ];
          }

          const match = sql.match(/select\s+(.+?)\s+from/i);
          if (match) {
            const cols = match[1].split(',').map((c) => c.replace(/"/g, '').trim());
            const mapped = mockRows.map((row) => {
              return cols.map((col) => {
                if (col in row) return row[col];
                const camel = col.replace(/_([a-z])/g, (g) => g[1].toUpperCase());
                if (camel in row) return row[camel];
                return null;
              });
            });
            return Promise.resolve(mapped);
          }
          return Promise.resolve([]);
        },
      };
      return stmt;
    },
    exec: () => Promise.resolve({ count: 0, duration: 0 }),
    batch: () => Promise.resolve([]),
  };
};

function encodeSshPublicKey(pubKeyBytes: Uint8Array): string {
  const header = new Uint8Array([
    0,
    0,
    0,
    11,
    ...new TextEncoder().encode('ssh-ed25519'),
    0,
    0,
    0,
    32,
  ]);
  const combined = new Uint8Array(header.length + pubKeyBytes.length);
  combined.set(header);
  combined.set(pubKeyBytes, header.length);

  const binary = String.fromCharCode(...combined);
  return `ssh-ed25519 ${btoa(binary)} felipe@developer`;
}

describe('Developer SSH Verification Flow & Secure Headers', () => {
  const mockKv = {
    get: vi.fn(),
    put: vi.fn().mockResolvedValue(undefined),
    delete: vi.fn().mockResolvedValue(undefined),
  };

  let devToken: string;
  let userToken: string;
  let devSshPublicKey: string;
  let devPrivateKey: CryptoKey;
  const challenge = '550e8400-e29b-41d4-a716-446655440000';

  const mockCtx = {
    waitUntil: () => {},
    passThroughOnException: () => {},
  };

  beforeEach(async () => {
    vi.clearAllMocks();

    // Set up KV mock implementation to separate rate limiting from challenge retrieval
    mockKv.get.mockImplementation(async (key: string) => {
      if (key.startsWith('ratelimit:')) {
        return '0';
      }
      if (key.startsWith('developer_challenge:')) {
        return challenge;
      }
      return null;
    });

    // Generate real Ed25519 key pair for the developer SSH test
    const keyPair = (await crypto.subtle.generateKey(
      { name: 'Ed25519', namedCurve: 'Ed25519' },
      true,
      ['sign', 'verify']
    )) as CryptoKeyPair;

    devPrivateKey = keyPair.privateKey;
    const pubRaw = new Uint8Array(
      (await crypto.subtle.exportKey('raw', keyPair.publicKey)) as ArrayBuffer
    );
    devSshPublicKey = encodeSshPublicKey(pubRaw);

    // Issue real JWT tokens for developer and normal user using the actual auth utility functions
    const { JwtService } = await import('../../../infrastructure/security/jwt/JwtService');
    const jwtService = new JwtService();

    const now = Math.floor(Date.now() / 1000);

    devToken = await jwtService.sign(
      {
        iss: 'asppibra-dao',
        aud: 'asppibra-app',
        sub: 'felipe.dev@empresa.com.br',
        userId: 99,
        role: 'dev',
        aal: 1,
        jti: 'session-jti',
        sessionId: 'session-id',
        sid: 'session-id',
        tokenVersion: 1,
        iat: now - 5,
        nbf: now - 5,
        exp: now + 15 * 60,
      },
      'test_secret',
      'v1'
    );

    userToken = await jwtService.sign(
      {
        iss: 'asppibra-dao',
        aud: 'asppibra-app',
        sub: 'citizen@asppibra.org',
        userId: 100,
        role: 'citizen',
        aal: 1,
        jti: 'session-jti-user',
        sessionId: 'session-id-user',
        sid: 'session-id-user',
        tokenVersion: 1,
        iat: now - 5,
        nbf: now - 5,
        exp: now + 15 * 60,
      },
      'test_secret',
      'v1'
    );
  });

  // ─── Permissions-Policy Secure Header ────────────────────────

  it('Response contains Permissions-Policy and other secure headers', async () => {
    const res = await app.fetch(
      new Request('http://localhost/api/core/identity/challenge/someone'),
      {
        DB: makeD1Mock(),
        KV_AUTH: mockKv,
        KV_CACHE: {},
        STORAGE: {},
        JWT_SECRET: 'test_secret',
      } as any,
      mockCtx as any
    );

    const policy = res.headers.get('Permissions-Policy');
    expect(policy).toBeDefined();
    expect(policy).toContain('geolocation');
    expect(res.headers.get('X-Frame-Options')).toBe('DENY');
    expect(res.headers.get('Referrer-Policy')).toBe('no-referrer');
  });

  // ─── Developer Challenge Authorization ───────────────────────

  it('GET /developer/challenge rejects request without auth token', async () => {
    const res = await app.fetch(
      new Request('http://localhost/api/core/identity/developer/challenge'),
      {
        DB: makeD1Mock(),
        KV_AUTH: mockKv,
        KV_CACHE: {},
        STORAGE: {},
        JWT_SECRET: 'test_secret',
      } as any,
      mockCtx as any
    );
    expect(res.status).toBe(401);
    const body = (await res.json()) as any;
    expect(body.success).toBe(false);
  });

  it('GET /developer/challenge rejects request from non-dev role', async () => {
    const res = await app.fetch(
      new Request('http://localhost/api/core/identity/developer/challenge', {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      }),
      {
        DB: makeD1Mock(),
        KV_AUTH: mockKv,
        KV_CACHE: {},
        STORAGE: {},
        JWT_SECRET: 'test_secret',
      } as any,
      mockCtx as any
    );
    expect(res.status).toBe(403);
    const body = (await res.json()) as any;
    expect(body.message).toContain('Acesso negado');
  });

  it('GET /developer/challenge returns 200 and challenge UUID for developer', async () => {
    const res = await app.fetch(
      new Request('http://localhost/api/core/identity/developer/challenge', {
        headers: {
          Authorization: `Bearer ${devToken}`,
        },
      }),
      {
        DB: makeD1Mock(),
        KV_AUTH: mockKv,
        KV_CACHE: {},
        STORAGE: {},
        JWT_SECRET: 'test_secret',
      } as any,
      mockCtx as any
    );

    expect(res.status).toBe(200);
    const body = (await res.json()) as any;
    expect(body.success).toBe(true);
    expect(body.challenge).toBeDefined();
    expect(mockKv.put).toHaveBeenCalledWith('developer_challenge:99', expect.any(String), {
      expirationTtl: 300,
    });
  });

  // ─── Developer SSH verify ────────────────────────────────────

  it('POST /developer/verify-ssh verifies signature and escalates to AAL3', async () => {
    const signatureBuffer = await crypto.subtle.sign(
      { name: 'Ed25519' },
      devPrivateKey,
      new TextEncoder().encode(challenge)
    );
    const signatureBase64 = btoa(String.fromCharCode(...new Uint8Array(signatureBuffer)));

    const res = await app.fetch(
      new Request('http://localhost/api/core/identity/developer/verify-ssh', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${devToken}`,
        },
        body: JSON.stringify({
          signature: signatureBase64,
        }),
      }),
      {
        DB: makeD1Mock(),
        KV_AUTH: mockKv,
        KV_CACHE: {},
        STORAGE: {},
        JWT_SECRET: 'test_secret',
        DEVELOPER_SSH_KEY: devSshPublicKey,
      } as any,
      mockCtx as any
    );

    expect(res.status).toBe(200);
    const body = (await res.json()) as any;
    expect(body.success).toBe(true);
    expect(body.accessToken).toBeDefined();

    // Parse the returned elevated token to check if AAL is 3
    const { decodeJwt } = await import('../../../utils/auth');
    const decoded = decodeJwt(body.accessToken);
    expect(decoded.aal).toBe(3);
    expect(decoded.role).toBe('dev');
  });
});
