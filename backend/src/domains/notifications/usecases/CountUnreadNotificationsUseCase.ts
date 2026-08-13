import { INotificationRepository } from '../../../application/ports/output/INotificationRepository';
import { Result } from '../../../shared/kernel/Result';

export interface CountUnreadNotificationsRequest {
  userId: number;
}

export class CountUnreadNotificationsUseCase {
  constructor(private repository: INotificationRepository) {}

  async execute(request: CountUnreadNotificationsRequest): Promise<Result<number>> {
    if (!request.userId) {
      return Result.fail('userId é obrigatório.');
    }

    return await this.repository.countUnread(request.userId);
  }
}
