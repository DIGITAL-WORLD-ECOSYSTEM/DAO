import { describe, it, expect, vi } from 'vitest';
import { DrizzleNotificationRepository } from './DrizzleNotificationRepository';
import { Notification } from '../../domains/notifications/entities/Notification';

describe('DrizzleNotificationRepository', () => {
  it('should return count of unread notifications', async () => {
    const mockDb = {
      select: vi.fn().mockReturnThis(),
      from: vi.fn().mockReturnThis(),
      where: vi.fn().mockResolvedValue([{ count: 5 }]),
    };

    const repo = new DrizzleNotificationRepository(mockDb);
    const result = await repo.countUnread(1);

    expect(result.isSuccess).toBe(true);
    expect(result.getValue()).toBe(5);
  });

  it('should create notification successfully', async () => {
    const mockNotification = Notification.create({
      userId: 1,
      type: 'INFO',
      category: 'SYSTEM',
      title: 'Bem-vindo',
      message: 'Notificação de teste',
    });

    const mockDb = {
      insert: vi.fn().mockReturnThis(),
      values: vi.fn().mockReturnThis(),
      returning: vi.fn().mockResolvedValue([
        {
          id: 10,
          userId: 1,
          type: 'INFO',
          category: 'SYSTEM',
          title: 'Bem-vindo',
          message: 'Notificação de teste',
          data: null,
          isRead: false,
          readAt: null,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ]),
    };

    const repo = new DrizzleNotificationRepository(mockDb);
    const result = await repo.create(mockNotification);

    expect(result.isSuccess).toBe(true);
    expect(result.getValue().id).toBe(10);
  });
});
