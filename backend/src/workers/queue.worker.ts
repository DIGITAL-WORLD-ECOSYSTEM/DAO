import { MessageBatch, ExecutionContext } from '@cloudflare/workers-types';
import { Bindings } from '../types/bindings';
import { processEmailBuffer } from './email.worker';
import { ResendProvider } from '../services/email/providers/resend-provider';
import { OutboundEmailService } from '../services/email/services/outbound-service';
import { EmailRepository } from '../repositories/email.repository';
import { EventRepository } from '../repositories/event.repository';
import { EmailEventService } from '../services/email/services/email-event.service';
import { createDb } from '../db';
import { NormalizeEmailDTO } from '../dto/normalize-email';
import { EmailEventTypes } from '../dto/email-event';

export async function handleQueueEvent(batch: MessageBatch<any>, env: Bindings, ctx: ExecutionContext) {
	const db = createDb(env.DB);
	const emailRepo = new EmailRepository(db);
	const eventService = new EmailEventService(new EventRepository(db));

	for (const msg of batch.messages) {
		const startTime = Date.now();
		const body = msg.body;
		
		try {
			if (body.type === 'outbound') {
				console.log(`[QueueWorker] Processing outbound email ${body.emailId}`);
				
				await eventService.emit({
					event: EmailEventTypes.PROCESSING,
					source: 'queue',
					emailId: body.emailId,
					queueMessageId: msg.id,
					severity: 'info'
				});
				
				const resendProvider = new ResendProvider(env as any);
				const outboundService = new OutboundEmailService(emailRepo, resendProvider, eventService);
				
				// In a real scenario, the body.payload would be the NormalizeEmailDTO 
				// or we'd fetch it from the DB using emailId.
				// Since we just abstracted the architecture, assuming body.payload is a NormalizeEmailDTO.
				await outboundService.sendEmail(body.payload as NormalizeEmailDTO);
				
				msg.ack();
			} else if (body.type === 'inbound_large') {
				console.log(`[QueueWorker] Processing large inbound email from R2: ${body.r2Key}`);
				
				await eventService.emit({
					event: EmailEventTypes.PROCESSING,
					source: 'queue',
					queueMessageId: msg.id,
					severity: 'info',
					metadata: { queue: 'inbound_large' }
				});
				
				// 1. Fetch from R2
				const obj = await env.R2_EMAIL_ATTACHMENTS.get(body.r2Key);
				if (!obj) {
					throw new Error(`R2 Object not found: ${body.r2Key}`);
				}
				
				const buffer = await obj.arrayBuffer();
				
				// 2. Process via Email Pipeline
				await processEmailBuffer(Buffer.from(buffer), body.authMetadata || {}, env);
				
				// 3. Delete temporary R2 object
				await env.R2_EMAIL_ATTACHMENTS.delete(body.r2Key);
				
				msg.ack();
			} else {
				console.warn(`[QueueWorker] Unknown message type: ${body.type}`);
				msg.ack();
			}
		} catch (error: any) {
			console.error(`[QueueWorker] Failed to process message ${msg.id}:`, error);
			await eventService.emit({
				event: EmailEventTypes.RETRIED,
				source: 'queue',
				queueMessageId: msg.id,
				severity: 'warning',
				durationMs: Date.now() - startTime,
				metadata: { error: error.message }
			});
			msg.retry();
		}
	}
}
