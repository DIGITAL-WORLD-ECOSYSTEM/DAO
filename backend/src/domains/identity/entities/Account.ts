import { BaseEntity } from '../../../shared/kernel/BaseEntity';

export interface AccountProps {
  id: number;
  email: string;
  password?: string;
  role: string;
  active: boolean;
  firstName?: string;
  lastName?: string;
  username?: string;
}

export class Account extends BaseEntity<number> {
  private _props: AccountProps;

  private constructor(props: AccountProps) {
    super(props.id);
    this._props = props;
  }

  public static restore(props: AccountProps): Account {
    return new Account(props);
  }

  // Do not define 'get id()' because 'id' is already provided by BaseEntity<number>
  get email(): string { return this._props.email; }
  get password(): string | undefined { return this._props.password; }
  get role(): string { return this._props.role; }
  get active(): boolean { return this._props.active; }
  get firstName(): string | undefined { return this._props.firstName; }
  get lastName(): string | undefined { return this._props.lastName; }
  get username(): string | undefined { return this._props.username; }

  changePassword(newHash: string): void {
    this._props.password = newHash;
  }
}
