import { INotificationRepository } from '../../../application/ports/output/INotificationRepository';
import { Result } from '../../../shared/kernel/Result';

export interface MarkAllNotificationsAsReadRequest {
  userId: number;
}

export class MarkAllNotificationsAsReadUseCase {
  constructor(private repository: INotificationRepository) {}

  async execute(request: MarkAllNotificationsAsReadRequest): Promise<Result<void>> {
    if (!request.userId) {
      return Result.fail('userId é obrigatório.');
    }

    return await this.repository.markAllAsRead(request.userId);
  }
}
