import { Context } from 'hono';
import { DrizzleNotificationRepository } from '../repositories/DrizzleNotificationRepository';
import { CreateNotificationUseCase } from '../../domains/notifications/usecases/CreateNotificationUseCase';
import { ListNotificationsUseCase } from '../../domains/notifications/usecases/ListNotificationsUseCase';
import { CountUnreadNotificationsUseCase } from '../../domains/notifications/usecases/CountUnreadNotificationsUseCase';
import { MarkNotificationAsReadUseCase } from '../../domains/notifications/usecases/MarkNotificationAsReadUseCase';
import { MarkAllNotificationsAsReadUseCase } from '../../domains/notifications/usecases/MarkAllNotificationsAsReadUseCase';
import { NotificationController } from '../../domains/notifications/controllers/NotificationController';

export async function setupNotificationsDI(c: Context) {
  const db = c.get('db' as any);
  
  const repo = new DrizzleNotificationRepository(db);

  const createUseCase = new CreateNotificationUseCase(repo);
  const listUseCase = new ListNotificationsUseCase(repo);
  const countUseCase = new CountUnreadNotificationsUseCase(repo);
  const markAsReadUseCase = new MarkNotificationAsReadUseCase(repo);
  const markAllAsReadUseCase = new MarkAllNotificationsAsReadUseCase(repo);

  const controller = new NotificationController(
    createUseCase,
    listUseCase,
    markAsReadUseCase,
    markAllAsReadUseCase,
    countUseCase
  );

  return {
    repo,
    controller,
    createUseCase,
    listUseCase,
    countUseCase,
    markAsReadUseCase,
    markAllAsReadUseCase
  };
}
