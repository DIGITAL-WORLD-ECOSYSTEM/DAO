import { eq, and, isNull } from 'drizzle-orm';
import { IAuthMethodCounter } from '../../domains/identity/usecases/UnlinkExternalIdentityUseCase';
import { TransactionContext } from '../../application/dto/TransactionContext';
import { userAuthenticators } from '../../db/authentication/tables';
import { userExternalIdentities } from '../../db/user/tables';
import { wallets } from '../../db/web3/tables';

export class AuthMethodCounterAdapter implements IAuthMethodCounter {
  constructor(private readonly db: any) {}

  public async countPrimaryMethods(userId: number, txCtx?: TransactionContext): Promise<number> {
    const executor = (txCtx?.nativeTx as any) || this.db;

    // 1. Contar autenticadores diretos (password, webauthn/passkey) não revogados
    const authenticators = await executor
      .select({ id: userAuthenticators.id })
      .from(userAuthenticators)
      .where(
        and(
          eq(userAuthenticators.userId, userId),
          isNull(userAuthenticators.revokedAt)
        )
      );

    // 2. Contar identidades sociais externas vinculadas (OAuth)
    const externalIdentities = await executor
      .select({ id: userExternalIdentities.id })
      .from(userExternalIdentities)
      .where(eq(userExternalIdentities.userId, userId));

    // 3. Contar carteiras ativas
    const userWallets = await executor
      .select({ id: wallets.id })
      .from(wallets)
      .where(eq(wallets.userId, userId));

    return authenticators.length + externalIdentities.length + userWallets.length;
  }
}
