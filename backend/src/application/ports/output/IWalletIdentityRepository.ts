import { TransactionContext } from '../../dto/TransactionContext';

export interface IWalletIdentityRepository {
  findUserIdByWalletIdentity(
    networkId: number,
    addressNormalized: string,
    txCtx?: TransactionContext
  ): Promise<number | null>;
}
