import { CreateNotificationUseCase, CreateNotificationRequest } from '../usecases/CreateNotificationUseCase';
import { ListNotificationsUseCase, ListNotificationsRequest } from '../usecases/ListNotificationsUseCase';
import { MarkNotificationAsReadUseCase, MarkNotificationAsReadRequest } from '../usecases/MarkNotificationAsReadUseCase';
import { MarkAllNotificationsAsReadUseCase, MarkAllNotificationsAsReadRequest } from '../usecases/MarkAllNotificationsAsReadUseCase';
import { CountUnreadNotificationsUseCase, CountUnreadNotificationsRequest } from '../usecases/CountUnreadNotificationsUseCase';

export interface HttpRequest {
  body?: any;
  query?: any;
  params?: any;
  headers?: any;
  user?: any;
}

export interface HttpResponse {
  status: number;
  body: any;
}

export class NotificationController {
  constructor(
    private createUseCase: CreateNotificationUseCase,
    private listUseCase: ListNotificationsUseCase,
    private markAsReadUseCase: MarkNotificationAsReadUseCase,
    private markAllAsReadUseCase: MarkAllNotificationsAsReadUseCase,
    private countUnreadUseCase: CountUnreadNotificationsUseCase
  ) {}

  async create(req: HttpRequest): Promise<HttpResponse> {
    const payload: CreateNotificationRequest = {
      userId: req.body.userId,
      type: req.body.type,
      category: req.body.category,
      title: req.body.title,
      message: req.body.message,
      data: req.body.data,
    };

    const result = await this.createUseCase.execute(payload);

    if (result.isFailure) {
      return { status: 400, body: { success: false, message: result.error } };
    }

    return {
      status: 201,
      body: {
        success: true,
        message: 'Notificação criada com sucesso',
        data: result.getValue(),
      },
    };
  }

  async list(req: HttpRequest): Promise<HttpResponse> {
    const payload: ListNotificationsRequest = {
      userId: req.user?.userId,
      limit: req.query?.limit ? parseInt(req.query.limit, 10) : 50,
      offset: req.query?.offset ? parseInt(req.query.offset, 10) : 0,
    };

    const result = await this.listUseCase.execute(payload);

    if (result.isFailure) {
      return { status: 400, body: { success: false, message: result.error } };
    }

    return {
      status: 200,
      body: {
        success: true,
        data: result.getValue(),
      },
    };
  }

  async markAsRead(req: HttpRequest): Promise<HttpResponse> {
    const payload: MarkNotificationAsReadRequest = {
      userId: req.user?.userId,
      notificationId: parseInt(req.params.id, 10),
    };

    const result = await this.markAsReadUseCase.execute(payload);

    if (result.isFailure) {
      const isNotFound = String(result.error).includes('não encontrada');
      return { status: isNotFound ? 404 : 400, body: { success: false, message: result.error } };
    }

    return {
      status: 200,
      body: { success: true, message: 'Notificação marcada como lida' },
    };
  }

  async markAllAsRead(req: HttpRequest): Promise<HttpResponse> {
    const payload: MarkAllNotificationsAsReadRequest = {
      userId: req.user?.userId,
    };

    const result = await this.markAllAsReadUseCase.execute(payload);

    if (result.isFailure) {
      return { status: 400, body: { success: false, message: result.error } };
    }

    return {
      status: 200,
      body: { success: true, message: 'Todas as notificações marcadas como lidas' },
    };
  }

  async countUnread(req: HttpRequest): Promise<HttpResponse> {
    const payload: CountUnreadNotificationsRequest = {
      userId: req.user?.userId,
    };

    const result = await this.countUnreadUseCase.execute(payload);

    if (result.isFailure) {
      return { status: 400, body: { success: false, message: result.error } };
    }

    return {
      status: 200,
      body: {
        success: true,
        data: {
          count: result.getValue(),
        },
      },
    };
  }
}
