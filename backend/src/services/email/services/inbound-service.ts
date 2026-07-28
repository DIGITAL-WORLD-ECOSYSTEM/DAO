import { NormalizeEmailDTO } from '../../../dto/normalize-email';
import { EmailRepository } from '../../../repositories/email.repository';
import { AttachmentRepository } from '../../../repositories/attachment.repository';
import { ThreadService } from './thread-service';
import { AttachmentService } from './attachment-service';
import { SpamProvider, ParserProvider, InboundEmailProvider } from '../providers/provider';
import { EmailEventService } from './email-event.service';
import { EmailEventTypes } from '../../../dto/email-event';

export class InboundEmailService {
	constructor(
		private emailRepo: EmailRepository,
		private attachmentRepo: AttachmentRepository,
		private threadService: ThreadService,
		private attachmentService: AttachmentService,
		private parserProvider: ParserProvider,
		private spamProvider: SpamProvider,
		private eventService: EmailEventService
	) {}

	/**
	 * Processa o stream ou buffer bruto de um provedor (ex: Cloudflare Email Routing).
	 */
	async processRawEmail(rawEmail: Buffer | string, authMetadata: Record<string, any> = {}): Promise<string> {
		// 1. Parse via MailParserService (ParserProvider)
		const dto: NormalizeEmailDTO = await this.parserProvider.parse(rawEmail);
		dto.authMetadata = authMetadata;
		
		await this.eventService.emit({
			event: EmailEventTypes.PARSED,
			source: 'worker',
			messageId: dto.messageId,
			severity: 'info'
		});

		// 2. Spam & Security Check
		const spamResult = await this.spamProvider.validate(dto.headers, authMetadata);
		dto.authMetadata.spamScore = spamResult.score;
		dto.authMetadata.spamReasons = spamResult.reasons;
		dto.authMetadata.isSafe = spamResult.isSafe;

		// 3. Thread Resolver
		let accountId = 'system';
		if (dto.to && dto.to.length > 0) {
			const foundId = await this.emailRepo.getAccountIdByEmail(dto.to[0].address);
			if (foundId) accountId = foundId;
		}
		dto.threadId = await this.threadService.resolveThread(dto, accountId);

		// 4. Attachment Upload
		dto.attachments = await this.attachmentService.processAttachments(dto.attachments);

		// 5. Deduplication Check
		const exists = await this.emailRepo.existsByMessageId(dto.messageId);
		if (exists) {
			console.warn(`[InboundService] Email duplicado ignorado: ${dto.messageId}`);
			return dto.messageId; // Já processado
		}

		// 6. Save Email (D1)
		const emailId = await this.emailRepo.create(dto);

		// 7. Save Attachments (D1)
		await this.attachmentRepo.createMany(emailId, dto.attachments);

		await this.eventService.emit({
			event: EmailEventTypes.STORED,
			source: 'worker',
			emailId: emailId,
			messageId: dto.messageId,
			severity: 'info',
			metadata: { attachmentCount: dto.attachments.length, spamScore: spamResult.score }
		});

		// TODO: Trigger Notification/SWR webhook update to frontend

		return emailId;
	}
}
