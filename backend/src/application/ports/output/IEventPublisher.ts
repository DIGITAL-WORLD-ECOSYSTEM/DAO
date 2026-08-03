import { Result } from '../../../shared/kernel/result/Result';

export interface IEventPublisher {
  publish(eventName: string, payload: any): Promise<Result<void>>;
}
