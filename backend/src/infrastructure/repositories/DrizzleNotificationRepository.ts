import { eq, and, desc, sql } from 'drizzle-orm';
import { notifications } from '../../db/communication/tables';
import { Notification } from '../../domains/notifications/entities/Notification';
import { INotificationRepository } from '../../application/ports/output/INotificationRepository';
import { Result } from '../../shared/kernel/Result';

export class DrizzleNotificationRepository implements INotificationRepository {
  constructor(private db: any) {}

  async create(notification: Notification): Promise<Result<Notification>> {
    try {
      const [record] = await this.db
        .insert(notifications)
        .values({
          userId: notification.userId,
          type: notification.type,
          category: notification.category,
          title: notification.title,
          message: notification.message,
          data: notification.data,
          isRead: notification.isRead,
          readAt: notification.readAt,
          createdAt: notification.createdAt,
          updatedAt: notification.createdAt,
        })
        .returning();

      if (!record) {
        return Result.fail('Falha ao criar notificação no banco de dados.');
      }

      const createdEntity = Notification.reconstitute(
        {
          userId: record.userId,
          type: record.type,
          category: record.category,
          title: record.title,
          message: record.message,
          data: record.data,
          isRead: record.isRead,
          readAt: record.readAt ? new Date(record.readAt) : null,
          createdAt: new Date(record.createdAt),
          updatedAt: new Date(record.updatedAt),
        },
        record.id
      );

      return Result.ok(createdEntity);
    } catch (error: any) {
      return Result.fail(`Erro ao salvar notificação: ${error.message}`);
    }
  }

  async findById(id: number): Promise<Result<Notification>> {
    try {
      const [record] = await this.db
        .select()
        .from(notifications)
        .where(eq(notifications.id, id))
        .limit(1);

      if (!record) {
        return Result.fail('Notificação não encontrada.');
      }

      return Result.ok(this.mapToDomain(record));
    } catch (error: any) {
      return Result.fail(`Erro ao buscar notificação: ${error.message}`);
    }
  }

  async findByUser(userId: number, limit: number = 50, offset: number = 0): Promise<Result<Notification[]>> {
    try {
      const records = await this.db
        .select()
        .from(notifications)
        .where(eq(notifications.userId, userId))
        .orderBy(desc(notifications.createdAt))
        .limit(limit)
        .offset(offset);

      const items = records.map((r: any) => this.mapToDomain(r));
      return Result.ok(items);
    } catch (error: any) {
      return Result.fail(`Erro ao buscar notificações do usuário: ${error.message}`);
    }
  }

  async markAsRead(id: number, userId: number): Promise<Result<void>> {
    try {
      const [record] = await this.db
        .update(notifications)
        .set({
          isRead: true,
          readAt: sql`(strftime('%s', 'now'))`,
          updatedAt: sql`(strftime('%s', 'now'))`,
        })
        .where(and(eq(notifications.id, id), eq(notifications.userId, userId)))
        .returning();

      if (!record) {
        return Result.fail('Notificação não encontrada ou não pertence ao usuário.');
      }

      return Result.ok();
    } catch (error: any) {
      return Result.fail(`Erro ao marcar notificação como lida: ${error.message}`);
    }
  }

  async markAllAsRead(userId: number): Promise<Result<void>> {
    try {
      await this.db
        .update(notifications)
        .set({
          isRead: true,
          readAt: sql`(strftime('%s', 'now'))`,
          updatedAt: sql`(strftime('%s', 'now'))`,
        })
        .where(and(eq(notifications.userId, userId), eq(notifications.isRead, false)));

      return Result.ok();
    } catch (error: any) {
      return Result.fail(`Erro ao marcar todas notificações como lidas: ${error.message}`);
    }
  }

  async countUnread(userId: number): Promise<Result<number>> {
    try {
      const [result] = await this.db
        .select({ count: sql<number>`count(*)` })
        .from(notifications)
        .where(and(eq(notifications.userId, userId), eq(notifications.isRead, false)));

      return Result.ok(result?.count || 0);
    } catch (error: any) {
      return Result.fail(`Erro ao contar notificações não lidas: ${error.message}`);
    }
  }

  private mapToDomain(record: any): Notification {
    return Notification.reconstitute(
      {
        userId: record.userId,
        type: record.type,
        category: record.category,
        title: record.title,
        message: record.message,
        data: record.data,
        isRead: record.isRead,
        readAt: record.readAt ? new Date(record.readAt) : null,
        createdAt: new Date(record.createdAt),
        updatedAt: new Date(record.updatedAt),
      },
      record.id
    );
  }
}
