import { INotificationRepository } from '../../../application/ports/output/INotificationRepository';
import { Result } from '../../../shared/kernel/Result';
import { Notification } from '../entities/Notification';

export interface ListNotificationsRequest {
  userId: number;
  limit?: number;
  offset?: number;
}

export class ListNotificationsUseCase {
  constructor(private repository: INotificationRepository) {}

  async execute(request: ListNotificationsRequest): Promise<Result<Notification[]>> {
    if (!request.userId) {
      return Result.fail('userId é obrigatório.');
    }

    const limit = request.limit && request.limit > 0 ? request.limit : 50;
    const offset = request.offset && request.offset >= 0 ? request.offset : 0;

    return await this.repository.findByUser(request.userId, limit, offset);
  }
}
