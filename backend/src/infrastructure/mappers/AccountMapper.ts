import { Account } from '../../domains/identity/entities/Account';

export class AccountMapper {
  static toDomain(raw: any): Account {
    return Account.restore({
      id: raw.id,
      email: raw.email,
      password: raw.password,
      role: raw.role,
      active: raw.active !== undefined ? Boolean(raw.active) : raw.status === 'active',
      firstName: raw.firstName,
      lastName: raw.lastName,
      username: raw.username,
      tokenVersion: raw.tokenVersion,
      status: raw.status,
    });
  }
}
