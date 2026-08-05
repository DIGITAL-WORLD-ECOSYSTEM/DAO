import { IEventBus } from '../../application/ports/output/IEventBus';
import { Result } from '../../shared/kernel/Result';

export class CloudflareQueueEventBus implements IEventBus {
  // Recebe o binding configurado no wrangler.toml (ex: env.DOMAIN_EVENTS_QUEUE)
  constructor(private queue: any) {}

  async publish(eventName: string, payload: any): Promise<Result<void>> {
    try {
      if (!this.queue) {
        return Result.fail('Cloudflare Queue binding is not provided');
      }

      await this.queue.send({
        eventName,
        payload,
        timestamp: new Date().toISOString()
      });

      return Result.ok();
    } catch (error: any) {
      return Result.fail(`CloudflareQueueEventBus failed to publish event: ${error.message}`);
    }
  }
}
