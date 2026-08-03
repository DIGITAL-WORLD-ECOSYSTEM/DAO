import { BaseEntity } from '../../../shared/kernel/BaseEntity';
import { Result } from '../../../shared/kernel/Result';

export interface CitizenProps {
  id: number;
  userId: number;
  username: string;
  firstName?: string;
  lastName?: string;
  did?: string;
  cpf?: string;
  status?: string;
  publicKey?: string;
  phone?: string;
  address?: string;
}

export class Citizen extends BaseEntity<number> {
  private _props: CitizenProps;

  private constructor(props: CitizenProps) {
    super(props.id);
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
  get status(): string | undefined { return this._props.status; }
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
}
