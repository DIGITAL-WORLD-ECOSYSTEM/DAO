import { eq } from 'drizzle-orm';
import { citizens } from '../../db/schema';
import { ICitizenRepository } from '../../application/ports/output/ICitizenRepository';
import { CitizenMapper } from '../mappers/CitizenMapper';
import { Result } from '../../shared/kernel/Result';
import { Citizen } from '../../domains/citizens/entities/Citizen';

export class DrizzleCitizenRepository implements ICitizenRepository {
  constructor(private db: any) {}

  async findByAccountId(accountId: number): Promise<Result<Citizen>> {
    try {
      const result = await this.db
        .select()
        .from(citizens)
        .where(eq(citizens.userId, accountId))
        .limit(1);

      if (!result || result.length === 0) {
        return Result.fail('Citizen not found');
      }

      const domainEntity = CitizenMapper.toDomain(result[0]);
      return Result.ok(domainEntity);
    } catch (error: any) {
      return Result.fail(error.message);
    }
  }
}
