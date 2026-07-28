/**
 * Project: Governance System (ASPPIBRA DAO)
 * Role: Central System API & Identity Provider
 * Entry Point: Cloudflare Worker (Hono Framework)
 */

import { Hono, Context, Next } from 'hono';
import { ExecutionContext, ScheduledEvent, MessageBatch } from '@cloudflare/workers-types';
import { cors } from 'hono/cors';
import { secureHeaders } from 'hono/secure-headers';
import { correlationIdMiddleware } from './middleware/correlation_id';
import { Bindings, Variables } from './types/bindings';
import { createDb, Database } from './db';
import { error } from './utils/response';
import { DashboardTemplate } from './views/dashboard';
import { AuditService } from './services/audit';
import { getTokenMarketData } from './services/market';
import { Logger } from './utils/logger';
import { emails, emailAccounts } from './db/schema';
import { eq } from 'drizzle-orm';

// --- CORE MODULES ---
import authRouter from './routes/core/identity';
import healthRouter from './routes/core/health';
import webhooksRouter from './routes/core/webhooks';
import complianceRouter from './routes/core/compliance';
import aiRouter from './routes/ai/test';
import pipelineRouter from './routes/ai/pipeline-test';
import publishRouter from './routes/ai/publish';

// --- PLATFORM MODULES ---
import paymentsRouter from './routes/platform/payments';
import storageRouter from './routes/platform/storage';
import identityRouter from './routes/platform/identity';
import governanceRouter from './routes/platform/governance';
import treasuryRouter from './routes/platform/treasury';
import emailRouter from './routes/platform/email';
import devosRouter from './routes/platform/devos';
import devosDatabaseRouter from './routes/platform/devos-database';

// --- PRODUCT MODULES ---
import agroRouter from './routes/products/agro';
import rwaRouter from './routes/products/rwa';
import blogRouter from './routes/products/blog';
import realEstateRouter from './routes/products/real-estate';
import exchangeRouter from './routes/products/exchange';

// Configuração de Tipagem do Hono
type AppType = {
	Bindings: Bindings;
	Variables: Variables;
};

const app = new Hono<AppType>();

// =================================================================
// 1. MIDDLEWARES GLOBAIS
// =================================================================

// 1.0 Observabilidade & Security Headers Globais
app.use('*', correlationIdMiddleware());
app.use('*', secureHeaders({
	contentSecurityPolicy: {
		defaultSrc: ["'self'"],
		scriptSrc: ["'self'", "'unsafe-inline'"],
		styleSrc: ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com'],
		fontSrc: ["'self'", 'https://fonts.gstatic.com'],
		imgSrc: ["'self'", 'data:', 'https:', 'http:'],
		connectSrc: ["'self'", 'https://api.asppibra.com', 'https://app.asppibra.com'],
	},
	referrerPolicy: 'no-referrer',
	xFrameOptions: 'DENY',
	xContentTypeOptions: 'nosniff',
	strictTransportSecurity: 'max-age=63072000; includeSubDomains; preload',
	permissionsPolicy: {
		geolocation: ['self'],
		camera: ['none'],
		microphone: ['none'],
	},
}));

// 1.1 CORS Dinâmico para suporte a Vercel e Localhost (Hardened)
app.use('/*', async (c: Context<AppType>, next: Next) => {
	const corsMiddleware = cors({
		origin: (origin) => {
			const allowedOrigins = [
				'https://app.asppibra.com',
				'https://www.app.asppibra.com',
				'https://asppibra.com',
				'https://www.asppibra.com',
				'https://api.asppibra.com',
				'https://social-fi-asppibra.vercel.app',
				'https://dashboard.asppibra.com',
			];
			
			if (!origin) return allowedOrigins[0];

			const cleanOrigin = origin.replace(/\/$/, '');

			const isExactMatch = allowedOrigins.some(allowed => allowed === cleanOrigin);
			const allowedRegexes = [
				/^http:\/\/localhost:[0-9]+$/,
				/^https:\/\/[a-zA-Z0-9-]+\.cloudworkstations\.dev$/,
				/^https:\/\/[a-zA-Z0-9-]+\.pages\.dev$/
			];
			const isRegexMatch = allowedRegexes.some(regex => regex.test(cleanOrigin));

			if (isExactMatch || isRegexMatch) {
				return origin;
			}
			return allowedOrigins[0];
		},
		allowHeaders: [
			'Content-Type',
			'Authorization',
			'X-Requested-With',
			'X-App-ID',
			'x-admin-key',
			'X-Identity-Signature',
			'X-Identity-DID',
			'X-Identity-Timestamp',
			'X-Correlation-ID',
			'Idempotency-Key',
		],
		allowMethods: ['POST', 'GET', 'OPTIONS', 'PUT', 'PATCH', 'DELETE'],
		exposeHeaders: ['Content-Length', 'X-Correlation-ID'],
		maxAge: 600,
		credentials: true,
	});
	return corsMiddleware(c, next);
});

// 1.2 Database Injection (Scoped)
app.use(async (c: Context<AppType>, next: Next) => {
	if (!c.env.DB) {
		return error(c, 'Binding DB não configurado no wrangler.toml', null, 500);
	}
	const db = createDb(c.env.DB);
	c.set('db', db);
	await next();
});

