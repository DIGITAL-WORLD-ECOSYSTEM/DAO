import { eq, and } from 'drizzle-orm';
import { citizens } from '../../db/schema';
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
        .select()
        .from(citizens)
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
      if (!entity.id) {
        const [inserted] = await this.db.insert(citizens).values({
          userId: (entity as any).userId,
          username: entity.username,
          firstName: entity.firstName,
          lastName: entity.lastName,
          did: entity.did,
          status: entity.status,
          phone: entity.phone,
          address: entity.address,
          passkeyId: (entity as any).passkeyId,
          passkeyPublicKey: (entity as any).passkeyPublicKey,
          totpSecret: (entity as any).totpSecret,
          totpEnabled: (entity as any).totpEnabled,
          version: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
        }).returning();

        (entity as any).id = inserted.id;
        entity.setVersion(1);

        const events = entity.peekEvents();
        for (const event of events) {
          await this.outbox.saveEvent(event, entity.id, 'Citizen', 1);
        }
        entity.clearEvents();
        return Result.ok();
      }

      // Optimistic Locking: Atualizamos a versão no banco e filtramos pela versão atual da entidade
      const currentVersion = entity.version;
      const nextVersion = currentVersion + 1;

      const result = await this.db
        .update(citizens)
        .set({
          status: entity.status,
          phone: entity.phone,
          address: entity.address,
          passkeyId: (entity as any).passkeyId,
          passkeyPublicKey: (entity as any).passkeyPublicKey,
          totpSecret: (entity as any).totpSecret,
          totpEnabled: (entity as any).totpEnabled,
          version: nextVersion,
          updatedAt: new Date(),
        })
        .where(
          and(
            eq(citizens.id, entity.id),
            eq(citizens.version, currentVersion)
          )
        )
        .returning();

      if (!result || result.length === 0) {
        return Result.fail('ConcurrencyException: Optimistic locking failed');
      }

      // Persistir eventos de domínio no Outbox (Mesma transação!)
      const events = entity.peekEvents();
      for (const event of events) {
        await this.outbox.saveEvent(event, entity.id, 'Citizen', nextVersion);
      }
      entity.clearEvents();

      // Sincroniza a entidade com a nova versão
      entity.setVersion(nextVersion);

      return Result.ok();
    } catch (error: any) {
      return Result.fail(error.message);
    }
  }
}
