import { Bindings } from '../../types/bindings';
import { QueueEnvelope, OutboundEmailQueueDTO } from '../../dto/queue-envelope';
import { EmailRepository } from '../../repositories/email.repository';
import { EventRepository } from '../../repositories/event.repository';
import { EmailEventService } from '../../services/email/services/email-event.service';
import { ResendProvider } from '../../services/email/providers/resend-provider';
import { EmailEventTypes } from '../../dto/email-event';
import { createDb } from '../../db';
import { emails } from '../../db/schema';
import { eq } from 'drizzle-orm';

export class OutboundQueueHandler {
	constructor(private env: Bindings) {}

	async execute(envelope: QueueEnvelope<OutboundEmailQueueDTO>) {
		const db = createDb(this.env.DB);
		const emailRepo = new EmailRepository(db);
		const eventService = new EmailEventService(new EventRepository(db));
		
		const { emailId } = envelope.payload;

		// 1. Check idempotency (only process if it's 'queued', 'draft' or 'processing')
		const emailRecord = await db.select().from(emails).where(eq(emails.id, emailId)).get();
		if (!emailRecord) {
			throw new Error(`EmailRecord not found: ${emailId}`);
		}

		if (emailRecord.status === 'sent' || emailRecord.status === 'delivered') {
			console.log(`[OutboundQueueHandler] Email ${emailId} is already ${emailRecord.status}. Skipping.`);
			return; // Idempotency
		}

		// 2. Mark as processing/sending
		// Assuming status 'processing' is added to schema, if not, we can just use 'queued' or 'draft'.
		// We will update the schema to include 'processing' and 'sending'.
		await db.update(emails).set({ status: 'sending' }).where(eq(emails.id, emailId));
		await eventService.emit({
			event: EmailEventTypes.SENDING,
			source: 'queue',
			emailId,
			queueMessageId: envelope.id,
			severity: 'info'
		});

		// 3. Dispatch to Resend
		const resendProvider = new ResendProvider(this.env as any);
		const result = await resendProvider.send({
			from: { name: '', address: emailRecord.sender },
			to: [{ address: emailRecord.recipient }],
			cc: (emailRecord.cc ? emailRecord.cc.split(',').map(c => ({ address: c.trim() })) : undefined) as any,
			bcc: (emailRecord.bcc ? emailRecord.bcc.split(',').map(b => ({ address: b.trim() })) : undefined) as any,
			subject: emailRecord.subject,
			html: emailRecord.bodyHtml || '',
			text: emailRecord.bodyText || '',
		} as any);

		// 4. Update status based on result
		if (result.success && result.messageId) {
			await emailRepo.updateStatusAndMessageId(emailId, 'sent', result.messageId);
			await eventService.emit({
				event: EmailEventTypes.SENT,
				source: 'queue',
				emailId,
				messageId: result.messageId,
				severity: 'info',
				provider: 'resend'
			});
		} else {
			await emailRepo.updateStatusAndMessageId(emailId, 'failed', result.error || 'Unknown Error');
			await eventService.emit({
				event: EmailEventTypes.FAILED,
				source: 'queue',
				emailId,
				severity: 'error',
				provider: 'resend',
				metadata: { error: result.error }
			});
			throw new Error(`Failed to send email: ${result.error}`);
		}
	}
}
