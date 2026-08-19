import { eq, and } from 'drizzle-orm';
import {
  IExternalIdentityRepository,
  ExternalIdentityRecord,
  CreateExternalIdentityDTO,
} from '../../application/ports/output/IExternalIdentityRepository';
import { TransactionContext } from '../../application/dto/TransactionContext';
import { userExternalIdentities } from '../../db/user/tables';

export class ExternalIdentityRepository implements IExternalIdentityRepository {
  constructor(private readonly db: any) {}

  private getExecutor(txCtx?: TransactionContext) {
    return (txCtx?.nativeTx as any) || this.db;
  }

  public async findUserIdByProviderSubject(
    provider: string,
    providerSubjectId: string,
    txCtx?: TransactionContext
  ): Promise<number | null> {
    const record = await this.findByProviderSubject(provider, providerSubjectId, txCtx);
    return record ? record.userId : null;
  }

  public async findByProviderSubject(
    provider: string,
    providerSubjectId: string,
    txCtx?: TransactionContext
  ): Promise<ExternalIdentityRecord | null> {
    const executor = this.getExecutor(txCtx);
    const rows = await executor
      .select()
      .from(userExternalIdentities)
      .where(
        and(
          eq(userExternalIdentities.provider, provider),
          eq(userExternalIdentities.providerSubjectId, providerSubjectId)
        )
      )
      .limit(1);

    if (rows.length === 0) return null;

    const row = rows[0];
    return {
      id: row.id,
      userId: row.userId,
      provider: row.provider as any,
      providerSubjectId: row.providerSubjectId,
      emailAtBinding: row.emailAtBinding,
      createdAt: row.createdAt,
    };
  }

  public async findByUserId(
    userId: number,
    txCtx?: TransactionContext
  ): Promise<ExternalIdentityRecord[]> {
    const executor = this.getExecutor(txCtx);
    const rows = await executor
      .select()
      .from(userExternalIdentities)
      .where(eq(userExternalIdentities.userId, userId));

    return rows.map((row: any) => ({
      id: row.id,
      userId: row.userId,
      provider: row.provider as any,
      providerSubjectId: row.providerSubjectId,
      emailAtBinding: row.emailAtBinding,
      createdAt: row.createdAt,
    }));
  }

  public async save(
    binding: CreateExternalIdentityDTO,
    txCtx?: TransactionContext
  ): Promise<ExternalIdentityRecord> {
    const executor = this.getExecutor(txCtx);
    const id = crypto.randomUUID();
    const createdAt = new Date();

    await executor.insert(userExternalIdentities).values({
      id,
      userId: binding.userId,
      provider: binding.provider,
      providerSubjectId: binding.providerSubjectId,
      emailAtBinding: binding.emailAtBinding || null,
      createdAt,
    });

    return {
      id,
      userId: binding.userId,
      provider: binding.provider,
      providerSubjectId: binding.providerSubjectId,
      emailAtBinding: binding.emailAtBinding || null,
      createdAt,
    };
  }

  public async delete(id: string, txCtx?: TransactionContext): Promise<void> {
    const executor = this.getExecutor(txCtx);
    await executor
      .delete(userExternalIdentities)
      .where(eq(userExternalIdentities.id, id));
  }
}
