import { Result } from '../../../shared/kernel/Result';
import { Citizen } from '../../../domains/citizens/entities/Citizen';

export interface ICitizenRepository {
  findByAccountId(accountId: number): Promise<Result<Citizen>>;
}
