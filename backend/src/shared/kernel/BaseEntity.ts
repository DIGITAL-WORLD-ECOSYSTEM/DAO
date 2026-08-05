import { IDomainEvent } from './DomainEvent';

export abstract class BaseEntity<TId> {
  public readonly id: TId;
  private _version: number;
  private _domainEvents: IDomainEvent[] = [];

  protected constructor(id: TId, version: number = 1) {
    this.id = id;
    this._version = version;
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

  public get version(): number {
    return this._version;
  }

  public setVersion(version: number): void {
    this._version = version;
  }

  public get domainEvents(): IDomainEvent[] {
    return this._domainEvents;
  }

  public peekEvents(): readonly IDomainEvent[] {
    return [...this._domainEvents];
  }

  public hasEvents(): boolean {
    return this._domainEvents.length > 0;
  }

  protected addDomainEvent(domainEvent: IDomainEvent): void {
    this._domainEvents.push(domainEvent);
  }

  public clearEvents(): void {
    this._domainEvents = [];
  }
}
