import { Hono } from 'hono';
import { Webhook } from 'svix';
import { zValidator } from '@hono/zod-validator';
import { authSignature } from '../../middleware/auth_signature';
import { rateLimit, idempotency } from '../../middleware/rate_limit';
import { sendCampaignSchema } from '../../validators/email';
import { EmailService } from '../../services/email';
import { Bindings, Variables } from '../../types/bindings';
import { emails, emailAccounts } from '../../db/schema';
import { desc, eq, and, lt } from 'drizzle-orm';
import { EmailEventService } from '../../services/email/services/email-event.service';
import { EventRepository } from '../../repositories/event.repository';
import { EmailEventTypes, EmailEventType } from '../../dto/email-event';

type AppType = {
	Bindings: Bindings;
	Variables: Variables;
};

const email = new Hono<AppType>();

// --- MIDDLEWARE DE SEGURANÇA (Zero-Trust) ---
// Reativado para trancar envios anônimos e garantir que c.var.user e c.var.db estejam disponíveis
email.use('/*', authSignature);

/**
 * Enviar Campanha de E-mail via Resend e Persistir no D1
 * (Limitado a 10 requisições por minuto por IP para evitar DDoS)
 */
email.post('/campaign', rateLimit({ windowMs: 60000, maxRequests: 10 }), idempotency(), zValidator('json', sendCampaignSchema), async (c) => {
	const payload = c.req.valid('json');
	const db = c.var.db;
	
	const emailService = new EmailService(c.env, db);
	
	try {
		const emailId = await emailService.sendCampaign({
			recipient: payload.recipient,
			subject: payload.subject,
			bodyHtml: payload.bodyHtml,
			senderEmail: c.env.SENDER_EMAIL
		});
		
		return c.json({
			success: true,
			message: 'E-mail enfileirado para envio',
			id: emailId
		});
	} catch (error: any) {
		return c.json({
			success: false,
			message: 'Erro ao despachar campanha',
			error: error.message
		}, 500);
	}
});

/**
 * Rota de Leitura (Caixa de Mensagens)
 */
email.get('/list', async (c) => {
	const db = c.var.db;
	const accountId = c.req.query('accountId');
	const limit = parseInt(c.req.query('limit') || '50', 10);
	const cursor = c.req.query('cursor'); // createdAt timestamp of the last seen email
	
	const emailService = new EmailService(c.env, db);

	try {
		const list = await emailService.listEmails(accountId, limit, cursor);
		
		return c.json({
			success: true,
			data: list
		});
	} catch (error: any) {
		return c.json({
			success: false,
			message: 'Erro ao listar e-mails',
			error: error.message
		}, 500);
	}
});

/**
 * Rota de Leitura (Contas Corporativas)
 */
email.get('/accounts', async (c) => {
	const db = c.var.db;
	
	try {
		const list = await db.select().from(emailAccounts).orderBy(desc(emailAccounts.createdAt));
		
		return c.json({
			success: true,
			data: list
		});
	} catch (error: any) {
		return c.json({
			success: false,
			message: 'Erro ao listar contas corporativas',
			error: error.message
		}, 500);
	}
});



/**
 * Rota de Criação (Contas Corporativas)
 */
email.post('/accounts', async (c) => {
	const payload = await c.req.json();
	const db = c.var.db;
	
	try {
		const id = crypto.randomUUID();
		await db.insert(emailAccounts).values({
			id,
			email: payload.email,
			department: payload.department,
			displayName: payload.displayName,
			type: payload.type || 'Atendimento',
			criticality: payload.criticality || 'Média',
			createdAt: new Date(),
		});
		
		return c.json({ success: true, id });
	} catch (error: any) {
		return c.json({
			success: false,
			message: 'Erro ao criar conta',
			error: error.message
		}, 500);
	}
});



/**
 * Webhook (Resend)
 * Escuta eventos de status (delivered, bounced, complained, etc.)
 */
email.post('/webhook', async (c) => {
	const payload = await c.req.text();
	const headers = c.req.header();
	
	const svixId = headers['svix-id'];
	const svixTimestamp = headers['svix-timestamp'];
	const svixSignature = headers['svix-signature'];
	
	if (!svixId || !svixTimestamp || !svixSignature) {
		return c.json({ success: false, message: 'Missing svix headers' }, 400);
	}

	const secret = c.env.SVIX_SECRET;
	if (!secret) {
		// Log but don't fail publicly if secret is not set in dev
		console.warn('SVIX_SECRET not configured.');
		return c.json({ success: true }, 200);
	}

	try {
		const wh = new Webhook(secret);
		const event = wh.verify(payload, {
			'svix-id': svixId,
			'svix-timestamp': svixTimestamp,
			'svix-signature': svixSignature,
		}) as any;

		const type = event.type;
		const data = event.data;
		
		const messageId = data?.email_id;
		if (!messageId) {
			return c.json({ success: true, message: 'No email_id in payload' }, 200);
		}

		const db = c.var.db;
		const updates: any = { providerPayload: JSON.stringify(data) };
		const eventService = new EmailEventService(new EventRepository(db));
		let eventType: EmailEventType | null = null;

		if (type === 'email.delivered') {
			updates.status = 'delivered';
			updates.deliveredAt = new Date();
			eventType = EmailEventTypes.DELIVERED;
		} else if (type === 'email.bounced' || type === 'email.complained') {
			updates.status = 'bounced';
			updates.bouncedAt = new Date();
			updates.errorMessage = data.reason || 'Bounced/Complained';
			eventType = type === 'email.bounced' ? EmailEventTypes.BOUNCED : EmailEventTypes.COMPLAINED;
		} else if (type === 'email.opened') {
			updates.status = 'read';
			updates.openedAt = new Date();
			eventType = EmailEventTypes.OPENED;
		} else if (type === 'email.clicked') {
			eventType = EmailEventTypes.CLICKED;
		} else if (type === 'email.delivery_delayed') {
			updates.status = 'queued';
			updates.errorMessage = 'Delayed by provider';
		}

		await db.update(emails)
			.set(updates)
			.where(eq(emails.messageId, messageId));
			
		if (eventType) {
			await eventService.emit({
				event: eventType,
				source: 'webhook',
				messageId: messageId,
				provider: 'resend',
				severity: (eventType === EmailEventTypes.BOUNCED || eventType === EmailEventTypes.COMPLAINED) ? 'warning' : 'info'
			});
		}

		return c.json({ success: true });
	} catch (error: any) {
		console.error('Webhook verification failed', error);
		return c.json({ success: false, message: 'Invalid signature' }, 400);
	}
});

export default email;
