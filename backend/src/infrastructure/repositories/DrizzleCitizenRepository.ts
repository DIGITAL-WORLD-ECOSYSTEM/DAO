import { eq, and } from 'drizzle-orm';
import { citizens, identityDocuments } from '../../db/civil-identity/tables';
import { userProfiles } from '../../db/user/tables';
import { ICitizenRepository } from '../../application/ports/output/ICitizenRepository';
import { CitizenMapper } from '../mappers/CitizenMapper';
import { Result } from '../../shared/kernel/Result';
import { Citizen } from '../../domains/citizens/entities/Citizen';
import { IOutboxRepository } from '../../application/ports/output/IOutboxRepository';

export class DrizzleCitizenRepository implements ICitizenRepository {
  constructor(private db: any, private outbox: IOutboxRepository) {}

  async findByUserId(userId: number): Promise<Result<Citizen>> {
    try {
      const result = await this.db
        .select({
          userId: citizens.userId,
          legalFirstName: citizens.legalFirstName,
          legalLastName: citizens.legalLastName,
          civilStatus: citizens.civilStatus,
          version: citizens.version,
          username: userProfiles.username,
          cpf: identityDocuments.encryptedNumber,
        })
        .from(citizens)
        .leftJoin(userProfiles, eq(citizens.userId, userProfiles.userId))
        .leftJoin(
          identityDocuments,
          and(
            eq(citizens.userId, identityDocuments.userId),
            eq(identityDocuments.documentType, 'cpf')
          )
        )
        .where(eq(citizens.userId, userId))
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

  async save(entity: Citizen): Promise<Result<void>> {
    try {
      const dbStatus = entity.status.toLowerCase();
      const existing = await this.db
        .select()
        .from(citizens)
        .where(eq(citizens.userId, entity.userId))
        .limit(1);

      if (!existing || existing.length === 0) {
        await this.db.insert(citizens).values({
          userId: entity.userId,
          legalFirstName: entity.firstName,
          legalLastName: entity.lastName,
          civilStatus: dbStatus,
          version: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
        });

        entity.setVersion(1);
        const events = entity.peekEvents();
        if (this.outbox?.saveEvent) {
          for (const event of events) {
            await this.outbox.saveEvent(event, entity.userId, 'Citizen', 1);
          }
        }
        entity.clearEvents();
        return Result.ok();
      }

      // Optimistic Locking
      const currentVersion = entity.version;
      const nextVersion = currentVersion + 1;

      const result = await this.db
        .update(citizens)
        .set({
          legalFirstName: entity.firstName,
          legalLastName: entity.lastName,
          civilStatus: dbStatus,
          version: nextVersion,
          updatedAt: new Date(),
        })
        .where(
          and(
            eq(citizens.userId, entity.userId),
            eq(citizens.version, currentVersion)
          )
        )
        .returning();

      if (!result || result.length === 0) {
        return Result.fail('ConcurrencyException: Optimistic locking failed');
      }

      const events = entity.peekEvents();
      if (this.outbox?.saveEvent) {
        for (const event of events) {
          await this.outbox.saveEvent(event, entity.userId, 'Citizen', nextVersion);
        }
      }
      entity.clearEvents();

      entity.setVersion(nextVersion);
      return Result.ok();
    } catch (error: any) {
      return Result.fail(error.message);
    }
  }
}
