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

      try {
        const domainEntity = AccountMapper.toDomain(result[0]);
        return Result.ok(domainEntity);
      } catch (err: any) {
        console.error('AccountMapper Error:', err);
        throw err;
      }
    } catch (error: any) {
      console.error('findByEmail Error:', error);
      return Result.fail(error.message);
    }
  }

  async findById(id: number): Promise<Result<Account>> {
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
        .where(eq(users.id, id))
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

  async save(account: Account): Promise<Result<Account>> {
    try {
      if (account.id) {
        // Update
        await this.db.update(users).set({
          email: account.email,
          password: account.password,
          role: account.role,
          active: account.active,
          updatedAt: new Date(),
        }).where(eq(users.id, account.id));
      } else {
        // Insert
        const [inserted] = await this.db.insert(users).values({
          email: account.email,
          password: account.password,
          role: account.role,
          active: account.active,
        }).returning();
        
        // Atribuir o ID gerado pelo banco à entidade de domínio
        (account as any).id = inserted.id;
      }
      return Result.ok(account);
    } catch (error: any) {
      return Result.fail(error.message);
    }
  }
}
