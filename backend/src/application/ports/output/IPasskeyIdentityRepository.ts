import { TransactionContext } from '../../dto/TransactionContext';

export interface IPasskeyIdentityRepository {
  findUserIdByCredentialId(
    credentialId: string,
    txCtx?: TransactionContext
  ): Promise<number | null>;
}
