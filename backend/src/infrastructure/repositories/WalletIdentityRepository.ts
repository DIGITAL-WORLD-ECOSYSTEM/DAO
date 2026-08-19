import { eq, and } from 'drizzle-orm';
import { IWalletIdentityRepository } from '../../application/ports/output/IWalletIdentityRepository';
import { TransactionContext } from '../../application/dto/TransactionContext';
import { wallets } from '../../db/web3/tables';

export class WalletIdentityRepository implements IWalletIdentityRepository {
  constructor(private readonly db: any) {}

  public async findUserIdByWalletIdentity(
    networkId: number,
    addressNormalized: string,
    txCtx?: TransactionContext
  ): Promise<number | null> {
    const executor = (txCtx?.nativeTx as any) || this.db;
    const address = addressNormalized.toLowerCase();

    const rows = await executor
      .select({ userId: wallets.userId })
      .from(wallets)
      .where(
        and(
          eq(wallets.networkId, networkId),
          eq(wallets.addressNormalized, address)
        )
      )
      .limit(1);

    return rows.length > 0 ? rows[0].userId : null;
  }
}
