import { Result } from '../../../shared/kernel/Result';
import { Account } from '../../../domains/identity/entities/Account';

export interface IAccountRepository {
  findByEmail(email: string): Promise<Result<Account>>;
  findById(id: number): Promise<Result<Account>>;
  save(account: Account): Promise<Result<Account>>;
}
