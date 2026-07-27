import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import { eq } from 'drizzle-orm';
import { users, auditLogs } from '../../db/schema';
import { authSignature } from '../../middleware/auth_signature';
import { timingSafeEqual } from '../../utils/timing_safe';
import { kycSubmitSchema, kycReviewSchema } from '../../validators/auth';
import { Bindings } from '../../types/bindings';

type AppType = { Bindings: Bindings; Variables: { db: any } };

const compliance = new Hono<AppType>();

/**
 * KYC Submission (Stub for R2 Integration)
 * Protegido por Zero-Trust signature. Valida schema de entrada via Zod.
 */
compliance.post('/kyc/submit', authSignature, zValidator('json', kycSubmitSchema), async (c) => {
	const { userId, documentType } = c.req.valid('json');
	const db = c.get('db');

	await db.update(users).set({ kycStatus: 'pending' }).where(eq(users.id, userId));

	await db.insert(auditLogs).values({
		action: 'KYC_SUBMITTED',
		actorId: userId,
		status: 'success',
		metadata: { documentType },
	});

	return c.json({ success: true, message: 'Documentos enviados para revisão.' });
});

/**
 * Admin: Approve/Reject KYC
 * Fix SEC-02: usa timingSafeEqual para prevenir timing attack na comparação da admin key.
 * Valida schema de entrada via Zod.
 */
compliance.post('/kyc/review', zValidator('json', kycReviewSchema), async (c) => {
	const { userId, status, reason } = c.req.valid('json');
	const adminKey = c.req.header('x-admin-key') ?? '';
	const db = c.get('db');

	// Guard: ADMIN_PASSWORD deve estar configurado como secret no Cloudflare
	const adminPassword = c.env.ADMIN_PASSWORD;
	if (!adminPassword) {
		return c.json({ success: false, message: 'Configuração de segurança ausente. Contate o administrador.' }, 500);
	}

	// SEC-02: Comparação em tempo constante (previne timing attacks)
	// Rejeita também se adminKey estiver vazio
	if (!adminKey || !timingSafeEqual(adminKey, adminPassword)) {
		return c.json({ success: false, message: 'Unauthorized' }, 401);
	}

	await db.update(users).set({ kycStatus: status }).where(eq(users.id, userId));

	await db.insert(auditLogs).values({
		action: `KYC_${status.toUpperCase()}`,
		actorId: userId,
		status: 'success',
		metadata: { reason },
	});

	return c.json({ success: true, message: `Status KYC atualizado para: ${status}` });
});

export default compliance;
