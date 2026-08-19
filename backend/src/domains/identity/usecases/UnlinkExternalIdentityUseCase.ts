import { TransactionContext } from '../../../application/dto/TransactionContext';
import { IExternalIdentityRepository } from '../../../application/ports/output/IExternalIdentityRepository';
import { ISecurityAuditPort } from '../../../application/ports/output/ISecurityAuditPort';
import { Result } from '../../../shared/kernel/Result';

export interface UnlinkExternalIdentityInput {
  readonly userId: number;
  readonly bindingId: string;
  readonly sessionAal: number;
}

export type UnlinkExternalIdentityOutput = {
  readonly success: boolean;
};

export interface IAuthMethodCounter {
  countPrimaryMethods(userId: number, txCtx?: TransactionContext): Promise<number>;
}

export class UnlinkExternalIdentityUseCase {
  constructor(
    private readonly externalRepo: IExternalIdentityRepository,
    private readonly authMethodCounter: IAuthMethodCounter,
    private readonly auditPort: ISecurityAuditPort,
    private readonly uow: { execute: <T>(fn: (txCtx: TransactionContext) => Promise<T>) => Promise<T> }
  ) {}

  public async execute(input: UnlinkExternalIdentityInput): Promise<Result<UnlinkExternalIdentityOutput>> {
    const { userId, bindingId, sessionAal } = input;

    // AF-007: Exigir AAL2+ Step-Up
    if (sessionAal < 2) {
      return Result.fail('STEP_UP_REQUIRED: AAL2+ assurance is required for identity unlinking');
    }

    try {
      await this.uow.execute(async (txCtx) => {
        // AF-008: Verificar Invariável Anti-Lockout no mesmo contexto transacional D1
        const primaryMethods = await this.authMethodCounter.countPrimaryMethods(userId, txCtx);

        if (primaryMethods < 2) {
          throw new Error('CANNOT_UNLINK_LAST_AUTHENTICATION_METHOD');
        }

        // Buscar vínculo para audit metadata
        const userBindings = await this.externalRepo.findByUserId(userId, txCtx);
        const targetBinding = userBindings.find((b) => b.id === bindingId);

        if (!targetBinding) {
          throw new Error('BINDING_NOT_FOUND');
        }

        await this.externalRepo.delete(bindingId, txCtx);

        await this.auditPort.logEvent(
          {
            event: 'identity_unlinked',
            userId,
            metadata: {
              bindingId,
              provider: targetBinding.provider,
              providerSubjectId: targetBinding.providerSubjectId,
            },
          },
          txCtx
        );
      });

      return Result.ok({ success: true });
    } catch (error: any) {
      if (error.message === 'CANNOT_UNLINK_LAST_AUTHENTICATION_METHOD') {
        return Result.fail('CANNOT_UNLINK_LAST_AUTHENTICATION_METHOD: Unlinking would leave account without primary authentication method');
      }
      if (error.message === 'BINDING_NOT_FOUND') {
        return Result.fail('BINDING_NOT_FOUND: The specified external identity binding does not exist');
      }
      return Result.fail(`UNLINK_FAILED: ${error.message}`);
    }
  }
}
