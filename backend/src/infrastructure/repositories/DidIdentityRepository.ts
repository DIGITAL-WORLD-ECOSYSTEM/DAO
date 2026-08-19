import { eq } from 'drizzle-orm';
import { IDidIdentityRepository } from '../../application/ports/output/IDidIdentityRepository';
import { TransactionContext } from '../../application/dto/TransactionContext';
import { didIdentities } from '../../db/ssi/tables';

export class DidIdentityRepository implements IDidIdentityRepository {
  constructor(private readonly db: any) {}

  public async findUserIdByDid(
    did: string,
    txCtx?: TransactionContext
  ): Promise<number | null> {
    const executor = (txCtx?.nativeTx as any) || this.db;

    const rows = await executor
      .select({ userId: didIdentities.userId })
      .from(didIdentities)
      .where(eq(didIdentities.did, did))
      .limit(1);

    return rows.length > 0 ? rows[0].userId : null;
  }
}
