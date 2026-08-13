import { INotificationRepository } from '../../../application/ports/output/INotificationRepository';
import { Result } from '../../../shared/kernel/Result';

export interface MarkNotificationAsReadRequest {
  notificationId: number;
  userId: number;
}

export class MarkNotificationAsReadUseCase {
  constructor(private repository: INotificationRepository) {}

  async execute(request: MarkNotificationAsReadRequest): Promise<Result<void>> {
    if (!request.notificationId || !request.userId) {
      return Result.fail('notificationId e userId são obrigatórios.');
    }

    return await this.repository.markAsRead(request.notificationId, request.userId);
  }
}
