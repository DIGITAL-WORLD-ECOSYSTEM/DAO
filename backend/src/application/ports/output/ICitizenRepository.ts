import { Result } from '../../../shared/kernel/Result';
import { Citizen } from '../../../domains/citizens/entities/Citizen';

export interface ICitizenRepository {
  findByUserId(userId: number): Promise<Result<Citizen>>;
  save(entity: Citizen): Promise<Result<void>>;
}
