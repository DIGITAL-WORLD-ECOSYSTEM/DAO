import { NormalizeEmailDTO } from '../../../dto/normalize-email';
import { EmailRepository } from '../../../repositories/email.repository';
import { OutboundEmailProvider } from '../providers/provider';
import { EmailEventService } from './email-event.service';
import { EmailEventTypes } from '../../../dto/email-event';

export class OutboundEmailService {
	constructor(
		private emailRepo: EmailRepository,
		private outboundProvider: OutboundEmailProvider,
		private eventService: EmailEventService
	) {}

	async sendEmail(dto: NormalizeEmailDTO): Promise<string> {
		// 1. Initial save in DB as 'queued' or 'sending'
		const emailId = await this.emailRepo.create(dto);
		
		// 2. Dispatch via Provider (e.g. Resend)
		const result = await this.outboundProvider.send(dto);

		// 3. Update status in DB
		if (result.success && result.messageId) {
			await this.emailRepo.updateStatusAndMessageId(emailId, 'sent', result.messageId);
			await this.eventService.emit({
				event: EmailEventTypes.SENT,
				source: 'api',
				emailId,
				messageId: result.messageId,
				severity: 'info',
				provider: 'resend'
			});
		} else {
			await this.emailRepo.updateStatusAndMessageId(emailId, 'failed', `Error: ${result.error || 'Unknown'}`);
			await this.eventService.emit({
				event: EmailEventTypes.FAILED,
				source: 'api',
				emailId,
				severity: 'error',
				provider: 'resend',
				metadata: { error: result.error }
			});
			throw new Error(`Failed to send email: ${result.error}`);
		}

		return emailId;
	}
}
