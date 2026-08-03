import { eq } from 'drizzle-orm';
import { users, citizens } from '../../db/schema';
import { IAccountRepository } from '../../application/ports/output/IAccountRepository';
import { AccountMapper } from '../mappers/AccountMapper';
import { Result } from '../../shared/kernel/Result';
import { Account } from '../../domains/identity/entities/Account';

export class DrizzleAccountRepository implements IAccountRepository {
  constructor(private db: any) {}

  async findByEmail(email: string): Promise<Result<Account>> {
    try {
      const result = await this.db
        .select({
          id: users.id,
          email: users.email,
          password: users.password,
          role: users.role,
          active: users.active,
          firstName: citizens.firstName,
          lastName: citizens.lastName,
          username: citizens.username,
        })
        .from(users)
        .leftJoin(citizens, eq(users.id, citizens.userId))
        .where(eq(users.email, email))
        .limit(1);

      if (!result || result.length === 0) {
        return Result.fail('Account not found');
      }

      const domainEntity = AccountMapper.toDomain(result[0]);
      return Result.ok(domainEntity);
    } catch (error: any) {
      return Result.fail(error.message);
    }
  }
}
