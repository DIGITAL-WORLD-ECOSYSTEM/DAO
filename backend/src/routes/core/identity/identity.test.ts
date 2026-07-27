import { describe, it, expect, vi, beforeEach } from 'vitest';
import { app } from '../../../index';

// Drizzle ORM uses .raw() internally for SELECT queries via the D1 session.
// This factory creates a compliant D1 mock stub.
const makeD1Mock = (overrides: Record<string, any> = {}) => ({
	prepare: () => ({
		bind: (..._args: any[]) => ({
			first: (_col?: string) => Promise.resolve(overrides.firstResult ?? null),
			all: () => Promise.resolve({ results: overrides.allResults ?? [], success: true }),
			run: () => Promise.resolve({ success: true, meta: {} }),
			raw: () => Promise.resolve(overrides.rawResults ?? []),
		}),
		first: (_col?: string) => Promise.resolve(overrides.firstResult ?? null),
		all: () => Promise.resolve({ results: overrides.allResults ?? [], success: true }),
		run: () => Promise.resolve({ success: true, meta: {} }),
		raw: () => Promise.resolve(overrides.rawResults ?? []),
	}),
	exec: () => Promise.resolve({ count: 0, duration: 0 }),
	batch: () => Promise.resolve([]),
});

describe('Identity Module — SSI Handshake', () => {
	const mockKv = {
		get: vi.fn(),
		put: vi.fn().mockResolvedValue(undefined),
		delete: vi.fn().mockResolvedValue(undefined),
	};

	const baseEnv = {
		DB: makeD1Mock(),
		KV_AUTH: mockKv,
		KV_CACHE: {},
		STORAGE: {},
		JWT_SECRET: 'test_secret',
		ADMIN_PASSWORD: 'admin_secret',
	};

	beforeEach(() => {
		vi.clearAllMocks();
	});

	// ─── Challenge ───────────────────────────────────────────────

	it('GET /challenge/:username → 200 com nonce UUID válido', async () => {
		mockKv.get.mockResolvedValue(null); // sem cidadão = encryptedVault null

		const res = await app.fetch(
			new Request('http://localhost/api/core/identity/challenge/test_user'),
			baseEnv as any,
			{ waitUntil: () => {}, passThroughOnException: () => {} } as any,
		);

		expect(res.status).toBe(200);
		const body = (await res.json()) as any;
		expect(body.success).toBe(true);
		expect(body.challenge).toBeDefined();
		// Um nonce deve ter formato UUID
		expect(body.challenge).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i);
		expect(mockKv.put).toHaveBeenCalledWith('nonce:test_user', expect.any(String), { expirationTtl: 300 });
	});

	// ─── Register ────────────────────────────────────────────────

	it('POST /register rejeita body vazio (Zod 400)', async () => {
		const res = await app.fetch(
			new Request('http://localhost/api/core/identity/register', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({}),
			}),
			baseEnv as any,
			{ waitUntil: () => {}, passThroughOnException: () => {} } as any,
		);
		expect(res.status).toBe(400);
	});

	it('POST /register rejeita challenge inválido (não-UUID)', async () => {
		const res = await app.fetch(
			new Request('http://localhost/api/core/identity/register', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					username: 'test_user',
					publicKey: '[1,2,3]',
					signature: '[4,5,6]',
					challenge: 'NOT_A_UUID', // deve falhar Zod
					firstName: 'Test',
					lastName: 'User',
				}),
			}),
			baseEnv as any,
			{ waitUntil: () => {}, passThroughOnException: () => {} } as any,
		);
		expect(res.status).toBe(400);
	});

	it('POST /register rejeita username com caracteres inválidos', async () => {
		const res = await app.fetch(
			new Request('http://localhost/api/core/identity/register', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					username: 'UPPER_CASE_USERNAME', // Zod: só a-z0-9_
					publicKey: '[1,2,3]',
					signature: '[4,5,6]',
					challenge: '550e8400-e29b-41d4-a716-446655440000',
					firstName: 'Test',
					lastName: 'User',
				}),
			}),
			baseEnv as any,
			{ waitUntil: () => {}, passThroughOnException: () => {} } as any,
		);
		expect(res.status).toBe(400);
	});

	it('POST /register rejeita quando nonce não existe no KV (401)', async () => {
		mockKv.get.mockResolvedValue(null); // nonce não encontrado

		const res = await app.fetch(
			new Request('http://localhost/api/core/identity/register', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					username: 'test_user',
					publicKey: '[1,2,3]',
					signature: '[4,5,6]',
					challenge: '550e8400-e29b-41d4-a716-446655440000',
					firstName: 'Test',
					lastName: 'User',
				}),
			}),
			baseEnv as any,
			{ waitUntil: () => {}, passThroughOnException: () => {} } as any,
		);
		expect(res.status).toBe(401);
		const body = (await res.json()) as any;
		expect(body.message).toContain('Challenge inválido');
	});

	// ─── Login ───────────────────────────────────────────────────

	it('POST /login rejeita body sem username (Zod 400)', async () => {
		const res = await app.fetch(
			new Request('http://localhost/api/core/identity/login', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ signature: '[1,2,3]', challenge: '550e8400-e29b-41d4-a716-446655440000' }),
			}),
			baseEnv as any,
			{ waitUntil: () => {}, passThroughOnException: () => {} } as any,
		);
		expect(res.status).toBe(400);
	});

	it('POST /login rejeita challenge inexistente no KV (401)', async () => {
		mockKv.get.mockResolvedValue(null);

		const res = await app.fetch(
			new Request('http://localhost/api/core/identity/login', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					username: 'test_user',
					signature: '[4,5,6]',
					challenge: '550e8400-e29b-41d4-a716-446655440000',
				}),
			}),
			baseEnv as any,
			{ waitUntil: () => {}, passThroughOnException: () => {} } as any,
		);
		expect(res.status).toBe(401);
	});

	// ─── Rate Limiter ────────────────────────────────────────────

	it('Retorna 429 quando rate limit é atingido (>= 20 requests)', async () => {
		mockKv.get.mockResolvedValue('20'); // já atingiu o limite

		const res = await app.fetch(
			new Request('http://localhost/api/core/identity/challenge/anyone'),
			baseEnv as any,
			{ waitUntil: () => {}, passThroughOnException: () => {} } as any,
		);
		expect(res.status).toBe(429);
		const body = (await res.json()) as any;
		expect(body.message).toContain('Muitas tentativas');
	});

	// ─── DID Resolver ────────────────────────────────────────────

	it('GET /did/:id retorna 400 para DID sem username', async () => {
		mockKv.get.mockResolvedValue('0');
		const res = await app.fetch(
			new Request('http://localhost/api/core/identity/did/did:dao:asppibra:'),
			baseEnv as any,
			{ waitUntil: () => {}, passThroughOnException: () => {} } as any,
		);
		expect(res.status).toBe(400);
	});

	// ─── Passkeys (WebAuthn) ──────────────────────────────────────

	it('GET /passkey/challenge/:username → 200 com challenge UUID', async () => {
		const res = await app.fetch(
			new Request('http://localhost/api/core/identity/passkey/challenge/test_user'),
			baseEnv as any,
			{ waitUntil: () => {}, passThroughOnException: () => {} } as any,
		);
		expect(res.status).toBe(200);
		const body = (await res.json()) as any;
		expect(body.success).toBe(true);
		expect(body.challenge).toBeDefined();
	});

	it('POST /passkey/bind falha se não houver headers Zero-Trust', async () => {
		const res = await app.fetch(
			new Request('http://localhost/api/core/identity/passkey/bind', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					username: 'test_user',
					credentialId: 'cred_123',
					publicKey: '[1,2,3]',
					challenge: '550e8400-e29b-41d4-a716-446655440000',
					signature: '[4,5,6]',
				}),
			}),
			baseEnv as any,
			{ waitUntil: () => {}, passThroughOnException: () => {} } as any,
		);
		expect(res.status).toBe(401);
	});

	it('GET /passkey/login/challenge/:username retorna 400 se cidadão não tem passkey cadastrada', async () => {
		const localEnv = {
			...baseEnv,
			DB: makeD1Mock({ firstResult: null }),
		};
		const res = await app.fetch(
			new Request('http://localhost/api/core/identity/passkey/login/challenge/test_user'),
			localEnv as any,
			{ waitUntil: () => {}, passThroughOnException: () => {} } as any,
		);
		expect(res.status).toBe(400);
	});
});
