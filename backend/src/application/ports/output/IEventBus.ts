import { IDomainEvent } from '../../../shared/kernel/DomainEvent';
import { Result } from '../../../shared/kernel/Result';

export interface IEventBus {
  /**
   * Publica um evento de domínio em um barramento assíncrono (Queue, Kafka, Redis, etc.)
   */
  publish(eventName: string, payload: any): Promise<Result<void>>;
}
