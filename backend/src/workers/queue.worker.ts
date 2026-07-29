import { MessageBatch, ExecutionContext } from '@cloudflare/workers-types';
import { Bindings } from '../types/bindings';
import { QueueEnvelope } from '../dto/queue-envelope';
import { OutboundQueueHandler } from './handlers/outbound.handler';
import { InboundQueueHandler } from './handlers/inbound.handler';
import { EventRepository } from '../repositories/event.repository';
import { EmailEventService } from '../services/email/services/email-event.service';
import { createDb } from '../db';
import { EmailEventTypes } from '../dto/email-event';

export async function handleQueueEvent(
  batch: MessageBatch<any>,
  env: Bindings,
  ctx: ExecutionContext
) {
  const db = createDb(env.DB);
  const eventService = new EmailEventService(new EventRepository(db));

  const outboundHandler = new OutboundQueueHandler(env);
  const inboundHandler = new InboundQueueHandler(env);

  for (const msg of batch.messages) {
    const startTime = Date.now();
    const envelope = msg.body as QueueEnvelope<any>;

    try {
      if (envelope.type === 'outbound') {
        console.log(`[QueueWorker] Handling outbound queue message: ${envelope.id}`);
        await outboundHandler.execute(envelope);
        msg.ack();
      } else if (envelope.type === 'inbound-large') {
        console.log(`[QueueWorker] Handling inbound large queue message: ${envelope.id}`);
        await inboundHandler.execute(envelope);
        msg.ack();
      } else {
        console.warn(`[QueueWorker] Unknown message type: ${envelope.type}`);
        msg.ack(); // Ack unknown messages to avoid poison queue loop
      }
    } catch (error: any) {
      console.error(`[QueueWorker] Failed to process message ${msg.id}:`, error);
      await eventService.emit({
        event: EmailEventTypes.RETRIED,
        source: 'queue',
        queueMessageId: msg.id,
        severity: 'warning',
        durationMs: Date.now() - startTime,
        metadata: { error: error.message, envelopeType: envelope.type },
      });
      msg.retry();
    }
  }
}
