import { Result } from '../../../shared/kernel/Result';
import { Account } from '../../identity/entities/Account';

export interface IAccountRepository {
  findByEmail(email: string): Promise<Result<Account>>;
  save(account: Account): Promise<Result<Account>>;
}
