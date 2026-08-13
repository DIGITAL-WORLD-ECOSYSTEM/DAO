import { describe, it, expect, beforeEach } from 'vitest';
import { CreateNotificationUseCase } from './CreateNotificationUseCase';
import { ListNotificationsUseCase } from './ListNotificationsUseCase';
import { MarkNotificationAsReadUseCase } from './MarkNotificationAsReadUseCase';
import { MarkAllNotificationsAsReadUseCase } from './MarkAllNotificationsAsReadUseCase';
import { CountUnreadNotificationsUseCase } from './CountUnreadNotificationsUseCase';
import { INotificationRepository } from '../../../application/ports/output/INotificationRepository';
import { Result } from '../../../shared/kernel/Result';
import { Notification } from '../entities/Notification';

class MockNotificationRepository implements INotificationRepository {
  public notifications: Notification[] = [];
  public idCounter = 1;

  async create(notification: Notification): Promise<Result<Notification>> {
    const created = Notification.reconstitute(notification.props, this.idCounter++);
    this.notifications.push(created);
    return Result.ok(created);
  }

  async findById(id: number): Promise<Result<Notification>> {
    const n = this.notifications.find(n => n.id === id);
    if (!n) return Result.fail('Notificação não encontrada.');
    return Result.ok(n);
  }

  async findByUser(userId: number, limit: number = 50, offset: number = 0): Promise<Result<Notification[]>> {
    const userNotes = this.notifications
      .filter(n => n.userId === userId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime()) // desc
      .slice(offset, offset + limit);
    return Result.ok(userNotes);
  }

  async markAsRead(id: number, userId: number): Promise<Result<void>> {
    const n = this.notifications.find(n => n.id === id && n.userId === userId);
    if (!n) return Result.fail('Notificação não encontrada.');
    n.markAsRead();
    return Result.ok();
  }

  async markAllAsRead(userId: number): Promise<Result<void>> {
    this.notifications.forEach(n => {
      if (n.userId === userId && !n.isRead) {
        n.markAsRead();
      }
    });
    return Result.ok();
  }

  async countUnread(userId: number): Promise<Result<number>> {
    const count = this.notifications.filter(n => n.userId === userId && !n.isRead).length;
    return Result.ok(count);
  }
}

describe('Notification UseCases', () => {
  let repository: MockNotificationRepository;
  
  beforeEach(() => {
    repository = new MockNotificationRepository();
  });

  describe('CreateNotificationUseCase', () => {
    it('deve criar uma notificação', async () => {
      const uc = new CreateNotificationUseCase(repository);
      const res = await uc.execute({
        userId: 1, type: 'sys', category: 'cat', title: 'test'
      });
      expect(res.isSuccess).toBe(true);
      expect(repository.notifications.length).toBe(1);
      expect(res.getValue().id).toBe(1);
    });

    it('deve falhar se faltarem dados obrigatórios', async () => {
      const uc = new CreateNotificationUseCase(repository);
      const res = await uc.execute({ userId: 0, type: '', category: '', title: '' });
      expect(res.isFailure).toBe(true);
      expect(res.error).toContain('obrigatórios');
    });
  });

  describe('ListNotificationsUseCase (e Isolamento)', () => {
    it('deve listar apenas notificações do usuário solicitado', async () => {
      const uc = new ListNotificationsUseCase(repository);
      
      await repository.create(Notification.create({ userId: 1, type: 'A', category: 'C', title: '1' }));
      await repository.create(Notification.create({ userId: 1, type: 'A', category: 'C', title: '2' }));
      await repository.create(Notification.create({ userId: 2, type: 'B', category: 'C', title: '3' }));

      const resA = await uc.execute({ userId: 1 });
      const resB = await uc.execute({ userId: 2 });

      expect(resA.getValue().length).toBe(2);
      expect(resA.getValue()[0].userId).toBe(1);
      
      expect(resB.getValue().length).toBe(1);
      expect(resB.getValue()[0].title).toBe('3');
    });
  });

  describe('MarkNotificationAsReadUseCase', () => {
    it('deve marcar como lida apenas se pertencer ao usuário', async () => {
      await repository.create(Notification.create({ userId: 1, type: 'A', category: 'C', title: '1' }));
      const uc = new MarkNotificationAsReadUseCase(repository);

      // Usuário 2 tentando ler do usuário 1
      const resFail = await uc.execute({ userId: 2, notificationId: 1 });
      expect(resFail.isFailure).toBe(true);

      // Usuário 1 lendo sua própria
      const resSuccess = await uc.execute({ userId: 1, notificationId: 1 });
      expect(resSuccess.isSuccess).toBe(true);
      
      const n = await repository.findById(1);
      expect(n.getValue().isRead).toBe(true);
    });
  });

  describe('MarkAllNotificationsAsReadUseCase', () => {
    it('deve marcar todas como lidas do usuário', async () => {
      await repository.create(Notification.create({ userId: 1, type: 'A', category: 'C', title: '1' }));
      await repository.create(Notification.create({ userId: 1, type: 'A', category: 'C', title: '2' }));
      await repository.create(Notification.create({ userId: 2, type: 'A', category: 'C', title: '3' }));

      const uc = new MarkAllNotificationsAsReadUseCase(repository);
      await uc.execute({ userId: 1 });

      expect((await repository.findById(1)).getValue().isRead).toBe(true);
      expect((await repository.findById(2)).getValue().isRead).toBe(true);
      expect((await repository.findById(3)).getValue().isRead).toBe(false); // Usuário 2 intacto
    });
  });

  describe('CountUnreadNotificationsUseCase', () => {
    it('deve retornar quantidade correta', async () => {
      await repository.create(Notification.create({ userId: 1, type: 'A', category: 'C', title: '1' }));
      await repository.create(Notification.create({ userId: 1, type: 'A', category: 'C', title: '2' }));
      
      const n3 = Notification.create({ userId: 1, type: 'A', category: 'C', title: '3' });
      n3.markAsRead();
      await repository.create(n3);

      const uc = new CountUnreadNotificationsUseCase(repository);
      const count = await uc.execute({ userId: 1 });
      expect(count.getValue()).toBe(2);
    });
  });
});
