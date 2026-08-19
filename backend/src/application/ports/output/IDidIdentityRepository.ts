import { TransactionContext } from '../../dto/TransactionContext';

export interface IDidIdentityRepository {
  findUserIdByDid(
    did: string,
    txCtx?: TransactionContext
  ): Promise<number | null>;
}