// 1.3 Audit & Telemetry com WaitUntil (Performance)
app.use('*', async (c: Context<AppType>, next: Next) => {
	const start = Date.now();
	await next();

	const path = c.req.path;
	// Ignora logs de telemetria para assets e rotas de saúde
	if (!path.match(/\.(css|js|png|jpg|ico|json|map)$/) && !path.startsWith('/api/core/health')) {
		const audit = new AuditService(c.env);
		const executionTime = Date.now() - start;
		const cf = (c.req.raw as any).cf;

		c.executionCtx.waitUntil(
			audit.log({
				action: 'API_REQUEST',
				ip: c.req.header('cf-connecting-ip') || 'unknown',
				country: c.req.header('cf-ipcountry') || 'XX',
				userAgent: c.req.header('user-agent'),
				status: c.res.ok ? 'success' : 'failure',
				metadata: {
					path: path,
					method: c.req.method,
					executionTimeMs: executionTime,
					city: cf?.city,
					correlationId: c.get('correlationId'),
				},
			}),
		);
	}
});

// =================================================================
// 2. ROTAS DE DASHBOARD E MONITORAMENTO
// =================================================================

app.get('/', async (c) => {
	const audit = new AuditService(c.env);
	const metrics = await audit.getDashboardMetrics();

	const domain = c.req.url.includes('localhost') ? 'http://localhost:8787' : 'https://api.asppibra.com';

	return c.html(
		DashboardTemplate({
			version: '1.1.0',
			service: 'Central System API',
			cacheRatio: (metrics as any).cacheRatio || 'N/A',
			domain: domain,
			imageUrl: `${domain}/img/social-preview.png`,
		}),
	);
});

app.get('/api/stats', async (c) => {
	const audit = new AuditService(c.env);
	return c.json(await audit.getDashboardMetrics());
});

// =================================================================
// 3. API & ROTAS MODULARES
// =================================================================

app.route('/api/core/identity', authRouter);
app.route('/api/core/compliance', complianceRouter);
app.route('/api/core/health', healthRouter);
app.route('/api/core/webhooks', webhooksRouter);
app.route('/api/platform/payments', paymentsRouter);
app.route('/api/platform/storage', storageRouter);
app.route('/api/platform/identity', identityRouter);
app.route('/api/products/agro', agroRouter);
app.route('/api/products/rwa', rwaRouter);
app.route('/api/products/real-estate', realEstateRouter);
app.route('/api/products/exchange', exchangeRouter);
app.route('/api/platform/governance', governanceRouter);
app.route('/api/platform/treasury', treasuryRouter);
app.route('/api/platform/email', emailRouter);
app.route('/api/platform/devos', devosRouter); // DevOS API & Secrets Vault
app.route('/api/platform/devos/database', devosDatabaseRouter); // DevOS API & Secrets Vault
app.route('/api/posts', blogRouter); // SocialFi Integration
app.route('/api/ai', aiRouter); // AI Integration Phase 1
app.route('/api/ai/pipeline', pipelineRouter); // AI Integration Phase 2
app.route('/api/ai/publish', publishRouter); // AI Integration Phase 3 (Orchestration)

// =================================================================
// 4. ARQUIVOS ESTÁTICOS & ERROS
// =================================================================

app.get('/static/*', async (c) => {
	return (await c.env.ASSETS.fetch(c.req.raw as any)) as unknown as Response;
});

app.notFound((c) => c.json({ success: false, message: 'Rota não encontrada (404)' }, 404));

app.onError((err, c) => {
	console.error('🔥 Server Error:', err);
	return c.json({ success: false, message: 'Internal Server Error', error: err.message }, 500);
});

import { handleEmailEvent } from './workers/email.worker';
import { handleQueueEvent } from './workers/queue.worker';
import type { ForwardableEmailMessage } from '@cloudflare/workers-types';

export { app }; // Export for testing
export default {
	fetch: app.fetch,

	// Email Worker: Intercepta e-mails recebidos pela Cloudflare Email Routing
	async email(message: ForwardableEmailMessage, env: Bindings, ctx: ExecutionContext) {
		await handleEmailEvent(message, env, ctx);
	},

	// Worker CRON: Atualização de Mercado e Estatísticas (Producer)
	async scheduled(event: ScheduledEvent, env: Bindings, ctx: ExecutionContext) {
		ctx.waitUntil(
			(async () => {
				await updateTokenPrice(env);
				const audit = new AuditService(env);
				await audit.computeGlobalStats();
			})(),
		);
	},

	// Worker QUEUE: Processamento de Eventos (Consumer)
	async queue(batch: MessageBatch<any>, env: Bindings, ctx: ExecutionContext) {
		await handleQueueEvent(batch, env, ctx);
	}
};

// Lógica de Atualização de Cache KV (Preços de Token)
async function updateTokenPrice(env: Bindings) {
	try {
		const newData = await getTokenMarketData(env, 'price_only');
		if (newData && env.KV_CACHE) {
			await env.KV_CACHE.put('market:data', JSON.stringify(newData));
			await env.KV_CACHE.put('market:price_usd', newData.price.toString());
		}
	} catch (error) {
		console.error('❌ Cron: Erro na atualização', error);
	}
}

const logger = new Logger('Worker');

// Retry Exponencial genérico para chamadas assíncronas
async function withRetry<T>(fn: () => Promise<T>, retries = 3, backoffMs = 2000): Promise<T> {
	for (let i = 0; i < retries; i++) {
		try {
			return await fn();
		} catch (error: any) {
			if (i === retries - 1) throw error;
			logger.warn(`Tentativa ${i + 1} falhou, aguardando ${backoffMs}ms...`, { error: error.message });
			await new Promise(res => setTimeout(res, backoffMs));
			backoffMs *= 2; // backoff exponencial
		}
	}
	throw new Error('Unreachable');
}
