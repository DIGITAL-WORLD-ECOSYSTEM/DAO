import { eq } from 'drizzle-orm';
import { users, userProfiles } from '../../db/user/tables';
import { citizens } from '../../db/civil-identity/tables';
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
          password: users.email, // fallback for interface compatibility
          role: users.subjectType,
          active: users.status,
          status: users.status,
          tokenVersion: users.authEpoch,
          firstName: citizens.legalFirstName,
          lastName: citizens.legalLastName,
          username: userProfiles.username,
        })
        .from(users)
        .leftJoin(userProfiles, eq(users.id, userProfiles.userId))
        .leftJoin(citizens, eq(users.id, citizens.userId))
        .where(eq(users.email, email))
        .limit(1);

      if (!result || result.length === 0) {
        return Result.fail('Account not found');
      }

      try {
        const raw = {
          ...result[0],
          active: result[0].active === 'active',
        };
        const domainEntity = AccountMapper.toDomain(raw);
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
          password: users.email, // fallback for interface compatibility
          role: users.subjectType,
          active: users.status,
          status: users.status,
          tokenVersion: users.authEpoch,
          firstName: citizens.legalFirstName,
          lastName: citizens.legalLastName,
          username: userProfiles.username,
        })
        .from(users)
        .leftJoin(userProfiles, eq(users.id, userProfiles.userId))
        .leftJoin(citizens, eq(users.id, citizens.userId))
        .where(eq(users.id, id))
        .limit(1);

      if (!result || result.length === 0) {
        return Result.fail('Account not found');
      }

      const row = result[0] || {};
      const raw = {
        id: row.id ?? id,
        email: row.email ?? '',
        role: row.role ?? 'human',
        active: row.active === 'active' || row.status === 'active' || row.active === true,
        status: row.status ?? 'active',
        tokenVersion: row.tokenVersion ?? 1,
        firstName: row.firstName,
        lastName: row.lastName,
        username: row.username,
      };
      const domainEntity = AccountMapper.toDomain(raw);
      return Result.ok(domainEntity);
    } catch (error: any) {
      console.error('FINDBYID ERROR:', error);
      return Result.fail(error.stack || error.message);
    }
  }

  async save(account: Account): Promise<Result<Account>> {
    try {
      const subjectType = account.role === 'service' || account.role === 'system' ? account.role : 'human';

      if (account.id) {
        // Update
        await this.db
          .update(users)
          .set({
            email: account.email,
            emailNormalized: account.email ? account.email.toLowerCase() : null,
            subjectType,
            status: account.active ? 'active' : 'suspended',
            statusChangedAt: new Date(),
          })
          .where(eq(users.id, account.id));
      } else {
        // Insert
        const [inserted] = await this.db
          .insert(users)
          .values({
            email: account.email,
            emailNormalized: account.email ? account.email.toLowerCase() : null,
            subjectType,
            status: account.active ? 'active' : 'suspended',
          })
          .returning();

        (account as any).id = inserted.id;
      }
      return Result.ok(account);
    } catch (error: any) {
      return Result.fail(error.message);
    }
  }
}
