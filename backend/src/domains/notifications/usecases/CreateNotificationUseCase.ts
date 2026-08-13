import { INotificationRepository } from '../../../application/ports/output/INotificationRepository';
import { Result } from '../../../shared/kernel/Result';
import { Notification, NotificationProps } from '../entities/Notification';

export interface CreateNotificationRequest {
  userId: number;
  type: string;
  category: string;
  title: string;
  message?: string;
  data?: any;
}

export class CreateNotificationUseCase {
  constructor(private repository: INotificationRepository) {}

  async execute(request: CreateNotificationRequest): Promise<Result<Notification>> {
    if (!request.userId || !request.type || !request.category || !request.title) {
      return Result.fail('userId, type, category e title são obrigatórios.');
    }

    const notification = Notification.create({
      userId: request.userId,
      type: request.type,
      category: request.category,
      title: request.title,
      message: request.message,
      data: request.data,
    });

    return await this.repository.create(notification);
  }
}
