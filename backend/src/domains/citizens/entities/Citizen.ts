import { BaseEntity } from '../../../shared/kernel/BaseEntity';
import { Result } from '../../../shared/kernel/Result';
import { CitizenVerifiedEvent, CitizenSuspendedEvent, CitizenRevokedEvent, CitizenReactivatedEvent } from './CitizenEvents';

export type CitizenStatus = 'PENDING' | 'VERIFIED' | 'SUSPENDED' | 'REVOKED';

export enum SuspensionReason {
  FRAUD = 'FRAUD',
  KYC_EXPIRED = 'KYC_EXPIRED',
  LEGAL_ORDER = 'LEGAL_ORDER',
  ADMINISTRATIVE = 'ADMINISTRATIVE',
  OTHER = 'OTHER'
}

export interface CitizenProps {
  id: number;
  userId: number;
  username: string;
  firstName?: string;
  lastName?: string;
  did?: string;
  cpf?: string;
  status: CitizenStatus;
  publicKey?: string;
  phone?: string;
  address?: string;
  version?: number;
}

export class Citizen extends BaseEntity<number> {
  private _props: CitizenProps;

  private constructor(props: CitizenProps) {
    super(props.id, props.version);
    this._props = props;
  }

  public static restore(props: CitizenProps): Citizen {
    return new Citizen(props);
  }

  get userId(): number { return this._props.userId; }
  get username(): string { return this._props.username; }
  get firstName(): string | undefined { return this._props.firstName; }
  get lastName(): string | undefined { return this._props.lastName; }
  get did(): string | undefined { return this._props.did; }
  get cpf(): string | undefined { return this._props.cpf; }
  get status(): CitizenStatus { return this._props.status; }
  get publicKey(): string | undefined { return this._props.publicKey; }
  get phone(): string | undefined { return this._props.phone; }
  get address(): string | undefined { return this._props.address; }

  // Domain Behaviors (Lei 27)

  public changeAddress(newAddress: string): Result<void> {
    if (!newAddress || newAddress.trim().length === 0) {
      return Result.fail('Endereço não pode ser vazio');
    }
    if (newAddress.length > 255) {
      return Result.fail('Endereço excede o limite máximo de caracteres');
    }
    
    // Evita gravação inútil
    if (this._props.address === newAddress.trim()) {
      return Result.ok();
    }

    this._props.address = newAddress.trim();
    return Result.ok();
  }

  public updatePhone(newPhone: string): Result<void> {
    if (!newPhone || newPhone.trim().length === 0) {
      return Result.fail('ValidationError: Telefone inválido');
    }

    const regex = /^\+?[1-9]\d{1,14}$/;
    if (!regex.test(newPhone)) {
      return Result.fail('ValidationError: Telefone com formato inválido');
    }

    // Evita gravação inútil
    if (this._props.phone === newPhone) {
      return Result.ok();
    }

    this._props.phone = newPhone;
    return Result.ok();
  }

  // --- LEI 28: State Machine & Transições Explícitas ---

  public verify(): Result<void> {
    if (this._props.status === 'VERIFIED') {
      return Result.ok(); // Idempotência
    }
    if (this._props.status === 'SUSPENDED' || this._props.status === 'REVOKED') {
      return Result.fail(`Transição Inválida: Não é possível verificar um cidadão no estado ${this._props.status}`);
    }

    this._props.status = 'VERIFIED';
    this.addDomainEvent(new CitizenVerifiedEvent(this.id));
    return Result.ok();
  }

  public suspend(reason: SuspensionReason, description?: string): Result<void> {
    if (this._props.status === 'SUSPENDED') {
      return Result.ok(); // Idempotência
    }
    if (this._props.status === 'PENDING') {
      return Result.fail('Transição Inválida: Cidadão ainda pendente não pode ser suspenso');
    }
    if (this._props.status === 'REVOKED') {
      return Result.fail('Transição Inválida: Cidadão revogado não pode ser suspenso');
    }

    this._props.status = 'SUSPENDED';
    this.addDomainEvent(new CitizenSuspendedEvent(this.id, reason, description));
    return Result.ok();
  }

  public revoke(): Result<void> {
    if (this._props.status === 'REVOKED') {
      return Result.ok(); // Idempotência sem persistência extra (UseCase cuida disso)
    }

    this._props.status = 'REVOKED';
    this.addDomainEvent(new CitizenRevokedEvent(this.id));
    return Result.ok();
  }

  public reactivate(): Result<void> {
    if (this._props.status === 'VERIFIED') {
      return Result.ok(); // Idempotência
    }
    if (this._props.status === 'REVOKED') {
      return Result.fail('Transição Inválida: Cidadão revogado nunca pode ser reativado');
    }
    if (this._props.status === 'PENDING') {
      return Result.fail('Transição Inválida: Cidadão pendente não pode ser reativado, use verify()');
    }

    this._props.status = 'VERIFIED';
    this.addDomainEvent(new CitizenReactivatedEvent(this.id));
    return Result.ok();
  }
}
