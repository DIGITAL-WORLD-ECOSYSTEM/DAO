import { IDomainEvent, IDomainEventPublisher } from '../../shared/kernel/DomainEvent';

export class NullPublisher implements IDomainEventPublisher {
  async publish(event: IDomainEvent): Promise<void> {
    // Intentionally empty for Sprint B
  }

  async publishAll(events: IDomainEvent[]): Promise<void> {
    // Intentionally empty for Sprint B
  }
}
