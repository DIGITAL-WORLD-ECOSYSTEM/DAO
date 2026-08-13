import { describe, it, expect } from 'vitest';
import { Notification } from './Notification';

describe('Notification Entity', () => {
  it('deve criar uma nova notificação com estado inicial correto', () => {
    const notification = Notification.create({
      userId: 1,
      type: 'system',
      category: 'UI',
      title: 'Bem-vindo!',
      message: 'Olá, mundo.',
    });

    expect(notification.userId).toBe(1);
    expect(notification.type).toBe('system');
    expect(notification.category).toBe('UI');
    expect(notification.title).toBe('Bem-vindo!');
    expect(notification.message).toBe('Olá, mundo.');
    expect(notification.isRead).toBe(false);
    expect(notification.readAt).toBeNull();
    expect(notification.createdAt).toBeInstanceOf(Date);
  });

  it('deve marcar a notificação como lida', () => {
    const notification = Notification.create({
      userId: 2,
      type: 'payment',
      category: 'Finance',
      title: 'Pagamento recebido',
    });

    expect(notification.isRead).toBe(false);
    
    notification.markAsRead();
    
    expect(notification.isRead).toBe(true);
    expect(notification.readAt).toBeInstanceOf(Date);
  });

  it('deve ser idempotente ao marcar como lida múltiplas vezes', () => {
    const notification = Notification.create({
      userId: 3,
      type: 'social',
      category: 'Friend',
      title: 'Novo amigo',
    });

    notification.markAsRead();
    const firstReadAt = notification.readAt;

    notification.markAsRead(); // Chamando novamente
    
    expect(notification.isRead).toBe(true);
    expect(notification.readAt).toBe(firstReadAt); // Não deve sobrescrever o tempo original
  });

  it('deve permitir reconstituir uma notificação existente', () => {
    const pastDate = new Date('2025-01-01');
    const notification = Notification.reconstitute({
      userId: 1,
      type: 'alert',
      category: 'Security',
      title: 'Alerta',
      isRead: true,
      readAt: pastDate,
      createdAt: pastDate,
      updatedAt: pastDate
    }, 100);

    expect(notification.id).toBe(100);
    expect(notification.isRead).toBe(true);
    expect(notification.readAt).toEqual(pastDate);
  });
});
