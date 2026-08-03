import { IDomainEvent } from './DomainEvent';

export abstract class BaseEntity<TId> {
  public readonly id: TId;
  private _domainEvents: IDomainEvent[] = [];

  protected constructor(id: TId) {
    this.id = id;
  }

  public equals(object?: BaseEntity<TId>): boolean {
    if (object == null || object == undefined) {
      return false;
    }
    if (this === object) {
      return true;
    }
    if (!(object instanceof BaseEntity)) {
      return false;
    }
    return this.id === object.id;
  }

  public get domainEvents(): IDomainEvent[] {
    return this._domainEvents;
  }

  protected addDomainEvent(domainEvent: IDomainEvent): void {
    this._domainEvents.push(domainEvent);
  }

  public clearEvents(): void {
    this._domainEvents = [];
  }
}
