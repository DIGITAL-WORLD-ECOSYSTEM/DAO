import { Notification } from '../../../domains/notifications/entities/Notification';
import { Result } from '../../../shared/kernel/Result';

export interface INotificationRepository {
  create(notification: Notification): Promise<Result<Notification>>;
  findById(id: number): Promise<Result<Notification>>;
  findByUser(userId: number, limit?: number, offset?: number): Promise<Result<Notification[]>>;
  markAsRead(id: number, userId: number): Promise<Result<void>>;
  markAllAsRead(userId: number): Promise<Result<void>>;
  countUnread(userId: number): Promise<Result<number>>;
}
