import { eq } from 'drizzle-orm';
import { IPasskeyIdentityRepository } from '../../application/ports/output/IPasskeyIdentityRepository';
import { TransactionContext } from '../../application/dto/TransactionContext';
import { webauthnCredentials, userAuthenticators } from '../../db/authentication/tables';

export class PasskeyIdentityRepository implements IPasskeyIdentityRepository {
  constructor(private readonly db: any) {}

  public async findUserIdByCredentialId(
    credentialId: string,
    txCtx?: TransactionContext
  ): Promise<number | null> {
    const executor = (txCtx?.nativeTx as any) || this.db;

    const rows = await executor
      .select({ userId: userAuthenticators.userId })
      .from(webauthnCredentials)
      .innerJoin(
        userAuthenticators,
        eq(webauthnCredentials.authenticatorId, userAuthenticators.id)
      )
      .where(eq(webauthnCredentials.credentialId, credentialId))
      .limit(1);

    return rows.length > 0 ? rows[0].userId : null;
  }
}
