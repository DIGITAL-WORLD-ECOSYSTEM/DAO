import { Bindings } from '../../types/bindings';
import { QueueEnvelope, InboundLargeEmailQueueDTO } from '../../dto/queue-envelope';
import { processEmailBuffer } from '../email.worker';
import { EventRepository } from '../../repositories/event.repository';
import { EmailEventService } from '../../services/email/services/email-event.service';
import { EmailEventTypes } from '../../dto/email-event';
import { createDb } from '../../db';

export class InboundQueueHandler {
	constructor(private env: Bindings) {}

	async execute(envelope: QueueEnvelope<InboundLargeEmailQueueDTO>) {
		const db = createDb(this.env.DB);
		const eventService = new EmailEventService(new EventRepository(db));
		const { r2Key, authMetadata } = envelope.payload;

		await eventService.emit({
			event: EmailEventTypes.PROCESSING,
			source: 'queue',
			queueMessageId: envelope.id,
			severity: 'info',
			metadata: { queue: 'inbound_large', r2Key }
		});
		
		// 1. Fetch from R2
		const obj = await this.env.R2_EMAIL_ATTACHMENTS.get(r2Key);
		if (!obj) {
			throw new Error(`R2 Object not found: ${r2Key}`);
		}
		
		const buffer = await obj.arrayBuffer();
		
		// 2. Process via Email Pipeline
		await processEmailBuffer(Buffer.from(buffer), authMetadata || {}, this.env);
		
		// 3. Delete temporary R2 object
		await this.env.R2_EMAIL_ATTACHMENTS.delete(r2Key);
	}
}
