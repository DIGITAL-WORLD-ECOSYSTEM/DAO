import { IDomainEvent } from '../../../shared/kernel/DomainEvent';

export class CitizenVerifiedEvent implements IDomainEvent {
  public dateTimeOccurred: Date;
  public citizenId: number;

  constructor(citizenId: number) {
    this.dateTimeOccurred = new Date();
    this.citizenId = citizenId;
  }
}

export class CitizenSuspendedEvent implements IDomainEvent {
  public dateTimeOccurred: Date;
  public citizenId: number;
  public reason: string;
  public description?: string;

  constructor(citizenId: number, reason: string, description?: string) {
    this.dateTimeOccurred = new Date();
    this.citizenId = citizenId;
    this.reason = reason;
    this.description = description;
  }
}

export class CitizenRevokedEvent implements IDomainEvent {
  public dateTimeOccurred: Date;
  public citizenId: number;

  constructor(citizenId: number) {
    this.dateTimeOccurred = new Date();
    this.citizenId = citizenId;
  }
}

export class CitizenReactivatedEvent implements IDomainEvent {
  public dateTimeOccurred: Date;
  public citizenId: number;

  constructor(citizenId: number) {
    this.dateTimeOccurred = new Date();
    this.citizenId = citizenId;
  }
}
