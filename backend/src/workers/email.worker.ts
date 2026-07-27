import { ForwardableEmailMessage, ExecutionContext } from '@cloudflare/workers-types';
import { Bindings } from '../types/bindings';
import { CloudflareEmailProvider } from '../services/email/providers/cloudflare-provider';
import { MailParserProvider } from '../services/email/providers/parser-provider';
import { CloudflareSpamProvider } from '../services/email/providers/spam-provider';
import { R2StorageProvider } from '../services/email/providers/storage-provider';
import { InboundEmailService } from '../services/email/services/inbound-service';
import { ThreadService } from '../services/email/services/thread-service';
import { AttachmentService } from '../services/email/services/attachment-service';
import { EmailRepository } from '../repositories/email.repository';
import { AttachmentRepository } from '../repositories/attachment.repository';
import { ThreadRepository } from '../repositories/thread.repository';
import { EventRepository } from '../repositories/event.repository';
import { EmailEventService } from '../services/email/services/email-event.service';
import { createDb } from '../db';
import { EmailEventTypes } from '../dto/email-event';

// The threshold in bytes to consider an email "large" (e.g. 512KB)
// Emails above this size (usually with attachments) are sent to the Queue.
const LARGE_EMAIL_THRESHOLD = 512 * 1024; 

export async function handleEmailEvent(message: ForwardableEmailMessage, env: Bindings, ctx: ExecutionContext) {
	const startTime = Date.now();
	const db = createDb(env.DB);
	const eventService = new EmailEventService(new EventRepository(db));
	// Usamos o Message-ID do header ou geramos um ID de correlação fallback
	const messageId = message.headers.get('message-id') || crypto.randomUUID();

	try {
		const size = message.rawSize; // Some versions of ForwardableEmailMessage have size info
		
		await eventService.emit({
			event: EmailEventTypes.RECEIVED,
			source: 'worker',
			messageId,
			severity: 'info',
			durationMs: Date.now() - startTime,
			metadata: { headers: Object.fromEntries(message.headers) }
		});
		
		if (size && size > LARGE_EMAIL_THRESHOLD) {
			// Send to Queue
			console.log(`[EmailWorker] Email is large (${size} bytes). Offloading to Queue.`);
			// Note: We can't directly serialize ForwardableEmailMessage to Queue.
			// We have to read the stream to a buffer and pass the buffer, OR save the stream to R2 temporarily.
			// Since reading to buffer consumes memory, for now we will read to buffer and queue it, 
			// OR if it's too big for Queue (128KB limit in SQS/Cloudflare Queue), we MUST save to R2 first!
			// Cloudflare Queues have a 128KB message limit. So we CANNOT send large emails directly in Queue payload!
			
			// Strategy for Large Emails in CF Queues:
			// 1. Read Stream
			// 2. Save raw buffer to R2 temporary key
			// 3. Send { type: 'inbound_large', r2Key: 'temp/...' } to Queue
			
			const provider = new CloudflareEmailProvider();
			const buffer = await provider.receive(message);
			const tempKey = `inbound_temp/${Date.now()}-${message.from}.eml`;
			await env.R2_EMAIL_ATTACHMENTS.put(tempKey, buffer);
			
			await env.EMAIL_SYNC_QUEUE.send({ 
				type: 'inbound_large', 
				r2Key: tempKey, 
				from: message.from, 
				to: message.to,
				headers: Object.fromEntries(message.headers) 
			});
			
			await eventService.emit({
				event: EmailEventTypes.QUEUED,
				source: 'worker',
				messageId,
				severity: 'info',
				durationMs: Date.now() - startTime,
			});
			return;
		}

		// Small email -> Process directly
		console.log(`[EmailWorker] Processing small email directly.`);
		const provider = new CloudflareEmailProvider();
		const rawBuffer = await provider.receive(message);
		const authMetadata = provider.extractAuthMetadata(message.headers);
		
		await processEmailBuffer(rawBuffer, authMetadata, env);
		
	} catch (error: any) {
		console.error(`[EmailWorker] Failed to process email event:`, error);
		await eventService.emit({
			event: EmailEventTypes.FAILED,
			source: 'worker',
			messageId,
			severity: 'error',
			durationMs: Date.now() - startTime,
			metadata: { error: error.message }
		});
		message.setReject('Failed to process email');
	}
}

export async function processEmailBuffer(rawBuffer: Buffer | Uint8Array, authMetadata: Record<string, any>, env: Bindings) {
	const db = createDb(env.DB);
	
	const emailRepo = new EmailRepository(db);
	const attachmentRepo = new AttachmentRepository(db);
	const threadRepo = new ThreadRepository(db);
	
	const storageProvider = new R2StorageProvider(env.R2_EMAIL_ATTACHMENTS, env.R2_PUBLIC_URL);
	const parserProvider = new MailParserProvider();
	const spamProvider = new CloudflareSpamProvider();
	
	const eventService = new EmailEventService(new EventRepository(db));
	
	const attachmentService = new AttachmentService(storageProvider);
	const threadService = new ThreadService(threadRepo);
	
	const inboundService = new InboundEmailService(
		emailRepo,
		attachmentRepo,
		threadService,
		attachmentService,
		parserProvider,
		spamProvider,
		eventService
	);

	await inboundService.processRawEmail(rawBuffer as Buffer, authMetadata);
}
