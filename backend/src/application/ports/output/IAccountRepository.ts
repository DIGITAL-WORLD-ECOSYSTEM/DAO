import { Result } from '../../../shared/kernel/result/Result';

export interface IAccountRepository {
  findByEmail(email: string): Promise<Result<any>>;
}
