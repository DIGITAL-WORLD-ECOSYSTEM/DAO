import { BaseEntity } from '../../../shared/kernel/BaseEntity';

export interface NotificationProps {
  userId: number;
  type: string;
  category: string;
  title: string;
  message?: string | null;
  data?: any | null;
  isRead: boolean;
  readAt?: Date | null;
  createdAt?: Date;
  updatedAt?: Date;
}

export class Notification extends BaseEntity<number> {
  public props: NotificationProps;

  private constructor(props: NotificationProps, id?: number) {
    super(id || 0);
    this.props = props;
  }

  public static create(props: Omit<NotificationProps, 'isRead'>, id?: number): Notification {
    return new Notification(
      {
        ...props,
        isRead: false,
        createdAt: props.createdAt || new Date(),
        updatedAt: props.updatedAt || new Date(),
      },
      id
    );
  }

  public static reconstitute(props: NotificationProps, id: number): Notification {
    return new Notification(props, id);
  }

  public get userId(): number {
    return this.props.userId;
  }

  public get type(): string {
    return this.props.type;
  }

  public get category(): string {
    return this.props.category;
  }

  public get title(): string {
    return this.props.title;
  }

  public get message(): string | null {
    return this.props.message || null;
  }

  public get data(): any | null {
    return this.props.data || null;
  }

  public get isRead(): boolean {
    return this.props.isRead;
  }

  public get readAt(): Date | null {
    return this.props.readAt || null;
  }

  public get createdAt(): Date {
    return this.props.createdAt || new Date();
  }

  public markAsRead(): void {
    if (this.props.isRead) {
      return;
    }
    this.props.isRead = true;
    this.props.readAt = new Date();
    this.props.updatedAt = new Date();
  }
}
