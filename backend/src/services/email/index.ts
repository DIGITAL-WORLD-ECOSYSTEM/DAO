import { Bindings } from '../../types/bindings';
import { Database } from '../../db';
import { EmailRepository } from '../../repositories/email.repository';
import { Logger } from '../../utils/logger';

const logger = new Logger('EmailService');

export class EmailService {
	private emailRepo: EmailRepository;

	constructor(private env: Bindings, db: Database) {
		this.emailRepo = new EmailRepository(db);
	}

	async sendCampaign(payload: { recipient: string; subject: string; bodyHtml: string; senderEmail?: string }) {
		// Outbox Pattern: Saves first, then enqueues
		const sender = payload.senderEmail || 'atendimento@asppibra.com';
		const accountId = await this.emailRepo.getAccountIdByEmail(sender) || undefined;

		const emailId = await this.emailRepo.createOutboundEmail({
			accountId,
			sender,
			recipient: payload.recipient,
			subject: payload.subject,
			bodyHtml: payload.bodyHtml,
			status: 'queued'
		});

		try {
			if (this.env.EMAIL_PIPELINE_QUEUE) {
				await this.env.EMAIL_PIPELINE_QUEUE.send({
					id: crypto.randomUUID(),
					version: 1,
					type: 'outbound',
					correlationId: crypto.randomUUID(),
					createdAt: Date.now(),
					payload: { emailId }
				});
				logger.info('E-mail enfileirado no Outbox com sucesso', { emailId });
			} else {
				logger.warn('Fila EMAIL_PIPELINE_QUEUE não configurada. E-mail permanecerá queued.', { emailId });
			}
		} catch (error) {
			logger.error('Falha ao enfileirar e-mail no Outbox', error, { emailId });
			// Message remains 'queued' in DB. DLQ or fallback job can retry.
		}

		return emailId;
	}

	async listEmails(accountId?: string, limit?: number, cursor?: string) {
		return await this.emailRepo.list(accountId, limit, cursor);
	}
}
