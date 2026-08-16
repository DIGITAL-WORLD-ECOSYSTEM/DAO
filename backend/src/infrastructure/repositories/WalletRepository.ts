import { eq } from 'drizzle-orm';
import { wallets } from '../../db/web3/tables';
import { IWalletRepository, WalletRecord } from '../../application/ports/output/IWalletRepository';
import { Result } from '../../shared/kernel/Result';

export class DrizzleWalletRepository implements IWalletRepository {
  constructor(private db: any) {}

  async findByAddress(address: string): Promise<Result<WalletRecord>> {
    try {
      const result = await this.db.select().from(wallets).where(eq(wallets.address, address)).limit(1);
      if (!result || result.length === 0) {
        return Result.fail('Wallet not found');
      }
      return Result.ok(result[0]);
    } catch (error: any) {
      return Result.fail(error.message);
    }
  }

  async save(wallet: WalletRecord): Promise<Result<WalletRecord>> {
    try {
      if (wallet.id) {
        await this.db.update(wallets).set({
          isPrimary: wallet.isPrimary
        }).where(eq(wallets.id, wallet.id));
      } else {
        const [inserted] = await this.db.insert(wallets).values({
          userId: wallet.userId,
          address: wallet.address,
          addressNormalized: wallet.addressNormalized,
          networkId: wallet.networkId,
          provenance: wallet.provenance || 'external',
          isPrimary: wallet.isPrimary || false,
        }).returning();
        wallet.id = inserted.id;
      }
      return Result.ok(wallet);
    } catch (error: any) {
      return Result.fail(error.message);
    }
  }
}
