import { IOutboxRepository } from '../../application/ports/output/IOutboxRepository';
import { IEventBus } from '../../application/ports/output/IEventBus';
import { Result } from '../../shared/kernel/Result';

export class OutboxProcessor {
  constructor(
    private outboxRepository: IOutboxRepository,
    private eventBus: IEventBus
  ) {}

  /**
   * Processa eventos pendentes no banco e despacha para o barramento de eventos.
   * Pode ser chamado via Cron Job, Cloudflare Scheduled Event ou após commits estratégicos.
   */
  async process(batchSize: number = 50): Promise<Result<{ processed: number, failed: number }>> {
    const pendingResult = await this.outboxRepository.getPendingEvents(batchSize);
    
    if (pendingResult.isFailure) {
      return Result.fail(`Failed to read outbox: ${pendingResult.error}`);
    }

    const events = pendingResult.getValue();
    if (!events || events.length === 0) {
      return Result.ok({ processed: 0, failed: 0 });
    }

    let processedCount = 0;
    let failedCount = 0;

    for (const record of events) {
      try {
        // Envia para o Barramento de Eventos
        const payload = JSON.parse(record.payload);
        const publishResult = await this.eventBus.publish(record.eventName, payload);

        if (publishResult.isSuccess) {
          // Marca como publicado com sucesso
          await this.outboxRepository.markAsPublished(record.id);
          processedCount++;
        } else {
          // Registra falha e incrementa attempt
          await this.outboxRepository.markAsFailed(record.id, publishResult.error || 'Unknown error');
          failedCount++;
        }
      } catch (err: any) {
        await this.outboxRepository.markAsFailed(record.id, err.message);
        failedCount++;
      }
    }

    return Result.ok({ processed: processedCount, failed: failedCount });
  }
}
